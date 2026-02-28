namespace ProjectsControl.Application.Services.Project.Dtos;

public class UpdateProjectDto
{
    public string? Title { get; set; }
    public string? CustomerCompany { get; set; }
    public string? PerformingCompany { get; set; }
    public int[]? EmployeesIds { get; set; }
    public int? ProjectManagerId { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? FinishDate { get; set; }
    public int? Priority { get; set; }
}