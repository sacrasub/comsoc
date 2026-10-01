// Configurações globais de conexão do Firebase (agenda-cft-01)
const FIREBASE_CONFIG = {
    apiKey: atob("QUl6YVN5Q19ZeTRaNl9HeFBoRW9TQTJ5QUhIQ3Q3VGgweG5vVDFR"),
    authDomain: "agenda-cft-01.firebaseapp.com",
    projectId: "agenda-cft-01",
    storageBucket: "agenda-cft-01.firebasestorage.app",
    messagingSenderId: "172645083425",
    appId: "1:172645083425:web:5c3bcabadf32c41cb27660",
    measurementId: "G-GMN9YMET7T"
};

let firebaseApp = null;
let firebaseDb = null;
let firebaseAuth = null;

try {
    if (typeof firebase !== 'undefined') {
        if (!firebase.apps || firebase.apps.length === 0) {
            firebaseApp = firebase.initializeApp(FIREBASE_CONFIG);
        } else {
            firebaseApp = firebase.app();
        }
        firebaseDb = firebaseApp.firestore();
        if (typeof firebase.auth === 'function') {
            firebaseAuth = firebaseApp.auth();
        }
        console.log("[Firebase] Inicializado com sucesso no projeto agenda-cft-01.");
    } else {
        console.error("SDK do Firebase não carregado no HTML.");
    }
} catch (e) {
    console.error("Erro ao inicializar Firebase:", e);
}
