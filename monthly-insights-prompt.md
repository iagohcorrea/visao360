# 🤖 Prompt Mensal para Insights Gerais

Este arquivo contém o prompt que será enviado automaticamente todo mês para a IA gerar os insights gerais da empresa.

## 📋 Como funciona

- **Frequência**: Todo dia 1º de cada mês às 00:00
- **Destino**: Agente de IA do n8n via webhook
- **Resultado**: Salvo no banco de dados e exibido na box "General Insights"
- **Fallback**: Em caso de erro, mantém o insight do mês anterior

## ✏️ Prompt Atual

**Edite o texto abaixo conforme necessário:**

---

Analise os dados de NPS e feedback da empresa do último mês e gere um insight estratégico executivo detalhado.

**Estrutura solicitada:**

1. **📊 Resumo Executivo**
   - Principais métricas e tendências identificadas
   - Comparação com períodos anteriores (se disponível)

2. **🔍 Análise Detalhada**
   - Pontos fortes identificados nos feedbacks
   - Áreas de atenção críticas que precisam de ação imediata
   - Padrões comportamentais dos clientes

3. **💡 Recomendações Estratégicas**
   - Ações prioritárias para os próximos 30 dias
   - Iniciativas de médio prazo (2-3 meses)
   - Oportunidades de crescimento identificadas

4. **⚠️ Alertas e Riscos**
   - Tendências negativas que requerem atenção
   - Possíveis impactos no negócio se não tratados

**Formato de resposta:**
- Use linguagem executiva e objetiva
- Inclua dados quantitativos quando possível
- Foque em insights acionáveis
- Mantenha entre 300-500 palavras
- Use emojis para melhor visualização

**Contexto adicional:**
Você está analisando dados de uma empresa que usa NPS como principal métrica de satisfação. Os insights devem ser direcionados para tomada de decisões estratégicas pela liderança.

---

## 🔧 Como atualizar este prompt

1. **Edite o texto acima** conforme suas necessidades
2. **Salve o arquivo** 
3. **Copie o prompt atualizado**
4. **Cole na variável de ambiente** `MONTHLY_INSIGHTS_PROMPT` no seu `.env.local`

Ou use diretamente no código em `src/app/api/cron/monthly-insights/route.ts`

## 📝 Histórico de Mudanças

- **2025-01-XX**: Prompt inicial criado
- **[Data]**: [Suas alterações aqui]

## 🧪 Para testar o prompt

Execute manualmente em desenvolvimento:
```bash
POST http://localhost:3000/api/cron/monthly-insights
```

---

💡 **Dica**: Mantenha o prompt específico mas flexível o suficiente para diferentes cenários mensais.
