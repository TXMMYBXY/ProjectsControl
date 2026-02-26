using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using ProjectsControl.Api.Controllers.EmployeeController.VIewModels;
using ProjectsControl.Application.Services.Employee;

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
        throw new NotImplementedException();
    }
    
    [HttpGet("{employeeId:int}")]
    public async Task<ActionResult<List<GetEmployeeViewModel>>> GetEmployeeById([FromRoute] int employeeId)
    {
        throw new NotImplementedException();
    }
    
    [HttpPost]
    public async Task<ActionResult> CreateEmployee([FromBody] CreateEmployeeViewModel createEmployeeViewModel)
    {
        throw new NotImplementedException();
    }
    
    [HttpPatch("{employeeId:int}")]
    public async Task<ActionResult> UpdateEmployeeById(int employeeId, 
        [FromBody] UpdateEmployeViewModel updateEmployeeViewModel)
    {
        throw new NotImplementedException();
    }

    [HttpDelete("{employeeId:int}")]
    public async Task<ActionResult> DeleteEmployeeById(int employeeId)
    {
        throw new NotImplementedException();
    }
}