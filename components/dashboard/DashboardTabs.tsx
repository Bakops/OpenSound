
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Line, Bar } from "react-chartjs-2";
import type { ChartData, ChartOptions } from "chart.js";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { useEffect, useState } from "react";
import { getTopGenres, getTopDecades, getDurationPopularityCorrelation } from "@/service/etl";

// Register Bar chart elements for Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type Props = {
  chartData: ChartData<"line", number[], string>;
  chartOptions: ChartOptions<"line">;
  localisations: {
    id: string;
    name: string;
    [key: string]: unknown;
  }[];
  selectedLocalisation: string | null;
  handleLocationClick: (id: string) => void;
  timeline: {
    totalStreams?: number | null | undefined;
    totalArtists?: number | null | undefined;
    avgPopularity?: number | null | undefined;
    newReleases?: number | null | undefined;
    date?: string;
    dateValue?: string;
  }[];
  isLoading: boolean;
  etlDataset?: "high" | "low";
  topGenresData?: Record<string, number>;
  topDecadesData?: Record<number, number>;
};

export default function DashboardTabs({
  chartData,
  chartOptions,
  timeline,
  isLoading,
  etlDataset = "high",
  topGenresData: propsGenresData,
  topDecadesData: propsDecadesData,
}: Props) {
  const [topGenresData, setTopGenresData] = useState<Record<string, number>>(propsGenresData || {});
  const [topDecadesData, setTopDecadesData] = useState<Record<number, number>>(propsDecadesData || {});
  const [correlationData, setCorrelationData] = useState<number | null>(null);
  const [etlLoading, setEtlLoading] = useState(false);

  // Update local state when props change
  useEffect(() => {
    if (propsGenresData) setTopGenresData(propsGenresData);
    if (propsDecadesData) setTopDecadesData(propsDecadesData);
  }, [propsGenresData, propsDecadesData]);

  useEffect(() => {
    async function fetchETLData() {
      setEtlLoading(true);
      try {
        // Only fetch correlation, genres and decades data come from props
        const corrRes = await getDurationPopularityCorrelation(etlDataset);
        setCorrelationData(corrRes.correlation);
      } catch (error) {
        console.error("Erreur ETL:", error);
      } finally {
        setEtlLoading(false);
      }
    }
    fetchETLData();
  }, [etlDataset]);

  // Chart data pour top genres
  const genresChartData: ChartData<"bar"> = {
    labels: Object.keys(topGenresData),
    datasets: [
      {
        label: "Popularité moyenne",
        data: Object.values(topGenresData),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Chart data pour top décennies
  const decadesChartData: ChartData<"bar"> = {
    labels: Object.keys(topDecadesData).map(d => `${d}s`),
    datasets: [
      {
        label: "Popularité moyenne",
        data: Object.values(topDecadesData),
        backgroundColor: "rgba(255, 159, 64, 0.6)",
        borderColor: "rgba(255, 159, 64, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Options avec titre pour respecter le format Chart.js demandé
  const genresBarOptions: ChartOptions<"bar"> = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: "Évolution des tendances musicales - OpenSound Label",
      },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  const decadesBarOptions: ChartOptions<"bar"> = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: "Évolution des tendances musicales - OpenSound Label",
      },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  return (
    <Tabs defaultValue="top-genres">
      <TabsList>
        <TabsTrigger value="top-genres">Top Genres ETL</TabsTrigger>
        <TabsTrigger value="top-decades">Top Décennies ETL</TabsTrigger>
        <TabsTrigger value="correlation">Corrélation ETL</TabsTrigger>
      </TabsList>
      <TabsContent value="charts" className="border rounded-md p-4">
        <div className="w-full h-full">
          <Line data={chartData} options={chartOptions} />
        </div>
      </TabsContent>

      <TabsContent value="top-genres" className="border rounded-md p-4">
        <div className="w-full">
          {etlLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : Object.keys(topGenresData).length > 0 ? (
            <Bar data={genresChartData} options={genresBarOptions} />
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              Aucune donnée de genres disponible
            </div>
          )}
        </div>
      </TabsContent>

      <TabsContent value="top-decades" className="border rounded-md p-4">
        <div className="w-full">
          {etlLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : Object.keys(topDecadesData).length > 0 ? (
            <Bar data={decadesChartData} options={decadesBarOptions} />
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              Aucune donnée de décennies disponible
            </div>
          )}
        </div>
      </TabsContent>

      <TabsContent value="correlation" className="border rounded-md p-4">
        <div className="w-full">
          <h3 className="text-lg font-semibold mb-4">Corrélation Durée vs Popularité - Dataset {etlDataset === "high" ? "Haute" : "Faible"} Popularité</h3>
          {etlLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mb-4">
                <span className="text-6xl font-bold" style={{ color: correlationData && correlationData > 0 ? "#10b981" : "#ef4444" }}>
                  {correlationData?.toFixed(3) ?? "N/A"}
                </span>
              </div>
              <p className="text-lg text-gray-600 mb-2">Coefficient de corrélation de Pearson</p>
              <p className="text-sm text-gray-500">
                {correlationData && Math.abs(correlationData) < 0.3 
                  ? "Corrélation faible" 
                  : correlationData && Math.abs(correlationData) < 0.7 
                  ? "Corrélation modérée" 
                  : "Corrélation forte"}
              </p>
              <div className="mt-8 text-left max-w-2xl mx-auto">
                <h4 className="font-semibold mb-2">Interprétation :</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  <li>Valeur proche de 1 : corrélation positive forte (durée ↑ = popularité ↑)</li>
                  <li>Valeur proche de 0 : pas de corrélation linéaire</li>
                  <li>Valeur proche de -1 : corrélation négative forte (durée ↑ = popularité ↓)</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </TabsContent>

      <TabsContent value="timeline" className="border rounded-md p-4">
        {timeline && timeline.length > 0 ? (
          <div className="space-y-4">
            {timeline.map((item, index: number) => {
              const safeValue = (value: unknown) => {
                if (value === null || value === undefined) return 0;
                return isNaN(Number(value as number)) ? 0 : Number(value);
              };
              const total_streams = safeValue(item.totalStreams);
              const total_artists = safeValue(item.totalArtists);
              const avg_popularity = safeValue(item.avgPopularity);
              const new_releases = safeValue(item.newReleases);
              let formattedDate;
              try {
                const d = item.date ?? item.dateValue ?? "";
                formattedDate = d ? new Date(d).toLocaleDateString() : "Date invalide";
              } catch {
                formattedDate = "Date invalide";
              }
              return (
                <div key={index} className="border-b pb-2">
                  <h3 className="font-medium">{formattedDate}</h3>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div>
                      <span className="text-sm text-muted-foreground">Streams totaux:</span>
                      <span className="ml-2 font-medium">{total_streams.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Popularité:</span>
                      <span className="ml-2 font-medium">{avg_popularity.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Nouvelles sorties:</span>
                      <span className="ml-2 font-medium">{new_releases.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Artistes actifs:</span>
                      <span className="ml-2 font-medium">{total_artists.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            {isLoading
              ? "Chargement des données chronologiques..."
              : "Aucune donnée chronologique disponible"}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}