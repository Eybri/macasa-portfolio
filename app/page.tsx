import Header from "./components/Header";
import Hero from "./components/Hero";
import About from "./components/About";
import Projects from "./components/Projects";
import Footer from "./components/Footer";
import { getGithubData } from "./lib/github";
import TechStack from "./components/TechStack";
import Contact from "./components/Contact";

export default async function Home() {
  const { repos, skills } = await getGithubData();

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#FF8000]/30">
      <Header />
      <main>
        <Hero />
        <About skills={skills} />
        <TechStack githubSkills={skills} />
        <Projects repos={repos} aggregateSkills={skills} />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
