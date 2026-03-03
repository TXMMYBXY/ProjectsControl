using Microsoft.Extensions.DependencyInjection;
using ProjectsControl.Application.Repository;
using ProjectsControl.Application.Services.Document;
using ProjectsControl.Application.Services.Employee;
using ProjectsControl.Application.Services.Employee.MappingProfile;
using ProjectsControl.Application.Services.FileStorage;
using ProjectsControl.Application.Services.Project;
using ProjectsControl.Application.Services.Project.MappingProfile;
using ProjectsControl.Infrastructure.Repository;
using ProjectsControl.Infrastructure.Services;

namespace ProjectsControl.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services)
    {
        //Register automapper profiles
        services.AddAutoMapper(typeof(EmployeeMappingProfile).Assembly);
        services.AddAutoMapper(typeof(ProjectMappingProfile).Assembly);
        
        //Register services
        services.AddScoped<IProjectService, ProjectService>();
        services.AddScoped<IEmployeeService, EmployeeService>();
        services.AddScoped<IDocumentService, DocumentService>();
        services.AddScoped<IFileStorageService, FileStorageService>();
        
        //Register repositories
        services.AddScoped(typeof(IBaseRepository<>), typeof(BaseRepository<>));
        services.AddScoped<IProjectRepository, ProjectRepository>();
        services.AddScoped<IEmployeeRepository, EmployeeRepository>();
        services.AddScoped<IDocumentRepository, DocumentRepository>();
        
        return services;
    }
}