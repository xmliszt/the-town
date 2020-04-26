var firebaseApp = null;
$(document).ready(()=>{
    var firebaseConfig = {
        apiKey: "AIzaSyC6SFUbS3UHxY9mD3u8a8j_T9Nixi4Dg-Y",
        authDomain: "bbfish-town.firebaseapp.com",
        databaseURL: "https://bbfish-town.firebaseio.com",
        projectId: "bbfish-town",
        storageBucket: "bbfish-town.appspot.com",
        messagingSenderId: "808191526396",
        appId: "1:808191526396:web:b5e6bc2feab12979c35e79",
        measurementId: "G-M4TZVEYVDX"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    firebase.analytics();
    console.info("Firebase initialized!");
    firebaseApp = firebase.database();
});

export {firebaseApp}