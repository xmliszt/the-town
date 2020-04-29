$(document).ready(()=>{
    var name = window.localStorage.getItem("username");
    if (!name) {
        window.location.href = "login.html";
    } else {
        $('#user-portal').hide();
        $('#signout').show();
    }
    var id = window.localStorage.getItem("user");
    var userItems = [];

    new Vue({
        el: "#greetMe",
        data: {
            name: name
        }
    });

    var myItems = new Vue({
        el: "#myItems",
        data: {
            items: []
        },
        methods: {
            updateItems: function(){
                this.items = [];
                userItems.forEach((item)=>{
                    if (item.quantity > 0){
                        this.items.push({
                            name: item.name,
                            quantity: item.quantity,
                            last: new Date(item.last).toString()
                        });
                    }
                })
            },
            remove: async function(idx){
                this.items[idx].quantity --;
                var itemName = this.items[idx].name;
                userItems.forEach((item)=>{
                    if (item.name == itemName){
                        item.quantity --;
                    }
                });
                
                this.updateItems();

                db.collection("users").doc(id).update({
                    items: userItems
                });
            }
        }
    });

    myItems.updateItems();

    console.info("Firebase initialized!");
    db = firebase.firestore();
    db.collection("users").doc(id).get().then((doc) => {
        userItems = doc.data().items;
        myItems.updateItems();

    }).catch((err)=>{console.error(err)});

    $('#signout').click(()=>{
        var confirm = window.confirm("Are you sure about signing out?");
        if (confirm) {
            window.localStorage.removeItem("username");
            window.localStorage.removeItem("user");
            window.localStorage.removeItem("admin");
            window.location.reload();
        }
    });
});