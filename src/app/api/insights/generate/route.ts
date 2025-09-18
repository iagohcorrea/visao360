import { NextResponse } from 'next/server';

// POST - Gera insight mensal (chamado pelo cron job)
export async function POST(req: Request) {
  try {
    // Verifica se tem a chave de autorização (para segurança)
    const authHeader = req.headers.get('authorization');
    const expectedAuth = process.env.CRON_AUTH_KEY;
    
    if (!expectedAuth || authHeader !== `Bearer ${expectedAuth}`) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const { prompt, mes } = await req.json();
    
    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt é obrigatório' },
        { status: 400 }
      );
    }

    // Define o mês (ou usa o atual)
    const targetMonth = mes || new Date().toISOString().slice(0, 10).replace(/-..$/, '-01');
    
    console.log(`Iniciando geração de insight para ${targetMonth}`);
    console.log(`Prompt: ${prompt}`);

    try {
      // Chama a API do n8n
      const n8nResponse = await fetch('/api/chat/proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: prompt }),
      });

      if (!n8nResponse.ok) {
        const errorData = await n8nResponse.json();
        throw new Error(`Erro do n8n: ${errorData.error || n8nResponse.statusText}`);
      }

      const n8nData = await n8nResponse.json();
      const insight = n8nData.reply;

      // Salva o insight com sucesso
      const saveResponse = await fetch('/api/insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mes: targetMonth,
          prompt: prompt,
          insight: insight,
          status: 'success'
        }),
      });

      if (!saveResponse.ok) {
        throw new Error('Erro ao salvar insight no banco');
      }

      console.log(`Insight gerado e salvo com sucesso para ${targetMonth}`);
      
      return NextResponse.json({
        message: 'Insight gerado com sucesso',
        mes: targetMonth,
        insight: insight
      });

    } catch (aiError) {
      console.error('Erro na geração do insight:', aiError);
      
      // Salva o erro no banco para auditoria
      await fetch('/api/insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mes: targetMonth,
          prompt: prompt,
          insight: null,
          status: 'error',
          error_details: aiError instanceof Error ? aiError.message : String(aiError)
        }),
      });

      // Retorna erro mas não falha completamente
      return NextResponse.json({
        message: 'Erro na geração, insight anterior mantido',
        mes: targetMonth,
        error: aiError instanceof Error ? aiError.message : String(aiError)
      }, { status: 500 });
    }

  } catch (err) {
    console.error('Erro inesperado na geração de insight:', err);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
