const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const USERNAME = 'Eybri'; // Extracted from social links

export async function getGithubData() {
    try {
        const headers = {
            Authorization: `token ${GITHUB_TOKEN}`,
            Accept: 'application/vnd.github.v3+json',
        };

        // Fetch Repositories
        const reposRes = await fetch(`https://api.github.com/users/${USERNAME}/repos?sort=updated&per_page=100`, { headers, next: { revalidate: 3600 } });
        const repos = await reposRes.json();

        if (!Array.isArray(repos)) {
            console.error('Failed to fetch repos:', repos);
            return { repos: [], skills: [] };
        }

        // Filter out forks and find top projects (can be based on stars/updated)
        const topRepos = repos
            .filter((repo: any) => !repo.fork)
            .sort((a: any, b: any) => b.stargazers_count - a.stargazers_count || new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());

        // Fetch Languages for languages per repo and skills
        const langMap: Record<string, number> = {};

        // Parallel fetch for languages of top repos
        const langPromises = topRepos.map(async (repo: any) => {
            const res = await fetch(repo.languages_url, { headers, next: { revalidate: 3600 } });
            return res.json();
        });

        const langData = await Promise.all(langPromises);

        // Map languages back to repos and build global langMap
        const reposWithLangs = topRepos.map((repo: any, index: number) => {
            const languages = Object.keys(langData[index]);
            const repoLangData = langData[index];
            const repoTotalBytes = Object.values(repoLangData).reduce((a, b) => (a as number) + (b as number), 0) as number;

            const languageStats = Object.entries(repoLangData).map(([name, bytes]) => ({
                name,
                percentage: repoTotalBytes > 0 ? Math.round(((bytes as number) / repoTotalBytes) * 100) : 0
            })).sort((a, b) => b.percentage - a.percentage);

            // Build global skill map
            Object.entries(repoLangData).forEach(([lang, bytes]) => {
                langMap[lang] = (langMap[lang] || 0) + (bytes as number);
            });

            return {
                ...repo,
                languages: languages,
                languageStats: languageStats
            };
        });

        // Convert to percentage-like levels for global skills
        const totalBytes = Object.values(langMap).reduce((a, b) => a + b, 0);
        const skills = Object.entries(langMap)
            .map(([name, bytes]) => ({
                name,
                level: Math.round((bytes / totalBytes) * 100),
                category: getCategoryForLang(name),
            }))
            .sort((a, b) => b.level - a.level);

        return { repos: reposWithLangs, skills };
    } catch (error) {
        console.error('Error fetching GitHub data:', error);
        return { repos: [], skills: [] };
    }
}

function getCategoryForLang(lang: string): string {
    const categories: Record<string, string> = {
        'TypeScript': 'Frontend Development',
        'JavaScript': 'Frontend Development',
        'HTML': 'Frontend Development',
        'CSS': 'Frontend Development',
        'SCSS': 'Frontend Development',
        'Vue': 'Frontend Development',
        'Python': 'Backend Development',
        'Go': 'Backend Development',
        'Java': 'Backend Development',
        'Ruby': 'Backend Development',
        'PHP': 'Backend Development',
        'C#': 'Backend Development',
        'C++': 'Backend Development',
        'Rust': 'Backend Development',
        'SQL': 'Database Management',
        'PLpgSQL': 'Database Management',
        'Shell': 'Tools & Technologies',
        'Dockerfile': 'Tools & Technologies',
        'Makefile': 'Tools & Technologies',
    };
    return categories[lang] || 'Other';
}
