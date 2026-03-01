using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProjectsControl.Entity.Models;

public class Document : EntityBase
{
    [Required]
    [Column (nameof(Title), TypeName = "nvarchar(63)")]
    public string Title { get; set; }
    
    [Required]
    [Column (nameof(FilePath), TypeName = "nvarchar(127)")]
    public string FilePath { get; set; }
    
    [Required]
    [ForeignKey(nameof(Project))]
    public int ProjectId { get; set; }
    public Project Project { get; set; }
}