namespace ProjectsControl.Application.Services.Auth;

public interface IJwtService
{
    string GenerateAccessToken(Entity.Models.Employee employee);
}