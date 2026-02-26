using ProjectsControl.Application.Services.Employee;
using ProjectsControl.Application.Services.Employee.Dtos;

namespace ProjectsControl.Infrastructure.Services;

public class EmployeeService : IEmployeeService
{
    public async Task<List<GetEmployeeDto>> GetAllEmployeesAsync()
    {
        throw new NotImplementedException();
    }

    public async Task<GetEmployeeDto> GetEmployeeAsync(int employeeId)
    {
        throw new NotImplementedException();
    }

    public async Task CreateEmployeeAsync(CreateEmployeeDto createEmployeeDto)
    {
        throw new NotImplementedException();
    }

    public async Task UpdateEmployeeAsync(int employeeId, UpdateEmployeeDto updateEmployeeDto)
    {
        throw new NotImplementedException();
    }

    public async Task DeleteEmployeeAsync(int employeeId)
    {
        throw new NotImplementedException();
    }
}