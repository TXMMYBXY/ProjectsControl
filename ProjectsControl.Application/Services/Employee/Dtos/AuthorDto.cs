using System.Text.Json.Serialization;

namespace ProjectsControl.Application.Services.Employee.Dtos;

public class AuthorDto
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
}