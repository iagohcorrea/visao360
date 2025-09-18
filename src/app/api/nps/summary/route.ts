import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabaseServer';

export async function GET() {
  try {
    const supabase = createServerSupabaseClient();
    // Busca todos os dados mensais ordenados por mês (mais recente primeiro)
    const { data, error } = await supabase
      .from('nps_summary_v')
      .select('*')
      .order('mes', { ascending: false });

    if (error) {
      console.error('Erro ao buscar summary NPS:', error);
      // Retorna dados vazios em caso de erro no banco de dados
      return NextResponse.json({
        idx: 0,
        mes: new Date().toISOString().split('T')[0],
        mes_label: new Date().toISOString().slice(0, 7),
        total: 0,
        promoters: 0,
        passives: 0,
        detractors: 0,
        nps: "0",
      });
    }

    if (!data || data.length === 0) {
      // Retorna dados vazios se não houver dados
      return NextResponse.json({
        idx: 0,
        mes: new Date().toISOString().split('T')[0],
        mes_label: new Date().toISOString().slice(0, 7),
        total: 0,
        promoters: 0,
        passives: 0,
        detractors: 0,
        nps: "0",
      });
    }

    // Pega o primeiro item (mais recente)
    const latestData = data[0];
    
    // Garante que todos os campos esperados existem
    const formattedData = {
      idx: latestData.idx || 0,
      mes: latestData.mes || new Date().toISOString().split('T')[0],
      mes_label: latestData.mes_label || new Date().toISOString().slice(0, 7),
      total: latestData.total || 0,
      promoters: latestData.promoters || 0,
      passives: latestData.passives || 0,
      detractors: latestData.detractors || 0,
      nps: latestData.nps || "0",
    };

    return NextResponse.json(formattedData);
  } catch (err) {
    console.error('Erro inesperado na API NPS Summary:', err);
    return NextResponse.json(
      {
        idx: 0,
        mes: new Date().toISOString().split('T')[0],
        mes_label: new Date().toISOString().slice(0, 7),
        total: 0,
        promoters: 0,
        passives: 0,
        detractors: 0,
        nps: "0",
        error: 'Internal Server Error',
      },
      { status: 500 }
    );
  }
}
