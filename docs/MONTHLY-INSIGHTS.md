# 📊 Sistema de Insights Mensais Automatizados

Este documento explica como funciona o sistema de geração automática de insights mensais.

## 🎯 Visão Geral

O sistema gera automaticamente insights estratégicos todo mês usando IA, baseado nos dados de NPS e feedback da empresa.

## 📁 Arquivos Importantes

### Configuração do Prompt
- **`monthly-insights-prompt.md`**: Arquivo principal para editar o prompt (formato amigável)
- **`src/config/monthly-prompt.ts`**: Configuração técnica do sistema

### APIs
- **`/api/insights`**: GET (busca) e POST (salva) insights
- **`/api/insights/generate`**: Gera novo insight via n8n
- **`/api/cron/monthly-insights`**: Cron job automático

### Frontend
- **`src/app/page.tsx`**: Exibe os insights na box "General Insights"

## 🔄 Como Funciona

```
1. Todo dia 1º do mês às 00:00
2. Cron job executa automaticamente
3. Envia prompt configurado para n8n
4. n8n processa via IA
5. Resposta é salva no banco
6. Frontend exibe automaticamente
```

## ⚙️ Configuração

### 1. Banco de Dados
Execute no Supabase:
```sql
-- Copie o conteúdo de database-schema.sql
```

### 2. Variáveis de Ambiente
```env
CRON_SECRET=sua_chave_secreta
CRON_AUTH_KEY=sua_chave_interna
MONTHLY_INSIGHTS_PROMPT="seu_prompt_personalizado" # Opcional
```

### 3. Editando o Prompt
**Opção 1 - Arquivo Markdown (Recomendado):**
1. Edite `monthly-insights-prompt.md`
2. Copie o prompt atualizado
3. Cole na variável `MONTHLY_INSIGHTS_PROMPT`

**Opção 2 - Código TypeScript:**
1. Edite `src/config/monthly-prompt.ts`
2. Modifique a propriedade `prompt`

## 🧪 Testando

### Teste Manual (Desenvolvimento)
```bash
POST http://localhost:3000/api/cron/monthly-insights
Content-Type: application/json
```

### Verificar Status
```bash
GET http://localhost:3000/api/insights
```

## 📊 Estados do Sistema

| Status | Ícone | Descrição |
|--------|-------|-----------|
| `success` | ✅ | Insight gerado com sucesso |
| `pending` | ⏳ | Aguardando primeira geração |
| `error` | ⚠️ | Erro na geração, usando insight anterior |

## 🔧 Manutenção

### Logs
- Verifique logs do Vercel para execuções do cron
- Logs aparecem no console durante desenvolvimento

### Banco de Dados
```sql
-- Ver todos os insights
SELECT * FROM general_insights ORDER BY mes DESC;

-- Ver apenas o insight atual
SELECT * FROM latest_general_insight_v;

-- Limpar insights antigos (opcional)
DELETE FROM general_insights WHERE mes < '2024-01-01';
```

### Forçar Nova Geração
```bash
# Em desenvolvimento
POST http://localhost:3000/api/insights/generate
Content-Type: application/json
Authorization: Bearer sua_chave_auth

{
  "prompt": "seu_prompt_aqui",
  "mes": "2025-01-01"
}
```

## 🚨 Troubleshooting

### Cron não executa
1. Verificar `vercel.json` está correto
2. Conferir variável `CRON_SECRET`
3. Deploy deve estar no Vercel (cron local não funciona)

### IA não responde
1. Verificar conexão com n8n
2. Conferir variáveis `N8N_*`
3. Testar webhook manualmente

### Insights não aparecem
1. Verificar API `/api/insights`
2. Conferir tabela no banco
3. Verificar console do navegador

## 📈 Melhorias Futuras

- [ ] Interface para editar prompt via web
- [ ] Histórico de insights anteriores
- [ ] Múltiplos prompts por categoria
- [ ] Agendamento personalizado
- [ ] Notificações por email

---

💡 **Dica**: Mantenha backups dos prompts importantes no controle de versão!
