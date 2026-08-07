import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getFirestore,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


const firebaseConfig = {

  apiKey:
    "AIzaSyB9Hv0YOgxHe4Rz8KIefVa_IApcK0drCQg",

  authDomain:
    "victoria-fc-bf995.firebaseapp.com",

  projectId:
    "victoria-fc-bf995",

  storageBucket:
    "victoria-fc-bf995.firebasestorage.app",

  messagingSenderId:
    "608890063019",

  appId:
    "1:608890063019:web:56d54e9a5f9a35f07ecfee"

};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


async function loadSquad(){

  try{

    const snapshot =
      await getDocs(
        collection(db, "applications")
      );


    const playersBox =
      document.getElementById("players");

    playersBox.innerHTML = "";


    /* CLEAR OLD POSITIONS */

    const ids = [

      "gkName",

      "lbName",
      "cbName",
      "rbName",

      "cdmName",
      "cmName",

      "lwName",
      "camName",
      "rwName",

      "st1Name",
      "st2Name"

    ];


    ids.forEach(id => {

      const element =
        document.getElementById(id);

      if(element){
        element.textContent = "-";
      }

    });


    /* POSITION ARRAYS */

    const gks = [];

    const playersByPosition = {

      LB: [],
      CB: [],
      RB: [],

      CDM: [],
      CM: [],

      LW: [],
      CAM: [],
      RW: [],

      ST: []

    };


    let captain = null;
    let viceCaptain = null;


    /* READ FIREBASE */

    snapshot.forEach(docSnap => {

      const player =
        docSnap.data();


      /* ONLY ACCEPTED + SQUAD PLAYERS */

      if(
        player.status !== "Accepted" ||
        player.inSquad !== true
      ){

        return;

      }


      const name =
        player.name || "Player";


      const position =
        (
          player.positionAssigned || ""
        )
        .trim()
        .toUpperCase();


      const role =
        player.role || "Player";


      /* CAPTAIN */

      if(role === "Captain"){

        captain = player;

      }


      /* VICE CAPTAIN */

      if(role === "Vice Captain"){

        viceCaptain = player;

      }


      /* GK */

      if(position === "GK"){

        gks.push(name);

      }


      /* OTHER POSITIONS */

      if(
        playersByPosition[position]
      ){

        playersByPosition[position].push(name);

      }


      /* PLAYER LIST */

      playersBox.innerHTML += `

        <div class="list-player">

          <div class="list-name">
            ${name}
          </div>

          <div class="list-position">
            ${position || "Position not set"}
          </div>

        </div>

      `;

    });


    /* =========================
       CAPTAIN
    ========================= */

    if(captain){

      document.getElementById(
        "captainName"
      ).textContent =
        captain.name || "Not Selected";


      document.getElementById(
        "captainPosition"
      ).textContent =
        captain.positionAssigned || "-";

    }


    /* =========================
       VICE CAPTAIN
    ========================= */

    if(viceCaptain){

      document.getElementById(
        "viceName"
      ).textContent =
        viceCaptain.name || "Not Selected";


      document.getElementById(
        "vicePosition"
      ).textContent =
        viceCaptain.positionAssigned || "-";

    }


    /* =========================
       GOALKEEPER
       1 GK = ONE NAME
       2 GK = NAME / NAME
    ========================= */

    if(gks.length === 1){

      document.getElementById(
        "gkName"
      ).textContent =
        gks[0];

    }

    else if(gks.length >= 2){

      document.getElementById(
        "gkName"
      ).textContent =
        gks.slice(0, 2).join(" / ");

    }


    /* =========================
       LB
    ========================= */

    if(playersByPosition.LB[0]){

      document.getElementById(
        "lbName"
      ).textContent =
        playersByPosition.LB[0];

    }


    /* =========================
       CB
    ========================= */

    if(playersByPosition.CB[0]){

      document.getElementById(
        "cbName"
      ).textContent =
        playersByPosition.CB[0];

    }


    /* =========================
       RB
    ========================= */

    if(playersByPosition.RB[0]){

      document.getElementById(
        "rbName"
      ).textContent =
        playersByPosition.RB[0];

    }


    /* =========================
       CDM
    ========================= */

    if(playersByPosition.CDM[0]){

      document.getElementById(
        "cdmName"
      ).textContent =
        playersByPosition.CDM[0];

    }


    /* =========================
       CM
    ========================= */

    if(playersByPosition.CM[0]){

      document.getElementById(
        "cmName"
      ).textContent =
        playersByPosition.CM[0];

    }


    /* =========================
       LW
    ========================= */

    if(playersByPosition.LW[0]){

      document.getElementById(
        "lwName"
      ).textContent =
        playersByPosition.LW[0];

    }


    /* =========================
       CAM
    ========================= */

    if(playersByPosition.CAM[0]){

      document.getElementById(
        "camName"
      ).textContent =
        playersByPosition.CAM[0];

    }


    /* =========================
       RW
    ========================= */

    if(playersByPosition.RW[0]){

      document.getElementById(
        "rwName"
      ).textContent =
        playersByPosition.RW[0];

    }


    /* =========================
       STRIKER 1
    ========================= */

    if(playersByPosition.ST[0]){

      document.getElementById(
        "st1Name"
      ).textContent =
        playersByPosition.ST[0];

    }


    /* =========================
       STRIKER 2
    ========================= */

    if(playersByPosition.ST[1]){

      document.getElementById(
        "st2Name"
      ).textContent =
        playersByPosition.ST[1];

    }


    /* NO PLAYERS */

    if(
      playersBox.innerHTML.trim() === ""
    ){

      playersBox.innerHTML = `

        <div class="empty">
          No players in the squad yet.
        </div>

      `;

    }

  }

  catch(error){

    console.error(
      "Squad loading error:",
      error
    );


    document.getElementById(
      "players"
    ).innerHTML = `

      <div class="empty">
        Unable to load squad.
      </div>

    `;

  }

}


loadSquad();
