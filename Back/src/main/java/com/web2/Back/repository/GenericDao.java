import java.util.List;
import java.util.Optional;

public interface GenericDao<T, ID> {
    void insert(T entity);
    Optional<T> findById(ID id);
    List<T> findAll();
    void update(T entity);
    void delete(ID id);
}