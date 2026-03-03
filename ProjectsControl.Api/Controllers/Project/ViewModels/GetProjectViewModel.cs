using System.Text.Json.Serialization;
using ProjectsControl.Application.Services.Project.Dtos;
using ProjectsControl.Entity.Models;

namespace ProjectsControl.Api.Controllers.Project.ViewModels;

public class GetProjectViewModel
{
    [JsonPropertyName("id")]
    public int Id { get; set; }
    
    [JsonPropertyName("title")]
    public string Title { get; set; }
    
    [JsonPropertyName("customerCompany")]
    public string CustomerCompany { get; set; }
    
    [JsonPropertyName("performingCompany")]
    public string PerformingCompany { get; set; }
    
    [JsonPropertyName("employees")]
    public List<EmployeeInProjectDto> Employees { get; set; }
    
    [JsonPropertyName("projectManager")]
    public EmployeeInProjectDto ProjectManager { get; set; }
    
    [JsonPropertyName("startDate")]
    public DateTime StartDate { get; set; }
    
    [JsonPropertyName("endDate")]
    public DateTime FinishDate { get; set; }
    
    [JsonPropertyName("priority")]
    public int Priority { get; set; }

    [JsonPropertyName("status")]

    [JsonConverter(typeof(JsonStringEnumConverter))]
    public ProjectStatus Status { get; set; }
    
    public List<GetDocumentDto> Documents { get; set; }
}