namespace ProjectsControl.Application.Services.Employee.Dtos;

public class ChangeEmployeeOnProjectDto
{
    public int? ProjectManagerId { get; set; }
    public int[]? EmployeesIds { get; set; }
}