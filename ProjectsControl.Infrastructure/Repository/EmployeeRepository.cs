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

    public async Task<Employee> GetEmployeeByEmailAsync(string email)
    {
        return await _dbContext.Employees.FirstOrDefaultAsync(e => e.Email == email);
    }

}