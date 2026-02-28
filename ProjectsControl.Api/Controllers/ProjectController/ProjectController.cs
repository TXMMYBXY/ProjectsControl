using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using ProjectsControl.Api.Controllers.ProjectController.ViewModels;
using ProjectsControl.Application.Services.Employee.Dtos;
using ProjectsControl.Application.Services.Project;
using ProjectsControl.Application.Services.Project.Dtos;

namespace ProjectsControl.Api.Controllers.ProjectController;

[ApiController]
[Route("project-control-api/projects")]
public class ProjectController : ControllerBase
{
    private readonly IMapper _mapper;
    private readonly IProjectService _projectService;

    public ProjectController(IMapper mapper, IProjectService projectService)
    {
        _mapper = mapper;
        _projectService = projectService;
    }

    [HttpGet("all")]
    public async Task<ActionResult<List<GetProjectViewModel>>> GetAllProjects()
    {
        var projectListDto = await _projectService.GetAllProjectsAsync();
        var projectListViewModel = _mapper.Map<List<GetProjectViewModel>>(projectListDto);
        
        return Ok(projectListViewModel);
    }
    
    [HttpGet("{projectId:int}")]
    public async Task<ActionResult<GetProjectViewModel>> GetProjectById(int projectId)
    {
        var projectDto = await _projectService.GetProjectByIdAsync(projectId);
        var projectViewModel = _mapper.Map<GetProjectViewModel>(projectDto);
        
        return Ok(projectViewModel);
    }

    [HttpPost]
    public async Task<ActionResult> CreateProject([FromBody] CreateProjectViewModel createProjectViewModel)
    {
        var createProjectDto = _mapper.Map<CreateProjectDto>(createProjectViewModel);
        var projectDto = await _projectService.CreateProjectAsync(createProjectDto);
        var projectViewModel = _mapper.Map<CreateProjectViewModel>(projectDto);
        
        return Created(nameof(projectViewModel), projectViewModel);
    }

    [HttpPatch("{projectId:int}")]
    public async Task<ActionResult> UpdateProjectById(int projectId, 
        [FromBody] UpdateProjectViewModel updateProjectViewModel)
    {
        var updateProjectDto = _mapper.Map<UpdateProjectInfoDto>(updateProjectViewModel);
        
        await _projectService.UpdateProjectInfoAsync(projectId, updateProjectDto);
        
        return Ok();
    }

    [HttpDelete("{projectId:int}")]
    public async Task<ActionResult> DeleteProjectById(int projectId)
    {
        await  _projectService.DeleteProjectAsync(projectId);
        
        return Ok();
    }

    [HttpPatch("{projectId:int}/change-employees")]
    public async Task<ActionResult> ChangeEmployeesOnProject(int projectId,
        ChangeEmployeesOnProjectViewModel changeEmployeesOnProjectViewModel)
    {
        var changeEmployeesOnDto = _mapper.Map<ChangeEmployeeOnProjectDto>(changeEmployeesOnProjectViewModel);
        
        await _projectService.ChangeEmployeesOnProjectAsync(projectId, changeEmployeesOnDto);
        
        return Ok();
    }
} 