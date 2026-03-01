namespace ProjectsControl.Application.Services.Project.Dtos;

public class UpdateProjectInfoDto
{
    public string? Title { get; set; }
    public string? CustomerCompany { get; set; }
    public string? PerformingCompany { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? FinishDate { get; set; }
    public int? Priority { get; set; }
}