namespace ProjectsControl.Infrastructure.Services;

public static class GeneralService
{

    /// <summary>
    /// Проверка на null
    /// </summary>
    /// <typeparam name="T">Тип данных</typeparam>
    /// <param name="target">объект который нужно проверить</param>
    /// <param name="message">сообщение, в случае null</param>
    /// <exception cref="NullReferenceException"></exception>
    public static void CheckForNull<T>(T target, string message)
    {
        if (target == null)
        {
            throw new NullReferenceException(message);
        }
    }
    
    public class Checker
    {
        internal static void UniversalCheckException<T>(CheckerParam<T> param)
        {
            if (param.Predicate)
            {
                throw new Exception(param.Exception.Message, param.Exception).InnerException;
            }
        }

        internal static bool UniversalCheckBool<T>(CheckerParam<T> param)
        {
            return param.Predicate;
        }
    }
    /// <summary>
    /// public Exception Exception { get; set; }/
    /// public bool Predicate { get; set; }/
    /// public T[] Target { get; set; } 
    /// </summary>
    /// <typeparam name="T">Тип данных</typeparam>
    public class CheckerParam<T>
    {
        public Exception Exception { get; set; }
        public bool Predicate { get; set; }
        public T[] Target { get; set; }

        /// <summary>
        /// public Exception Exception { get; set; }/
        /// public bool Predicate { get; set; }/
        /// public T[] Target { get; set; } 
        /// </summary>
        public CheckerParam()
        {

        }
        
        /// <summary>
        /// Parametrs for universal check
        /// </summary>
        public CheckerParam(
            Exception exception,
            Predicate<T[]> predicate,
            params T[] target)
        {
            Exception = exception;
            Predicate = predicate(target);
            Target = target;
        }
    }
    // Example
    // var checker = new Checker();
    // checker.UniversalCheck<int>(new CheckerParam<int>(
    //     new ArgumentException("Must be more than 0"),
    //     param => param > 0,
    //     65);
}