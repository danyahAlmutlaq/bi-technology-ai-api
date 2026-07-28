"use client";

import { Bell, Languages } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

type TopbarProps = {
  titleAr: string;
  titleEn: string;
  subtitleAr?: string;
  subtitleEn?: string;
};

export default function Topbar({
  titleAr,
  titleEn,
  subtitleAr,
  subtitleEn,
}: TopbarProps) {
  const { language, changeLanguage, t } = useLanguage();

  return (
    <header className="app-topbar">
      <div>
        <span className="topbar-eyebrow">
          {t("BI Technology Business OS", "BI Technology Business OS")}
        </span>

        <h1>{t(titleAr, titleEn)}</h1>

        {(subtitleAr || subtitleEn) && (
          <p>{t(subtitleAr || "", subtitleEn || "")}</p>
        )}
      </div>

      <div className="topbar-controls">
        <button
          className="language-switch"
          onClick={changeLanguage}
          type="button"
        >
          <Languages size={17} />
          {language === "ar" ? "English" : "العربية"}
        </button>

        <button className="topbar-icon-button" type="button">
          <Bell size={18} />
          <span />
        </button>

        <div className="topbar-profile">
          <div className="topbar-avatar">DA</div>

          <div>
            <strong>{t("دانية المطلق", "Danyah Almutlaq")}</strong>
            <span>{t("مدير النظام", "System Administrator")}</span>
          </div>
        </div>
      </div>
    </header>
  );
}