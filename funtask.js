
function handleMenu(){
    var leftSideMenu = document.getElementById('leftSideMenu');
    var main = document.getElementById('main');
    var menuWidth = leftSideMenu.style.width;

    if(menuWidth === "0%" || menuWidth === ""){
        leftSideMenu.style.width = "10%";
        main.style.marginLeft ="10%"
        main.style.width = "90%";

    } else {
        leftSideMenu.style.width = "0%";
        main.style.marginLeft = "0%"
        main.style.width = "100%";

    }

}



var DomStrings = {
    tableBody: "tableBody"

};




var tableController = (function(){

})();

