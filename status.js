import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyB9Hv0YOgxHe4Rz8KIefVa_IApcK0drCQg",
  authDomain: "victoria-fc-bf995.firebaseapp.com",
  projectId: "victoria-fc-bf995",
  storageBucket: "victoria-fc-bf995.firebasestorage.app",
  messagingSenderId: "608890063019",
  appId: "1:608890063019:web:56d54e9a5f9a35f07ecfee"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

window.checkStatus = async function () {

  const applicationId =
    document.getElementById("applicationId").value.trim().toUpperCase();

  const result =
    document.getElementById("result");

  if (!applicationId) {
    result.innerHTML = "<p>Please enter your Application ID.</p>";
    return;
  }

  result.innerHTML = "<p>Checking...</p>";

  try {

    const q = query(
      collection(db, "applications"),
      where("applicationId", "==", applicationId)
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      result.innerHTML = "<p>Application ID not found.</p>";
      return;
    }

    const data = snapshot.docs[0].data();

    const status = data.status || "Pending";
    const reason = data.reason || "Your application is under review.";

    result.innerHTML = `
      <h3>Status: ${status}</h3>
      <p><strong>Reason:</strong> ${reason}</p>
    `;

  } catch (error) {

    console.error(error);

    result.innerHTML =
      "<p>Unable to check status. Please try again.</p>";
  }
};