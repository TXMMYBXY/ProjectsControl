namespace ProjectsControl.Application.Services.Employee.Dtos;

public class GetEmployeeDto
{
    public int Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Patronymic { get; set; }
    public string Email { get; set; }
    public string PhoneNumber { get; set; }
    public List<ProjectByEmployeeDto> Projects { get; set; }
}