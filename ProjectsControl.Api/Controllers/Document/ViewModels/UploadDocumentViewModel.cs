using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace ProjectsControl.Api.Controllers.Document.ViewModels;

public class UploadDocumentViewModel
{
    [Required]
    [JsonPropertyName("file")]
    public IFormFile File { get; set; }
}