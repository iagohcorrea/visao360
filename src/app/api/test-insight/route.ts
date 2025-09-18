import { NextResponse } from 'next/server';

// Rota para testar e forçar um insight de exemplo
export async function POST() {
  try {
    console.log('🧪 Gerando insight de teste...');

    // Insight de exemplo baseado no seu prompt
    const testInsight = `📊 **RELATÓRIO EXECUTIVO MENSAL - IHC MARKETPLACE**

📅 **Data**: Janeiro 2025

📈 **Vendas**
- Crescimento de 15% em volume comparado ao mês anterior
- Ticket médio de R$ 127,50 (+8% vs mês anterior)
- Categoria "Eletrônicos" liderou com 35% das vendas
- Top vendedor: João Silva (R$ 45.000 em vendas)

💚 **Clientes (NPS)**
- NPS atual: -45.5 (melhoria de 0.3 pontos vs mês anterior)
- Promotores: 18% | Passivos: 19% | Detratores: 63%
- **Principais motivos dos detratores:**
  - Problemas de qualidade dos produtos (40%)
  - Atrasos na entrega (35%)
  - Atendimento inadequado dos vendedores (25%)

⭐ **Qualidade de Produtos e Vendedores**
- Avaliação média de produtos: 3.2/5.0
- **Destaques positivos:** Produtos eletrônicos com alta durabilidade
- **Pontos críticos:** Material de construção abaixo do especificado em 23% dos casos
- Avaliação média de vendedores: 3.8/5.0
- **Vendedores destacados:** Atendimento prestativo e rápido
- **Alertas:** 12% dos vendedores não seguem diretrizes de comunicação

🚚 **Logística**
- 28% de reclamações por atrasos na entrega
- 15% de produtos extraviados ou danificados
- Tempo médio de entrega: 8.5 dias (meta: 5 dias)
- Região Sul apresenta maiores problemas logísticos

🚨 **Riscos e Alertas**
- **CRÍTICO:** Alta taxa de detratores pode impactar reputação da marca
- **ATENÇÃO:** Vendedor "TechStore123" acumula 15 reclamações por não cumprir política de devolução
- **OPORTUNIDADE:** Implementar programa de qualidade para fornecedores pode reduzir reclamações em 40%

**Recomendações Imediatas:**
1. Auditoria de qualidade nos top 10 produtos com mais reclamações
2. Treinamento obrigatório para vendedores com avaliação < 3.5
3. Revisão do processo logístico na região Sul
4. Implementação de sistema de tracking em tempo real`;

    // Salva o insight de teste
    const saveResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/insights`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mes: new Date().toISOString().slice(0, 10).replace(/-..$/, '-01'),
        prompt: "Relatório de teste gerado manualmente",
        insight: testInsight,
        status: 'success'
      }),
    });

    if (!saveResponse.ok) {
      throw new Error('Erro ao salvar insight de teste');
    }

    console.log('✅ Insight de teste salvo com sucesso!');
    
    return NextResponse.json({
      success: true,
      message: 'Insight de teste gerado e salvo com sucesso',
      insight: testInsight
    });

  } catch (error) {
    console.error('❌ Erro ao gerar insight de teste:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
