import React from "react";
import { HeroSection } from "@/components/home/HeroSection";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { RoadsideQuickHelp } from "@/components/home/RoadsideQuickHelp";
import { RecommendedProviders } from "@/components/home/RecommendedProviders";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { AntiqueExpansionSection } from "@/components/home/AntiqueExpansionSection";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <CategoryGrid />
      <RoadsideQuickHelp />
      <RecommendedProviders />
      <HowItWorksSection />
      <AntiqueExpansionSection />
    </div>
  );
}
