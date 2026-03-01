using AutoMapper;
using ProjectsControl.Application.Services.Project.Dtos;

namespace ProjectsControl.Application.Services.Project.MappingProfile;

public class ProjectMappingProfile : Profile
{
    public ProjectMappingProfile()
    {
        //Profiles for GET
        CreateMap<GetProjectDto, Entity.Models.Project>().ReverseMap();
        CreateMap<EmployeeInProjectDto, Entity.Models.Employee>().ReverseMap();
        
        CreateMap<Entity.Models.Document, GetDocumentDto>()
            .ForMember(dest => dest.FileName,
                opt => opt.MapFrom(src => src.Title));
        
        //Profiles for POST
        CreateMap<Entity.Models.Project, CreateProjectDto>()
            .ForMember(dest => dest.EmployeesIds, opt => opt.Ignore());

        CreateMap<CreateProjectDto, Entity.Models.Project>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.Employees, opt => opt.Ignore());
        
        //Profiles for PATCH
        CreateMap<UpdateProjectInfoDto, Entity.Models.Project>()
            .ForAllMembers(opts =>
                opts.Condition((src, dest, srcMember) => srcMember != null));

        CreateMap<Entity.Models.Project, UpdateProjectInfoDto>();
    }
}