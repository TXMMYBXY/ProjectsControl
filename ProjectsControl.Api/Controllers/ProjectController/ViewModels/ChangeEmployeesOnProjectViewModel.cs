namespace ProjectsControl.Api.Controllers.ProjectController.ViewModels;

public class ChangeEmployeesOnProjectViewModel
{
    public int? ProjectManagerId { get; set; }
    public List<int>? EmployeesIds { get; set; }
}