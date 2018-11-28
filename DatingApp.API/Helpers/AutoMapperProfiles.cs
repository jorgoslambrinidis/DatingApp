using System.Linq;
using AutoMapper;
using DatingApp.API.Dtos;
using DatingApp.API.Models;

namespace DatingApp.API.Helpers
{
    // AutoMapper uses profiles to help understand the 
    // source and the destination of what is mapping
    // In order to use the methods inside here we need to
    // inherit from the profile class
    public class AutoMapperProfiles : Profile
    {
        // init a constructor
        public AutoMapperProfiles()
        {
            // inside a constructor we can create our mappings

            // here we are specifing the source and the destination mappings

            // create a configuration for our automapper
            CreateMap<User, UserForListDto>()
                .ForMember(dest => dest.PhotoUrl, opt => {
                    opt.MapFrom(src => src.Photos.FirstOrDefault(p => p.IsMain).Url);
                })
                .ForMember(dest => dest.Age, opt => {
                    opt.ResolveUsing(d => d.DateOfBirth.CalculateAge());
                });
            CreateMap<User, UserForDetailedDto>()
                .ForMember(dest => dest.PhotoUrl, opt => {
                    opt.MapFrom(src => src.Photos.FirstOrDefault(p => p.IsMain).Url);
                })
                .ForMember(dest => dest.Age, opt => {
                    opt.ResolveUsing(d => d.DateOfBirth.CalculateAge());
                });
            CreateMap<Photo, PhotosForDetailedDto>();

            // AutoMapper is convention based
            // Ex:
            // "Username" propery inside User.cs 
            // &
            // "Username" propery inside UserForListDto.cs
            // its smart enough to realize that these 2 properties should map to each other
        }
    }
}