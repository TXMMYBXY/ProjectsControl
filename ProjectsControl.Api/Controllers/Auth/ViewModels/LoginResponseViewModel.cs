using ProjectsControl.Application.Services.Auth.Dtos;

namespace ProjectsControl.Api.Controllers.Auth.ViewModels;

public class LoginResponseViewModel
{
    public UserInfoForLoginDto UserInfo { get; set; }
    public string AccessToken { get; set; }
    public string ExpiresAt { get; set; }
    public string TokenType { get; set; } = "Bearer";
}