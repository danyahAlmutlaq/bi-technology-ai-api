"use client";

import { Construction, Sparkles } from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import { useLanguage } from "@/context/LanguageContext";

type ModulePlaceholderProps = {
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
};

export default function ModulePlaceholder({
  titleAr,
  titleEn,
  descriptionAr,
  descriptionEn,
}: ModulePlaceholderProps) {
  const { t } = useLanguage();

  return (
    <AppShell
      titleAr={titleAr}
      titleEn={titleEn}
      subtitleAr={descriptionAr}
      subtitleEn={descriptionEn}
    >
      <section className="module-placeholder">
        <div className="module-placeholder-icon">
          <Construction size={31} />
        </div>

        <span>
          <Sparkles size={14} />
          {t("الوحدة متصلة بالتنقل", "Module navigation is active")}
        </span>

        <h2>{t(titleAr, titleEn)}</h2>

        <p>
          {t(
            "الصفحة تعمل الآن وسنربط بياناتها الحقيقية بالباك إند في الخطوة التالية.",
            "This page is now active. Its real data will be connected to the backend in the next step."
          )}
        </p>
      </section>
    </AppShell>
  );
}