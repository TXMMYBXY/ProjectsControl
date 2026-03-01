using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using ProjectsControl.Entity.Models;

namespace ProjectsControl.Api.Controllers.EmployeeController.VIewModels;

public class CreateEmployeeViewModel
{
    [Required]
    [MaxLength(63)]
    [JsonPropertyName("firstName")]
    public string FirstName { get; set; }
    
    [Required]
    [MaxLength(63)]
    [JsonPropertyName("lastName")]
    public string LastName { get; set; }
    
    [MaxLength(63)]
    [JsonPropertyName("patronymic")]
    public string Patronymic { get; set; }
    
    [MaxLength(63)]
    [JsonPropertyName("email")]
    public string Email { get; set; }
    
    [MaxLength(31)]
    [JsonPropertyName("phoneNumber")]
    public string PhoneNumber { get; set; }
    
    [JsonPropertyName("projectsIds")]
    public List<int> ProjectsIds { get; set; }
}