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


    /* CLEAR POSITIONS */

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
      CAM: [],

      LW: [],
      RW: [],

      ST: []

    };


    let captain = null;
    let viceCaptain = null;


    /* READ FIREBASE */

    snapshot.forEach(docSnap => {

      const player =
        docSnap.data();


      /* ONLY ACCEPTED + SQUAD */

      if(
        player.status !== "Accepted" ||
        player.inSquad !== true
      ){

        return;

      }


      const name =
        player.name || "Player";


      let position =
        (
          player.positionAssigned || ""
        )
        .trim()
        .toUpperCase();


      const role =
        player.role || "Player";


      /* =================================
         CONVERT ADMIN POSITION NAMES
      ================================= */

      const positionMap = {

        "GOALKEEPER": "GK",
        "GK": "GK",

        "LEFT BACK": "LB",
        "LEFT-BACK": "LB",
        "LB": "LB",

        "RIGHT BACK": "RB",
        "RIGHT-BACK": "RB",
        "RB": "RB",

        "CENTRE BACK": "CB",
        "CENTER BACK": "CB",
        "CENTRE-BACK": "CB",
        "CENTER-BACK": "CB",
        "CB": "CB",

        "DEFENSIVE MIDFIELDER": "CDM",
        "DEFENSIVE MID": "CDM",
        "CDM": "CDM",

        "CENTRAL MIDFIELDER": "CM",
        "CENTRAL MID": "CM",
        "CM": "CM",

        "ATTACKING MIDFIELDER": "CAM",
        "ATTACKING MID": "CAM",
        "CAM": "CAM",

        "LEFT WING": "LW",
        "LEFT WINGER": "LW",
        "LW": "LW",

        "RIGHT WING": "RW",
        "RIGHT WINGER": "RW",
        "RW": "RW",

        "STRIKER": "ST",
        "ST": "ST"

      };


      position =
        positionMap[position] || position;


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
            ${player.positionAssigned || "Position not set"}
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
       GK
    ========================= */

    if(gks.length >= 1){

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
       CAM
    ========================= */

    if(playersByPosition.CAM[0]){

      document.getElementById(
        "camName"
      ).textContent =
        playersByPosition.CAM[0];

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
       RW
    ========================= */

    if(playersByPosition.RW[0]){

      document.getElementById(
        "rwName"
      ).textContent =
        playersByPosition.RW[0];

    }


    /* =========================
       ST 1
    ========================= */

    if(playersByPosition.ST[0]){

      document.getElementById(
        "st1Name"
      ).textContent =
        playersByPosition.ST[0];

    }


    /* =========================
       ST 2
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
