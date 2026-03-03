using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace ProjectsControl.Api.Controllers.Project.ViewModels;

public class UpdateProjectViewModel
{
    [JsonPropertyName("title")]
    public string? Title { get; set; }
    
    [JsonPropertyName("customerCompany")]
    public string? CustomerCompany { get; set; }
    
    [JsonPropertyName("performingCompany")]
    public string? PerformingCompany { get; set; }
    
    [JsonPropertyName("startDate")]
    public DateTime? StartDate { get; set; }
    
    [JsonPropertyName("endDate")]
    public DateTime? FinishDate { get; set; }
    
    [JsonPropertyName("priority")]
    [Range(0, 10)]
    public int? Priority { get; set; }
}