using AutoMapper;
using ProjectsControl.Application.Repository;
using ProjectsControl.Application.Services.Document;
using ProjectsControl.Application.Services.Document.Dtos;
using ProjectsControl.Application.Services.FileStorage;
using ProjectsControl.Entity.Models;

namespace ProjectsControl.Infrastructure.Services;

public class DocumentService : IDocumentService
{
    private readonly IMapper _mapper;
    private readonly IDocumentRepository _documentRepository;
    private readonly IProjectRepository _projectRepository;
    private readonly IFileStorageService _fileStorageService;

    public DocumentService(
        IMapper mapper, 
        IDocumentRepository documentRepository,
        IProjectRepository projectRepository,
        IFileStorageService fileStorageService)
    {
        _mapper = mapper;
        _documentRepository = documentRepository;
        _projectRepository = projectRepository;
        _fileStorageService = fileStorageService;
    }
    
    public async Task UploadDocumentAsync(int projectId, UploadDocumentDto uploadDocumentDto)
    {
        var project = await _projectRepository.GetProjectByIdAsync(projectId);
        
        GeneralService.CheckForNull(project, "Project is not exists");
        GeneralService.CheckForNull(uploadDocumentDto, "File is not exists");

        if (uploadDocumentDto.FileLength == 0)
        {
            throw new ArgumentException("File is empty");
        }
        
        var uniqueFileName = $"{Guid.NewGuid()}_{uploadDocumentDto.FileName}";

        var projectFolder = $"{project.Id}_{_ClearName(project.Title)}";

        var filePath = await _fileStorageService.SaveFileAsync(
            uploadDocumentDto.FileStream,
            uniqueFileName,
            projectFolder);

        var document = new Document
        {
            Title = uploadDocumentDto.FileName,
            FilePath = filePath,
            ProjectId = projectId
        };

        await _documentRepository.AddAsync(document);
        await _documentRepository.SaveChangesAsync();
    }

    public async Task<DownloadDocumentDto> DownloadDocumentAsync(int documentId)
    {
        var document = await _documentRepository.GetByIdAsync(documentId);

        GeneralService.CheckForNull(document, "Document not found");

        return new DownloadDocumentDto
        {
            FilePath = document.FilePath,
            FileName = document.Title
        };
    }

    private string _ClearName(string input)
    {
        foreach (var c in Path.GetInvalidFileNameChars())
            input = input.Replace(c, '_');

        return input.Replace(" ", "_");
    }
}