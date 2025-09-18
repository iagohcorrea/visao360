import Image from "next/image";
import Gauge from '@/components/Gauge';
import NpsBars from '@/components/NpsBars';
import ReloadButton from '@/components/ReloadButton';

interface NpsSummary {
  idx: number;
  mes: string;
  mes_label: string;
  total: number;
  promoters: number;
  passives: number;
  detractors: number;
  nps: string;
}

interface InsightData {
  insight: string;
  mes_label: string;
  status: string;
  updated_at?: string;
}

export default async function Home() {
  let npsData: NpsSummary | null = null;
  let insightData: InsightData | null = null;
  let error: string | null = null;

  try {
    // Busca dados de NPS e Insights em paralelo
    const [npsResponse, insightResponse] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/nps/summary`, {
        cache: 'no-store',
      }),
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/insights`, {
        cache: 'no-store',
      })
    ]);
    
    if (!npsResponse.ok) {
      error = `Erro ao buscar dados do NPS: ${npsResponse.statusText}`;
    } else {
      npsData = await npsResponse.json();
    }

    if (insightResponse.ok) {
      insightData = await insightResponse.json();
    }
  } catch (err) {
    console.error('Erro ao buscar dados:', err);
    error = 'Não foi possível conectar ao servidor para buscar dados.';
  }

  const hasNpsData = npsData && (npsData.total > 0 || parseFloat(npsData.nps) !== 0);

  return (
    <div className="min-h-screen" style={{backgroundColor: '#f9fafb'}}>
      {/* Hero Section with Background */}
      <div className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/360-view-background.png"
            alt="360 View Background"
            fill
            style={{ objectFit: 'cover' }}
            className="opacity-90"
            priority
          />
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/50"></div>
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-caveat font-bold mb-4">
            Visão 360
          </h1>
          <p className="text-lg md:text-xl font-inter mb-8 text-gray-100">
            Insights estratégicos e análises completas do feedback da sua empresa
          </p>
        </div>
        
      </div>

      {/* General Insights Card - Positioned between hero and graphs */}
      <div className="relative -mt-20 pb-8 px-4 sm:px-6 lg:px-8 z-20">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-lora font-bold text-gray-800">General Insights</h2>
              {insightData && (
                <div className="text-sm text-gray-600">
                  <span className="mr-2">📅 {insightData.mes_label}</span>
                  {insightData.status === 'success' && <span className="text-green-600">✅ Atualizado</span>}
                  {insightData.status === 'pending' && <span className="text-yellow-600">⏳ Pendente</span>}
                  {insightData.status === 'error' && <span className="text-orange-600">⚠️ Usando anterior</span>}
                </div>
              )}
            </div>
            <div className="min-h-[200px] md:min-h-[250px] p-4 border border-gray-300 rounded-lg bg-gray-50">
              {insightData ? (
                <div className="text-gray-700 whitespace-pre-wrap font-inter text-sm md:text-base leading-relaxed">
                  {insightData.insight}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <div className="text-center">
                    <div className="animate-pulse mb-2">🤖</div>
                    <p>Carregando insights mensais...</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Container principal do Dashboard */}

        {/* Container para os gráficos lado a lado */}
        <div className="flex flex-col md:flex-row gap-8 w-full justify-center items-stretch flex-grow"> 
          {/* NPS Dashs Card */}
          <div className="bg-white p-6 rounded-2xl shadow-md flex flex-col w-full md:w-1/2 flex-grow items-stretch"> {/* Container for Gauge */}
            <div className="mb-6">
              <h2 className="text-2xl font-lora font-bold text-gray-800">NPS Dashs</h2>
              {npsData && hasNpsData && (
                <p className="text-sm text-gray-600 mt-1">Referência: {npsData.mes_label}</p>
              )}
            </div>
            {!npsData && !error ? (
              <div className="animate-pulse flex flex-col items-center space-y-8 w-full">
                <div className="w-48 h-48 bg-gray-200 rounded-full"></div>
                <div className="w-full h-48 bg-gray-200 rounded-lg"></div>
              </div>
            ) : error ? (
              <ReloadButton errorMessage={error} />
            ) : !hasNpsData ? (
              <div className="text-gray-600 text-center">
                <p>Nenhum feedback de NPS registrado ainda.</p>
              </div>
            ) : (
              <div className="w-full flex items-center justify-center"> {/* Container for Gauge */}
                {npsData && <Gauge value={parseFloat(npsData.nps)} />}
              </div>
            )}
          </div>

          {/* NpsBars Card */}
          <div className="bg-white p-6 rounded-2xl shadow-md flex flex-col w-full md:w-1/2 items-stretch flex-grow"> {/* Container for NpsBars */}
            <div className="mb-6">
              <h2 className="text-2xl font-lora font-bold text-gray-800">Distribuição NPS</h2>
              {npsData && hasNpsData && (
                <p className="text-sm text-gray-600 mt-1">Referência: {npsData.mes_label}</p>
              )}
            </div>
            {npsData && <NpsBars promoters={npsData.promoters} passives={npsData.passives} detractors={npsData.detractors} />}
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
