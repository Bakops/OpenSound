import HeaderComponent from "@/components/layout/HeaderComponent";
import Link from "next/link";
import Hero from "@/components/ui/animated-hero";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarChart, LineChart, PieChart } from "lucide-react";

export default function Home() {
  return (
    <>
 <div className="flex flex-col min-h-screen">
      <HeaderComponent />
      <main className="flex-1">
        <section className=" bg-[#FFF] h-180 w-full py-12 md:py-24 lg:py-32 flex items-center justify-center">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <Hero />
              <div className="space-x-4">
                <Link href="/dashboard">
                  <span className="top-2 -left-1 relative flex size-3">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-linear-to-r from-red-500 to-purple-900 opacity-75"></span>
                    <span className="relative inline-flex size-3 rounded-full bg-linear-to-r from-red-500 to-purple-900"></span>
                  </span>
                  <Button className="cursor-pointer font-bold">
                    Explorer les données
                  </Button>
                </Link>
                <a
                  href="http://localhost:8081/swagger-ui/index.html"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    variant="outline"
                    className="cursor-pointer hover:text-transparent hover:bg-clip-text hover:bg-linear-to-r from-red-500 to-purple-900 font-bold"
                  >
                    Documentation API
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full flex justify-center py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">
                    Collecte de données
                  </CardTitle>
                  <BarChart className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Multisource</div>
                  <p className="text-xs text-muted-foreground">
                    Données provenant de bases de santé publiques, archives
                    hospitalières et publications scientifiques
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">
                    Nettoyage et analyse
                  </CardTitle>
                  <LineChart className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Standardisé</div>
                  <p className="text-xs text-muted-foreground">
                    Élimination des doublons, standardisation et assurance
                    qualité des données
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">
                    Visualisation
                  </CardTitle>
                  <PieChart className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Interactive</div>
                  <p className="text-xs text-muted-foreground">
                    Tableaux de bord interactifs avec filtres et indicateurs
                    clés
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full border-t px-4 md:px-6">
        <p className="text-xs text-muted-foreground">
          © 2025 EPIVIZ. Tous droits réservés.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Conditions dutilisation
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Politique de confidentialité
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Contact
          </Link>
        </nav>
      </footer>
    </div>
      
    </>
  );
}
