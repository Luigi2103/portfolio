"use strict";

// Funzione principale che inizializza tutto
const init = () => {
    console.log("DOM caricato, avvio script...");

    // 1. Gestione Animazioni Scroll
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

    // 2. Avvio Fetch Statistiche GitHub
    // Sostituisci i nomi delle repo se differiscono da quelli su GitHub
    fetchGitHubStats('Project-Bugboard26', 'stats-ingsw');
    fetchGitHubStats('LASD', 'stats-lasd');
    fetchGitHubStats('ProgettoGagliottiDifferente', 'stats-oo');
};

// Funzione asincrona per recuperare i dati da GitHub
async function fetchGitHubStats(repoName, elementId) {
    const el = document.getElementById(elementId);
    if (!el) {
        console.error(`Elemento con ID ${elementId} non trovato nel DOM.`);
        return;
    }

    try {
        console.log(`Richiesta dati per: ${repoName}...`);
        const response = await fetch(`https://api.github.com/repos/Luigi2103/${repoName}`);
        
        // Gestione Rate Limit (Errore 403)
        if (response.status === 403) {
            console.warn(`Rate limit raggiunto per ${repoName}.`);
            el.innerText = "Repository Pubblica";
            return;
        }

        if (!response.ok) {
            throw new Error(`Errore HTTP: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.pushed_at) {
            const date = new Date(data.pushed_at).toLocaleDateString('it-IT');
            const stars = data.stargazers_count || 0;
            el.innerText = `Ultimo update: ${date} • ${stars} ⭐`;
            console.log(`Dati caricati per ${repoName}`);
        }

    } catch (e) {
        console.error(`Errore nel fetch di ${repoName}:`, e);
        el.innerText = "Repository su GitHub";
    }
}

// Usiamo sia DOMContentLoaded che un fallback per essere sicuri al 100%
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
} else {
    init();
}