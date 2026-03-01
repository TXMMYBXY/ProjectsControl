namespace ProjectsControl.Application.Services.FileStorage;

public interface IFileStorageService
{
    Task<string> SaveFileAsync(Stream fileStream, string fileName, string projectFolder);
    Task DeleteFileAsync(string filePath);
}