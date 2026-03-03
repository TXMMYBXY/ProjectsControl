using Microsoft.EntityFrameworkCore;
using ProjectsControl.Application.Repository;
using ProjectsControl.Entity.Data;
using ProjectsControl.Entity.Models;

namespace ProjectsControl.Infrastructure.Repository;

public class EmployeeRepository : BaseRepository<Employee>, IEmployeeRepository
{
    private readonly ApplicationDbContext _dbContext;
    public EmployeeRepository(ApplicationDbContext dbContext) : base(dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IReadOnlyList<Employee>> GetAllEmployeesAsync()
    {
        return await _dbContext.Employees.Include(e => e.Projects).ToListAsync();
    }

    public async Task<IReadOnlyList<Employee>> GetEmployeesByIdsAsync(int[] employeesIds)
    {
        return await _dbContext.Employees.Where(e => employeesIds.Contains(e.Id)).ToListAsync();
    }

    public Task<Employee> GetEmployeeByIdAsync(int employeeId)
    {
        return _dbContext.Employees.Include(e => e.Projects).FirstOrDefaultAsync(e => e.Id == employeeId);
    }
    
    public async Task<Employee> GetEmployeeByLoginAsync(string email)
    {
        return await _dbContext.Employees.FirstOrDefaultAsync(x => x.Email.Equals(email));
    }
}