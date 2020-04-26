import {firebaseApp} from "./index";

var point;
async function getVal(ref){
    ref.get().then((doc) => {
        console.log(doc.data());
    }).catch((err)=>{console.error(error)});
}

var pointRef = firebaseApp.collection("profile").doc("leet-point");

$('.btn-easy').click(async ()=>{
    $('#easy').show();
    $('#easy').fadeOut(500);
    await getVal(pointRef);
});

$('.btn-medium').click(()=>{
    $('#med').show();
    $('#med').fadeOut(500);
    point += 2;
});

$('.btn-hard').click(()=>{
    $('#hard').show();
    $('#hard').fadeOut(500);
    point += 3;
});
