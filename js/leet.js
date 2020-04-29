$(document).ready(()=>{
    console.info("Firebase initialized!");
    db = firebase.firestore();
    var name = window.localStorage.getItem("username");
    if (!name) {
        $('#user-portal').show();
        $('#signout').hide();
    } else {
        $('#user-portal').hide();
        $('#signout').show();
    }
    var id = window.localStorage.getItem("user");
    $('.btn-easy').click(async ()=>{
        if (!name) {
            window.location.href = "login.html"; 
            return;
        }
        await updatePoint(1);
        $('#easy').show();
        $('#easy').fadeOut(500);
    });

    $('.btn-medium').click(async ()=>{
        if (!name) {
            window.location.href = "login.html"; 
            return;
        }
        await updatePoint(2);
        $('#med').show();
        $('#med').fadeOut(500);
    });

    $('.btn-hard').click(async ()=>{
        if (!name) {
            window.location.href = "login.html"; 
            return;
        }
        await updatePoint(3);
        $('#hard').show();
        $('#hard').fadeOut(500);
    });

    $('#signout').click(()=>{
        var confirm = window.confirm("Are you sure about signing out?");
        if (confirm) {
            window.localStorage.removeItem("username");
            window.localStorage.removeItem("user");
            window.localStorage.removeItem("admin");
            window.location.reload();
        }
    });

    
    async function updatePoint(newVal){
        await db.collection("users").doc(id).get().then((doc) => {
            var point = doc.data().point;
            db.collection("users").doc(id).update({
                point: Number(point) + Number(newVal)
            });
        }).catch((err)=>{console.error(err)});
    }

});
