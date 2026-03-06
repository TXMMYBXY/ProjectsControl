using Microsoft.EntityFrameworkCore;
using ProjectsControl.Application.Repository;
using ProjectsControl.Application.Services.Project;
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

    public async Task<List<Project>?> GetAllProjectsAsync(ProjectFilter projectFilter)
    {
        var query = _dbContext.Projects
            .Include(p => p.Employees)
            .Include(p => p.ProjectManager)
            .Include(p => p.Documents)
            .AsQueryable();

        if (projectFilter != null)
        {
            if (projectFilter.status != null) query = query.Where(p => p.Status == projectFilter.status);
            if (projectFilter.startTime != null) query = query.Where(p => p.StartDate >= projectFilter.startTime);
            if (projectFilter.endTime != null) query = query.Where(p => p.StartDate <= projectFilter.endTime);
            if (projectFilter.projectManagerId != null) query = query.Where(p => p.ProjectManagerId == projectFilter.projectManagerId);
        }

        return await query
            .AsNoTracking()
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

    public async Task<List<Project>> GetProjectsFilteredByStartDateAsync(ProjectFilter projectFilter)
    {
        return await _dbContext.Projects
            .Where(p => p.Status == projectFilter.status)
            .Where(p => p.StartDate >= projectFilter.startTime)
            .Include(p => p.Employees)
            .Include(p => p.ProjectManager)
            .Include(p => p.Documents)
            .ToListAsync();
    }
}