using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using ProjectsControl.Api.Controllers.ProjectTask.ViewModels;
using ProjectsControl.Application.Services.ProjectTask;
using ProjectsControl.Application.Services.ProjectTask.Dtos;

namespace ProjectsControl.Api.Controllers.ProjectTask;

[ApiController]
[Route("api/task")]
public class TaskController : ControllerBase
{
    private readonly IMapper _mapper;
    private readonly ITaskService _taskService;

    public TaskController(IMapper mapper, ITaskService taskService)
    {
        _mapper = mapper;
        _taskService = taskService;
    }

    [HttpGet]
    public async Task<ActionResult<GetTaskViewModel>> GetAllTasks()
    {
        var taskListDto = await _taskService.GetAllTasksAsync();
        var taskListViewModel = _mapper.Map<List<GetTaskViewModel>>(taskListDto);
        
        return Ok(taskListViewModel);
    }
    
    [HttpGet("{taskId:int}")]
    public async Task<ActionResult<GetTaskViewModel>> GetTask([FromRoute] int taskId)
    {
        var taskDto = await _taskService.GetTaskByIdAsync(taskId);
        var taskViewModel = _mapper.Map<GetTaskViewModel>(taskDto);
        
        return Ok(taskViewModel);
    }

    [HttpGet("{userId:int}/by-user")]
    public async Task<ActionResult<List<GetTaskViewModel>>> GetTaskAllTasksByUser([FromRoute] int userId)
    {
        var taskListDto = await _taskService.GetAllTasksByUserIdAsync(userId);
        var taskListViewModel = _mapper.Map<List<GetTaskViewModel>>(taskListDto);
        
        return Ok(taskListViewModel);
    }

    [HttpPost]
    public async Task<ActionResult> CreateTask([FromBody] CreateTaskViewModel createTaskViewModel)
    {
        var createTaskDto = _mapper.Map<CreateTaskDto>(createTaskViewModel);
        var taskDto = await _taskService.CreateTaskAsync(createTaskDto);
        var taskViewModel = _mapper.Map<CreateTaskViewModel>(taskDto);
        
        return Created(nameof(taskViewModel), taskViewModel);
    }

    [HttpPatch("{taskId:int}/info")]
    public async Task<ActionResult> UpdateTaskInfo([FromRoute] int taskId, 
        [FromBody] UpdateTaskInfoViewModel updateTaskInfoViewModel)
    {
        var updateTaskInfoDto = _mapper.Map<UpdateTaskInfoDto>(updateTaskInfoViewModel);
        
        await _taskService.UpdateTaskInfoAsync(taskId, updateTaskInfoDto);
        
        return Ok();
    }

    [HttpPatch("{taskId:int}/employee")]
    public async Task<ActionResult> UpdateTaskEmployee([FromRoute] int taskId,
        [FromBody] UpdateTaskEmployeeViewModel updateTaskEmployeesViewModel)
    {
        var updateTaskEmployeeDto = _mapper.Map<UpdateTaskEmployeeDto>(updateTaskEmployeesViewModel);

        await _taskService.UpdateTaskEmployeeAsync(taskId, updateTaskEmployeeDto);

        return Ok();
    }

    [HttpPatch("{taskId:int}/status")]
    public async Task<ActionResult> UpdateTaskStatus([FromRoute] int taskId,
        [FromBody] UpdateTaskStatusViewModel updateTaskStatusViewModel)
    {
        var updateTaskStatusDto = _mapper.Map<UpdateTaskStatusDto>(updateTaskStatusViewModel);

        await _taskService.UpdateTaskStatusAsync(taskId, updateTaskStatusDto);

        return Ok();
    }

    [HttpDelete("{taskId:int}")]
    public async Task<ActionResult> DeleteTask([FromRoute] int taskId)
    {
        await _taskService.DeleteTaskAsync(taskId);

        return Ok();
    }
}