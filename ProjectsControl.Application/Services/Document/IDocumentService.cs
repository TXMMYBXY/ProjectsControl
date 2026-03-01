using ProjectsControl.Application.Services.Document.Dtos;

namespace ProjectsControl.Application.Services.Document;

public interface IDocumentService
{
    Task UploadDocumentAsync(int projectId, UploadDocumentDto uploadDocumentDto);
    Task<DownloadDocumentDto> DownloadDocumentAsync(int documentId);
}