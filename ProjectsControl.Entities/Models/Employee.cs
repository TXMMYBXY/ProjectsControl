using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProjectsControl.Entity.Models;

public class Employee : EntityBase
{
    [Required]
    [Column(nameof(FirstName))]
    [MaxLength(63)]
    public string FirstName { get; set; }
    
    [Required]
    [Column(nameof(LastName))]
    [MaxLength(63)]
    public string LastName { get; set; }
    
    [Column(nameof(Patronymic))]
    [MaxLength(63)]
    public string Patronymic { get; set; }
    
    [Column(nameof(Email))]
    [MaxLength(63)]
    public string Email { get; set; }
    
    [Column(nameof(PhoneNumber))]
    [MaxLength(31)]
    public string PhoneNumber { get; set; }

    public virtual List<Project> Projects { get; set; } = new List<Project>();
    public virtual List<Project> ManagedProjects { get; set; } = new List<Project>();

}