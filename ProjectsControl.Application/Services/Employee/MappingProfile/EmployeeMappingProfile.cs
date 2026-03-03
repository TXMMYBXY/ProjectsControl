using AutoMapper;
using ProjectsControl.Application.Services.Employee.Dtos;

namespace ProjectsControl.Application.Services.Employee.MappingProfile;

public class EmployeeMappingProfile : Profile
{
    public EmployeeMappingProfile()
    {
        //Profiles for GET
        CreateMap<GetEmployeeDto, Entity.Models.Employee>().ReverseMap();
        
        CreateMap<ProjectByEmployeeDto, Entity.Models.Project>().ReverseMap();
        
        //Profiles for POST
        CreateMap<Entity.Models.Employee, CreateEmployeeDto>()
            .ForMember(dest => dest.ProjectsIds, opt => opt.Ignore());

        CreateMap<CreateEmployeeDto, Entity.Models.Employee>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.Projects, opt => opt.Ignore())
            .ForMember(dest => dest.ManagedProjects, opt => opt.Ignore());
        
        //Profiles for PATCH
        CreateMap<UpdateEmployeeDto, Entity.Models.Employee>()
            .AfterMap((src, dest) =>
            {
                dest.FirstName = src.FirstName ?? dest.FirstName;
                dest.LastName = src.LastName ?? dest.LastName;
                dest.Patronymic = src.Patronymic ?? dest.Patronymic;
                dest.Email = src.Email ?? dest.Email;
                dest.PhoneNumber = src.PhoneNumber ?? dest.PhoneNumber;
            });
    }
}