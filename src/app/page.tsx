import { Header } from "@/components/Header";
import { Chart } from "@/components/Chart";
import { appConfig } from "@/lib/config";

export const dynamic = "force-dynamic";

export default function Home() {
  // Read locations from server-side config
  const locations = appConfig.locations;

  return (
    <main className="font-sans min-h-dvh bg-background text-foreground">
      <Header />
      <Chart locations={locations} />
    </main>
  );
}