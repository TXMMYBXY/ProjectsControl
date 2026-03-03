using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace ProjectsControl.Api.Controllers.Auth;

public class AuthorizeByRoleAttribute : AuthorizeAttribute, IAuthorizationFilter
{
    private readonly int[] _allowedRoles;
    
    public AuthorizeByRoleAttribute(params int[] allowedRoles)
    {
        _allowedRoles = allowedRoles;
    }
    
    public void OnAuthorization(AuthorizationFilterContext context)
    {
        if (!context.HttpContext.User.Identity.IsAuthenticated)
        {
            context.Result = new UnauthorizedResult();
            return;
        }

        var claimRoleId = context.HttpContext.User.FindFirst("RoleId").Value;

        if (string.IsNullOrEmpty(claimRoleId))
        {
            context.Result = new ForbidResult();
            return;
        }

        if (!int.TryParse(claimRoleId, out int userRoleId))
        {
            context.Result = new ForbidResult();
            return;
        }

        if (!_allowedRoles.Contains(userRoleId))
        {
            context.Result = new ForbidResult();
        }
    }
}