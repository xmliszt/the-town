Vue.component('NavBar', {
    template: `
    <div id="navbar">
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
            <a href="index.html" class="navbar-brand">
                <img src="./img/logo-sm.png" alt="BBFISH" width="30px" height="30px">
                <span style="margin-left: 1rem">THE TOWN</span>
            </a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav mr-auto">
                    <li class="nav-item">
                        <a href="index.html" class="nav-link">Dashboard</a>
                    </li>
                    <li class="nav-item">
                        <a href="leet.html" class="nav-link">LeetCode</a>
                    </li>
                    <li class="nav-item active">
                        <a href="shop.html" class="nav-link">Shop</a>
                    </li>
                </ul>
            </div>
        </nav>
    </div>
    `,
    data: function(){
        return {
            hello: "HELLO WORLD!"
        }
    }
})