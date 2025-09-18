import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabaseServer';

// GET - Busca o insight mais recente válido
export async function GET() {
  try {
    const supabase = createServerSupabaseClient();
    
    // Busca o insight mais recente que foi gerado com sucesso
    const { data, error } = await supabase
      .from('latest_general_insight_v')
      .select('*')
      .single();

    if (error) {
      console.error('Erro ao buscar insight:', error);
      return NextResponse.json({
        insight: 'Insights gerais serão gerados automaticamente todo mês pela nossa IA.',
        mes_label: new Date().toISOString().slice(0, 7),
        status: 'placeholder'
      });
    }

    if (!data) {
      return NextResponse.json({
        insight: 'Aguardando geração do primeiro insight mensal...',
        mes_label: new Date().toISOString().slice(0, 7),
        status: 'pending'
      });
    }

    return NextResponse.json({
      insight: data.insight_gerado,
      mes_label: data.mes_label,
      status: data.status,
      updated_at: data.updated_at
    });

  } catch (err) {
    console.error('Erro inesperado na API de insights:', err);
    return NextResponse.json(
      {
        insight: 'Erro ao carregar insights. Tente novamente mais tarde.',
        mes_label: new Date().toISOString().slice(0, 7),
        status: 'error'
      },
      { status: 500 }
    );
  }
}

// POST - Salva um novo insight (usado pela automação)
export async function POST(req: Request) {
  try {
    const { mes, prompt, insight, status, error_details } = await req.json();

    if (!mes || !prompt) {
      return NextResponse.json(
        { error: 'Mês e prompt são obrigatórios' },
        { status: 400 }
      );
    }

    const supabase = createServerSupabaseClient();
    
    // Cria o registro do insight
    const { data, error } = await supabase
      .from('general_insights')
      .upsert({
        mes: mes,
        mes_label: mes.slice(0, 7),
        prompt_enviado: prompt,
        insight_gerado: insight,
        status: status || 'pending',
        erro_detalhes: error_details,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'mes'
      })
      .select()
      .single();

    if (error) {
      console.error('Erro ao salvar insight:', error);
      return NextResponse.json(
        { error: 'Erro ao salvar insight' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Insight salvo com sucesso',
      data: data
    });

  } catch (err) {
    console.error('Erro inesperado ao salvar insight:', err);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
