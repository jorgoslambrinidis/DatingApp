using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.API.Data;
using DatingApp.API.Helpers;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace DatingApp.API
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }
 
        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddDbContext<DataContext>(x => x.UseSqlite(Configuration.GetConnectionString("DefaultConnection")));
            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_1)
            .AddJsonOptions(opt => {
                opt.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
            });
            services.AddCors();
            services.AddAutoMapper();
            services.AddTransient<Seed>(); // add in configure method
            
            // register DI
            services.AddScoped<IAuthRepository, AuthRepository>(); 
            services.AddScoped<IDatingRepository, DatingRepository>();

            // --> specify our authentication scheme that we are going to use
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options => {options.TokenValidationParameters = new TokenValidationParameters
            {
                // specify some options that we want to validate against 
                ValidateIssuerSigningKey = true, // check if the key is valid
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII
                .GetBytes(Configuration.GetSection("AppSettings:Token").Value)), // the key is stored in our configuration
                ValidateIssuer = false, // localhost
                ValidateAudience = false // localhost 
            };
            });

            // when we are going to configure authentication,
            // we have to tell our application about it, in Configure method
            // before app.UseMvc() method
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, Seed seeder)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                // this UseExceptionHandler is middleware to our pipline that catches exceptions
                // it logs them, and re-executes the request in an outerner pipeline
                // use of the Run at terminal middleware delegates to the app request pipeline
                // inside Run() we can access our context  
                // handling it globally
                app.UseExceptionHandler(builder => {
                    builder.Run(async context => {
                        context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

                        // get the detalis of the error
                        // this error is going to store our particular error
                        var error = context.Features.Get<IExceptionHandlerFeature>();

                        if(error != null) {
                            // before the async, write response from extension class
                            // this is going to add a new header to our response
                            context.Response.AddApplicationError(error.Error.Message);

                            // writing our error message in the http response
                            // here we have to have our own extension method such as WriteAsync
                            // add new folder "Helpers" in the Dating.API project
                            // -> add new class here in Helpers folder called "Extensions.cs"
                            await context.Response.WriteAsync(error.Error.Message);
                        }
                    });
                });
                // app.UseHsts();
            }

            // seed db !!! -> uncomment this to seed users
            // seeder.SeedUsers();
            
            // app.UseHttpsRedirection();
            app.UseCors(x => x.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
            // initialize auth here
            app.UseAuthentication(); 
            app.UseMvc();
        }
    }
}
