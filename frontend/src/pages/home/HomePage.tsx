import { Hero } from "../../components/Hero.js";
import { About } from "../../components/About.js";
import { Skills } from "../../components/Skills.js";
import { Projects } from "../../components/Projects.js";
import { Experience } from "../../components/Experience.js";
import { SystemMonitor } from "../../components/SystemMonitor.js";
import { Contact } from "../../components/Contact.js";

const HomePage = () => {
  return (
    <div className="w-full flex flex-col">
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Experience />
      <SystemMonitor />
      <Contact />
    </div>
  );
};

export default HomePage;

