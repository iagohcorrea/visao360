import Image from "next/image";
import Gauge from '@/components/Gauge';
import NpsBars from '@/components/NpsBars';
import ReloadButton from '@/components/ReloadButton';

interface NpsSummary {
  total: number;
  promoters: number;
  passives: number;
  detractors: number;
  nps: number;
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

  const hasNpsData = npsData && (npsData.total > 0 || npsData.nps !== 0);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <h1 className="text-center font-caveat text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-10 mt-8">
        Visão 360
      </h1>

      {/* Main content wrapper */}
      <div className="flex flex-col gap-8 w-full justify-center items-stretch h-full"> {/* Container principal do Dashboard */}
        {/* General Insights Card */}
        <div className="bg-white p-6 rounded-2xl shadow-md flex flex-col w-full items-stretch flex-grow">
          <h2 className="text-2xl font-lora font-bold text-gray-800 mb-6">General Insights</h2>
          <textarea
            readOnly
            placeholder="(Output AI agent for general insights)"
            className="w-full min-h-[200px] md:min-h-[300px] lg:min-h-[400px] p-4 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Output AI agent for general insights"
          ></textarea>
        </div>

        {/* Container para os gráficos lado a lado */}
        <div className="flex flex-col md:flex-row gap-8 w-full justify-center items-stretch flex-grow"> 
          {/* NPS Dashs Card */}
          <div className="bg-white p-6 rounded-2xl shadow-md flex flex-col w-full md:w-1/2 flex-grow items-stretch"> {/* Container for Gauge */}
            <h2 className="text-2xl font-lora font-bold text-gray-800 mb-6">NPS Dashs</h2>
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
                {npsData && <Gauge value={npsData.nps} />}
              </div>
            )}
          </div>

          {/* NpsBars Card */}
          <div className="bg-white p-6 rounded-2xl shadow-md flex flex-col w-full md:w-1/2 items-stretch flex-grow"> {/* Container for NpsBars */}
            <h2 className="text-2xl font-lora font-bold text-gray-800 mb-6">Distribuição NPS</h2>
            {npsData && <NpsBars promoters={npsData.promoters} passives={npsData.passives} detractors={npsData.detractors} />}
          </div>
        </div>
      </div>
    </div>
  );
}
