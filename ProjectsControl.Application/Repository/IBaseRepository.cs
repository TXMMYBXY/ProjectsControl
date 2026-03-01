using System.Linq.Expressions;

namespace ProjectsControl.Application.Repository;

public interface IBaseRepository<T> where T : class
{
    /// <summary>
    /// Returns all elements from table
    /// </summary>
    /// <returns>IReadOnlyList</returns>
    /// <typeparam name="T">Entity</typeparam>
    Task<IReadOnlyList<T>?> GetAllAsync();

    /// <summary>
    /// Returns element by id
    /// </summary>
    /// <typeparam name="T">Entity</typeparam>
    Task<T?> GetByIdAsync(int id);

    /// <summary>
    /// Add element
    /// </summary>
    Task AddAsync(T entity);

    /// <summary>
    /// Update element
    /// </summary>
    void Update(T entity);

    /// <summary>
    /// Delete element
    /// </summary>
    void Delete(T entity);

    /// <summary>
    /// Save changes in context
    /// </summary>
    Task SaveChangesAsync();

    /// <summary>
    /// Update fields in table
    /// </summary>
    /// <param name="entity">Entity that need to update</param>
    /// <param name="fields">Props that will change(in expression)</param>
    void UpdateFields(T entity, params Expression<Func<T, object>>[] fields);
}