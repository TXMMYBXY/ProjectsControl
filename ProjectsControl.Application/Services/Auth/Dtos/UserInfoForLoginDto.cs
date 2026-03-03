using ProjectsControl.Entity.Enums;

namespace ProjectsControl.Application.Services.Auth.Dtos;

public class UserInfoForLoginDto
{
    public string FullName { get; set; }
    public string Email { get; set; }
    public int RoleId { get; set; }
    public virtual Role Role { get; set; }
    public string Department { get; set; }
}