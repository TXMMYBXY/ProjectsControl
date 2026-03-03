using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using ProjectsControl.Api.Controllers.Auth.ViewModels;
using ProjectsControl.Application.Services.Auth;
using ProjectsControl.Application.Services.Auth.Dtos;

namespace ProjectsControl.Api.Controllers.Auth;

[ApiController]
[Route("api/authorization")]
public class AuthorizationController : ControllerBase
{
    private readonly IMapper _mapper;
    private readonly IAccountService _accountService;

    public AuthorizationController(IMapper mapper, IAccountService accountService)
    {
        _mapper = mapper;
        _accountService = accountService;
    }
    
    /// <summary>
    /// че бубнить...
    /// </summary>
    [HttpPost("login")]
    public async Task<ActionResult<LoginResponseViewModel>> Login([FromBody] LoginRequestViewModel loginUserViewModel)
    {
        var loginUserDto = _mapper.Map<LoginUserDto>(loginUserViewModel);
        var loginDto = await _accountService.LoginAsync(loginUserDto);
        var loginViewModel = _mapper.Map<LoginResponseViewModel>(loginDto);

        return Ok(loginViewModel);
    }
}