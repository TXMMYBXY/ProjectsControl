using System.Text.Json.Serialization;
using ProjectsControl.Entity.Models;

namespace ProjectsControl.Api.Controllers.ProjectController.ViewModels;

public class CreateProjectViewModel
{
    [JsonPropertyName("title")]
    public string Title { get; set; }
    
    [JsonPropertyName("customerCompany")]
    public string CustomerCompany { get; set; }
    
    [JsonPropertyName("performingCompany")]
    public string PerformingCompany { get; set; }
    
    [JsonPropertyName("employees")]
    public List<Employee> Employees { get; set; }
    
    [JsonPropertyName("projectManager")]
    public Employee ProjectManager { get; set; }
    
    [JsonPropertyName("startDate")]
    public DateTime StartDate { get; set; }
    
    [JsonPropertyName("endDate")]
    public DateTime FinishDate { get; set; }
    
    [JsonPropertyName("priority")]
    public int Priority { get; set; }
}