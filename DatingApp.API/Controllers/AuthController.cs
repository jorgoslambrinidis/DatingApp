using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using DatingApp.API.Data;
using DatingApp.API.Dtos;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace DatingApp.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthRepository _repo;
        private readonly IConfiguration _config;
        public AuthController(IAuthRepository repo, IConfiguration config)
        {
            _config = config;
            _repo = repo;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(UserForRegisterDto userForRegisterDto)
        {
            userForRegisterDto.Username = userForRegisterDto.Username.ToLower();

            if (await _repo.UserExists(userForRegisterDto.Username))
                return BadRequest("Username already exists");

            var userToCreate = new User
            {
                Username = userForRegisterDto.Username
            };

            var createdUser = await _repo.Register(userToCreate, userForRegisterDto.Password);

            // return CreatedAtRoute
            return StatusCode(201);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(UserForLoginDto userForLoginDto)
        {
            // try
            // {
            // throw new Exception("Computer says no!");

                // check if we have a user stored in our db
                var userFromRepo = await _repo.Login(userForLoginDto.Username.ToLower(), userForLoginDto.Password);

                if (userFromRepo == null)
                {
                    return Unauthorized();
                }

                // our token it's going to contain 2 claims (users id/users username)
                var claims = new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, userFromRepo.Id.ToString()),
                    new Claim(ClaimTypes.Name, userFromRepo.Username)
                };

                // chack if the tokens are valid
                // when it comes back the server needs to sign this token 
                var key = new SymmetricSecurityKey(Encoding.UTF8
                    .GetBytes(_config.GetSection("AppSettings:Token").Value));

                // use the key as part of signing credential
                // encrypting this key with hashing algorithm 
                var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

                // token creation
                // -> token descriptor
                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(claims),  // passing claims as subject
                    Expires = DateTime.Now.AddDays(1),     // give an expire date of 24h
                    SigningCredentials = creds             // passing signing credentials
                };

                // create a token handler 
                // needed to create the token based on tokenDescriptor
                var tokenHandler = new JwtSecurityTokenHandler();

                // pass the tokenDescriptor via tokenHandler in the token variable
                var token = tokenHandler.CreateToken(tokenDescriptor);

                // use the token variable to write the token 
                // in the response that we send back to the client
                return Ok(new
                {
                    token = tokenHandler.WriteToken(token)
                });

            // }
            // catch
            // {
            //     return StatusCode(500, "Computer really says no!");
            // }

            // we can check the created token via postman on 
            // http://localhost:5000/api/auth/login
            // username: john / password: password
            // and than decode the generated token on https://jwt.io/

        }


    }
}