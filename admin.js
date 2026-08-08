import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";


import {
    getFirestore,
    collection,
    getDocs,
    updateDoc,
    setDoc,
    doc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


/* =========================================
   FIREBASE
========================================= */

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


/* =========================================
   ELEMENTS
========================================= */

const applicationsBox =
    document.getElementById("applications");


const squadBox =
    document.getElementById("squadPlayers");


/* =========================================
   LOAD WEBSITE STATS
========================================= */

async function loadStats(){

    try{

        const statsRef =
            doc(db,"settings","websiteStats");

        const snapshot =
            await getDocs(
                collection(db,"settings")
            );

        let found = false;

        snapshot.forEach((item)=>{

            if(item.id === "websiteStats"){

                found = true;

                const data =
                    item.data();

                document.getElementById(
                    "totalMembers"
                ).value =
                    data.totalMembers ?? 0;


                document.getElementById(
                    "matchesPlayed"
                ).value =
                    data.matchesPlayed ?? 0;


                document.getElementById(
                    "bestPlayers"
                ).value =
                    data.bestPlayers ?? 0;

            }

        });


        if(!found){

            document.getElementById(
                "totalMembers"
            ).value = 0;

            document.getElementById(
                "matchesPlayed"
            ).value = 0;

            document.getElementById(
                "bestPlayers"
            ).value = 0;

        }

    }
    catch(error){

        console.error(error);

        showStatsMessage(
            "Could not load stats.",
            false
        );

    }

}


/* =========================================
   SAVE WEBSITE STATS
========================================= */

window.saveStats =
async function(){

    const totalMembers =
        Number(
            document.getElementById(
                "totalMembers"
            ).value
        );


    const matchesPlayed =
        Number(
            document.getElementById(
                "matchesPlayed"
            ).value
        );


    const bestPlayers =
        Number(
            document.getElementById(
                "bestPlayers"
            ).value
        );


    if(
        totalMembers < 0 ||
        matchesPlayed < 0 ||
        bestPlayers < 0
    ){

        showStatsMessage(
            "Numbers cannot be negative.",
            false
        );

        return;
    }


    try{

        await setDoc(

            doc(
                db,
                "settings",
                "websiteStats"
            ),

            {

                totalMembers:
                    totalMembers,

                matchesPlayed:
                    matchesPlayed,

                bestPlayers:
                    bestPlayers

            }

        );


        showStatsMessage(
            "Website stats saved successfully!",
            true
        );

    }
    catch(error){

        console.error(error);

        showStatsMessage(
            "Error saving stats. Check Firebase rules.",
            false
        );

    }

};


/* =========================================
   MESSAGE
========================================= */

function showStatsMessage(
    text,
    success
){

    const message =
        document.getElementById(
            "statsMessage"
        );

    message.textContent =
        text;

    message.className =
        success
            ? "message success"
            : "message error";

}


/* =========================================
   APPLICATIONS
========================================= */

async function loadApplications(){

    try{

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "applications"
                )
            );


        applicationsBox.innerHTML = "";


        if(snapshot.empty){

            applicationsBox.innerHTML = `
                <div class="card">
                    No applications found.
                </div>
            `;

            return;
        }


        snapshot.forEach((item)=>{

            const player =
                item.data();

            const id =
                item.id;


            applicationsBox.innerHTML += `

                <div class="application-card">

                    <h3>
                        ${player.name || "Player"}
                    </h3>

                    <p>
                        Age:
                        ${player.age || "N/A"}
                    </p>

                    <p>
                        Location:
                        ${player.location || "N/A"}
                    </p>

                    <p>
                        Position:
                        ${player.position || "N/A"}
                    </p>

                    <p>
                        Previous Team:
                        ${player.previousTeam || "N/A"}
                    </p>

                    <p>
                        Experience:
                        ${player.experience || "N/A"}
                    </p>

                    <p>
                        Jersey Size:
                        ${player.jerseySize || "N/A"}
                    </p>

                    <p>
                        Jersey Number:
                        ${player.jerseyNumber || "N/A"}
                    </p>

                    <p>
                        Status:
                        ${player.status || "Pending"}
                    </p>


                    <select
                        id="reason-${id}">

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
                            Other candidates were selected.
                        </option>

                    </select>


                    <button
                        class="accept"
                        onclick="
                            updateStatus(
                                '${id}',
                                'Accepted'
                            )
                        ">

                        ACCEPT

                    </button>


                    <button
                        class="reject"
                        onclick="
                            updateStatus(
                                '${id}',
                                'Rejected'
                            )
                        ">

                        REJECT

                    </button>

                </div>

            `;

        });

    }
    catch(error){

        console.error(error);

        applicationsBox.innerHTML = `
            <div class="card">
                Error loading applications.
            </div>
        `;

    }

}


