using AutoMapper;
using Hired1stTest.Entity.DTO;
using Hired1stTest.Entity.Models;

namespace Hired1stTest.Controllers
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            //USERS
            CreateMap<UserForRegistration, User>()
                .ForMember(u => u.UserName, opt => opt.MapFrom(x => x.Email)); 
            CreateMap<UserForManage, User>()
                .ForMember(u => u.UserName, opt => opt.MapFrom(x => x.Email));
            CreateMap<User, UserForManage>()
                .ForMember(u => u.Email, opt => opt.MapFrom(x => x.Email));

            //PRODUCTS
            CreateMap<ProductForManage, Product>()
                .ForMember(u => u.Name, opt => opt.MapFrom(x => x.Name));
            CreateMap<Product, ProductForManage>()
               .ForMember(u => u.Name, opt => opt.MapFrom(x => x.Name));
        }
    }
}
