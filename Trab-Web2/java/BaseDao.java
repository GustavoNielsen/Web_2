import java.util.List;
import java.util.Optional;

public abstract class BaseDao<T, ID> implements GenericDao<T, ID> {
    
    @Override
    public void insert(T entity) {
        System.out.println("Executando INSERT genérico para: " + entity.getClass().getSimpleName());
    }

    @Override
    public void update(T entity) {
        System.out.println("Executando UPDATE genérico para: " + entity.getClass().getSimpleName());
    }

    @Override
    public void delete(ID id) {
        System.out.println("Executando DELETE genérico para ID: " + id);
    }
    
    @Override
    public abstract Optional<T> findById(ID id);

    @Override
    public abstract List<T> findAll();
}