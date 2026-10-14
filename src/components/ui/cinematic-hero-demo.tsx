import { CinematicHero } from "@/components/ui/cinematic-landing-hero";

export default function CinematicHeroDemo() {
  return (
    <div className="overflow-x-hidden w-[100%] min-h-screen">
      <CinematicHero 
        brandName="MintMate"
        tagline1="Track your spending,"
        tagline2="live stress-free."
        cardHeading="Budgeting, simplified."
        cardDescription={
          <>
            <span className="text-white font-semibold">MintMate</span> helps students 
            manage their allowance with smart budgets, precise tracking, and beautiful 
            financial insights.
          </>
        }
        metricValue={30}
        metricLabel="Days on Track"
        ctaHeading="Start budgeting smart."
        ctaDescription="Join students taking control of their finances with smart budgeting tools designed for you."
      />
    </div>
  );
}
