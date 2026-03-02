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

    public async Task<IReadOnlyList<Project>?> GetProjectsByIdAsync(params int[] projectIds)
    {
        return await _dbContext.Projects.Where(p => projectIds.Contains(p.Id)).ToListAsync();
    }

    public async Task<IReadOnlyList<Project>?> GetAllProjectsAsync()
    {
        return await _dbContext.Projects
            .Include(p => p.Employees)
            .Include(p => p.ProjectManager)
            .Include(p => p.Documents)
            .ToListAsync();
    }

    public async Task<Project?> GetProjectByIdAsync(int projectId)
    {
        return await _dbContext.Projects
            .Include(p => p.ProjectManager)
            .Include(p => p.Employees)
            .Include(p => p.Documents)
            .FirstOrDefaultAsync(p => p.Id == projectId);
    }

    public async Task<IReadOnlyList<Project>?> GetManagedProjectsByEmployeeIdAsync(int employeeId)
    {
        return await _dbContext.Projects.Where(p => p.ProjectManagerId.Equals(employeeId)).ToListAsync();
    }

}