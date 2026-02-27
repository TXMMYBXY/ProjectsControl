using System.Text.Json.Serialization;

namespace ProjectsControl.Api.Controllers.EmployeeController.VIewModels;

public class GetEmployeeViewModel
{
    [JsonPropertyName("id")]
    public int Id { get; set; }
    
    [JsonPropertyName("firstName")]
    public string FirstName { get; set; }
    
    [JsonPropertyName("lastName")]
    public string LastName { get; set; }
    
    [JsonPropertyName("patronymic")]
    public string Patronymic { get; set; }
    
    [JsonPropertyName("email")]
    public string Email { get; set; }
    
    [JsonPropertyName("phoneNumber")]
    public string PhoneNumber { get; set; }
}