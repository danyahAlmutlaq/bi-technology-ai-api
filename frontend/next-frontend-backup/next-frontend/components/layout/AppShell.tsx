<AnimatedBackground />
import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import AnimatedBackground from "@/components/background/AnimatedBackground";

type AppShellProps = {
  children: ReactNode;
  titleAr: string;
  titleEn: string;
  subtitleAr?: string;
  subtitleEn?: string;
};

export default function AppShell({
  children,
  titleAr,
  titleEn,
  subtitleAr,
  subtitleEn,
}: AppShellProps) {
  return (
    <main className="app-shell">
      <div className="background-orb background-orb-one" />
      <div className="background-orb background-orb-two" />
      <div className="background-orb background-orb-three" />
      <div className="background-grid" />

      <Sidebar />

      <section className="app-main">
        <Topbar
          titleAr={titleAr}
          titleEn={titleEn}
          subtitleAr={subtitleAr}
          subtitleEn={subtitleEn}
        />

        <div className="app-page-content">{children}</div>
      </section>
    </main>
  );
}