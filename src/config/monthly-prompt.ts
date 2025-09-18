/**
 * Configuração do Prompt Mensal para Insights Gerais
 * 
 * Este arquivo centraliza a configuração do prompt que é enviado
 * automaticamente todo mês para gerar insights via IA.
 */

export const MONTHLY_INSIGHTS_CONFIG = {
  // Prompt principal - edite conforme necessário
  prompt: `Monte para mim um relatório executivo mensal para empresa IHC Marketplace, no qual você vai comparar os dados do mês passado com o mês anterior para os dados de vendas e valores de NPS. Já para as análises de qualidade de produtos, vendedores, logisticas e riscos e alertas, por favor, só traga informações do mês anterior ao atual. Por favor, só traga o relatório pedido, sem mais mensagens.

📅 Data: Relatório Mensal

Estrutura da resposta:

📈 **Vendas**
- Tendência de vendas (crescimento/queda) em valor e volume.
- Ticket médio e principais destaques de categorias ou vendedores.
- Monte com base nos dados de comentários da tool do supabase: Marketplace monthly sales.

💚 **Clientes (NPS)**
- NPS atual e variação recente (Utilize a tabela NPS_summary para trazer os valores de NPS já calculados).
- Principais motivos citados por promotores e detratores (Olhar comentarios da tabela do supabase NPS Data).
- Exemplos: Baixa ou alta qualidade dos produtos, Problemas com vendedores, Vendedores bons e atenciosos.

⭐ **Qualidade de Produtos e Vendedores**
- Média geral das avaliações.
- Principais destaques positivos e pontos críticos identificados.
- Exemplos: Produto de boa qualidade, Produto com alta performance, Produto de baixa qualidade muito frágil, Material diferente do especificado, Vendedor atencioso e prestativo, Vendedor não cumpre as diretrizes do marketplace.
- Monte com base nos dados de comentários das tools do supabase: Seller_Reviews_Data, Product_Reviews_Data

🚚 **Logística**
- Principais problemas de entrega reportados (ex.: atrasos, extravios).
- Monte com base nos dados de comentários das tools do supabase: Marketplace daily sales, Marketplace monthly sales, Seller_Reviews_Data, Product_Reviews_Data e NPS_summary.

🚨 **Riscos e Alertas**
- Pontos que exigem atenção imediata para reputação, operação ou políticas.
- Exemplos: Política de devolução sendo infringida pelo vendedor A, Alta reclamação de atrasos na entrega.
`.trim(),

  // Configurações do cron job
  schedule: {
    // Todo dia 1º de cada mês às 00:00 UTC
    cron: "0 0 1 * *",
    timezone: "America/Sao_Paulo"
  },

  // Configurações de fallback
  fallback: {
    // Mensagem exibida quando não há insights ainda
    noInsights: "Aguardando geração do primeiro insight mensal automatizado...",
    
    // Mensagem para erros temporários
    errorMessage: "Insights gerais serão atualizados automaticamente no próximo ciclo mensal.",
    
    // Tempo limite para geração (em ms)
    timeout: 600000 // 10 minutos
  },

  // Metadados
  version: "1.0.0",
  lastUpdated: "2025-01-XX",
  author: "Sistema Automatizado"
};

/**
 * Função para obter o prompt atual
 * Prioridade: ENV > Config > Default
 */
export function getMonthlyPrompt(): string {
  return process.env.MONTHLY_INSIGHTS_PROMPT || MONTHLY_INSIGHTS_CONFIG.prompt;
}

/**
 * Função para validar se o prompt está configurado
 */
export function validatePromptConfig(): boolean {
  const prompt = getMonthlyPrompt();
  return prompt.length > 50; // Mínimo de 50 caracteres
}

/**
 * Função para obter configurações de fallback
 */
export function getFallbackConfig() {
  return MONTHLY_INSIGHTS_CONFIG.fallback;
}
