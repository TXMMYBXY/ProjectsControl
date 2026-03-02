using ProjectsControl.Application.Services.Employee.Dtos;
using ProjectsControl.Application.Services.Project.Dtos;

namespace ProjectsControl.Application.Services.Employee;

public interface IEmployeeService
{
    Task<List<GetEmployeeDto>> GetAllEmployeesAsync();
    Task<GetEmployeeDto> GetEmployeeAsync(int employeeId);
    Task<CreateEmployeeDto> CreateEmployeeAsync(CreateEmployeeDto createEmployeeDto);
    
    /// <summary>
    /// Updating employee info
    /// </summary>
    Task UpdateEmployeeAsync(int employeeId, UpdateEmployeeDto updateEmployeeDto);
    Task DeleteEmployeeAsync(int employeeId);
    
    /// <summary>
    /// Updating employee`s projects
    /// </summary>
    /// <param name="employeeId"></param>
    /// <param name="changeProjectEmployeeDto"></param>
    /// <returns></returns>
    Task ChangeProjectEmployeeAsync(int employeeId, ChangeProjectEmployeeDto changeProjectEmployeeDto);
}