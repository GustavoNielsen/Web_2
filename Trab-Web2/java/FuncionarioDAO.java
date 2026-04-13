import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class FuncionarioDao extends BaseDao<Funcionario, Long> {
    
    @Override
    public Optional<Funcionario> findById(Long id) {
        System.out.println("SELECT * FROM funcionarios WHERE id = " + id);
        return Optional.empty();
    }

    @Override
    public List<Funcionario> findAll() {
        System.out.println("SELECT * FROM funcionarios");
        return new ArrayList<>();
    }

    public List<Funcionario> findByCargo(String cargo) {
        System.out.println("SELECT * FROM funcionarios WHERE cargo = '" + cargo + "'");
        return new ArrayList<>();
    }
}