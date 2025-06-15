import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { getFunctions, httpsCallable } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-functions.js";

// ✅ Your Firebase config — DO NOT wrap in <script> tags
const firebaseConfig = {
  apiKey: "AIzaSyBrlCFTo3LFXvbDgK_Q83b6Cvd7elEGfX4",
  authDomain: "commentreplys.firebaseapp.com",
  projectId: "commentreplys",
  storageBucket: "commentreplys.firebasestorage.app",
  messagingSenderId: "72668217502",
  appId: "1:72668217502:web:67074bbb574c0a00a17b8f"
};
// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const functions = getFunctions(app);

// 🔐 Sign In with Google
window.signIn = () => {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider).catch(console.error);
};

// 🔐 Sign Out
window.signOut = () => {
  signOut(auth);
};

// 💳 Start Stripe Subscription
window.startSubscription = async () => {
  const createCheckout = httpsCallable(functions, 'createCheckoutSession');
  const result = await createCheckout({ origin: window.location.origin });
  const stripe = Stripe("pk_live_51Ra3m8Le5mN8hyn8U7Ml7iJ1M4EqUASdvjprPgTkgGMYBxDhEqZ6bq5pohpvtYkG96iolHUFkq4nA9bhLpg5IJp000z2paHfHL"); // Replace this!
  stripe.redirectToCheckout({ sessionId: result.data.sessionId });
};

// 👤 Handle UI on Auth Change
onAuthStateChanged(auth, user => {
  const userSection = document.getElementById('user-section');
  const subscribeSection = document.getElementById('subscribe-section');
  const emailSpan = document.getElementById('user-email');

  if (user) {
    userSection.style.display = 'none';
    subscribeSection.style.display = 'block';
    emailSpan.textContent = user.email;
  } else {
    userSection.style.display = 'block';
    subscribeSection.style.display = 'none';
  }
});
