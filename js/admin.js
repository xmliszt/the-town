$(document).ready(()=>{
    
    if (!window.localStorage.getItem("admin")) window.location.href = "index.html";
    console.info("Firebase initialized!");
    db = firebase.firestore();
    
    var name = window.localStorage.getItem("username");
    if (!name) {
        name = "Guest";
        $('#user-portal').show();
        $('#signout').hide();
    } else {
        $('#user-portal').hide();
        $('#signout').show();
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
        window.location.href = "index.html";
    });

    $('#createItem').click(()=>{
        var name = $('#item-name').val();
        var quantity = $('#item-quantity').val();
        var price = $('#item-price').val();
        if (name != "" && quantity != "" && price != ""){
            db.collection("shop").add({
                history: [],
                name: name,
                quantity: Number(quantity),
                price: Number(price),
                soldOut: false
            }).then(()=>{
                $('#alert-msg').hide();
                $('#alert-success').html("Item created successfully!");
                $('#alert-success').fadeIn();
            }).catch(err=>{
                console.error(err);
                $('#alert-msg').html("Error in Firebase! Check the log!");
                $('#alert-msg').fadeIn();
                $('#alert-success').hide();
            });
        } else {
            $('#alert-msg').html("Incomplete information! Cannot create item!");
            $('#alert-msg').fadeIn();
            $('#alert-success').hide();
        }
    });
});

