using System;
using Microsoft.AspNetCore.Http;

namespace DatingApp.API.Helpers
{
    // extension class that we will use 
    // for other extension methods that we will need

    // we don't need to create any instance of this class
    public static class Extensions
    {
        public static void AddApplicationError(this HttpResponse response, string message)
        {
            // add additional headers in our response
            response.Headers.Add("Application-Error", message);
            // these 2 are only to allow to be displayed the fisrt header
            response.Headers.Add("Access-Control-Expose-Headers", "Application-Error");
            response.Headers.Add("Access-Control-Allow-Origin", "*");

            // from here go to StartUp.cs
        }

        public static int CalculateAge(this DateTime theDateTime)
        {
            var age = DateTime.Today.Year - theDateTime.Year;
            if (theDateTime.AddYears(age) > DateTime.Today) 
                age--;
            return age;
        }
    }
}