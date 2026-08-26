import Hero from "@/components/sections/Hero";
import OurClients from "@/components/sections/OurClients";
import Stats from "@/components/sections/Stats";
import About from "@/components/sections/About";
import Services from "@/components/sections/Services";
import Projects from "@/components/sections/Projects";
import Skills from "@/components/sections/Skills";
import Testimonials from "@/components/sections/Testimonials";
import CTA from "@/components/sections/FAQ";
import Blog from "@/components/sections/Blog";
import CustomCursor from "@/components/ui/CustomCursor";
import FAQ from "@/components/sections/FAQ";
import Gallery from "@/components/sections/Gallery";

export default function Home() {
  return (
    <>
      <CustomCursor />
      <main>
          <Hero />
          <OurClients />
          {/* <Stats /> */}
          <Services />
          {/* <Skills /> */}
          
          <Projects />
          <Testimonials />
          {/* <Gallery /> */}
          {/* <CTA /> */}
          <FAQ />
          
      </main>
    </>
  );
}