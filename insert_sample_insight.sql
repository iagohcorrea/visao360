-- Primeiro, cria a tabela se não existir
CREATE TABLE IF NOT EXISTS general_insights (
  id BIGSERIAL PRIMARY KEY,
  mes DATE NOT NULL,
  mes_label VARCHAR(7) NOT NULL,
  prompt_enviado TEXT NOT NULL,
  insight_gerado TEXT,
  status VARCHAR(20) DEFAULT 'pending',
  erro_detalhes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(mes)
);

-- Insere o insight de exemplo
INSERT INTO general_insights (
  mes, 
  mes_label, 
  prompt_enviado, 
  insight_gerado, 
  status
) VALUES (
  '2025-01-01',
  '2025-01',
  'Monte para mim um relatório executivo mensal para empresa IHC Marketplace, no qual você vai comparar os dados do mês passado com o mês anterior para os dados de vendas e valores de NPS.',
  '📊 **RELATÓRIO EXECUTIVO MENSAL - IHC MARKETPLACE**

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
4. Implementação de sistema de tracking em tempo real',
  'success'
) ON CONFLICT (mes) DO UPDATE SET
  insight_gerado = EXCLUDED.insight_gerado,
  status = EXCLUDED.status,
  updated_at = NOW();

-- Cria a view para buscar o insight mais recente
CREATE OR REPLACE VIEW latest_general_insight_v AS
SELECT 
  id,
  mes,
  mes_label,
  prompt_enviado,
  insight_gerado,
  status,
  created_at,
  updated_at
FROM general_insights 
WHERE status = 'success' 
  AND insight_gerado IS NOT NULL
ORDER BY mes DESC 
LIMIT 1;

-- Cria índices para performance
CREATE INDEX IF NOT EXISTS idx_general_insights_mes ON general_insights(mes DESC);
CREATE INDEX IF NOT EXISTS idx_general_insights_status ON general_insights(status);
