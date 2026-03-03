using System.Text.Json.Serialization;
using ProjectsControl.Application.Services.Employee.Dtos;
using ProjectsControl.Entity.Models;

namespace ProjectsControl.Application.Services.ProjectTask.Dtos;

public class GetTaskDto
{
    [JsonPropertyName("id")]
    public int Id { get; set; }
    
    [JsonPropertyName("projectId")]
    public int ProjectId { get; set; }
    
    [JsonPropertyName("title")]
    public string Title { get; set; }
    
    [JsonPropertyName("description")]
    public string Description { get; set; }
    
    [JsonPropertyName("employee")]
    public EmployeeDto Employee { get; set; }
    
    [JsonPropertyName("author")]
    public AuthorDto Author { get; set; }
    
    [JsonPropertyName("status")]
    public ProjectStatus Status { get; set; }
    
    [JsonPropertyName("priority")]
    public int Priority { get; set; }
}