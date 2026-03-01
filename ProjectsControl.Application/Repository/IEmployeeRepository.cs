using ProjectsControl.Entity.Models;

namespace ProjectsControl.Application.Repository;

public interface IEmployeeRepository : IBaseRepository<Employee>
{
    Task<IReadOnlyList<Employee>> GetAllEmployeesAsync();
    Task<IReadOnlyList<Employee>> GetEmployeesByIdsAsync(int[] employeesIds);
    Task<Employee> GetEmployeeByIdAsync(int employeeId);
}