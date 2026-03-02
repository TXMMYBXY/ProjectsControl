using ProjectsControl.Entity.Models;

namespace ProjectsControl.Application.Repository;

public interface IEmployeeRepository : IBaseRepository<Employee>
{
    /// <summary>
    /// Get all employees
    /// </summary>
    /// <returns>IReadOnlyList</returns>
    Task<IReadOnlyList<Employee>> GetAllEmployeesAsync();
    
    /// <summary>
    /// Get all employees by Ids
    /// </summary>
    /// <param name="employeesIds">Array of Ids</param>
    /// <returns>IReadOnlyList</returns>
    Task<IReadOnlyList<Employee>> GetEmployeesByIdsAsync(int[] employeesIds);
    
    /// <summary>
    /// Get employee by Id
    /// </summary>
    Task<Employee> GetEmployeeByIdAsync(int employeeId);
}