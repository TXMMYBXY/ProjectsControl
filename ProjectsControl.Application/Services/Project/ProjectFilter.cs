using ProjectsControl.Entity.Models;

namespace ProjectsControl.Application.Services.Project;

public class ProjectFilter
{
    public DateTime? startTime { get; set; }
    public DateTime? endTime { get; set; }
    public ProjectStatus? status { get; set; }
    public int? projectManagerId { get; set; }
}