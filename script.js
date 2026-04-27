"use strict";




const init = () => {
    const observerOptions = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
            }
        });
    }, observerOptions);

    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = "0";
        section.style.transform = "translateY(30px)";
        section.style.transition = "all 0.8s cubic-bezier(0.2, 1, 0.3, 1)";
        observer.observe(section);
    });

    fetchGitHubStats('Luigi2103', 'Project-Bugboard26', 'stats-ingsw');
    fetchGitHubStats('Luigi2103', 'LASD', 'stats-lasd');
    fetchGitHubStats('GDom3', 'ProgettoGagliottiDifferente', 'stats-oo');
    fetchGitHubStats('Luigi2103', 'Gemini-Game', 'stats-Gemini_Game');

};

function updateStatsUI(el, data) {
    if (data.pushed_at) {
        const date = new Date(data.pushed_at).toLocaleDateString('it-IT');
        const stars = data.stargazers_count || 0;
        el.innerText = `Ultimo update: ${date} • ${stars} ⭐`;
    }
}

async function fetchGitHubStats(owner, repoName, elementId) {
    const el = document.getElementById(elementId);
    if (!el) return;

    const cacheKey = `github_stats_${owner}_${repoName}`;
    const cacheTimeKey = `github_stats_time_${owner}_${repoName}`;
    const cachedData = localStorage.getItem(cacheKey);
    const cachedTime = localStorage.getItem(cacheTimeKey);

    if (cachedData && cachedTime && (Date.now() - cachedTime < 3600000)) {
        try {
            updateStatsUI(el, JSON.parse(cachedData));
            return;
        } catch (e) {
            console.warn("Errore parsing cache", e);
        }
    }

    try {
        const response = await fetch(`https://api.github.com/repos/${owner}/${repoName}`);

        if (response.status === 403) {
            if (cachedData) {
                updateStatsUI(el, JSON.parse(cachedData));
            } else {
                el.innerText = "Repository su GitHub";
            }
            return;
        }

        if (!response.ok) throw new Error(`Errore HTTP: ${response.status}`);

        const data = await response.json();

        localStorage.setItem(cacheKey, JSON.stringify(data));
        localStorage.setItem(cacheTimeKey, Date.now().toString());

        updateStatsUI(el, data);

    } catch (e) {
        if (cachedData) {
            try {
                updateStatsUI(el, JSON.parse(cachedData));
            } catch (err) { }
        } else {
            el.innerText = "Repository su GitHub";
        }
    }
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
} else {
    init();
}