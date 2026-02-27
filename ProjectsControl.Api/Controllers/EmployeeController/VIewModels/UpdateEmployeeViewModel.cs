using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using ProjectsControl.Entity.Models;

namespace ProjectsControl.Api.Controllers.EmployeeController.VIewModels;

public class UpdateEmployeeViewModel
{
    [MaxLength(63)]
    [JsonPropertyName("firstName")]
    public string? FirstName { get; set; }
    
    [MaxLength(63)]
    [JsonPropertyName("lastName")]
    public string? LastName { get; set; }
    
    [MaxLength(63)]
    [JsonPropertyName("patronymic")]
    public string? Patronymic { get; set; }
    
    [MaxLength(63)]
    [JsonPropertyName("email")]
    public string? Email { get; set; }
    
    [MaxLength(31)]
    [JsonPropertyName("phoneNumber")]
    public string? PhoneNumber { get; set; }
    
    [JsonPropertyName("projects")]
    public virtual List<Project>? Projects { get; set; }
    
    [JsonPropertyName("managedProjects")]
    public virtual List<Project>? ManagedProjects { get; set; }
}