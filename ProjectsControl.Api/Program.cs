using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using ProjectsControl.Api.Configuration;
using ProjectsControl.Api.Middleware;
using ProjectsControl.Entity.Data;
using ProjectsControl.Infrastructure;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});      

builder.Services.AddInfrastructure();     
builder.Services.AddControllers();
        
builder.Services.Configure<DataBaseConnectionSettings>(builder.Configuration.GetSection("DataBaseConnectionSettings"));

var dataBaseConnectionSettings = builder.Configuration.GetSection("DataBaseConnectionSettings").Get<DataBaseConnectionSettings>();
        
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
        Title = "Сервис контроля проектов",
        Version = "v1"
    });
});

var app = builder.Build();

app.UseCors("AllowAll");

app.UseHttpsRedirection();
app.UseErrorHandling();

app.MapSwagger("/openapi/{documentName}.json");
app.MapScalarApiReference();
app.MapControllers();

app.Run();
