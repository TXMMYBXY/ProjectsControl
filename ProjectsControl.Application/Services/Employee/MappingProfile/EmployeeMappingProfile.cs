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
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.Projects, opt => opt.Ignore())
            .ForMember(dest => dest.ManagedProjects, opt => opt.Ignore())
            .ForAllMembers(opts =>
                opts.Condition((src, dest, srcMember) => srcMember != null));

        CreateMap<Entity.Models.Employee, UpdateEmployeeDto>();
        
        CreateMap<ChangeProjectEmployeeDto, Entity.Models.Employee>()
            .ForAllMembers(opts =>
                opts.Condition((src, dest, srcMember) => srcMember != null));
    }
}