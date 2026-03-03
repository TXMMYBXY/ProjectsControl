using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using ProjectsControl.Api.Controllers.Employee.VIewModels;
using ProjectsControl.Application.Services.Employee;
using ProjectsControl.Application.Services.Employee.Dtos;

namespace ProjectsControl.Api.Controllers.Employee;

[ApiController]
[Route("api/employee")]
public class EmployeeController : ControllerBase
{
    private readonly IMapper _mapper;
    private readonly IEmployeeService _employeeService;
    
    public EmployeeController(IMapper mapper, IEmployeeService employeeService)
    {
        _mapper = mapper;
        _employeeService = employeeService;
    }
    
    /// <summary>
    /// Endpoint for getting all employees
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<List<GetEmployeeViewModel>>> GetAllEmployees()
    {
        var employeesListDto = await _employeeService.GetAllEmployeesAsync();
        var employeesListViewModel = _mapper.Map<List<GetEmployeeViewModel>>(employeesListDto);
        
        return Ok(employeesListViewModel);
    }
    
    /// <summary>
    /// Endpoint for getting employee
    /// </summary>
    [HttpGet("{employeeId:int}")]
    public async Task<ActionResult<GetEmployeeViewModel>> GetEmployee([FromRoute] int employeeId)
    {
        var employeeDto = await _employeeService.GetEmployeeAsync(employeeId);
        var employeeViewModel = _mapper.Map<GetEmployeeViewModel>(employeeDto);
        
        return Ok(employeeViewModel);
    }
    
    /// <summary>
    /// Endpoint for creating employee
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<CreateEmployeeViewModel>> CreateEmployee(
        [FromBody] CreateEmployeeViewModel createEmployeeViewModel)
    {
        var createEmployeeDto = _mapper.Map<CreateEmployeeDto>(createEmployeeViewModel);
        var employeeDto = await _employeeService.CreateEmployeeAsync(createEmployeeDto);
        var employeeViewModel = _mapper.Map<CreateEmployeeViewModel>(employeeDto);
        
        return Created(nameof(employeeViewModel), employeeViewModel);
    }
    
    /// <summary>
    /// Endpoint for updating employee
    /// </summary>
    [HttpPatch("{employeeId:int}/info")]
    public async Task<ActionResult> UpdateEmployeeInfo([FromRoute] int employeeId, 
        [FromBody] UpdateEmployeeViewModel updateEmployeeViewModel)
    {
        var  updateEmployeeDto = _mapper.Map<UpdateEmployeeDto>(updateEmployeeViewModel);
        
        await _employeeService.UpdateEmployeeAsync(employeeId, updateEmployeeDto);

        return Ok();
    }

    /// <summary>
    /// Endpoint for deleting employee
    /// </summary>
    [HttpDelete("{employeeId:int}")]
    public async Task<ActionResult> DeleteEmployee([FromRoute] int employeeId)
    {
        await  _employeeService.DeleteEmployeeAsync(employeeId);
        
        return Ok();
    }
    
    /// <summary>
    /// Endpoint for updating employee`s projects
    /// </summary>
    [HttpPatch("{employeeId:int}/projects")]
    public async Task<ActionResult> UpdateEmployeeProjects([FromRoute] int employeeId, 
        ChangeProjectEmployeeViewModel changeProjectViewModel)
    {
        var changeProjectEmployeeDto = _mapper.Map<ChangeProjectEmployeeDto>(changeProjectViewModel);
        
        await _employeeService.ChangeProjectEmployeeAsync(employeeId, changeProjectEmployeeDto);
        
        return Ok();
    }
}