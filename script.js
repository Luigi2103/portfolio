"use strict";

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

// Funzione asincrona per il tracking
async function startTracking() {
    try {
        
        const { firebaseConfig } = await import('./config.js');
        
       
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);

       
        if (window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1") {
            await addDoc(collection(db, "visualizzazioni"), {
                orario: serverTimestamp(),
                userAgent: navigator.userAgent,
                piattaforma: navigator.platform,
                lingua: navigator.language
            });
            console.log("Tracking inviato con successo.");
        }
    } catch (err) {
        console.warn("Tracking saltato: file di configurazione non trovato.");
    }
}

const init = () => {
    // Avvia il tracking in background
    startTracking();

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

    fetchGitHubStats('Project-Bugboard26', 'stats-ingsw');
    fetchGitHubStats('LASD', 'stats-lasd');
    fetchGitHubStats('ProgettoGagliottiDifferente', 'stats-oo');
};

async function fetchGitHubStats(repoName, elementId) {
    const el = document.getElementById(elementId);
    if (!el) return;

    try {
        const response = await fetch(`https://api.github.com/repos/Luigi2103/${repoName}`);
        
        if (response.status === 403) {
            el.innerText = "Repository Pubblica";
            return;
        }

        if (!response.ok) throw new Error(`Errore HTTP: ${response.status}`);

        const data = await response.json();
        
        if (data.pushed_at) {
            const date = new Date(data.pushed_at).toLocaleDateString('it-IT');
            const stars = data.stargazers_count || 0;
            el.innerText = `Ultimo update: ${date} • ${stars} ⭐`;
        }

    } catch (e) {
        el.innerText = "Repository su GitHub";
    }
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
} else {
    init();
}