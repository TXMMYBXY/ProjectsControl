using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProjectsControl.Entity.Models;

public class ProjectTask : EntityBase
{
    [Required]
    [Column(nameof(ProjectId), TypeName = "int")]
    public int ProjectId { get; set; }
    public Project Project { get; set; }
    
    [Required]
    [Column(nameof(Title), TypeName = "nvarchar(63)")]
    public string Title { get; set; }
    
    [ForeignKey(nameof(Author))]
    [Column(nameof(AuthorId), TypeName = "int")]
    public int AuthorId { get; set; }
    public Employee Author { get; set; }
    
    [ForeignKey(nameof(Employee))]
    [Column(nameof(EmployeeId), TypeName = "int")]
    public int? EmployeeId { get; set; }
    public Employee? Employee { get; set; }

    [Required]
    [Column(nameof(Status), TypeName = "int")]
    public StatusTask Status { get; set; } = StatusTask.ToDo;
    
    [Column(nameof(Description), TypeName = "nvarchar(255)")]
    public string? Description { get; set; }

    [Column(nameof(Priority), TypeName = "tinyint")]
    public int Priority { get; set; } = 0;
}