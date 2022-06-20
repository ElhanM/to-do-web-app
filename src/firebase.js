const firebaseConfig = {
  apiKey: "process.env.API_KEY",
  authDomain: "to-do-web-app-c9bcc.firebaseapp.com",
  projectId: "to-do-web-app-c9bcc",
  storageBucket: "to-do-web-app-c9bcc.appspot.com",
  messagingSenderId: "671982724554",
  appId: "1:671982724554:web:7036a5f4fdc1e51b419b33"
};

firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();