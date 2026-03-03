using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using ProjectsControl.Entity.Enums;

namespace ProjectsControl.Entity.Models;

public class Employee : EntityBase
{
    [Required]
    [Column(nameof(FirstName), TypeName =  "nvarchar(63)")]
    public string FirstName { get; set; }
    
    [Required]
    [Column(nameof(LastName), TypeName =  "nvarchar(63)")]
    public string LastName { get; set; }
    
    [Column(nameof(Patronymic), TypeName =  "nvarchar(63)")]
    public string Patronymic { get; set; }
    
    [Column(nameof(Email), TypeName =  "nvarchar(63)")]
    public string Email { get; set; }
    
    [Column(nameof(PasswordHash))]
    public string PasswordHash { get; set; }
    
    [Column(nameof(PhoneNumber), TypeName =  "nvarchar(31)")]
    public string PhoneNumber { get; set; }
    
    [Column(nameof(Role), TypeName =  "tinyint")]
    public Role Role { get; set; }

    public virtual List<Project> Projects { get; set; } = new List<Project>();
    public virtual List<Project> ManagedProjects { get; set; } = new List<Project>();

}