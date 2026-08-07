import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyB9Hv0YOgxHe4Rz8KIefVa_IApcK0drCQg",
  authDomain: "victoria-fc-bf995.firebaseapp.com",
  projectId: "victoria-fc-bf995",
  storageBucket: "victoria-fc-bf995.firebasestorage.app",
  messagingSenderId: "608890063019",
  appId: "1:608890063019:web:56d54e9a5f9a35f07ecfee"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

window.login = async function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert("Login Successful!");
    window.location.href = "admin.html";
  } catch (error) {
    alert(error.message);
  }
};