using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using ProjectsControl.Application.Repository;
using ProjectsControl.Application.Services.Auth;
using ProjectsControl.Application.Services.Auth.Config;
using ProjectsControl.Application.Services.Auth.Dtos;
using ProjectsControl.Entity.Models;

namespace ProjectsControl.Infrastructure.Services;

public class AccountService : IAccountService
{
    private readonly IMapper _mapper;
    private readonly IEmployeeRepository _employeeRepository;
    private readonly IJwtService _jwtService;
    private readonly JwtSettings _jwtSettings;

    public AccountService(
        IMapper mapper,
        IEmployeeRepository employeeRepository,
        IJwtService jwtService,
        IOptions<JwtSettings> jwtSettings)
    {
        _mapper = mapper;
        _employeeRepository = employeeRepository;
        _jwtService = jwtService;
        _jwtSettings = jwtSettings.Value;
    }
    
    public async Task<LoginResponseDto> LoginAsync(LoginUserDto loginUserDto)
    {
        var employee = await _employeeRepository.GetEmployeeByLoginAsync(loginUserDto.Email);
        
        GeneralService.CheckForNull(employee, "Incorrect login");

        var result = new PasswordHasher<Employee>().VerifyHashedPassword(employee, employee.PasswordHash, loginUserDto.PasswordHash);

        if (PasswordVerificationResult.Failed == result)
        {
            throw new ArgumentException("Incorrect password");
        }

        return new LoginResponseDto
        {
            UserInfo = _mapper.Map<UserInfoForLoginDto>(employee),
            AccessToken = _jwtService.GenerateAccessToken(employee),
            ExpiresAt = DateTime.UtcNow.AddMinutes(_jwtSettings.ExpiresMinutes).ToString(),
        };
    }
}