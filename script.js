import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    query,
    where,
    serverTimestamp
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


const form =
    document.getElementById("applicationForm");

const button =
    document.getElementById("submitButton");

const success =
    document.getElementById("success");


form.addEventListener("submit", async function(event){

    event.preventDefault();


    const name =
        document.getElementById("name").value.trim();

    const age =
        document.getElementById("age").value.trim();

    const location =
        document.getElementById("location").value.trim();

    const position =
        document.getElementById("position").value.trim();

    const previousTeam =
        document.getElementById("team").value.trim();

    const experience =
        document.getElementById("experience").value.trim();

    const jerseySize =
        document.getElementById("size").value.trim();

    const jerseyNumber =
        document.getElementById("number").value.trim();

    const phone =
        document.getElementById("phone").value.trim();


    let instagram =
        document.getElementById("instagram").value.trim();


    /*
    ==========================================
    NORMALIZE INSTAGRAM ID
    ==========================================
    */

    instagram =
        instagram
        .replace(/^@/, "")
        .trim()
        .toLowerCase();


    if(!instagram){

        alert(
            "Please enter your Instagram ID."
        );

        return;
    }


    /*
    ==========================================
    DISABLE BUTTON
    ==========================================
    */

    button.disabled = true;

    button.textContent =
        "CHECKING...";


    try{


        /*
        ==========================================
        CHECK 7-DAY COOLDOWN
        ==========================================
        */

        const applicationsRef =
            collection(
                db,
                "applications"
            );


        const instagramQuery =
            query(
                applicationsRef,
                where(
                    "instagram",
                    "==",
                    instagram
                )
            );


        const existingApplications =
            await getDocs(
                instagramQuery
            );


        const currentTime =
            Date.now();


        const sevenDays =
            7 * 24 * 60 * 60 * 1000;


        let cooldownActive = false;


        existingApplications.forEach(
            (doc) => {

                const data =
                    doc.data();


                if(
                    data.createdAt &&
                    data.createdAt.toMillis
                ){

                    const createdTime =
                        data.createdAt.toMillis();


                    if(
                        currentTime -
                        createdTime <
                        sevenDays
                    ){

                        cooldownActive = true;

                    }

                }

            }
        );


        if(cooldownActive){

            alert(
                "You have already applied. You can apply again after 7 days."
            );


            button.disabled = false;

            button.textContent =
                "Submit Application";


            return;
        }


        /*
        ==========================================
        SAVE APPLICATION
        ==========================================
        */

        button.textContent =
            "SUBMITTING...";


        await addDoc(
            applicationsRef,
            {

                name: name,

                age: age,

                location: location,

                position: position,

                previousTeam: previousTeam,

                experience: experience,

                jerseySize: jerseySize,

                jerseyNumber: jerseyNumber,

                phone: phone,

                instagram: instagram,

                status: "Pending",

                reason: "",

                inSquad: false,

                positionAssigned: "",

                role: "Player",

                createdAt:
                    serverTimestamp()

            }
        );


        /*
        ==========================================
        SUCCESS
        ==========================================
        */

        form.style.display =
            "none";


        success.style.display =
            "block";


    }
    catch(error){

        console.error(
            "Application Error:",
            error
        );


        alert(
            "Something went wrong. Please try again."
        );


        button.disabled = false;

        button.textContent =
            "Submit Application";

    }

});
