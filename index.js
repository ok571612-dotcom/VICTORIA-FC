import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getFirestore,
    doc,
    getDoc
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
        "1:608890063019:web:56d54e9a5f9a35f07ecfee",

    measurementId:
        "G-134SGSZ9TL"
};


const app =
    initializeApp(firebaseConfig);


const db =
    getFirestore(app);


async function loadWebsiteStats(){

    try{

        const statsRef =
            doc(
                db,
                "settings",
                "websiteStats"
            );


        const snapshot =
            await getDoc(statsRef);


        if(!snapshot.exists()){

            console.log(
                "Stats have not been created yet."
            );

            return;

        }


        const stats =
            snapshot.data();


        const totalMembers =
            document.getElementById(
                "totalMembers"
            );


        const matchesPlayed =
            document.getElementById(
                "matchesPlayed"
            );


        const bestPlayers =
            document.getElementById(
                "bestPlayers"
            );


        if(totalMembers){

            totalMembers.textContent =
                stats.totalMembers ?? 0;

        }


        if(matchesPlayed){

            matchesPlayed.textContent =
                stats.matchesPlayed ?? 0;

        }


        if(bestPlayers){

            bestPlayers.textContent =
                stats.bestPlayers ?? 0;

        }

    }
    catch(error){

        console.error(
            "Stats loading error:",
            error
        );

    }

}


loadWebsiteStats();