using System.Text.Json.Serialization;
using ProjectsControl.Entity.Models;

namespace ProjectsControl.Api.Controllers.Project.ViewModels;

public class ChangeEmployeesOnProjectViewModel
{
    [JsonPropertyName("projectManagerId")]
    public int? ProjectManagerId { get; set; }
    
    [JsonPropertyName("employeesIds")]
    public List<int>? EmployeesIds { get; set; }

    [JsonPropertyName("status")]
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public ProjectStatus? Status { get; set; }
}