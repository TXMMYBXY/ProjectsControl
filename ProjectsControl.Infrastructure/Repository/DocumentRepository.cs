using ProjectsControl.Application.Repository;
using ProjectsControl.Entity.Data;
using ProjectsControl.Entity.Models;

namespace ProjectsControl.Infrastructure.Repository;

public class DocumentRepository : BaseRepository<Document>, IDocumentRepository
{
    public DocumentRepository(ApplicationDbContext dbContext) : base(dbContext)
    {
    }
}