namespace ProjectsControl.Application.Services.Employee.Dtos;

public class CreateEmployeeDto
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Patronymic { get; set; }
    public string Email { get; set; }
    public string PhoneNumber { get; set; }
    public List<int>? ProjectsIds { get; set; }
}