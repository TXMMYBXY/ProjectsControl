using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using ProjectsControl.Api.Controllers.EmployeeController.VIewModels;
using ProjectsControl.Application.Services.Employee;
using ProjectsControl.Application.Services.Employee.Dtos;

namespace ProjectsControl.Api.Controllers.EmployeeController;

[ApiController]
[Route("project-control-api/employees")]
public class EmployeeController : ControllerBase
{
    private readonly IMapper _mapper;
    private readonly IEmployeeService _employeeService;
    
    public EmployeeController(IMapper mapper, IEmployeeService employeeService)
    {
        _mapper = mapper;
        _employeeService = employeeService;
    }
    
    [HttpGet("all")]
    public async Task<ActionResult<List<GetEmployeeViewModel>>> GetAllEmployees()
    {
        var employeesListDto = await _employeeService.GetAllEmployeesAsync();
        var employeesListViewModel = _mapper.Map<List<GetEmployeeViewModel>>(employeesListDto);
        
        return Ok(employeesListViewModel);
    }
    
    [HttpGet("{employeeId:int}")]
    public async Task<ActionResult<List<GetEmployeeViewModel>>> GetEmployeeById([FromRoute] int employeeId)
    {
        var employeeDto = await _employeeService.GetEmployeeAsync(employeeId);
        var employeeViewModel = _mapper.Map<List<GetEmployeeViewModel>>(employeeDto);
        
        return Ok(employeeViewModel);
    }
    
    [HttpPost]
    public async Task<ActionResult<CreateEmployeeViewModel>> CreateEmployee(
        [FromBody] CreateEmployeeViewModel createEmployeeViewModel)
    {
        var createEmployeeDto = _mapper.Map<CreateEmployeeDto>(createEmployeeViewModel);
        var employeeDto = await _employeeService.CreateEmployeeAsync(createEmployeeDto);
        var employeeViewModel = _mapper.Map<CreateEmployeeViewModel>(employeeDto);
        
        return Created(nameof(employeeViewModel), employeeViewModel);
    }
    
    [HttpPatch("{employeeId:int}")]
    public async Task<ActionResult> UpdateEmployeeById(int employeeId, 
        [FromBody] UpdateEmployeeViewModel updateEmployeeViewModel)
    {
        var  updateEmployeeDto = _mapper.Map<UpdateEmployeeDto>(updateEmployeeViewModel);
        await _employeeService.UpdateEmployeeAsync(employeeId, updateEmployeeDto);

        return Ok();
    }

    [HttpDelete("{employeeId:int}")]
    public async Task<ActionResult> DeleteEmployeeById(int employeeId)
    {
        await  _employeeService.DeleteEmployeeAsync(employeeId);
        
        return Ok();
    }
}