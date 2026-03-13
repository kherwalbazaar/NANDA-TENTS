// Firebase Configuration

// Demo Mode - Set to false to use real Firebase
const USE_DEMO_MODE = false; // ✅ Firebase is now configured!

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDY0auYecn8RNAarzMeBf0qu2GgfRDzyr0",
  authDomain: "nanda-tent.firebaseapp.com",
  projectId: "nanda-tent",
  storageBucket: "nanda-tent.firebasestorage.app",
  messagingSenderId: "973471111652",
  appId: "1:973471111652:web:7eba8a7cd82e33e6028ff1",
  measurementId: "G-C2B6M5T0SK"
};

let auth, db, storage;

if (!USE_DEMO_MODE) {
  // Check if Firebase is properly configured
  console.log('🔍 Checking Firebase configuration...');
  console.log('API Key:', firebaseConfig.apiKey);
  console.log('USE_DEMO_MODE:', USE_DEMO_MODE);
  
  if (firebaseConfig.apiKey === "YOUR_API_KEY_HERE") {
    console.error('❌ Firebase not configured! Please update firebaseConfig.js with your actual credentials.');
    console.log('📖 Get your config from: Firebase Console > Project Settings > General > Your apps');
    
    // Fall back to demo mode
    alert('⚠️ Firebase not configured! Running in demo mode. Items will NOT be saved permanently.\n\nPlease configure Firebase in firebaseConfig.js file.');
  } else {
    // Check if Firebase SDK is loaded
    if (typeof firebase === 'undefined') {
      console.error('❌ Firebase SDK not loaded! Make sure Firebase SDK scripts are included in index.html');
      console.log('Falling back to demo mode...');
    } else {
      console.log('✅ Firebase SDK detected');
      // Initialize Firebase
      try {
        firebase.initializeApp(firebaseConfig);
        auth = firebase.auth();
        db = firebase.firestore();
        storage = firebase.storage();
        
        console.log('🔥 Firebase initialized successfully!');
        console.log('✅ Connected to project:', firebaseConfig.projectId);
        console.log('📊 Analytics enabled:', firebaseConfig.measurementId);
      } catch (error) {
        console.error('❌ Error initializing Firebase:', error);
      }
    }
  }
} else {
  console.log('⚠️ Running in DEMO MODE - Data will NOT be saved to Firebase');
}

// If Firebase is not initialized or in demo mode, use mock data
if (USE_DEMO_MODE || !db) {
  console.log('🎭 Using offline/demo mode with mock data');
  
  // Mock authentication
  auth = {
    signInAnonymously: async () => {
      return { user: { uid: 'admin-user', displayName: 'Admin User' } };
    },
    onAuthStateChanged: (callback) => {
      callback({ uid: 'admin-user', displayName: 'Admin User', email: 'admin@nandatent.com' });
      return () => {};
    },
    signOut: async () => {
      return true;
    }
  };

  // Mock database with in-memory storage
  const mockData = {
    items: [
      { id: '1', item_name: 'Plastic Chair', price: 25, unit: 'Piece', description: 'Comfortable plastic chair', created_at: new Date('2023-12-01') },
      { id: '2', item_name: 'Wooden Table', price: 150, unit: 'Piece', description: 'Durable wooden table', created_at: new Date('2023-12-01') },
      { id: '3', item_name: 'Tent Cloth (Large)', price: 800, unit: 'Set', description: 'Large wedding tent cloth', created_at: new Date('2023-12-01') }
    ],
    customers: [
      { id: '1', name: 'Rajesh Kumar', phone: '9876543210', address: '123 Main Street', village: 'Gandhi Nagar', email: 'rajesh@email.com', created_at: new Date('2023-12-01') }
    ],
    bookings: []
  };

  db = {
    collection: (name) => ({
      get: async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
        const data = mockData[name] || [];
        return {
          docs: data.map(item => ({ id: item.id, data: () => item }))
        };
      },
      add: async (newItem) => {
        await new Promise(resolve => setTimeout(resolve, 200));
        const id = 'demo-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
        const item = { ...newItem, id, created_at: new Date() };
        if (mockData[name]) {
          mockData[name].push(item);
        } else {
          mockData[name] = [item];
        }
        console.log('💾 Demo mode: Item added to temporary memory:', item);
        console.warn('⚠️ WARNING: This data will be lost on page refresh! Configure Firebase to save permanently.');
        return { id };
      },
      doc: (id) => ({
        get: async () => {
          await new Promise(resolve => setTimeout(resolve, 100));
          const item = (mockData[name] || []).find(i => i.id === id);
          return { exists: !!item, data: () => item };
        },
        update: async (updates) => {
          await new Promise(resolve => setTimeout(resolve, 200));
          const index = (mockData[name] || []).findIndex(i => i.id === id);
          if (index !== -1) {
            mockData[name][index] = { ...mockData[name][index], ...updates, updated_at: new Date() };
            console.log('✏️ Demo mode: Item updated:', mockData[name][index]);
          }
        },
        delete: async () => {
          await new Promise(resolve => setTimeout(resolve, 200));
          const index = (mockData[name] || []).findIndex(i => i.id === id);
          if (index !== -1) {
            mockData[name].splice(index, 1);
            console.log('🗑️ Demo mode: Item deleted');
          }
        }
      }),
      where: (field, operator, value) => {
        const filtered = (mockData[name] || []).filter(item => {
          if (operator === '==') return item[field] === value;
          if (operator === '>') return item[field] > value;
          if (operator === '<') return item[field] < value;
          return true;
        });
        return {
          get: async () => ({
            docs: filtered.map(item => ({ id: item.id, data: () => item }))
          })
        };
      },
      orderBy: (field, direction = 'asc') => {
        const sorted = [...(mockData[name] || [])].sort((a, b) => {
          if (direction === 'desc') return b[field] > a[field] ? 1 : -1;
          return a[field] > b[field] ? 1 : -1;
        });
        return {
          get: async () => ({
            docs: sorted.map(item => ({ id: item.id, data: () => item }))
          })
        };
      },
      limit: (count) => ({
        get: async () => {
          const limited = (mockData[name] || []).slice(0, count);
          return {
            docs: limited.map(item => ({ id: item.id, data: () => item }))
          };
        }
      }),
      onSnapshot: (callback) => {
        // Simulate realtime updates
        setTimeout(() => {
          callback({ docChanges: () => [{ type: 'added' }] });
        }, 1000);
        return () => {};
      }
    })
  };

  storage = {};
}

// Export for use in other modules
window.firebaseApp = { auth };
window.auth = auth;
window.db = db;
window.storage = storage;

// Show status notification
if (typeof Utils !== 'undefined') {
  setTimeout(() => {
    if (USE_DEMO_MODE || !firebase.apps?.length) {
      Utils.showToast('🎭 Demo Mode Active - Items NOT saved to Firebase', 'warning');
    } else {
      Utils.showToast('🔥 Firebase Connected - Items saving to cloud', 'success');
    }
  }, 1000);
}
