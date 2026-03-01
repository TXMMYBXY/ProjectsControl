namespace ProjectsControl.Application.Services.Project.Dtos;

public class ChangeEmployeeOnProjectDto
{
    public int? ProjectManagerId { get; set; }
    public List<int>? EmployeesIds { get; set; }
}