/* =========================================
   ACCEPT / REJECT
========================================= */

window.updateStatus =
async function(
    id,
    status
){

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


    try{

        await updateDoc(

            doc(
                db,
                "applications",
                id
            ),

            {
                status:status,
                reason:reason
            }

        );


        alert(
            "Updated Successfully"
        );


        loadApplications();

        loadSquad();

    }
    catch(error){

        console.error(error);

        alert(
            "Error updating application."
        );

    }

};


/* =========================================
   LOAD SQUAD
========================================= */

async function loadSquad(){

    try{

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "applications"
                )
            );


        squadBox.innerHTML = "";


        let found = false;


        snapshot.forEach((item)=>{

            const player =
                item.data();

            const id =
                item.id;


            if(
                player.status !== "Accepted"
            ){

                return;

            }


            found = true;


            squadBox.innerHTML += `

                <div class="application-card">

                    <h3>
                        ${player.name || "Player"}
                    </h3>

                    <p>
                        Current Position:
                        ${player.positionAssigned || "Not assigned"}
                    </p>

                    <p>
                        Role:
                        ${player.role || "Player"}
                    </p>


                    <select
                        id="position-${id}">

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


                    <select
                        id="role-${id}">

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
                        onclick="
                            addToSquad('${id}')
                        ">

                        ADD / UPDATE SQUAD

                    </button>


                    <button
                        class="remove"
                        onclick="
                            removeFromSquad('${id}')
                        ">

                        REMOVE FROM SQUAD

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
    catch(error){

        console.error(error);

        squadBox.innerHTML = `
            <div class="card">
                Error loading squad.
            </div>
        `;

    }

}


/* =========================================
   ADD / UPDATE SQUAD
========================================= */

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


    try{

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "applications"
                )
            );


        /*
           ONLY ONE CAPTAIN
        */

        if(role === "Captain"){

            for(
                const item
                of snapshot.docs
            ){

                if(
                    item.id !== id &&
                    item.data().role === "Captain"
                ){

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
           ONLY ONE VICE CAPTAIN
        */

        if(
            role === "Vice Captain"
        ){

            for(
                const item
                of snapshot.docs
            ){

                if(
                    item.id !== id &&
                    item.data().role ===
                        "Vice Captain"
                ){

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

            doc(
                db,
                "applications",
                id
            ),

            {

                inSquad:true,

                positionAssigned:
                    position,

                role:role

            }

        );


        alert(
            "Squad updated successfully!"
        );


        loadSquad();

    }
    catch(error){

        console.error(error);

        alert(
            "Error updating squad."
        );

    }

};


/* =========================================
   REMOVE FROM SQUAD
========================================= */

window.removeFromSquad =
async function(id){

    try{

        await updateDoc(

            doc(
                db,
                "applications",
                id
            ),

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

    }
    catch(error){

        console.error(error);

        alert(
            "Error removing player."
        );

    }

};


/* =========================================
   START
========================================= */

loadStats();

loadApplications();

loadSquad();
