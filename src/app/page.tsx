import { Header } from "@/components/Header";
import { Chart } from "@/components/Chart";

export default function Home() {
  return (
    <main className="font-sans min-h-dvh bg-background text-foreground">
      <Header />
      <Chart />
    </main>
  );
}