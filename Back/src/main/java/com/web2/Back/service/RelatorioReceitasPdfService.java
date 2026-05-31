package com.web2.Back.service;

import com.lowagie.text.Document;
import com.lowagie.text.DocumentException;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import com.web2.Back.model.Solicitacao;
import com.web2.Back.repository.SolicitacaoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.text.NumberFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class RelatorioReceitasPdfService {

    private static final DateTimeFormatter DATA_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    private static final Locale BRASIL = Locale.of("pt", "BR");

    private final SolicitacaoRepository solicitacaoRepository;

    public RelatorioReceitasPdfService(SolicitacaoRepository solicitacaoRepository) {
        this.solicitacaoRepository = solicitacaoRepository;
    }

    @Transactional(readOnly = true)
    public byte[] gerarReceitasPorDia(LocalDate dataInicial, LocalDate dataFinal) {
        List<Solicitacao> solicitacoes = buscarPagasNoPeriodo(dataInicial, dataFinal);

        Map<LocalDate, Double> receitasPorDia = solicitacoes.stream()
                .collect(Collectors.groupingBy(
                        s -> s.getDataPagamento().toLocalDate(),
                        LinkedHashMap::new,
                        Collectors.summingDouble(s -> s.getOrcamento().getValor())
                ));

        PdfPTable tabela = criarTabela(2);
        adicionarCabecalho(tabela, "Data", "Receita");

        receitasPorDia.forEach((data, valor) ->
                adicionarLinha(tabela, data.format(DATA_FORMATTER), formatarMoeda(valor))
        );

        return gerarPdf(
                "Relatorio de Receitas por Dia",
                montarPeriodo(dataInicial, dataFinal),
                tabela,
                receitasPorDia.values().stream().mapToDouble(Double::doubleValue).sum()
        );
    }

    @Transactional(readOnly = true)
    public byte[] gerarReceitasPorCategoria() {
        List<Solicitacao> solicitacoes = solicitacaoRepository.findPagasComOrcamento();

        Map<String, Double> receitasPorCategoria = solicitacoes.stream()
                .collect(Collectors.groupingBy(
                        Solicitacao::getCategoria,
                        LinkedHashMap::new,
                        Collectors.summingDouble(s -> s.getOrcamento().getValor())
                ));

        PdfPTable tabela = criarTabela(2);
        adicionarCabecalho(tabela, "Categoria", "Receita");

        receitasPorCategoria.forEach((categoria, valor) ->
                adicionarLinha(tabela, categoria, formatarMoeda(valor))
        );

        return gerarPdf(
                "Relatorio de Receitas por Categoria",
                "Periodo: desde sempre",
                tabela,
                receitasPorCategoria.values().stream().mapToDouble(Double::doubleValue).sum()
        );
    }

    private List<Solicitacao> buscarPagasNoPeriodo(LocalDate dataInicial, LocalDate dataFinal) {
        return solicitacaoRepository.findPagasComOrcamento()
                .stream()
                .filter(s -> dataInicial == null || !s.getDataPagamento().toLocalDate().isBefore(dataInicial))
                .filter(s -> dataFinal == null || !s.getDataPagamento().toLocalDate().isAfter(dataFinal))
                .toList();
    }

    private byte[] gerarPdf(String titulo, String subtitulo, PdfPTable tabela, double total) {
        try {
            ByteArrayOutputStream output = new ByteArrayOutputStream();
            Document document = new Document();
            PdfWriter.getInstance(document, output);

            document.open();
            document.add(criarTitulo(titulo));
            document.add(new Paragraph(subtitulo));
            document.add(new Paragraph(" "));
            document.add(tabela);
            document.add(new Paragraph(" "));
            document.add(new Paragraph("Total: " + formatarMoeda(total), fonteNegrito(12)));
            document.close();

            return output.toByteArray();
        } catch (DocumentException e) {
            throw new IllegalStateException("Erro ao gerar PDF de receitas", e);
        }
    }

    private Paragraph criarTitulo(String texto) {
        Paragraph titulo = new Paragraph(texto, fonteNegrito(16));
        titulo.setAlignment(Element.ALIGN_CENTER);
        titulo.setSpacingAfter(12);
        return titulo;
    }

    private PdfPTable criarTabela(int colunas) {
        PdfPTable tabela = new PdfPTable(colunas);
        tabela.setWidthPercentage(100);
        return tabela;
    }

    private void adicionarCabecalho(PdfPTable tabela, String... colunas) {
        for (String coluna : colunas) {
            PdfPCell cell = new PdfPCell(new Phrase(coluna, fonteNegrito(11)));
            cell.setHorizontalAlignment(Element.ALIGN_CENTER);
            tabela.addCell(cell);
        }
    }

    private void adicionarLinha(PdfPTable tabela, String coluna1, String coluna2) {
        tabela.addCell(new Phrase(coluna1));
        PdfPCell valor = new PdfPCell(new Phrase(coluna2));
        valor.setHorizontalAlignment(Element.ALIGN_RIGHT);
        tabela.addCell(valor);
    }

    private String montarPeriodo(LocalDate dataInicial, LocalDate dataFinal) {
        String inicio = dataInicial == null ? "inicio" : dataInicial.format(DATA_FORMATTER);
        String fim = dataFinal == null ? "hoje" : dataFinal.format(DATA_FORMATTER);
        return "Periodo: " + inicio + " ate " + fim;
    }

    private String formatarMoeda(double valor) {
        return NumberFormat.getCurrencyInstance(BRASIL).format(valor);
    }

    private Font fonteNegrito(int tamanho) {
        return FontFactory.getFont(FontFactory.HELVETICA_BOLD, tamanho);
    }
}
