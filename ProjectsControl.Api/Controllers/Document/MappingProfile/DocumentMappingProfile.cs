using AutoMapper;
using ProjectsControl.Api.Controllers.Document.ViewModels;
using ProjectsControl.Application.Services.Document.Dtos;

namespace ProjectsControl.Api.Controllers.Document.MappingProfile;

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