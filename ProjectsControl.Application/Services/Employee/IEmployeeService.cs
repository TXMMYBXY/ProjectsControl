using ProjectsControl.Application.Services.Employee.Dtos;
using ProjectsControl.Application.Services.Project.Dtos;

namespace ProjectsControl.Application.Services.Employee;

public interface IEmployeeService
{
    Task<List<GetEmployeeDto>> GetAllEmployeesAsync();
    Task<GetEmployeeDto> GetEmployeeAsync(int employeeId);
    Task<CreateEmployeeDto> CreateEmployeeAsync(CreateEmployeeDto createEmployeeDto);
    Task UpdateEmployeeAsync(int employeeId, UpdateEmployeeDto updateEmployeeDto);
    Task DeleteEmployeeAsync(int employeeId);
    Task ChangeProjectEmployeeAsync(int employeeId, ChangeProjectEmployeeDto changeProjectEmployeeDto);
}