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

async function loadSquad() {

  const playersBox =
    document.getElementById("players");

  try {

    const q = query(
      collection(db, "applications"),
      where("inSquad", "==", true)
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {

      playersBox.innerHTML = `
        <div class="empty">
          No players have been added to the squad yet.
        </div>
      `;

      return;
    }

    playersBox.innerHTML = "";

    snapshot.forEach((doc) => {

      const player = doc.data();

      const card = document.createElement("div");

      card.className = "player";

      card.innerHTML = `
        <div class="name">
          ${player.name || "Player"}
        </div>

        <div class="info">
          Age: ${player.age || "N/A"}
        </div>

        <div class="position">
          ${player.positionAssigned || "Position not assigned"}
        </div>

        ${
          player.role === "Captain"
            ? `<div class="role">👑 CAPTAIN</div>`
            : ""
        }

        ${
          player.role === "Vice Captain"
            ? `<div class="role">VICE CAPTAIN</div>`
            : ""
        }
      `;

      playersBox.appendChild(card);

    });

  } catch (error) {

    console.error(error);

    playersBox.innerHTML = `
      <div class="empty">
        Unable to load squad.
      </div>
    `;
  }
}

loadSquad();