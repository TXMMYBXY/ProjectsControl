using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace ProjectsControl.Api.Controllers.ProjectController.ViewModels;

public class CreateProjectViewModel
{
    [Required]
    [JsonPropertyName("title")]
    public string Title { get; set; }
    
    [Required]
    [JsonPropertyName("customerCompany")]
    public string CustomerCompany { get; set; }
    
    [Required]
    [JsonPropertyName("performingCompany")]
    public string PerformingCompany { get; set; }
    
    [JsonPropertyName("employeesIds")]
    public int[]? EmployeesIds { get; set; }
    
    [JsonPropertyName("projectManagerId")]
    public int? ProjectManagerId { get; set; }
    
    [Required]
    [JsonPropertyName("startDate")]
    public DateTime StartDate { get; set; }
    
    [JsonPropertyName("finishDate")]
    public DateTime? FinishDate { get; set; }
    
    [JsonPropertyName("priority")]
    public int Priority { get; set; }
}