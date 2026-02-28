using Microsoft.EntityFrameworkCore.Internal;
using Microsoft.Extensions.DependencyInjection;
using ProjectsControl.Application.Repository;
using ProjectsControl.Application.Services.Employee;
using ProjectsControl.Application.Services.Employee.MappingProfile;
using ProjectsControl.Application.Services.Project;
using ProjectsControl.Application.Services.Project.MappingProfile;
using ProjectsControl.Infrastructure.Repository;
using ProjectsControl.Infrastructure.Services;

namespace ProjectsControl.Infrastructure;

public static class ServiceRegistration
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services)
    {
        services.AddAutoMapper(typeof(EmployeeMappingProfile).Assembly);
        services.AddAutoMapper(typeof(ProjectMappingProfile).Assembly);
        
        services.AddScoped<IProjectService, ProjectService>();
        services.AddScoped<IEmployeeService, EmployeeService>();
        
        services.AddScoped(typeof(IBaseRepository<>), typeof(BaseRepository<>));
        services.AddScoped<IProjectRepository, ProjectRepository>();
        services.AddScoped<IEmployeeRepository, EmployeeRepository>();
        
        return services;
    }
}