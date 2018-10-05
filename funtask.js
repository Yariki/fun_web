
function handleMenu(){
    var leftSideMenu = document.getElementById('leftSideMenu');
    var main = document.getElementById('main');
    var menuWidth = leftSideMenu.style.width;

    if(menuWidth === "0px" || menuWidth === ""){
        leftSideMenu.style.width = "250px";
        main.style.marginLeft = "250px";
    } else{
        leftSideMenu.style.width = "0px";
        main.style.marginLeft = "0px";
    }

}