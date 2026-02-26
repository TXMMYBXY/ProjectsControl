using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using ProjectsControl.Api.Configuration;
using ProjectsControl.Api.Middleware;
using ProjectsControl.Entity.Data;
using ProjectsControl.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddInfrastructure();     
        
        
builder.Services.Configure<DataBaseConnectionSettings>(builder.Configuration.GetSection("DataBaseConnectionSettings"));

var dataBaseConnectionSettings = builder.Configuration.GetSection("DataBaseConnectionSettings").Get<DataBaseConnectionSettings>();
        
builder.Services.AddControllers();
builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    options.UseSqlServer(dataBaseConnectionSettings.ConnectionString);
});
builder.Services.AddAutoMapper(typeof(Program));

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Сервис мониторинга стороннего приложения",
        Version = "v1"
    });
});

var app = builder.Build();

app.UseHttpsRedirection();
app.UseErrorHandling();
app.UseHttpsRedirection();

app.Run();
