import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

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
        "1:608890063019:web:56d54e9a5f9a35f07ecfee",

    measurementId:
        "G-134SGSZ9TL"
};


const app =
    initializeApp(firebaseConfig);


const db =
    getFirestore(app);


window.checkApplication =
async function(){

    const input =
        document.getElementById(
            "instagram"
        );

    const result =
        document.getElementById(
            "result"
        );


    let username =
        input.value.trim();


    if(!username){

        result.innerHTML = `
            <div class="result-card">
                <p>
                    Please enter your Instagram username.
                </p>
            </div>
        `;

        return;
    }


    username =
        username
        .replace("@","")
        .toLowerCase();


    result.innerHTML = `
        <div class="result-card">
            <p>
                Checking your application...
            </p>
        </div>
    `;


    try{

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "applications"
                )
            );


        let foundPlayer = null;


        snapshot.forEach((item)=>{

            const player =
                item.data();


            const instagram =
                String(
                    player.instagram ||
                    player.instagramUsername ||
                    player.instagramId ||
                    ""
                )
                .replace("@","")
                .toLowerCase();


            if(
                instagram === username
            ){

                foundPlayer = player;

            }

        });


        if(!foundPlayer){

            result.innerHTML = `
                <div class="result-card">

                    <h3>
                        Application Not Found
                    </h3>

                    <p>
                        We couldn't find an application
                        with this Instagram username.
                    </p>

                </div>
            `;

            return;
        }


        const status =
            foundPlayer.status ||
            "Pending";


        let statusClass =
            "pending";


        if(status === "Accepted"){

            statusClass =
                "accepted";

        }


        if(status === "Rejected"){

            statusClass =
                "rejected";

        }


        result.innerHTML = `

            <div class="result-card">

                <h3>
                    ${foundPlayer.name || "Player"}
                </h3>

                <p>
                    Instagram:
                    <strong>
                        @${username}
                    </strong>
                </p>

                <p>
                    Position:
                    <strong>
                        ${foundPlayer.position || "N/A"}
                    </strong>
                </p>

                <p>
                    Application Status:
                </p>

                <span
                    class="status ${statusClass}">
                    ${status}
                </span>

                ${
                    foundPlayer.reason
                    ?
                    `
                    <p style="margin-top:15px;">
                        Reason:
                        <strong>
                            ${foundPlayer.reason}
                        </strong>
                    </p>
                    `
                    :
                    ""
                }

            </div>

        `;


    }
    catch(error){

        console.error(error);


        result.innerHTML = `
            <div class="result-card">

                <h3>
                    Error
                </h3>

                <p>
                    Unable to check your application.
                    Please try again later.
                </p>

            </div>
        `;

    }

};