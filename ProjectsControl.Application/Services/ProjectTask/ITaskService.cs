using ProjectsControl.Application.Services.ProjectTask.Dtos;

namespace ProjectsControl.Application.Services.ProjectTask;

public interface ITaskService
{
    Task<List<GetTaskDto>> GetAllTasksAsync();
    Task<GetTaskDto> GetTaskByIdAsync(int taskId);
    Task<List<GetTaskDto>> GetAllTasksByUserIdAsync(int userId);
    Task<CreateTaskDto> CreateTaskAsync(CreateTaskDto createTaskDto);
    Task UpdateTaskInfoAsync(int taskId, UpdateTaskInfoDto updateTaskInfoDto);
    Task UpdateTaskEmployeeAsync(int taskId, UpdateTaskEmployeeDto updateTaskEmployeeDto);
    Task UpdateTaskStatusAsync(int taskId, UpdateTaskStatusDto updateTaskStatusDto);
    Task DeleteTaskAsync(int taskId);
}