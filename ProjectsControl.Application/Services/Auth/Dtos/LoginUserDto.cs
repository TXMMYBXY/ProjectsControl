namespace ProjectsControl.Application.Services.Auth.Dtos;

public class LoginUserDto
{
    public string Email { get; set; }
    public string PasswordHash { get; set; }
}