using AutoMapper;
using ProjectsControl.Application.Services.Employee.Dtos;
using ProjectsControl.Application.Services.Project.Dtos;

namespace ProjectsControl.Application.Services.Project.MappingProfile;

public class ProjectMappingProfile : Profile
{
    public ProjectMappingProfile()
    {
        //Profiles for GET
        CreateMap<GetProjectDto, Entity.Models.Project>().ReverseMap();
        
        //Profiles for POST
        CreateMap<CreateProjectDto, Entity.Models.Project>().ReverseMap();
        
        //Profiles for PATCH
        CreateMap<UpdateProjectDto, Entity.Models.Project>().ReverseMap();
    }
}