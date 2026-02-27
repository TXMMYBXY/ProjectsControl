namespace ProjectsControl.Application.Services.Project.Dtos;

public class CreateProjectDto
{
    public string Title { get; set; }
    public string CustomerCompany { get; set; }
    public string PerformingCompany { get; set; }
    public List<Entity.Models.Employee> Employees { get; set; }
    public Entity.Models.Employee ProjectManager { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime FinishDate { get; set; }
    public int Priority { get; set; }
}