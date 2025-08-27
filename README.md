# Visão 360 App

Este é um aplicativo web full-stack construído com Next.js 14+ (App Router), TypeScript, TailwindCSS, Recharts, Supabase (Postgres) e n8n.

## Requisitos Gerais

*   **Responsivo**: Design mobile-first com breakpoints `sm/md/lg/xl`.
*   **Header Fixo**: Logo da empresa no canto superior esquerdo e menu de navegação à direita (`Home` e `Falar com IA`).
*   **Tipografia**: Título "Visão 360" com Caveat (Google Fonts, 700, `text-3xl` mobile, `text-5xl` desktop); corpo e UI com Inter.
*   **Tema Visual**: Aparência clara com cards (`rounded-2xl`, `shadow-md`, espaçamento generoso).
*   **Acessibilidade**: Contraste de cor AA, `aria-labels` em inputs/botões, estados de foco, mensagens de erro.

## Instalação e Configuração

Siga os passos abaixo para configurar e rodar o projeto localmente:

1.  **Instalar Dependências**:

    ```bash
    pnpm i
    ```

2.  **Configurar Variáveis de Ambiente**:

    Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis (substitua pelos seus próprios valores):

    ```env
    NEXT_PUBLIC_SUPABASE_URL=sua_url_supabase
    SUPABASE_SERVICE_ROLE_KEY=sua_chave_de_servico_supabase
    N8N_WEBHOOK_URL=https://your-n8n/webhook/...
    ```

    *   `NEXT_PUBLIC_SUPABASE_URL`: Encontrado no painel Supabase (Settings -> API).
    *   `SUPABASE_SERVICE_ROLE_KEY`: Chave de Serviço do Supabase (para acesso server-side, encontrada em Settings -> API -> Service Role (secret)).
    *   `N8N_WEBHOOK_URL`: URL do seu webhook n8n para integração de chat.

3.  **Configuração do Banco de Dados Supabase**:

    Acesse o "SQL Editor" no seu painel Supabase e execute o seguinte script SQL para criar a tabela `feedback_nps` e a view `nps_summary_v`:

    ```sql
    create table if not exists feedback_nps (
      id bigserial primary key,
      created_at timestamptz default now(),
      score int not null check (score between 0 and 10),
      channel text,        -- optional (site, app, etc.)
      comment text         -- optional
    );

    create or replace view nps_summary_v as
    select
      count(*)::int as total,
      count(*) filter (where score between 9 and 10)::int as promoters,
      count(*) filter (where score between 7 and 8)::int as passives,
      count(*) filter (where score between 0 and 6)::int as detractors,
      -- Classic NPS (-100..100):
      ((count(*) filter (where score between 9 and 10)::float / nullif(count(*),0) * 100)
       - (count(*) filter (where score between 0 and 6)::float / nullif(count(*),0) * 100))::int as nps
    from feedback_nps;
    ```

4.  **Rodar o Servidor de Desenvolvimento**:

    ```bash
    pnpm dev
    ```

    Abra [http://localhost:3000](http://localhost:3000) no seu navegador para ver o aplicativo.

## Rotas da API

*   `GET /api/nps/summary`: Lê `nps_summary_v` do Supabase e retorna um resumo do NPS.
*   `POST /api/chat/proxy`: Encaminha mensagens de chat para `N8N_WEBHOOK_URL`.

## Testes E2E (Playwright)

Para executar os testes end-to-end:

1.  Certifique-se de que o servidor de desenvolvimento está rodando (`pnpm dev`).
2.  Execute o Playwright:

    ```bash
    npx playwright test
    ```

## Deploy no Vercel

A maneira mais fácil de fazer o deploy do seu aplicativo Next.js é usar a [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Consulte nossa [documentação de deploy do Next.js](https://nextjs.org/docs/app/building-your-application/deploying) para mais detalhes.
