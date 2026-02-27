using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProjectsControl.Entity.Models;

public class Project : EntityBase
{
    [Required]
    [Column(nameof(Title), TypeName =  "nvarchar(63)")]
    [MaxLength(63)]
    public string Title { get; set; }
    
    [Required]
    [Column(nameof(CustomerCompany), TypeName =  "nvarchar(63)")]
    [MaxLength(63)]
    public string CustomerCompany { get; set; }
    
    [Required]
    [Column(nameof(PerformingCompany), TypeName =  "nvarchar(63)")]
    [MaxLength(63)]
    public string PerformingCompany { get; set; }
    
    public virtual List<Employee>  Employees { get; set; } = new List<Employee>();
    
    [Required]
    [Column(nameof(ProjectManagerId))]
    [ForeignKey(nameof(ProjectManager))]
    public int ProjectManagerId { get; set; }
    public Employee ProjectManager { get; set; }
    
    [Required]
    [Column(nameof(StartDate), TypeName =  "date")]
    public DateTime StartDate { get; set; }
    
    [Required]
    [Column(nameof(FinishDate), TypeName =  "date")]
    public DateTime FinishDate { get; set; }
    
    [Required]
    [Column(nameof(Priority))]
    public int Priority { get; set; }
}