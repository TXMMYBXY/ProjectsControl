using ProjectsControl.Entity.Models;

namespace ProjectsControl.Application.Services.Project.Dtos;

public class GetProjectDto
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string CustomerCompany { get; set; }
    public string PerformingCompany { get; set; }
    public List<EmployeeInProjectDto> Employees { get; set; }
    public EmployeeInProjectDto ProjectManager { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime FinishDate { get; set; }
    public int Priority { get; set; }
    public List<GetDocumentDto> Documents { get; set; }
    public ProjectStatus Status { get; set; }
}
