namespace ProjectsControl.Api.Controllers.ProjectController.ViewModels;

public class ChangeEmployeesOnProjectViewModel
{
    public int? ProjectManagerId { get; set; }
    public int[]? EmployeesIds { get; set; }
}