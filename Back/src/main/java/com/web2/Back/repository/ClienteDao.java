import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class ClienteDao extends BaseDao<Cliente, Long> {
    
    @Override
    public Optional<Cliente> findById(Long id) {
        System.out.println("SELECT * FROM clientes WHERE id = " + id);
        return Optional.empty(); 
    }

    @Override
    public List<Cliente> findAll() {
        System.out.println("SELECT * FROM clientes");
        return new ArrayList<>();
    }
    
    public Optional<Cliente> findByEmail(String email) {
        System.out.println("SELECT * FROM clientes WHERE email = '" + email + "'");
        return Optional.empty();
    }
}