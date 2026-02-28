using AutoMapper;
using ProjectsControl.Application.Repository;
using ProjectsControl.Application.Services.Employee;
using ProjectsControl.Application.Services.Employee.Dtos;
using ProjectsControl.Application.Services.Project.Dtos;
using ProjectsControl.Entity.Models;

namespace ProjectsControl.Infrastructure.Services;

public class EmployeeService : IEmployeeService
{
    private readonly IMapper _mapper;
    private readonly IEmployeeRepository  _employeeRepository;
    private readonly IProjectRepository _projectRepository;

    public EmployeeService(
        IMapper mapper, 
        IEmployeeRepository employeeRepository,
        IProjectRepository projectRepository)
    {
        _mapper = mapper;
        _employeeRepository = employeeRepository;
        _projectRepository = projectRepository;
    }
    
    public async Task<List<GetEmployeeDto>> GetAllEmployeesAsync()
    {
        var employeeList = await _employeeRepository.GetAllEmployeesAsync();
        var employeeListDto =  _mapper.Map<List<GetEmployeeDto>>(employeeList);
        
        return employeeListDto;
    }

    public async Task<GetEmployeeDto> GetEmployeeAsync(int employeeId)
    {
        var employee = await _employeeRepository.GetByIdAsync(employeeId);
        var employeeDto = _mapper.Map<GetEmployeeDto>(employee);
        
        return employeeDto;
    }

    public async Task<CreateEmployeeDto> CreateEmployeeAsync(CreateEmployeeDto createEmployeeDto)
    {
        var employee = _mapper.Map<Employee>(createEmployeeDto);

        if (createEmployeeDto.ProjectsIds.Length != 0)
        {
            var projects = await _projectRepository.GetProjectsByIdAsync(createEmployeeDto.ProjectsIds);
            
            employee.Projects = projects.ToList();
        }
        
        await _employeeRepository.AddAsync(employee);
        await _employeeRepository.SaveChangesAsync();

        return createEmployeeDto;
    }

    public async Task UpdateEmployeeAsync(int employeeId, UpdateEmployeeDto updateEmployeeDto)
    {
        var employee = await _employeeRepository.GetByIdAsync(employeeId);
        
        GeneralService.CheckForNull(employee, "Employee not found");
        
        _mapper.Map(updateEmployeeDto, employee);
        
        _employeeRepository.UpdateFields(employee);
        
        await _employeeRepository.SaveChangesAsync();
    }

    public async Task DeleteEmployeeAsync(int employeeId)
    {
        var employee = await _employeeRepository.GetByIdAsync(employeeId);

        if (employee != null) _employeeRepository.Delete(employee);

        await _employeeRepository.SaveChangesAsync();
    }

    public async Task ChangeProjectEmployeeAsync(int employeeId, ChangeProjectEmployeeDto changeProjectEmployeeDto)
    {
        var employee = await _employeeRepository.GetByIdAsync(employeeId);
        
        GeneralService.CheckForNull(employee, "Employee not found");
        GeneralService.CheckForNull(changeProjectEmployeeDto.ProjectsIds, "Empty argument");
        
        var projects = await _projectRepository.GetProjectsByIdAsync(changeProjectEmployeeDto.ProjectsIds);
        
        employee.Projects =  projects.ToList();
        
        await _employeeRepository.SaveChangesAsync();
    }
}