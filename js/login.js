$(document).ready(()=>{
    console.info("Firebase initialized!");
    db = firebase.firestore();
    
    $('#login-btn').click(()=>{
        var username = $('#username').val();
        var password = $('#password').val();
        if (username == "" || password == ""){
            $('#alert-msg').html("Please fill in your credentials to login!");
            $('#alert-msg').fadeIn();
        } else {
            db.collection("users").doc(username).get().then((doc)=>{
                console.log(doc.exists);
                if (!doc.exists) {
                    $('#signup-alert').fadeIn();
                    $('#alert-msg').html("You have not registered yet! Please sign up first!");
                    $('#alert-msg').fadeIn();
                } else {
                    var msg = doc.data().password;
                    var salt = CryptoJS.enc.Hex.parse(msg.substr(0, 32));
                    var iv = CryptoJS.enc.Hex.parse(msg.substr(32, 32));
                    var encrypted = msg.substring(64);
                    var key = CryptoJS.PBKDF2("~!@BI$*%^cvaSFBadf14%H$#^", salt, {
                        keySize: 256/32,
                        iterations: 100
                      });
                    var decrypted = CryptoJS.AES.decrypt(encrypted, key, {
                        iv: iv,
                        padding: CryptoJS.pad.Pkcs7,
                        mode: CryptoJS.mode.CBC
                    });
                    var pwd = decrypted.toString(CryptoJS.enc.Utf8);
                    if (password === pwd){
                        window.localStorage.setItem("username", doc.data().firstName + " " + doc.data().lastName);
                        window.localStorage.setItem("user", doc.id);
                        if (doc.id == "xmliszt") {
                            window.localStorage.setItem("admin", "true");
                        }
                        window.location.href = "index.html";
                    } else {
                        $('#signup-alert').fadeIn();
                        $('#alert-msg').html("Incorrect username or password!");
                        $('#alert-msg').fadeIn();
                    }
                }
            }).catch(err=>{
                console.error(err);
                $('#signup-alert').fadeIn();
                $('#alert-msg').html("Failed to log in!");
                $('#alert-msg').fadeIn();
            })
        }
    });
});