$(document).ready(()=>{
    var name = window.localStorage.getItem("username");
    var guest;
    if (name) {
        $('#user-portal').hide();
        $('#signout').show();
        name = window.localStorage.getItem("user"); // change to user's nickname
        guest = false;
    } else {
        name = "Guest-" + makeid(5);
        guest = true;
    }

    $('#signout').click(()=>{
        var confirm = window.confirm("Are you sure about signing out?");
        if (confirm) {
            window.localStorage.removeItem("username");
            window.localStorage.removeItem("user");
            window.localStorage.removeItem("admin");
            window.location.reload();
        }
    });

    $('#brand').click(()=>{
        if (window.localStorage.getItem("admin")){
            window.location.href = "admin.html";
        } else {
            window.location.href = "index.html";
        }
    });
    
    console.info("Firebase initialized!");
    db = firebase.firestore();

    if (!guest){
        db.collection("players").doc(name).get().then((doc)=>{
            window.localStorage.setItem("player-score", doc.data().score);
            window.localStorage.setItem("previous-score", doc.data().score);
        });
    } else {
        // guest previous score is 0
        window.localStorage.setItem("player-score", 0);
        window.localStorage.setItem("previous-score", 0);
    }

    var myRank = new Vue({
        el: "#myRank",
        data: {
            myName: name,
            myRank: "Sorry you don't have a score yet!"
        }
    });

    var ranking = new Vue({
        el: "#ranking",
        data: {
            myName: name,
            players: []
        },
        methods: {
            updateRank: ()=>{
                db.collection("players").get().then((snapshot)=>{
                    var unsorted = [];
                    try{
                        snapshot.forEach((doc, idx)=>{
                            if (idx == 20) {throw {};}
                            var data = doc.data();
                            unsorted.push(data);
                        });
                    } catch(e){
                    }
                    var sorted = unsorted.sort(customeCompare);
                    var rank = sorted.findIndex(findMe) + 1;
                    if (rank > 0) myRank.myRank = rank;
                    ranking.players = sorted;
                }).catch(err=>{
                    console.error(err);
                })
            }
        }
    });

    var ranking_ele = document.getElementById("ranking");
    ranking_ele.addEventListener("uploaded", updateDBScore);
    ranking.updateRank();

    
    function findMe(me){
        return me.name == name;
    }

    function customeCompare(a,b){
        scoreA = a.score;
        scoreB = b.score;

        if (scoreA < scoreB) return 1;
        else if (scoreA > scoreB) return -1;
        else return 0;
    }

    function updateDBScore(){
        var playerScore = Number(window.localStorage.getItem("player-score"));
        // new score!
        var lastScore = Number(window.localStorage.getItem("previous-score"));
        if (playerScore > lastScore){
            window.localStorage.setItem("previous-score", playerScore);
            if (!guest){
                db.collection("players").doc(name).update({
                    score: playerScore
                }).then(()=>{
                    ranking.updateRank();
                });
            } else {
                db.collection("players").doc(name).set({
                    name: name,
                    score: playerScore
                }).then(()=>{
                    ranking.updateRank();
                });
            }
        }
    }
    
    function makeid(length) {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }



});
