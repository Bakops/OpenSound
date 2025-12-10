"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from "axios";
import { Search } from "lucide-react";
import { useState } from "react";

interface PandemicStatsProps {
  pandemic: string;
  timeframe: string;
}

const api = axios.create({
  baseURL: "http://localhost:8081/api",
});

export const getPandemicStats = async (pandemicId: string) => {
  const response = await api.get(`/pandemies/${pandemicId}/stats`);
  return response.data;
};

export function PandemicStats({ pandemic }: PandemicStatsProps) {
  const [loading ] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  

  const stats = [
    {
      region: "Monde",
      cases:
        pandemic === "covid19"
          ? "768M"
          : pandemic === "spanish_flu"
            ? "500M"
            : pandemic === "black_death"
              ? "75M"
              : "8K",
      deaths:
        pandemic === "covid19"
          ? "6.9M"
          : pandemic === "spanish_flu"
            ? "50M"
            : pandemic === "black_death"
              ? "25M"
              : "774",
      mortality:
        pandemic === "covid19"
          ? "0.9%"
          : pandemic === "spanish_flu"
            ? "10%"
            : pandemic === "black_death"
              ? "33%"
              : "9.6%",
      duration:
        pandemic === "covid19"
          ? "3+ ans"
          : pandemic === "spanish_flu"
            ? "2 ans"
            : pandemic === "black_death"
              ? "7 ans"
              : "8 mois",
    },
    {
      region: "Europe",
      cases:
        pandemic === "covid19"
          ? "240M"
          : pandemic === "spanish_flu"
            ? "125M"
            : pandemic === "black_death"
              ? "50M"
              : "2K",
      deaths:
        pandemic === "covid19"
          ? "2.1M"
          : pandemic === "spanish_flu"
            ? "12.5M"
            : pandemic === "black_death"
              ? "20M"
              : "200",
      mortality:
        pandemic === "covid19"
          ? "0.9%"
          : pandemic === "spanish_flu"
            ? "10%"
            : pandemic === "black_death"
              ? "40%"
              : "10%",
      duration:
        pandemic === "covid19"
          ? "3+ ans"
          : pandemic === "spanish_flu"
            ? "2 ans"
            : pandemic === "black_death"
              ? "4 ans"
              : "6 mois",
    },
    {
      region: "Asie",
      cases:
        pandemic === "covid19"
          ? "300M"
          : pandemic === "spanish_flu"
            ? "200M"
            : pandemic === "black_death"
              ? "15M"
              : "5K",
      deaths:
        pandemic === "covid19"
          ? "2.7M"
          : pandemic === "spanish_flu"
            ? "20M"
            : pandemic === "black_death"
              ? "5M"
              : "500",
      mortality:
        pandemic === "covid19"
          ? "0.9%"
          : pandemic === "spanish_flu"
            ? "10%"
            : pandemic === "black_death"
              ? "33%"
              : "10%",
      duration:
        pandemic === "covid19"
          ? "3+ ans"
          : pandemic === "spanish_flu"
            ? "2 ans"
            : pandemic === "black_death"
              ? "5 ans"
              : "8 mois",
    },
    {
      region: "Amériques",
      cases:
        pandemic === "covid19"
          ? "190M"
          : pandemic === "spanish_flu"
            ? "150M"
            : pandemic === "black_death"
              ? "0"
              : "300",
      deaths:
        pandemic === "covid19"
          ? "1.7M"
          : pandemic === "spanish_flu"
            ? "15M"
            : pandemic === "black_death"
              ? "0"
              : "30",
      mortality:
        pandemic === "covid19"
          ? "0.9%"
          : pandemic === "spanish_flu"
            ? "10%"
            : pandemic === "black_death"
              ? "0%"
              : "10%",
      duration:
        pandemic === "covid19"
          ? "3+ ans"
          : pandemic === "spanish_flu"
            ? "2 ans"
            : pandemic === "black_death"
              ? "0"
              : "4 mois",
    },
    {
      region: "Afrique",
      cases:
        pandemic === "covid19"
          ? "25M"
          : pandemic === "spanish_flu"
            ? "15M"
            : pandemic === "black_death"
              ? "10M"
              : "100",
      deaths:
        pandemic === "covid19"
          ? "225K"
          : pandemic === "spanish_flu"
            ? "1.5M"
            : pandemic === "black_death"
              ? "3M"
              : "10",
      mortality:
        pandemic === "covid19"
          ? "0.9%"
          : pandemic === "spanish_flu"
            ? "10%"
            : pandemic === "black_death"
              ? "30%"
              : "10%",
      duration:
        pandemic === "covid19"
          ? "3+ ans"
          : pandemic === "spanish_flu"
            ? "2 ans"
            : pandemic === "black_death"
              ? "3 ans"
              : "2 mois",
    },
    {
      region: "Océanie",
      cases:
        pandemic === "covid19"
          ? "13M"
          : pandemic === "spanish_flu"
            ? "10M"
            : pandemic === "black_death"
              ? "0"
              : "0",
      deaths:
        pandemic === "covid19"
          ? "117K"
          : pandemic === "spanish_flu"
            ? "1M"
            : pandemic === "black_death"
              ? "0"
              : "0",
      mortality:
        pandemic === "covid19"
          ? "0.9%"
          : pandemic === "spanish_flu"
            ? "10%"
            : pandemic === "black_death"
              ? "0%"
              : "0%",
      duration:
        pandemic === "covid19"
          ? "3+ ans"
          : pandemic === "spanish_flu"
            ? "1.5 ans"
            : pandemic === "black_death"
              ? "0"
              : "0",
    },
  ];

  const filteredStats = stats.filter((stat) =>
    stat.region.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Rechercher par région..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline">Exporter CSV</Button>
      </div>

      {loading ? (
        <div className="h-[400px] w-full flex items-center justify-center bg-muted/20 rounded-lg">
          <div className="animate-pulse">Chargement des statistiques...</div>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Région</TableHead>
                <TableHead className="text-right">Cas</TableHead>
                <TableHead className="text-right">Décès</TableHead>
                <TableHead className="text-right">Taux de mortalité</TableHead>
                <TableHead className="text-right">Durée</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStats.map((stat) => (
                <TableRow key={stat.region}>
                  <TableCell className="font-medium">{stat.region}</TableCell>
                  <TableCell className="text-right">{stat.cases}</TableCell>
                  <TableCell className="text-right">{stat.deaths}</TableCell>
                  <TableCell className="text-right">{stat.mortality}</TableCell>
                  <TableCell className="text-right">{stat.duration}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Facteurs de risque</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1 text-sm">
              {pandemic === "covid19" ? (
                <>
                  <li>• Âge avancé (65+ ans)</li>
                  <li>• Maladies cardiovasculaires</li>
                  <li>• Diabète</li>
                  <li>• Maladies respiratoires chroniques</li>
                  <li>• Immunodépression</li>
                </>
              ) : pandemic === "spanish_flu" ? (
                <>
                  <li>• Jeunes adultes (20-40 ans)</li>
                  <li>• Conditions de vie surpeuplées</li>
                  <li>• Malnutrition</li>
                  <li>• Conditions sanitaires médiocres</li>
                  <li>• Infections bactériennes secondaires</li>
                </>
              ) : pandemic === "black_death" ? (
                <>
                  <li>• Proximité avec les rongeurs</li>
                  <li>• Conditions sanitaires médiocres</li>
                  <li>• Densité de population urbaine</li>
                  <li>• Malnutrition</li>
                  <li>• Absence de quarantaine</li>
                </>
              ) : (
                <>
                  <li>• Contact avec des animaux infectés</li>
                  <li>• Exposition à des fluides corporels</li>
                  <li>• Conditions sanitaires médiocres</li>
                  <li>• Absence déquipement de protection</li>
                  <li>• Retard dans lidentification des cas</li>
                </>
              )}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">
              Mesures de contrôle efficaces
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1 text-sm">
              {pandemic === "covid19" ? (
                <>
                  <li>• Vaccination</li>
                  <li>• Distanciation sociale</li>
                  <li>• Port du masque</li>
                  <li>• Confinements</li>
                  <li>• Traçage des contacts</li>
                </>
              ) : pandemic === "spanish_flu" ? (
                <>
                  <li>• Fermeture des lieux publics</li>
                  <li>• Interdiction des rassemblements</li>
                  <li>• Port du masque</li>
                  <li>• Quarantaine</li>
                  <li>• Amélioration de lhygiène</li>
                </>
              ) : pandemic === "black_death" ? (
                <>
                  <li>• Quarantaine (40 jours)</li>
                  <li>• Isolement des malades</li>
                  <li>• Contrôle des ports</li>
                  <li>• Incinération des corps</li>
                  <li>• Abandon des zones touchées</li>
                </>
              ) : (
                <>
                  <li>• Isolement des patients</li>
                  <li>• Équipement de protection</li>
                  <li>• Traçage des contacts</li>
                  <li>• Contrôle des animaux</li>
                  <li>• Surveillance internationale</li>
                </>
              )}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}