import { useState } from "react";
import { LoadingScreen } from "../../components/LoadingScreen.js";
import { Hero } from "../../components/Hero.js";
import { About } from "../../components/About.js";
import { Skills } from "../../components/Skills.js";
import { Projects } from "../../components/Projects.js";
import { Experience } from "../../components/Experience.js";
import { Contact } from "../../components/Contact.js";

const HomePage = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      <div className={`w-full flex flex-col transition-opacity duration-700 ${isLoading ? "opacity-0" : "opacity-100"}`}>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Contact />
      </div>
    </>
  );
};

export default HomePage;
