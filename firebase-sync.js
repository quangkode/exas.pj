/* ========== Firebase Sync — localStorage ↔ Firestore ========== */
const FIREBASE_CONFIG = {
    apiKey: "AIzaSyCSm4pv8E4FK8oteZVUga5ojiyLLvrkswI",
    authDomain: "exas-mrv.firebaseapp.com",
    projectId: "exas-mrv",
    storageBucket: "exas-mrv.firebasestorage.app",
    messagingSenderId: "206036299876",
    appId: "1:206036299876:web:abc94c990501aad1d86f71"
};

const MRV_SYNC_KEYS = ['mrv_farms', 'mrv_diaries', 'mrv_soc', 'mrv_drone', 'mrv_audit', 'mrv_iot'];

let _db = null;
let _syncEnabled = false;
window._originalSetItem = localStorage.setItem.bind(localStorage);

window.firebaseReady = (async function initFirebaseSync() {
    try {
        firebase.initializeApp(FIREBASE_CONFIG);
        _db = firebase.firestore();

        // Load tất cả data từ Firestore vào localStorage
        await Promise.all(MRV_SYNC_KEYS.map(async key => {
            try {
                const snap = await _db.collection('mrv_data').doc(key).get();
                if (snap.exists && snap.data().value) {
                    window._originalSetItem(key, snap.data().value);
                }
            } catch(e) {}
        }));

        // Intercept localStorage.setItem để tự động sync lên Firestore
        localStorage.setItem = function(key, value) {
            window._originalSetItem(key, value);
            if (_syncEnabled && MRV_SYNC_KEYS.includes(key) && _db) {
                _db.collection('mrv_data').doc(key)
                    .set({ value, updatedAt: new Date().toISOString() })
                    .catch(() => {});
            }
        };

        _syncEnabled = true;
        console.log('[Firebase] Sync đã bật');
    } catch(e) {
        console.warn('[Firebase] Không kết nối được, dùng localStorage:', e.message);
    }
})();
