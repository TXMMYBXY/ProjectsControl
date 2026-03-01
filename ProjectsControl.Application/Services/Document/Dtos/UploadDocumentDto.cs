namespace ProjectsControl.Application.Services.Document.Dtos;

public class UploadDocumentDto
{
    public string FileName { get; set; }
    public long FileLength { get; set; }
    public Stream FileStream { get; set; }
}