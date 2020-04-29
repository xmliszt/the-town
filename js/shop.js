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
    var point = 0;

    var headline = new Vue({
        el: "#greet",
        data: {
            name: name,
            point: point
        },
        methods: {
            updatePoint: function(newVal){
                this.point = newVal
            }
        }
    });
    console.info("Firebase initialized!");
    db = firebase.firestore();
    db.collection("users").doc(id).get().then((doc) => {
        point = doc.data().point;
        headline.updatePoint(point);
        userItems = doc.data().items;
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

    var shopItems = new Vue({
        el: "#items",
        data: {
            items: []
        },
        methods: {
            updateItems: async function(){
                await db.collection("shop").where("soldOut", "==", false).get().then((snapshot) => {
                    var temp = [];
                    snapshot.forEach((doc) => {
                        var data = doc.data();
                        temp.push({
                            docID: doc.id,
                            data: data
                        });
                    });
                    this.items = temp;
                }).catch(err=>{
                    console.error(err);
                })
            },
            buy: async function(idx){
                var targetItem = this.items[idx];
                // check if have enough point to buy in the first place
                if (headline.point < targetItem.data.price) {
                    window.alert("Sorry you don't have enough point to redeem the item! Please work on more LeetCode problems and come back later!");
                    return;
                }
                // item quantity -1, if quantity is zero, soldOut set to true
                // update db
                var timestamp = new Date().getTime();
                targetItem.data.quantity --;
                targetItem.data.history.push({
                    who: id,
                    timestamp: timestamp
                });
                if (targetItem.data.quantity == 0) targetItem.data.soldOut = true;
                await db.collection("shop").get().then((snapshot)=>{
                    snapshot.forEach((doc)=>{
                        if (doc.id === targetItem.docID) {
                            db.collection("shop").doc(doc.id).update({
                                quantity: targetItem.data.quantity,
                                soldOut: targetItem.data.soldOut,
                                history: targetItem.data.history
                            });
                        }
                    })
                }).catch(err=>{
                    console.error(err);
                    window.alert("Failed to update shop item!");
                    return;
                })
                // point minus item price and update db
                headline.point -= targetItem.data.price;
                // update user's item list
                try{
                    userItems.forEach((item) => {
                        if (item.name == targetItem.data.name){
                            item.quantity++;
                            item.last = timestamp;
                            throw {};
                        }
                    });
                    userItems.push({
                        itemID: targetItem.docID,
                        name: targetItem.data.name,
                        quantity: 1,
                        last: timestamp
                    });
                } catch (e){};
               
                await db.collection("users").doc(id).update({
                    point: headline.point,
                    items: userItems
                });

                // update vue for items in the table
                this.updateItems();
            }
        }
    });

    shopItems.updateItems();
});