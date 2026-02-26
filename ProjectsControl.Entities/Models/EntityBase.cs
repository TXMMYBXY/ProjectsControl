using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProjectsControl.Entity.Models;

public abstract class EntityBase
{
    [Column(nameof(Id))]
    [Key]
    public int Id { get;set; }
}