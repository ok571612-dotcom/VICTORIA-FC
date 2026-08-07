import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getFirestore,
  collection,
  getDocs,
  updateDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyB9Hv0YOgxHe4Rz8KIefVa_IApcK0drCQg",
  authDomain: "victoria-fc-bf995.firebaseapp.com",
  projectId: "victoria-fc-bf995",
  storageBucket: "victoria-fc-bf995.firebasestorage.app",
  messagingSenderId: "608890063019",
  appId: "1:608890063019:web:56d54e9a5f9a35f07ecfee",
  measurementId: "G-134SGSZ9TL"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const box =
  document.getElementById("applications");

const squadBox =
  document.getElementById("squadPlayers");


/* =========================
   LOAD APPLICATIONS
========================= */

async function loadApplications(){

  const snapshot =
    await getDocs(collection(db,"applications"));

  box.innerHTML = "";

  snapshot.forEach((data)=>{

    const player = data.data();
    const id = data.id;

    box.innerHTML += `

      <div class="card">

        <h3>${player.name || "Player"}</h3>

        <p>Age: ${player.age || "N/A"}</p>
        <p>Location: ${player.location || "N/A"}</p>
        <p>Position: ${player.position || "N/A"}</p>
        <p>Previous Team: ${player.previousTeam || "N/A"}</p>
        <p>Experience: ${player.experience || "N/A"}</p>
        <p>Jersey Size: ${player.jerseySize || "N/A"}</p>
        <p>Jersey Number: ${player.jerseyNumber || "N/A"}</p>

        <p>
          Status:
          <span class="status ${
            player.status === "Accepted"
              ? "approved"
              : player.status === "Rejected"
              ? "rejected"
              : "pending"
          }">
            ${player.status || "Pending"}
          </span>
        </p>

        <select id="reason-${id}">

          <option value="">
            Select Reason
          </option>

          <option>
            Welcome to Victoria FC! Your application has been approved.
          </option>

          <option>
            Selected for the squad. Congratulations!
          </option>

          <option>
            Your position matches our team requirements.
          </option>

          <option>
            Welcome to the Victoria FC family.
          </option>

          <option>
            Approved after team management review.
          </option>

          <option>
            Your playing style fits our team.
          </option>

          <option>
            Your experience meets our requirements.
          </option>

          <option>
            You are selected for upcoming matches.
          </option>

          <option>
            Your registration with Victoria FC is confirmed.
          </option>

          <option>
            Officially selected as a Victoria FC player.
          </option>

          <option>
            Position already filled.
          </option>

          <option>
            Team requirements are currently complete.
          </option>

          <option>
            Not enough experience for current squad.
          </option>

          <option>
            Profile does not match current requirements.
          </option>

          <option>
            Age criteria not suitable.
          </option>

          <option>
            Previous team experience required.
          </option>

          <option>
            Application details were incomplete.
          </option>

          <option>
            Selected players list is full.
          </option>

          <option>
            Need more improvement before selection.
          </option>

          <option>
            Other candidates were selected.
          </option>

        </select>

        <br>

        <button
          class="accept"
          onclick="updateStatus('${id}','Accepted')">
          Accept
        </button>

        <button
          class="reject"
          onclick="updateStatus('${id}','Rejected')">
          Reject
        </button>

      </div>

    `;

  });

}


/* =========================
   ACCEPT / REJECT
========================= */

window.updateStatus =
async function(id,status){

  const reason =
    document.getElementById(
      "reason-"+id
    ).value;

  if(!reason){

    alert(
      "Please select a reason first."
    );

    return;
  }

  await updateDoc(
    doc(db,"applications",id),
    {
      status:status,
      reason:reason
    }
  );

  alert("Updated Successfully");

  loadApplications();

  loadSquad();
};


/* =========================
   LOAD SQUAD MANAGEMENT
========================= */

async function loadSquad(){

  const snapshot =
    await getDocs(
      collection(db,"applications")
    );

  squadBox.innerHTML = "";

  let found = false;

  snapshot.forEach((data)=>{

    const player = data.data();
    const id = data.id;

    if(player.status !== "Accepted"){
      return;
    }

    found = true;

    squadBox.innerHTML += `

      <div class="card">

        <h3>${player.name || "Player"}</h3>

        <p>
          Age: ${player.age || "N/A"}
        </p>

        <p>
          Current Position:
          ${player.positionAssigned || "Not assigned"}
        </p>

        <p>
          Role:
          ${player.role || "Player"}
        </p>

        <select id="position-${id}">

          <option value="">
            Select Position
          </option>

          <option>GK</option>
          <option>Left Back</option>
          <option>Right Back</option>
          <option>Centre Back</option>
          <option>Defensive Midfielder</option>
          <option>Central Midfielder</option>
          <option>Attacking Midfielder</option>
          <option>Left Wing</option>
          <option>Right Wing</option>
          <option>Striker</option>

        </select>

        <select id="role-${id}">

          <option value="Player">
            Player
          </option>

          <option value="Captain">
            Captain
          </option>

          <option value="Vice Captain">
            Vice Captain
          </option>

        </select>

        <button
          class="squad"
          onclick="addToSquad('${id}')">

          Add / Update Squad

        </button>

        <button
          class="remove"
          onclick="removeFromSquad('${id}')">

          Remove From Squad

        </button>

      </div>

    `;

  });

  if(!found){

    squadBox.innerHTML = `
      <div class="card">
        No approved players yet.
      </div>
    `;
  }

}


/* =========================
   ADD / UPDATE SQUAD
========================= */

window.addToSquad =
async function(id){

  const position =
    document.getElementById(
      "position-"+id
    ).value;

  const role =
    document.getElementById(
      "role-"+id
    ).value;

  if(!position){

    alert(
      "Please select a position."
    );

    return;
  }

  /*
    If Captain is selected,
    remove Captain role from
    all other players.
  */

  if(role === "Captain"){

    const snapshot =
      await getDocs(
        collection(db,"applications")
      );

    for(const item of snapshot.docs){

      const player =
        item.data();

      if(player.role === "Captain"){

        await updateDoc(
          doc(
            db,
            "applications",
            item.id
          ),
          {
            role:"Player"
          }
        );

      }

    }

  }


  /*
    If Vice Captain is selected,
    remove Vice Captain role
    from all other players.
  */

  if(role === "Vice Captain"){

    const snapshot =
      await getDocs(
        collection(db,"applications")
      );

    for(const item of snapshot.docs){

      const player =
        item.data();

      if(player.role === "Vice Captain"){

        await updateDoc(
          doc(
            db,
            "applications",
            item.id
          ),
          {
            role:"Player"
          }
        );

      }

    }

  }


  await updateDoc(
    doc(db,"applications",id),
    {
      inSquad:true,
      positionAssigned:position,
      role:role
    }
  );

  alert(
    "Squad updated successfully!"
  );

  loadSquad();

};


/* =========================
   REMOVE FROM SQUAD
========================= */

window.removeFromSquad =
async function(id){

  await updateDoc(
    doc(db,"applications",id),
    {
      inSquad:false,
      positionAssigned:"",
      role:"Player"
    }
  );

  alert(
    "Player removed from squad."
  );

  loadSquad();

};


/* =========================
   START
========================= */

loadApplications();

loadSquad();