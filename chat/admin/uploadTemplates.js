import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getDatabase, ref, set, remove } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-database.js";

// Initialize Firebase with config
const firebaseConfig = {
    apiKey: "AIzaSyAv2EwUHRGGQU-6Y7tor001hfFf7AbbN3Q",
    authDomain: "aiensemble.firebaseapp.com",
    databaseURL: "https://aiensemble-default-rtdb.firebaseio.com",
    projectId: "aiensemble",
    storageBucket: "aiensemble.firebasestorage.app",
    messagingSenderId: "1003149548679",
    appId: "1:1003149548679:web:060bf22bce499f67922c22"
};

// Initialize Firebase
initializeApp(firebaseConfig);

// Function to show status messages
function showStatus(message, isError = false) {
    const statusDiv = document.getElementById('status');
    statusDiv.textContent = message;
    statusDiv.className = isError ? 'error' : 'success';
}

// Function to clear existing templates
async function clearTemplates() {
    try {
        const db = getDatabase();
        await remove(ref(db, 'templates'));
        showStatus('Successfully cleared all templates');
        return true;
    } catch (error) {
        console.error('Error clearing templates:', error);
        showStatus('Error clearing templates: ' + error.message, true);
        return false;
    }
}

// Function to load and upload templates
async function uploadTemplates() {
    try {
        const db = getDatabase();
        let uploadedCount = 0;
        
        // Load and upload templates 1 through 10
        for (let i = 1; i <= 10; i++) {
            try {
                const response = await fetch(`../templates/template${i}.json`);
                if (!response.ok) {
                    console.warn(`Template ${i} not found or error loading`);
                    continue;
                }
                const templateData = await response.json();
                
                // Upload to Firebase under templates/templateN
                await set(ref(db, `templates/template${i}/data`), {
                    keywords: templateData.keywords || [],
                    title: templateData.title || [`Template ${i}`],
                    description: templateData.description || [],
                    icon: templateData.icon || "📄",
                    questions: templateData.questions || []
                });
                
                uploadedCount++;
                showStatus(`Successfully uploaded ${uploadedCount} templates...`);
                console.log(`Successfully uploaded template${i}`);
            } catch (error) {
                console.error(`Error uploading template${i}:`, error);
                showStatus(`Error uploading template ${i}: ${error.message}`, true);
            }
        }
        showStatus(`Template upload completed. Successfully uploaded ${uploadedCount} templates.`);
    } catch (error) {
        console.error('Error in upload process:', error);
        showStatus('Error in upload process: ' + error.message, true);
    }
}

// Add event listeners when the document is loaded
document.addEventListener('DOMContentLoaded', () => {
    const uploadButton = document.getElementById('uploadButton');
    const clearButton = document.getElementById('clearButton');
    
    uploadButton.addEventListener('click', async () => {
        uploadButton.disabled = true;
        try {
            await uploadTemplates();
        } finally {
            uploadButton.disabled = false;
        }
    });
    
    clearButton.addEventListener('click', async () => {
        if (confirm('Are you sure you want to clear all existing templates? This cannot be undone.')) {
            clearButton.disabled = true;
            try {
                await clearTemplates();
            } finally {
                clearButton.disabled = false;
            }
        }
    });
});
