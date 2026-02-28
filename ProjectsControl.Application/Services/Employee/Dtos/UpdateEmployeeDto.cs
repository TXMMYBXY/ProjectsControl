namespace ProjectsControl.Application.Services.Employee.Dtos;

public class UpdateEmployeeDto
{
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public string? Patronymic { get; set; }
    public string? Email { get; set; }
    public string? PhoneNumber { get; set; }
    public int[]? ProjectsIds { get; set; }
    public int[]? ManagedProjectsIds { get; set; }
}