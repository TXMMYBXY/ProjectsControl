using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace ProjectsControl.Api.Controllers.ProjectTask.ViewModels;

public class UpdateTaskInfoViewModel
{
    [JsonPropertyName("title")]
    public string? Titile { get; set; }
    
    [JsonPropertyName("description")]
    public string? Description { get; set; }
    
    [JsonPropertyName("priority")]
    [Range(0, 10)]
    public int? Priority { get; set; }
}