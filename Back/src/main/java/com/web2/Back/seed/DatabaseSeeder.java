package com.web2.Back.seed;

import com.web2.Back.model.CategoriaEquipamentos;
import com.web2.Back.model.Cliente;
import com.web2.Back.model.Endereco;
import com.web2.Back.model.Funcionario;
import com.web2.Back.model.HistoricoSolicitacao;
import com.web2.Back.model.Manutencao;
import com.web2.Back.model.Orcamento;
import com.web2.Back.model.Redirecionamento;
import com.web2.Back.model.Solicitacao;
import com.web2.Back.repository.CategoriaRepository;
import com.web2.Back.repository.ClienteRepository;
import com.web2.Back.repository.FuncionarioRepository;
import com.web2.Back.repository.HistoricoSolicitacaoRepository;
import com.web2.Back.repository.ManutencaoRepository;
import com.web2.Back.repository.OrcamentoRepository;
import com.web2.Back.repository.RedirecionamentoRepository;
import com.web2.Back.repository.SolicitacaoRepository;
import com.web2.Back.service.SenhaService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private static final String SEED_PREFIX = "[SEED]";

    private final CategoriaRepository categoriaRepository;
    private final ClienteRepository clienteRepository;
    private final FuncionarioRepository funcionarioRepository;
    private final SolicitacaoRepository solicitacaoRepository;
    private final OrcamentoRepository orcamentoRepository;
    private final ManutencaoRepository manutencaoRepository;
    private final HistoricoSolicitacaoRepository historicoRepository;
    private final RedirecionamentoRepository redirecionamentoRepository;
    private final SenhaService senhaService;

    public DatabaseSeeder(
            CategoriaRepository categoriaRepository,
            ClienteRepository clienteRepository,
            FuncionarioRepository funcionarioRepository,
            SolicitacaoRepository solicitacaoRepository,
            OrcamentoRepository orcamentoRepository,
            ManutencaoRepository manutencaoRepository,
            HistoricoSolicitacaoRepository historicoRepository,
            RedirecionamentoRepository redirecionamentoRepository,
            SenhaService senhaService
    ) {
        this.categoriaRepository = categoriaRepository;
        this.clienteRepository = clienteRepository;
        this.funcionarioRepository = funcionarioRepository;
        this.solicitacaoRepository = solicitacaoRepository;
        this.orcamentoRepository = orcamentoRepository;
        this.manutencaoRepository = manutencaoRepository;
        this.historicoRepository = historicoRepository;
        this.redirecionamentoRepository = redirecionamentoRepository;
        this.senhaService = senhaService;
    }

    @Override
    public void run(String... args) {
        seedCategorias();

        Funcionario maria = seedFuncionario(
                "Maria",
                "maria@manutads.com",
                "1234",
                "maria001",
                "(41) 99999-1001",
                LocalDate.of(1990, 3, 12)
        );

        Funcionario mario = seedFuncionario(
                "Mário",
                "mario@manutads.com",
                "2345",
                "mario001",
                "(41) 99999-1002",
                LocalDate.of(1988, 7, 25)
        );

        Cliente joao = seedCliente(
                "João",
                "joao@manutads.com",
                "3456",
                "joao0001",
                "39053344705",
                "(41) 98888-1001",
                new Endereco("80010-000", "Rua XV de Novembro", "100", "Apto 11", "Centro", "Curitiba", "PR")
        );

        Cliente jose = seedCliente(
                "José",
                "jose@manutads.com",
                "4567",
                "jose0001",
                "23100299900",
                "(41) 98888-1002",
                new Endereco("80240-000", "Avenida Iguaçu", "200", "", "Rebouças", "Curitiba", "PR")
        );

        Cliente joana = seedCliente(
                "Joana",
                "joana@manutads.com",
                "5678",
                "joana001",
                "30671644004",
                "(41) 98888-1003",
                new Endereco("80530-000", "Rua Mateus Leme", "300", "Casa", "São Lourenço", "Curitiba", "PR")
        );

        Cliente joaquina = seedCliente(
                "Joaquina",
                "joaquina@manutads.com",
                "6789",
                "joaquina",
                "02067401900",
                "(41) 98888-1004",
                new Endereco("81020-490", "Rua João Bettega", "400", "Bloco B", "Portão", "Curitiba", "PR")
        );

        seedSolicitacoes(List.of(joao, jose, joana, joaquina), maria, mario);
    }

    private void seedCategorias() {
        List.of("Notebook", "Desktop", "Impressora", "Mouse", "Teclado")
                .forEach(this::seedCategoria);
    }

    private CategoriaEquipamentos seedCategoria(String nome) {
        return categoriaRepository.findByNome(nome)
                .orElseGet(() -> categoriaRepository.save(new CategoriaEquipamentos(nome)));
    }

    private Funcionario seedFuncionario(
            String nome,
            String email,
            String senha,
            String salt,
            String telefone,
            LocalDate dataNascimento
    ) {
        return funcionarioRepository.findByEmail(email)
                .orElseGet(() -> {
                    Funcionario funcionario = new Funcionario(
                            nome,
                            email,
                            senhaService.hashSenha(senha, salt),
                            telefone,
                            dataNascimento
                    );
                    funcionario.setSalt(salt);
                    funcionario.setAtivo(true);
                    return funcionarioRepository.save(funcionario);
                });
    }

    private Cliente seedCliente(
            String nome,
            String email,
            String senha,
            String salt,
            String cpf,
            String telefone,
            Endereco endereco
    ) {
        return clienteRepository.findByEmail(email)
                .orElseGet(() -> {
                    Cliente cliente = new Cliente(
                            cpf,
                            nome,
                            email,
                            telefone,
                            senhaService.hashSenha(senha, salt),
                            endereco
                    );
                    cliente.setSalt(salt);
                    return clienteRepository.save(cliente);
                });
    }

    private void seedSolicitacoes(
            List<Cliente> clientes,
            Funcionario maria,
            Funcionario mario
    ) {
        boolean seedJaExiste = solicitacaoRepository.findAll()
                .stream()
                .anyMatch(s -> s.getDescricaoDefeito() != null
                        && s.getDescricaoDefeito().startsWith(SEED_PREFIX));

        if (seedJaExiste) {
            return;
        }

        LocalDateTime base = LocalDateTime.of(2026, 5, 1, 8, 0);

        createAberta(clientes.get(0), "Notebook Dell Inspiron", "Notebook",
                "Não liga ao pressionar o botão", base.plusHours(1));
        createAberta(clientes.get(1), "Mouse Logitech M90", "Mouse",
                "Clique esquerdo falhando", base.plusDays(1).plusHours(2));
        createAberta(clientes.get(2), "Teclado Mecânico Redragon", "Teclado",
                "Tecla espaço travando", base.plusDays(2).plusHours(3));

        createOrcada(clientes.get(3), maria, "Desktop Gamer", "Desktop",
                "Fonte fazendo ruído", 180.00, base.plusDays(3).plusHours(4));
        createOrcada(clientes.get(0), mario, "Impressora Epson L3150", "Impressora",
                "Falha ao puxar papel", 95.50, base.plusDays(4).plusHours(5));
        createOrcada(clientes.get(1), maria, "Notebook Lenovo Ideapad", "Notebook",
                "Tela com linhas verticais", 420.00, base.plusDays(5).plusHours(6));

        createRejeitada(clientes.get(2), mario, "Mouse Gamer HyperX", "Mouse",
                "Scroll sem resposta", 75.00, base.plusDays(6).plusHours(7));
        createRejeitada(clientes.get(3), maria, "Desktop Dell Optiplex", "Desktop",
                "HD com falha intermitente", 260.00, base.plusDays(7).plusHours(8));
        createRejeitada(clientes.get(0), mario, "Teclado Microsoft", "Teclado",
                "Teclas numéricas falhando", 110.00, base.plusDays(8).plusHours(9));

        createAprovada(clientes.get(1), maria, "Notebook Acer Aspire", "Notebook",
                "Bateria não carrega", 310.00, base.plusDays(9).plusHours(1));
        createAprovada(clientes.get(2), mario, "Impressora HP 2774", "Impressora",
                "Impressão manchada", 140.00, base.plusDays(10).plusHours(2));
        createAprovada(clientes.get(3), maria, "Desktop Positivo", "Desktop",
                "Sistema reiniciando sozinho", 230.00, base.plusDays(11).plusHours(3));

        createRedirecionada(clientes.get(0), maria, mario, "Notebook Samsung Book", "Notebook",
                "Superaquecimento", 280.00, base.plusDays(12).plusHours(4));
        createRedirecionada(clientes.get(1), mario, maria, "Impressora Brother", "Impressora",
                "Erro no cilindro", 190.00, base.plusDays(13).plusHours(5));

        createArrumada(clientes.get(2), maria, "Mouse Microsoft Basic", "Mouse",
                "Cabo com mau contato", 45.00, "Substituição do cabo USB",
                "Evitar dobrar o cabo próximo ao conector", base.plusDays(14).plusHours(6));
        createArrumada(clientes.get(3), mario, "Teclado Logitech K120", "Teclado",
                "Teclas presas por sujeira", 60.00, "Limpeza interna completa",
                "Manter longe de líquidos", base.plusDays(15).plusHours(7));

        createPaga(clientes.get(0), maria, "Desktop HP", "Desktop",
                "Memória RAM com erro", 170.00, "Troca de módulo de memória",
                "Testar o equipamento por 48 horas", base.plusDays(16).plusHours(8));
        createPaga(clientes.get(1), mario, "Notebook Asus VivoBook", "Notebook",
                "Conector de energia solto", 220.00, "Ressolda do conector de carga",
                "Usar fonte compatível", base.plusDays(17).plusHours(9));

        createFinalizada(clientes.get(2), maria, "Impressora Canon G3110", "Impressora",
                "Cabeçote entupido", 160.00, "Limpeza profunda do cabeçote",
                "Imprimir página de teste semanalmente", base.plusDays(18).plusHours(1));
        createFinalizada(clientes.get(3), mario, "Teclado Dell KB216", "Teclado",
                "Falha na tecla Enter", 80.00, "Substituição da membrana",
                "Evitar impacto nas teclas", base.plusDays(19).plusHours(2));
    }

    private Solicitacao createBase(
            Cliente cliente,
            String equipamento,
            String categoria,
            String defeito,
            String status,
            LocalDateTime criadaEm
    ) {
        Solicitacao solicitacao = new Solicitacao();
        solicitacao.setCliente(cliente);
        solicitacao.setDescricaoEquipamento(equipamento);
        solicitacao.setCategoria(categoria);
        solicitacao.setDescricaoDefeito(SEED_PREFIX + " " + defeito);
        solicitacao.setStatus(status);
        solicitacao.setDataCriacao(criadaEm);
        return solicitacaoRepository.save(solicitacao);
    }

    private void createAberta(
            Cliente cliente,
            String equipamento,
            String categoria,
            String defeito,
            LocalDateTime criadaEm
    ) {
        createBase(cliente, equipamento, categoria, defeito, "ABERTA", criadaEm);
    }

    private Solicitacao createOrcada(
            Cliente cliente,
            Funcionario funcionario,
            String equipamento,
            String categoria,
            String defeito,
            double valor,
            LocalDateTime criadaEm
    ) {
        Solicitacao solicitacao = createBase(cliente, equipamento, categoria, defeito, "ORÇADA", criadaEm);
        Orcamento orcamento = createOrcamento(solicitacao, funcionario, valor, criadaEm.plusHours(2));
        solicitacao.setOrcamento(orcamento);
        solicitacaoRepository.save(solicitacao);
        addHistorico(solicitacao, "ABERTA", criadaEm);
        return solicitacao;
    }

    private void createRejeitada(
            Cliente cliente,
            Funcionario funcionario,
            String equipamento,
            String categoria,
            String defeito,
            double valor,
            LocalDateTime criadaEm
    ) {
        Solicitacao solicitacao = createOrcada(cliente, funcionario, equipamento, categoria, defeito, valor, criadaEm);
        solicitacao.setStatus("REJEITADA");
        solicitacao.setMotivoRejeicao("Cliente recusou o valor do orçamento.");
        solicitacaoRepository.save(solicitacao);
        addHistorico(solicitacao, "ORÇADA", criadaEm.plusHours(5));
    }

    private Solicitacao createAprovada(
            Cliente cliente,
            Funcionario funcionario,
            String equipamento,
            String categoria,
            String defeito,
            double valor,
            LocalDateTime criadaEm
    ) {
        Solicitacao solicitacao = createOrcada(cliente, funcionario, equipamento, categoria, defeito, valor, criadaEm);
        solicitacao.setStatus("APROVADA");
        solicitacaoRepository.save(solicitacao);
        addHistorico(solicitacao, "ORÇADA", criadaEm.plusHours(5));
        return solicitacao;
    }

    private void createRedirecionada(
            Cliente cliente,
            Funcionario origem,
            Funcionario destino,
            String equipamento,
            String categoria,
            String defeito,
            double valor,
            LocalDateTime criadaEm
    ) {
        Solicitacao solicitacao = createAprovada(cliente, origem, equipamento, categoria, defeito, valor, criadaEm);
        Redirecionamento redirecionamento = new Redirecionamento(solicitacao, origem, destino);
        redirecionamento.setDataRedirecionamento(criadaEm.plusHours(8));
        redirecionamentoRepository.save(redirecionamento);
        solicitacao.setStatus("REDIRECIONADA");
        solicitacaoRepository.save(solicitacao);
        addHistorico(solicitacao, "APROVADA", criadaEm.plusHours(8));
    }

    private Solicitacao createArrumada(
            Cliente cliente,
            Funcionario funcionario,
            String equipamento,
            String categoria,
            String defeito,
            double valor,
            String descricaoManutencao,
            String orientacao,
            LocalDateTime criadaEm
    ) {
        Solicitacao solicitacao = createAprovada(cliente, funcionario, equipamento, categoria, defeito, valor, criadaEm);
        Manutencao manutencao = createManutencao(
                solicitacao,
                funcionario,
                descricaoManutencao,
                orientacao,
                criadaEm.plusHours(12)
        );
        solicitacao.setManutencao(manutencao);
        solicitacao.setStatus("ARRUMADA");
        solicitacaoRepository.save(solicitacao);
        addHistorico(solicitacao, "APROVADA", criadaEm.plusHours(12));
        return solicitacao;
    }

    private Solicitacao createPaga(
            Cliente cliente,
            Funcionario funcionario,
            String equipamento,
            String categoria,
            String defeito,
            double valor,
            String descricaoManutencao,
            String orientacao,
            LocalDateTime criadaEm
    ) {
        Solicitacao solicitacao = createArrumada(
                cliente,
                funcionario,
                equipamento,
                categoria,
                defeito,
                valor,
                descricaoManutencao,
                orientacao,
                criadaEm
        );
        solicitacao.setStatus("PAGA");
        solicitacao.setDataPagamento(criadaEm.plusHours(18));
        solicitacaoRepository.save(solicitacao);
        addHistorico(solicitacao, "ARRUMADA", criadaEm.plusHours(18));
        return solicitacao;
    }

    private void createFinalizada(
            Cliente cliente,
            Funcionario funcionario,
            String equipamento,
            String categoria,
            String defeito,
            double valor,
            String descricaoManutencao,
            String orientacao,
            LocalDateTime criadaEm
    ) {
        Solicitacao solicitacao = createPaga(
                cliente,
                funcionario,
                equipamento,
                categoria,
                defeito,
                valor,
                descricaoManutencao,
                orientacao,
                criadaEm
        );
        solicitacao.setStatus("FINALIZADA");
        solicitacao.setDataFinalizacao(criadaEm.plusHours(24));
        solicitacao.setFuncionarioFinalizacao(funcionario);
        solicitacaoRepository.save(solicitacao);
        addHistorico(solicitacao, "PAGA", criadaEm.plusHours(24));
    }

    private Orcamento createOrcamento(
            Solicitacao solicitacao,
            Funcionario funcionario,
            double valor,
            LocalDateTime data
    ) {
        Orcamento orcamento = new Orcamento(solicitacao, funcionario, valor);
        orcamento.setDataOrcamento(data);
        return orcamentoRepository.save(orcamento);
    }

    private Manutencao createManutencao(
            Solicitacao solicitacao,
            Funcionario funcionario,
            String descricao,
            String orientacao,
            LocalDateTime data
    ) {
        Manutencao manutencao = new Manutencao(solicitacao, funcionario, descricao, orientacao);
        manutencao.setDataManutencao(data);
        return manutencaoRepository.save(manutencao);
    }

    private void addHistorico(Solicitacao solicitacao, String status, LocalDateTime data) {
        HistoricoSolicitacao historico = new HistoricoSolicitacao(solicitacao, status);
        historico.setData(data);
        historicoRepository.save(historico);
    }
}
