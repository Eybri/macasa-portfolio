import Header from "./components/Header";
import Hero from "./components/Hero";
import About from "./components/About";
import Projects from "./components/Projects";
import Footer from "./components/Footer";
import { getGithubData } from "./lib/github";
import TechStack from "./components/TechStack";

export default async function Home() {
  const { repos, skills } = await getGithubData();

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white selection:bg-blue-100 dark:selection:bg-blue-900">
      <Header />
      <main>
        <Hero />
        <About skills={skills} />
        <TechStack githubSkills={skills} />
        <Projects repos={repos} aggregateSkills={skills} />
      </main>
      <Footer />
    </div>
  );
}
