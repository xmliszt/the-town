$(document).ready(()=>{
    var name = window.localStorage.getItem("username");
    if (!name) {
        name = "Guest";
        $('#user-portal').show();
        $('#signout').hide();
    } else {
        $('#user-portal').hide();
        $('#signout').show();
    }
    new Vue({
        el: "#user",
        data: {
            name: name
        }
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

    $('#brand').click(()=>{
        if (window.localStorage.getItem("admin")){
            window.location.href = "admin.html";
        } else {
            window.location.href = "index.html";
        }
    });
});