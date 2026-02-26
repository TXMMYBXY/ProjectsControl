using ProjectsControl.Application.Repository;
using ProjectsControl.Entity.Data;
using ProjectsControl.Entity.Models;

namespace ProjectsControl.Infrastructure.Repository;

public class ProjectRepository : BaseRepository<Project>, IProjectRepository 
{
    public ProjectRepository(ApplicationDbContext dbContext) : base(dbContext)
    {
    }
    
}