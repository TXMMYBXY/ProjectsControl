using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using ProjectsControl.Api.Controllers.ProjectController.ViewModels;
using ProjectsControl.Application.Services.Project;

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

    [HttpGet]
    public async Task<ActionResult<List<GetProjectViewModel>>> GetAllProjects()
    {
        throw  new NotImplementedException();
    }
    
    [HttpGet("{projectId:int}")]
    public async Task<ActionResult<GetProjectViewModel>> GetProjectById(int projectId)
    {
        throw  new NotImplementedException();
    }

    [HttpPost]
    public async Task<ActionResult> CreateProject([FromBody] CreateProjectViewModel createProjectViewModel)
    {
        throw  new NotImplementedException();
    }

    [HttpPut("{projectId:int}")]
    public async Task<ActionResult> UpdateProjectById(int projectId, 
        [FromBody] UpdateProjectViewModel updateProjectViewModel)
    {
        throw  new NotImplementedException();
    }

    [HttpDelete("{projectId:int}")]
    public async Task<ActionResult> DeleteProjectById(int projectId)
    {
        throw  new NotImplementedException();
    }
}