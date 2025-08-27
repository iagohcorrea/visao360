import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabaseServer';

export async function GET() {
  try {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase.from('nps_summary_v').select('*').single();

    if (error) {
      console.error('Erro ao buscar summary NPS:', error);
      // Retorna zeros em caso de erro no banco de dados
      return NextResponse.json({
        total: 0,
        promoters: 0,
        passives: 0,
        detractors: 0,
        nps: 0,
      });
    }

    if (!data) {
      // Retorna zeros se não houver dados
      return NextResponse.json({
        total: 0,
        promoters: 0,
        passives: 0,
        detractors: 0,
        nps: 0,
      });
    }

    // Garante que todos os campos esperados existem e são números
    const formattedData = {
      total: data.total || 0,
      promoters: data.promoters || 0,
      passives: data.passives || 0,
      detractors: data.detractors || 0,
      nps: data.nps || 0,
    };

    return NextResponse.json(formattedData);
  } catch (err) {
    console.error('Erro inesperado na API NPS Summary:', err);
    return NextResponse.json(
      {
        total: 0,
        promoters: 0,
        passives: 0,
        detractors: 0,
        nps: 0,
        error: 'Internal Server Error',
      },
      { status: 500 }
    );
  }
}
