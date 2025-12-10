"use client";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AreaChart, BarChart, LineChart } from "lucide-react";
import { useState } from "react";

interface PandemicChartProps {
  pandemic: string;
  timeframe: string;
}

const api = axios.create({
  baseURL: "http://localhost:8081/api", // Replace with your actual API base URL
});

export const getPandemicChartData = async (
  pandemicId: string,
  timeframe: string
) => {
  const response = await api.get(
    `/pandemies/${pandemicId}/charts?timeframe=${timeframe}`
  );
  return response.data;
};

export function PandemicChart({ pandemic, timeframe }: PandemicChartProps) {
  const [loading] = useState(true);


  return (
    <div className="space-y-4">
      <Tabs defaultValue="cases">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="cases">Cas</TabsTrigger>
            <TabsTrigger value="deaths">Décès</TabsTrigger>
            <TabsTrigger value="transmission">Transmission</TabsTrigger>
            <TabsTrigger value="comparison">Comparaison</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-md hover:bg-muted">
              <LineChart className="h-5 w-5" />
            </button>
            <button className="p-2 rounded-md hover:bg-muted">
              <BarChart className="h-5 w-5" />
            </button>
            <button className="p-2 rounded-md hover:bg-muted">
              <AreaChart className="h-5 w-5" />
            </button>
          </div>
        </div>

        <TabsContent value="cases" className="mt-4">
          {loading ? (
            <div className="h-[400px] w-full flex items-center justify-center bg-muted/20 rounded-lg">
              <div className="animate-pulse">Chargement des données...</div>
            </div>
          ) : (
            <div className="h-[400px] w-full bg-muted/20 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <p className="text-muted-foreground">
                  Graphique des cas pour {pandemic}
                </p>
                <p className="text-xs text-muted-foreground">
                  Période: {timeframe}
                </p>
                <div className="mt-4 text-sm">
                  [Ici safficherait un graphique interactif montrant
                  lévolution des cas]
                </div>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="deaths" className="mt-4">
          {loading ? (
            <div className="h-[400px] w-full flex items-center justify-center bg-muted/20 rounded-lg">
              <div className="animate-pulse">Chargement des données...</div>
            </div>
          ) : (
            <div className="h-[400px] w-full bg-muted/20 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <p className="text-muted-foreground">
                  Graphique des décès pour {pandemic}
                </p>
                <p className="text-xs text-muted-foreground">
                  Période: {timeframe}
                </p>
                <div className="mt-4 text-sm">
                  [Ici safficherait un graphique interactif montrant
                  lévolution des décès]
                </div>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="transmission" className="mt-4">
          {loading ? (
            <div className="h-[400px] w-full flex items-center justify-center bg-muted/20 rounded-lg">
              <div className="animate-pulse">Chargement des données...</div>
            </div>
          ) : (
            <div className="h-[400px] w-full bg-muted/20 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <p className="text-muted-foreground">
                  Graphique du taux de transmission pour {pandemic}
                </p>
                <p className="text-xs text-muted-foreground">
                  Période: {timeframe}
                </p>
                <div className="mt-4 text-sm">
                  [Ici safficherait un graphique interactif montrant
                  lévolution du taux de transmission]
                </div>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="comparison" className="mt-4">
          {loading ? (
            <div className="h-[400px] w-full flex items-center justify-center bg-muted/20 rounded-lg">
              <div className="animate-pulse">Chargement des données...</div>
            </div>
          ) : (
            <div className="h-[400px] w-full bg-muted/20 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <p className="text-muted-foreground">
                  Comparaison avec dautres pandémies
                </p>
                <p className="text-xs text-muted-foreground">
                  Période: {timeframe}
                </p>
                <div className="mt-4 text-sm">
                  [Ici safficherait un graphique comparatif entre différentes
                  pandémies]
                </div>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Pic de cas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {pandemic === "covid19"
                ? "X"
                : pandemic === "spanish_flu"
                ? "X"
                : "X"}
            </div>
            <p className="text-xs text-muted-foreground">
              Atteint le{" "}
              {pandemic === "covid19"
                ? "15 Jan 2022"
                : pandemic === "spanish_flu"
                ? "Oct 1918"
                : "Mar 2003"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Durée du pic</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {pandemic === "covid19"
                ? "X"
                : pandemic === "spanish_flu"
                ? "8 semaines"
                : "4 semaines"}
            </div>
            <p className="text-xs text-muted-foreground">
              {pandemic === "covid19"
                ? "Plus long que la moyenne"
                : pandemic === "spanish_flu"
                ? "Très intense"
                : "Relativement court"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Taux de reproduction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {pandemic === "covid19"
                ? "X"
                : pandemic === "spanish_flu"
                ? "R0: 1.8"
                : "R0: 3.0"}
            </div>
            <p className="text-xs text-muted-foreground">
              {pandemic === "covid19"
                ? "Varie selon les variants"
                : pandemic === "spanish_flu"
                ? "Estimation historique"
                : "Très contagieux"}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}