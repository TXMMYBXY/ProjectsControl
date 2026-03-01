using AutoMapper;
using ProjectsControl.Api.Controllers.ProjectController.ViewModels;
using ProjectsControl.Application.Services.Employee.Dtos;
using ProjectsControl.Application.Services.Project.Dtos;

namespace ProjectsControl.Api.Controllers.ProjectController.MappingProfile;

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