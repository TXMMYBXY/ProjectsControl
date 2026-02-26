using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using ProjectsControl.Api.Middleware;
using ProjectsControl.Entity.Data;
using ProjectsControl.Infrastructure;

namespace ProjectsControl.Api.Configuration;

public class RegisterService
{
    public IConfiguration Configuration { get; }

    public RegisterService(IConfiguration configuration)
    {
        Configuration = configuration;
    }

    public void ConfigureServices(IServiceCollection services)
    {
        services.AddControllers();
        services.AddInfrastructure();     
        
        
        services.Configure<DataBaseConnectionSettings>(Configuration.GetSection("DataBaseConnectionSettings"));

        var dataBaseConnectionSettings = Configuration.GetSection("DataBaseConnectionSettings").Get<DataBaseConnectionSettings>();
        
        services.AddControllers();
        services.AddDbContext<ApplicationDbContext>(options =>
        {
            options.UseSqlServer(dataBaseConnectionSettings.ConnectionString);
        });
        services.AddAutoMapper(typeof(Program));

        services.AddEndpointsApiExplorer();
        services.AddSwaggerGen(c =>
        {
            c.SwaggerDoc("v1", new OpenApiInfo
            {
                Title = "Сервис мониторинга стороннего приложения",
                Version = "v1"
            });
        });
    }

    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
        app.UseErrorHandling();
        app.UseHttpsRedirection();
    }
}