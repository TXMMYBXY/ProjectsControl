using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace ProjectsControl.Api.Controllers.Employee.VIewModels;

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
}