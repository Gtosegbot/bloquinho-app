{
    "produto": "Ficha Preta 5x8",
        "codigo": "712",
            "preco": "11.57",
                "categoria": "FICHAS & FORMULÁRIOS",
                    "especificacoes": "100 folhas, 125x205mm, pautada preta"
},
{
    "produto": "Ficha Preta 6x9",
        "codigo": "713",
            "preco": "15.87",
                "categoria": "FICHAS & FORMULÁRIOS",
                    "especificacoes": "100 folhas, 155x215mm, pautada preta"
},
{
    "produto": "Nota de Pedido 2 Corpos (50x2)",
        "codigo": "205",
            "preco": "4.50",
                "categoria": "BLOCOS E TALÕES",
                    "especificacoes": "50 jogos x 2 vias, carbono incluso, 148x210mm"
},
{
    "produto": "Placa Vende-se / Aluga-se",
        "codigo": "901",
            "preco": "15.90",
                "categoria": "SINALIZAÇÃO",
                    "especificacoes": "Placa de poliestireno (PS) 1mm, 30x40cm, resistente a sol e chuva"
},
{
    "produto": "Receituário Médico Padrão",
        "codigo": "500",
            "preco": "35.00",
                "categoria": "PAPELARIA CORPORATIVA",
                    "especificacoes": "Bloco com 100 folhas, papel sulfite 90g, 15x21cm"
},
{
    "produto": "Cartão de Visita Couchê 300g",
        "codigo": "101",
            "preco": "120.00",
                "categoria": "PAPELARIA CORPORATIVA",
                    "especificacoes": "1000 unidades, verniz total frente, corte reto"
},
{
    "produto": "Cartaz Oferta Amarelo Retangular",
        "codigo": "340",
            "preco": "8.90",
                "categoria": "OUTROS PRODUTOS",
                    "especificacoes": "50 unidades, 100x150mm"
}
];

export const getContextString = () => {
    return productCatalog.map(p =>
        `${p.produto} (Cód: ${p.codigo}): R$ ${p.preco} - ${p.especificacoes}. Categoria: ${p.categoria}`
    ).join('\n');
};
