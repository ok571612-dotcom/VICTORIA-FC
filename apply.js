import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getFirestore,
    collection,
    addDoc,
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


/* FIND FORM */

const form =
    document.querySelector("form");


if(form){

    form.addEventListener(
        "submit",
        submitApplication
    );

}


/* SUBMIT APPLICATION */

async function submitApplication(event){

    event.preventDefault();


    const getValue = (...ids) => {

        for(const id of ids){

            const element =
                document.getElementById(id);

            if(element){

                return element.value.trim();

            }

        }

        return "";

    };


    const name =
        getValue(
            "name",
            "fullName",
            "playerName"
        );


    const age =
        getValue("age");


    const location =
        getValue("location");


    const instagram =
        getValue(
            "instagram",
            "instagramUsername",
            "instagramId"
        );


    const position =
        getValue("position");


    const previousTeam =
        getValue(
            "previousTeam",
            "previous-team"
        );


    const experience =
        getValue("experience");


    const jerseySize =
        getValue(
            "jerseySize",
            "jersey-size"
        );


    const jerseyNumber =
        getValue(
            "jerseyNumber",
            "jersey-number"
        );


    /* REQUIRED */

    if(
        !name ||
        !age ||
        !instagram ||
        !position
    ){

        alert(
            "Please fill in all required fields."
        );

        return;

    }


    /* BUTTON */

    const button =
        form.querySelector(
            'button[type="submit"], button'
        );


    if(button){

        button.disabled = true;

        button.textContent =
            "SUBMITTING...";

    }


    try{

        await addDoc(
            collection(
                db,
                "applications"
            ),
            {

                name:name,

                age:age,

                location:location,

                instagram:instagram,

                position:position,

                previousTeam:previousTeam,

                experience:experience,

                jerseySize:jerseySize,

                jerseyNumber:jerseyNumber,

                status:"Pending",

                reason:"",

                inSquad:false,

                positionAssigned:"",

                role:"Player",

                createdAt:
                    serverTimestamp()

            }
        );


        alert(
            "Application submitted successfully!"
        );


        form.reset();


    }
    catch(error){

        console.error(
            "Application error:",
            error
        );


        alert(
            "Application could not be submitted. Please try again."
        );


    }
    finally{

        if(button){

            button.disabled = false;

            button.textContent =
                "SUBMIT APPLICATION";

        }

    }

}