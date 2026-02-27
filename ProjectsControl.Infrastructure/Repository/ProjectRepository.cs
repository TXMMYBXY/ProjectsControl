using Microsoft.EntityFrameworkCore;
using ProjectsControl.Application.Repository;
using ProjectsControl.Entity.Data;
using ProjectsControl.Entity.Models;

namespace ProjectsControl.Infrastructure.Repository;

public class ProjectRepository : BaseRepository<Project>, IProjectRepository 
{
    private readonly ApplicationDbContext _dbContext;
    
    public ProjectRepository(ApplicationDbContext dbContext) : base(dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IReadOnlyList<Project>?> GetProjectsByEmployeeIdAsync(int employeeId)
    {
        throw new NotImplementedException();
    }

    public async Task<IReadOnlyList<Project>?> GetProjectsByManagerEmployeeIdAsync(int employeeId)
    {
        throw new NotImplementedException();
    }

    public async Task<IReadOnlyList<Project>?> AddProjectsToEmployeeByIdAsync(int employeeId, params int[] projectIds)
    {
        throw new NotImplementedException();
    }

    public async Task<IReadOnlyList<Project>?> GetProjectsByIdAsync(params int[] projectIds)
    {
        return await _dbContext.Projects.Where(p => projectIds.Contains(p.Id)).ToListAsync();
    }
}