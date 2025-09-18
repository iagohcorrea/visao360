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

export default async function Home() {
  let npsData: NpsSummary | null = null;
  let error: string | null = null;

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/nps/summary`, {
      cache: 'no-store', // Sempre buscar os dados mais recentes
    });
    
    if (!response.ok) {
      error = `Erro ao buscar dados do NPS: ${response.statusText}`;
    } else {
      npsData = await response.json();
    }
  } catch (err) {
    console.error('Erro ao buscar dados do NPS:', err);
    error = 'Não foi possível conectar ao servidor para buscar dados do NPS.';
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
            <h2 className="text-2xl font-lora font-bold text-gray-800 mb-6">General Insights</h2>
            <textarea
              readOnly
              placeholder="(Output AI agent for general insights)"
              className="w-full min-h-[200px] md:min-h-[250px] p-4 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Output AI agent for general insights"
            ></textarea>
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
