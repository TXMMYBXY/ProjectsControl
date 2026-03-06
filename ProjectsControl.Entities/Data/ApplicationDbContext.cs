using Microsoft.EntityFrameworkCore;
using ProjectsControl.Entity.Models;

namespace ProjectsControl.Entity.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> dbContextOptions) : base(dbContextOptions)
    {
        
    }
    
    public DbSet<Project> Projects { get; set; }
    public DbSet<Employee> Employees { get; set; }
    public DbSet<Document> Documents { get; set; }
    public DbSet<ProjectTask> Tasks { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Project>()
            .HasMany(p => p.Employees)
            .WithMany(e => e.Projects)
            .UsingEntity(j => j.ToTable("ProjectEmployees"));

        modelBuilder.Entity<Project>()
            .HasOne(p => p.ProjectManager)
            .WithMany(e => e.ManagedProjects)
            .HasForeignKey(p => p.ProjectManagerId)
            .OnDelete(DeleteBehavior.SetNull);

        modelBuilder.Entity<Document>()
            .HasOne(d => d.Project)
            .WithMany(p => p.Documents)
            .HasForeignKey(d => d.ProjectId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<ProjectTask>()
            .HasOne(t => t.Project)
            .WithMany(p => p.Tasks)
            .HasForeignKey(t => t.ProjectId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<ProjectTask>()
            .HasOne(t => t.Author)
            .WithMany()
            .HasForeignKey(t => t.AuthorId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<ProjectTask>()
            .HasOne(t => t.Employee)
            .WithMany(e => e.Tasks)
            .HasForeignKey(t => t.EmployeeId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}