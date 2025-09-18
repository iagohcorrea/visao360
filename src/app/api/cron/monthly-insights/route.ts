import { NextResponse } from 'next/server';

// Cron job mensal - executa no dia 1 de cada mês
export async function GET(req: Request) {
  try {
    // Verifica autorização do cron (Vercel ou sistema local)
    const authHeader = req.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('🤖 Iniciando geração automática de insight mensal...');

    // Importa o prompt configurado
    const { getMonthlyPrompt, validatePromptConfig } = await import('@/config/monthly-prompt');
    
    // Valida se o prompt está configurado corretamente
    if (!validatePromptConfig()) {
      throw new Error('Prompt mensal não está configurado corretamente');
    }
    
    const MONTHLY_PROMPT = getMonthlyPrompt();

    // Define o mês atual
    const now = new Date();
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      .toISOString()
      .split('T')[0];

    // Chama a API de geração
    const generateResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/insights/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.CRON_AUTH_KEY || 'local-dev'}`
      },
      body: JSON.stringify({
        prompt: MONTHLY_PROMPT,
        mes: currentMonth
      })
    });

    const result = await generateResponse.json();

    if (generateResponse.ok) {
      console.log('✅ Insight mensal gerado com sucesso:', result.mes);
      return NextResponse.json({
        success: true,
        message: 'Insight mensal gerado com sucesso',
        data: result
      });
    } else {
      console.error('❌ Erro na geração do insight:', result.error);
      return NextResponse.json({
        success: false,
        message: 'Erro na geração, insight anterior mantido',
        error: result.error
      }, { status: 200 }); // Retorna 200 para não falhar o cron
    }

  } catch (error) {
    console.error('❌ Erro crítico no cron job:', error);
    return NextResponse.json({
      success: false,
      message: 'Erro crítico no cron job',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 200 }); // Retorna 200 para não falhar o cron
  }
}

// Para desenvolvimento local - permite testar manualmente
export async function POST(req: Request) {
  console.log('🧪 Teste manual do cron job...');
  
  // Em desenvolvimento, pula a verificação de autorização
  if (process.env.NODE_ENV === 'development') {
    // Simula um request sem autorização para teste
    const testReq = new Request(req.url, {
      method: 'GET',
      headers: {
        'authorization': `Bearer ${process.env.CRON_SECRET || 'test-secret'}`
      }
    });
    return GET(testReq);
  }
  
  return GET(req);
}
