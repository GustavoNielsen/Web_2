import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class EquipamentoDao extends BaseDao<Equipamento, Long> {
    
    @Override
    public Optional<Equipamento> findById(Long id) {
        System.out.println("SELECT * FROM equipamentos WHERE id = " + id);
        return Optional.empty();
    }

    @Override
    public List<Equipamento> findAll() {
        System.out.println("SELECT * FROM equipamentos");
        return new ArrayList<>();
    }

    public List<Equipamento> findEmEstoque() {
        System.out.println("SELECT * FROM equipamentos WHERE quantidade_estoque > 0");
        return new ArrayList<>();
    }
}