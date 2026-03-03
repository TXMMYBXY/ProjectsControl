using ProjectsControl.Application.Services.Auth.Dtos;

namespace ProjectsControl.Application.Services.Auth;

public interface IAccountService
{
    Task<LoginResponseDto> LoginAsync(LoginUserDto loginUserDto);
}