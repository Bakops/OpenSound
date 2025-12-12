import HeaderComponent from "@/components/layout/HeaderComponent";
import { Button } from "@/components/ui/button";

export default function Page404() {
  return (
    <>
      <HeaderComponent />
      <main className="grid min-h-full h-screen place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
        <div className="text-center">
          <p className="text-base font-semibold text-transparent bg-clip-text bg-linear-to-r from-red-500 to-purple-900">404</p>
          <h1 className="mt-4 text-5xl font-semibold tracking-tight text-balance text-[#6b6b6b] sm:text-7xl">
            Page introuvable
          </h1>
          <p className="mt-6 text-lg font-medium text-pretty text-[#6b6b6b] sm:text-xl/8">
            Désolé, nous navons pas trouvé la page que vous recherchez.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
                <Button
                    variant="outline"
                    className="cursor-pointer hover:text-transparent hover:bg-clip-text hover:bg-linear-to-r from-red-500 to-purple-900 font-bold"
                  >
                    Retour à l'accueil
                  </Button>
          </div>
        </div>
      </main>
    </>
  );
}