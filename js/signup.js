$(document).ready(()=>{
    console.info("Firebase initialized!");
    db = firebase.firestore();
    var signupInputHandler = new Vue({
        el: "#signup",
        data: {
            username: "",
            password: "",
            repeat: ""
        },
        watch: {
            username: function(){
                this.debouncedCheckUsername()
            },
            password: function(){
                this.debouncedCheckPwd();
                this.debouncedCheckRepeat();
            },
            repeat: function(){
                this.debouncedCheckRepeat()
            }
        },
        created: function() {
            this.debouncedCheckUsername = _.debounce(this.checkUsername, 500);
            this.debouncedCheckPwd = _.debounce(this.checkPwd, 500);
            this.debouncedCheckRepeat = _.debounce(this.checkRepeat, 500)
        },
        methods: {
            checkUsername: function() {
                db.collection("users").get().then((snapshot)=>{
                    try{
                        snapshot.forEach((doc) => {
                            if (this.username === doc.id) {
                                throw {};
                            }
                        });
                        $('#username-success').html("Your username is ok!");
                        $('#username-success').fadeIn();
                        $('#username-alert').hide();
                        $('#signup-btn').prop('disabled', false);
                    } catch (e) {
                        $('#username-alert').html("Your username has already been taken!");
                        $('#username-alert').fadeIn();
                        $('#username-success').hide();
                        $('#signup-btn').prop('disabled', true);
                    }
                    
                }).catch(err=>{
                    console.error(err);
                    $('#username-alert').html("Something wrong when checking the username...");
                    $('#username-alert').fadeIn();
                    $('#username-success').hide();
                    $('#signup-btn').prop('disabled', true);
                })
            },
            checkPwd: function() {
                var passw=  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,20}$/;
                if (this.password.match(passw)){
                    $('#password-success').html("Your password is valid!");
                    $('#password-success').fadeIn();
                    $('#password-alert').hide();
                    $('#signup-btn').prop('disabled', false);
                } else {
                    $('#password-success').hide();
                    $('#password-alert').html("Password must be between 8 to 20 characters containing at least one lowercase letter, one uppercase letter, one numeric digit and one special character!");
                    $('#password-alert').fadeIn();
                    $('#signup-btn').prop('disabled', true);
                }
            },
            checkRepeat: function() {
                if (this.repeat != this.password){
                    $('#repeat-alert').html("Password do not match!");
                    $('#repeat-alert').fadeIn();
                    $('#repeat-success').hide();
                    $('#signup-btn').prop('disabled', true);
                } else {
                    $('#repeat-success').html("Password match correctly!");
                    $('#repeat-success').fadeIn();
                    $('#repeat-alert').hide();
                    $('#signup-btn').prop('disabled', false);
                }
            }
        }
    });

    $('#signup-btn').click(()=>{
        var username = signupInputHandler.username;
        var password = signupInputHandler.password;
        var firstName = $('#firstName').val();
        var lastName = $('#lastName').val();
        var repeat = signupInputHandler.repeat;
        if (firstName == "" || lastName == ""){
            $('#alert-msg').html("First name and last name cannot be empty!");
            $('#alert-msg').fadeIn();
            return;
        } else {
            var iv = CryptoJS.lib.WordArray.random(128/8);
            var salt = CryptoJS.lib.WordArray.random(128/8);
            var key = CryptoJS.PBKDF2("~!@BI$*%^cvaSFBadf14%H$#^", salt, {
                keySize: 256/32,
                iterations: 100
              });
            var encrypted = CryptoJS.AES.encrypt(password, key, {
                iv: iv,
                padding: CryptoJS.pad.Pkcs7,
                mode: CryptoJS.mode.CBC
            });
            db.collection("users").doc(username).set({
                firstName: firstName,
                lastName: lastName,
                password: salt.toString() + iv.toString() + encrypted.toString(),
                point: 0,
                items: []
            }).then(()=>{
                window.alert("Sign up successfully! Please log in!");
                window.location.href = "login.html";
            }).catch(err=>{
                console.error(err);
                $('#alert-msg').html("Something wrong when we were signing you up! Please try again!");
                $('#alert-msg').fadeIn();
            })
        }
    });
});