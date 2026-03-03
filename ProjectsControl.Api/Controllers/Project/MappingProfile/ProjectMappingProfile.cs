using AutoMapper;
using ProjectsControl.Api.Controllers.Project.ViewModels;
using ProjectsControl.Application.Services.Project.Dtos;

namespace ProjectsControl.Api.Controllers.Project.MappingProfile;

public class ProjectMappingProfile : Profile
{
    public ProjectMappingProfile()
    {
        //GET
        CreateMap<GetProjectViewModel, GetProjectDto>().ReverseMap();
        
        //POST
        CreateMap<CreateProjectViewModel, CreateProjectDto>().ReverseMap();
        
        //PATCH
        CreateMap<UpdateProjectViewModel, UpdateProjectInfoDto>().ReverseMap();
        
        CreateMap<ChangeEmployeesOnProjectViewModel, ChangeEmployeeOnProjectDto>().ReverseMap();
    }
}