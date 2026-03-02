namespace ProjectsControl.Infrastructure.Services;

public static class GeneralService
{
    /// <summary>
    /// Check entity for null
    /// </summary>
    /// <typeparam name="T">Type</typeparam>
    /// <param name="target">Instance of Type</param>
    /// <param name="message">message when null</param>
    /// <exception cref="NullReferenceException">Type of exception</exception>
    public static void CheckForNull<T>(T target, string message)
    {
        if (target == null)
        {
            throw new NullReferenceException(message);
        }
    }
}