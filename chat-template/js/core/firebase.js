import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-database.js";
import { getRemoteConfig, getValue, fetchAndActivate } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-remote-config.js";

// Initialize Firebase with minimal configuration (will be enhanced with Remote Config)
console.log('✅ Initializing Firebase with minimal configuration');

// Environment-based configuration
const getFirebaseConfig = () => {
    // SECURITY NOTE: 
    // - Firebase requires complete config for proper initialization
    // - These values are public and safe to expose in client-side code
    // - Sensitive data (Gemini API keys, etc.) are stored in Remote Config
    // - For production, consider using environment variables
    
    return {
    apiKey: "AIzaSyAv2EwUHRGGQU-6Y7tor001hfFf7AbbN3Q",
    authDomain: "aiensemble.firebaseapp.com",
    databaseURL: "https://aiensemble-default-rtdb.firebaseio.com",
    projectId: "aiensemble",
    storageBucket: "aiensemble.firebasestorage.app",
    messagingSenderId: "1003149548679",
    appId: "1:1003149548679:web:060bf22bce499f67922c22"
    };
};

const app = initializeApp(getFirebaseConfig());

// Initialize Firebase services
const auth = getAuth(app);
const database = getDatabase(app);

// Initialize Remote Config
const remoteConfig = getRemoteConfig(app);
remoteConfig.settings.minimumFetchIntervalMillis = 0; // Allow immediate fetch

// Load Firebase configuration from Remote Config (for validation)
async function loadFirebaseConfigFromRemoteConfig() {
    try {
        console.log('🔄 Loading Firebase configuration from Remote Config...');
        await fetchAndActivate(remoteConfig);
        
        const firebaseConfig = {
            apiKey: getValue(remoteConfig, "firebase_api_key").asString(),
            authDomain: getValue(remoteConfig, "firebase_auth_domain").asString(),
            databaseURL: getValue(remoteConfig, "firebase_database_url").asString(),
            projectId: getValue(remoteConfig, "firebase_project_id").asString(),
            storageBucket: getValue(remoteConfig, "firebase_storage_bucket").asString(),
            messagingSenderId: getValue(remoteConfig, "firebase_messaging_sender_id").asString(),
            appId: getValue(remoteConfig, "firebase_app_id").asString()
        };
        
        // Validate that all required values are present
        const requiredFields = ['apiKey', 'authDomain', 'databaseURL', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
        for (const field of requiredFields) {
            if (!firebaseConfig[field]) {
                throw new Error(`Firebase Remote Config missing required field: ${field}`);
            }
        }
        
        console.log('✅ Firebase configuration validated from Remote Config');
        console.log('🔍 Debug - Firebase config loaded:');
        console.log('🔍 API Key loaded:', firebaseConfig.apiKey.substring(0, 10) + '...');
        console.log('🔍 Project ID loaded:', firebaseConfig.projectId);
        console.log('🔍 Database URL loaded:', firebaseConfig.databaseURL);
        
        return firebaseConfig;
    } catch (error) {
        console.error('❌ Failed to load Firebase Remote Config:', error);
        console.error('❌ Using hardcoded Firebase configuration');
        return null;
    }
}

// Function to load configuration from Remote Config
async function loadConfigFromRemoteConfig() {
    try {
        console.log('🔄 Loading configuration from Firebase Remote Config...');
        await fetchAndActivate(remoteConfig);
        
        const config = {
            firebase: {
                apiKey: getValue(remoteConfig, "firebase_api_key").asString(),
                authDomain: getValue(remoteConfig, "firebase_auth_domain").asString(),
                databaseURL: getValue(remoteConfig, "firebase_database_url").asString(),
                projectId: getValue(remoteConfig, "firebase_project_id").asString(),
                storageBucket: getValue(remoteConfig, "firebase_storage_bucket").asString(),
                messagingSenderId: getValue(remoteConfig, "firebase_messaging_sender_id").asString(),
                appId: getValue(remoteConfig, "firebase_app_id").asString()
            },
            cerebras: {
                apiKey: getValue(remoteConfig, "cerebras_api_key").asString(),
                apiEndpoint: getValue(remoteConfig, "cerebras_api_endpoint").asString()
            }
        };
        
        console.log('✅ Configuration loaded from Remote Config');
        return config;
    } catch (error) {
        console.error('❌ Failed to load Remote Config:', error);
        throw error;
    }
}

// Validate Firebase config from Remote Config
loadFirebaseConfigFromRemoteConfig().then(firebaseConfig => {
    if (firebaseConfig) {
        console.log('✅ Firebase configuration validated successfully');
    } else {
        console.log('⚠️ Using hardcoded Firebase configuration');
    }
}).catch(error => {
    console.error('❌ Firebase validation failed:', error);
});

export { app, auth, database, remoteConfig, loadConfigFromRemoteConfig, loadFirebaseConfigFromRemoteConfig }; 