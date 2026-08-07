import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


/* =========================
   FIREBASE CONFIG
========================= */

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


/* =========================
   7 DAY COOLDOWN
========================= */

const COOLDOWN =
  7 * 24 * 60 * 60 * 1000;

const STORAGE_KEY =
  "victoria_fc_last_application";


/* =========================
   APPLICATION ID
========================= */

function generateApplicationId() {

  const characters =
    "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

  let id = "VFC-";

  for (let i = 0; i < 6; i++) {

    id += characters.charAt(
      Math.floor(
        Math.random() *
        characters.length
      )
    );

  }

  return id;
}


/* =========================
   CHECK 7 DAY LIMIT
========================= */

function checkCooldown() {

  const lastApplication =
    localStorage.getItem(
      STORAGE_KEY
    );

  if (!lastApplication) {

    return {
      allowed: true
    };

  }


  const elapsed =
    Date.now() -
    Number(lastApplication);


  if (elapsed >= COOLDOWN) {

    localStorage.removeItem(
      STORAGE_KEY
    );

    return {
      allowed: true
    };

  }


  const remaining =
    COOLDOWN - elapsed;


  const days =
    Math.floor(
      remaining /
      (24 * 60 * 60 * 1000)
    );


  const hours =
    Math.floor(
      (remaining %
        (24 * 60 * 60 * 1000)) /
      (60 * 60 * 1000)
    );


  return {

    allowed: false,

    days: days,

    hours: hours

  };

}


/* =========================
   SUBMIT APPLICATION
========================= */

window.submitApplication =
async function () {


  /* CHECK 7 DAY LIMIT */

  const cooldown =
    checkCooldown();


  if (!cooldown.allowed) {

    alert(
      "You have already submitted an application.\n\n" +
      "You can apply again after " +
      cooldown.days +
      " days and " +
      cooldown.hours +
      " hours."
    );

    return;

  }


  /* =========================
     GET FORM VALUES
  ========================= */

  const name =
    document.getElementById(
      "name"
    ).value.trim();


  const age =
    document.getElementById(
      "age"
    ).value.trim();


  const location =
    document.getElementById(
      "location"
    ).value.trim();


  const position =
    document.getElementById(
      "position"
    ).value;


  const previousTeam =
    document.getElementById(
      "team"
    ).value.trim();


  const experience =
    document.getElementById(
      "experience"
    ).value.trim();


  const jerseySize =
    document.getElementById(
      "size"
    ).value;


  const jerseyNumber =
    document.getElementById(
      "number"
    ).value.trim();


  const phone =
    document.getElementById(
      "phone"
    ).value.trim();


  const instagram =
    document.getElementById(
      "instagram"
    ).value.trim();


  /* =========================
     VALIDATION
  ========================= */

  if (
    !name ||
    !age ||
    !location ||
    !position ||
    !previousTeam ||
    !experience ||
    !jerseySize ||
    !jerseyNumber ||
    !phone ||
    !instagram
  ) {

    alert(
      "Please fill in all fields before submitting."
    );

    return;

  }


  /* =========================
     GENERATE ID
  ========================= */

  const applicationId =
    generateApplicationId();


  /* =========================
     APPLICATION DATA
  ========================= */

  const application = {

    applicationId:

      applicationId,

    name:

      name,

    age:

      age,

    location:

      location,

    position:

      position,

    previousTeam:

      previousTeam,

    experience:

      experience,

    jerseySize:

      jerseySize,

    jerseyNumber:

      jerseyNumber,

    phone:

      phone,

    instagram:

      instagram,

    status:

      "Pending",

    reason:

      "",

    inSquad:

      false,

    positionAssigned:

      "",

    role:

      "Player",

    createdAt:

      serverTimestamp()

  };


  try {


    /* =========================
       SAVE TO FIREBASE
    ========================= */

    await addDoc(

      collection(
        db,
        "applications"
      ),

      application

    );


    /* =========================
       START 7 DAY COOLDOWN
    ========================= */

    localStorage.setItem(

      STORAGE_KEY,

      Date.now().toString()

    );


    /* =========================
       SHOW APPLICATION ID
    ========================= */

    const applicationIdBox =
      document.getElementById(
        "applicationId"
      );


    if (applicationIdBox) {

      applicationIdBox.textContent =
        applicationId;

    }


    const successBox =
      document.getElementById(
        "success"
      );


    if (successBox) {

      successBox.style.display =
        "block";

    }


    /* =========================
       DISABLE SUBMIT BUTTON
    ========================= */

    const submitButton =
      document.getElementById(
        "submitButton"
      );


    if (submitButton) {

      submitButton.disabled =
        true;

      submitButton.textContent =
        "Application Submitted";

    }


    /* =========================
       SCROLL TO APPLICATION ID
    ========================= */

    window.scrollTo({

      top:
        document.body.scrollHeight,

      behavior:
        "smooth"

    });


  }

  catch (error) {


    console.error(
      "Application Error:",
      error
    );


    alert(
      "Application submission failed. Please try again."
    );

  }

};


/* =========================
   FORM SUBMIT EVENT
========================= */

const form =
  document.getElementById(
    "applicationForm"
  );


if (form) {

  form.addEventListener(
    "submit",
    function(event) {

      event.preventDefault();

      /*
        HTML required validation
        runs before this event.
      */

      if (
        typeof form.checkValidity ===
        "function"
      ) {

        if (
          !form.checkValidity()
        ) {

          form.reportValidity();

          return;

        }

      }


      window.submitApplication();

    }
  );

}