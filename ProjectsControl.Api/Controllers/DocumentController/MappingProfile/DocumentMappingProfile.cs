using AutoMapper;
using ProjectsControl.Api.Controllers.DocumentController.ViewModels;
using ProjectsControl.Application.Services.Document.Dtos;

namespace ProjectsControl.Api.Controllers.DocumentController.MappingProfile;

public class DocumentMappingProfile : Profile
{
    public DocumentMappingProfile()
    {
        CreateMap<DownloadDocumentViewModel, DownloadDocumentDto>().ReverseMap();
        
        CreateMap<UploadDocumentViewModel, UploadDocumentDto>()
            .ForMember(dest => dest.FileName, opt => opt.MapFrom(src => src.File.FileName))
            .ForMember(dest => dest.FileLength, opt => opt.MapFrom(src => src.File.Length));
        
    }
}