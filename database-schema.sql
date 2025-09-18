-- Tabela para armazenar insights mensais gerados pela IA
CREATE TABLE IF NOT EXISTS general_insights (
  id BIGSERIAL PRIMARY KEY,
  mes DATE NOT NULL, -- Primeiro dia do mês (ex: 2025-01-01)
  mes_label VARCHAR(7) NOT NULL, -- Formato YYYY-MM (ex: 2025-01)
  prompt_enviado TEXT NOT NULL, -- O prompt que foi enviado para a IA
  insight_gerado TEXT, -- A resposta da IA (NULL se houver erro)
  status VARCHAR(20) DEFAULT 'pending', -- pending, success, error
  erro_detalhes TEXT, -- Detalhes do erro se houver
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Garante um insight por mês
  UNIQUE(mes)
);

-- View para pegar o insight mais recente válido
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

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_general_insights_mes ON general_insights(mes DESC);
CREATE INDEX IF NOT EXISTS idx_general_insights_status ON general_insights(status);
