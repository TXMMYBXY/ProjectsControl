using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using ProjectsControl.Entity.Models;

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
    public List<int>? EmployeesIds { get; set; }
    
    [JsonPropertyName("projectManagerId")]
    public int? ProjectManagerId { get; set; }
    
    [Required]
    [JsonPropertyName("startDate")]
    public DateTime StartDate { get; set; }
    
    [JsonPropertyName("finishDate")]
    public DateTime? FinishDate { get; set; }
    
    [JsonPropertyName("priority")]
    [Range(0, 10)]
    public int Priority { get; set; }

    [JsonPropertyName("status")]
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public ProjectStatus Status { get; set; }
}