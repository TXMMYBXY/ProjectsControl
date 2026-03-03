namespace ProjectsControl.Api.Controllers.ProjectTask.ViewModels;

public class CreateTaskViewModel
{
    public int ProjectId { get; set; }
    public string Title { get; set; }
    public string? Description { get; set; }
    public int? Priority { get; set; }
    public int EmployeeId { get; set; }
    public int AuthorId { get; set; } //позже буду брать из контекста авторизованного пользователя
}