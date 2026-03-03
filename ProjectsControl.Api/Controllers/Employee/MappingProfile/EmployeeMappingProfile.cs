using AutoMapper;
using ProjectsControl.Api.Controllers.Employee.VIewModels;
using ProjectsControl.Application.Services.Employee.Dtos;

namespace ProjectsControl.Api.Controllers.Employee.MappingProfile;

public class EmployeeMappingProfile : Profile
{
    public EmployeeMappingProfile()
    {
        //GET
        CreateMap<GetEmployeeViewModel, GetEmployeeDto>().ReverseMap();

        //POST
        CreateMap<CreateEmployeeViewModel, CreateEmployeeDto>().ReverseMap();
        
        //PATCH
        CreateMap<UpdateEmployeeViewModel, UpdateEmployeeDto>().ReverseMap();
            
        CreateMap<ChangeProjectEmployeeViewModel, ChangeProjectEmployeeDto>().ReverseMap();
    }
}