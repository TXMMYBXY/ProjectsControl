using ProjectsControl.Entity.Models;

namespace ProjectsControl.Application.Services.ProjectTask.Dtos;

public class UpdateTaskStatusDto
{
    public ProjectStatus Status { get; set; }
}