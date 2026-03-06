using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using ProjectsControl.Api.Controllers.ProjectController.ViewModels;
using ProjectsControl.Application.Services.Project;
using ProjectsControl.Application.Services.Project.Dtos;

namespace ProjectsControl.Api.Controllers.ProjectController;

[ApiController]
[Route("api/project")]
public class ProjectController : ControllerBase
{
    private readonly IMapper _mapper;
    private readonly IProjectService _projectService;

    public ProjectController(IMapper mapper, IProjectService projectService)
    {
        _mapper = mapper;
        _projectService = projectService;
    }

    /// <summary>
    /// Endpoint for getting all projects
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<List<GetProjectViewModel>>> GetAllProjects([FromQuery] ProjectFilter projectFilter)
    {
        var projectListDto = await _projectService.GetAllProjectsAsync(projectFilter);
        var projectListViewModel = _mapper.Map<List<GetProjectViewModel>>(projectListDto);
        
        return Ok(projectListViewModel);
    }
    
    /// <summary>
    /// Endpoint for getting project
    /// </summary>
    [HttpGet("{projectId:int}")]
    public async Task<ActionResult<GetProjectViewModel>> GetProject([FromRoute] int projectId)
    {
        var projectDto = await _projectService.GetProjectByIdAsync(projectId);
        var projectViewModel = _mapper.Map<GetProjectViewModel>(projectDto);
        
        return Ok(projectViewModel);
    }

    /// <summary>
    /// Endpoint for creating project
    /// </summary>
    [HttpPost]
    public async Task<ActionResult> CreateProject([FromBody] CreateProjectViewModel createProjectViewModel)
    {
        var createProjectDto = _mapper.Map<CreateProjectDto>(createProjectViewModel);
        var projectDto = await _projectService.CreateProjectAsync(createProjectDto);
        var projectViewModel = _mapper.Map<CreateProjectViewModel>(projectDto);
        
        return Created(nameof(projectViewModel), projectViewModel);
    }

    /// <summary>
    /// Endpoint for updating project
    /// </summary>
    [HttpPatch("{projectId:int}/info")]
    public async Task<ActionResult> UpdateProjectInfo([FromRoute] int projectId, 
        [FromBody] UpdateProjectViewModel updateProjectViewModel)
    {
        var updateProjectDto = _mapper.Map<UpdateProjectInfoDto>(updateProjectViewModel);
        
        await _projectService.UpdateProjectInfoAsync(projectId, updateProjectDto);
        
        return Ok();
    }

    /// <summary>
    /// Endpoint for deleting project
    /// </summary>
    [HttpDelete("{projectId:int}")]
    public async Task<ActionResult> DeleteProject([FromRoute] int projectId)
    {
        await  _projectService.DeleteProjectAsync(projectId);
        
        return Ok();
    }

    /// <summary>
    /// Endpoint for updating project`s employees
    /// </summary>
    [HttpPatch("{projectId:int}/status-and-employees")]
    public async Task<ActionResult> UpdateEmployeesAndStatus([FromRoute] int projectId,
        [FromBody] ChangeEmployeesOnProjectViewModel changeEmployeesOnProjectViewModel)
    {
        var changeEmployeesOnDto = _mapper.Map<ChangeEmployeeOnProjectDto>(changeEmployeesOnProjectViewModel);
        
        await _projectService.ChangeEmployeesAndStatusAsync(projectId, changeEmployeesOnDto);
        
        return Ok();
    }

} 