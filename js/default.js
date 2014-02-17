// Initialize my ko view
$(document).ready(function () {
    try{
        //window.localStorage.setItem("inventory", "");
        load();
        // Apply datamodel binding
        ko.applyBindings(koClickView);
        // Start gameloop
        requestAnimFrame(gameLoop);
        // Start update money loop
        updateMoney();
    } catch (e) {
        window.status = e.message;
        debugger;
    }
});

// Save tries to save game data using local storage
function save() {
    
    try {
        if (typeof (localStorage) === 'undefined') {
            alert('Your browser does not support HTML5 localStorage. Try upgrading.');
        } else {
            try {
                window.localStorage.setItem("currency", totalCurrency.toString());
                window.localStorage.setItem("cps", CPS.toString());
                window.localStorage.setItem("inventory", ko.toJSON(koClickView));
            } catch (e) {
                if (e === QUOTA_EXCEEDED_ERR) {
                    alert('Quota exceeded!');
                }
            }
        }
    } catch (e) {
        window.status = e.message;
    }

    lastSave = new Date();
}

function load() {
    try {
        window.status = "loading...";
        if (typeof (localStorage) != 'undefined') {
            var savedCurrency = parseInt(window.localStorage.getItem("currency"));
            var savedCps = parseFloat(window.localStorage.getItem("cps"));
            var inventory = window.localStorage.getItem("inventory");

            if (!isNaN(savedCurrency)) {
                totalCurrency = savedCurrency;
            }
            if(!isNaN(savedCps)){
                CPS = savedCps;
            }
            if(inventory.length > 10){
                koClickView.buttons = ko.observableArray([]);
                loadKoData(JSON.parse(inventory).buttons);
            }
        } else {
            //Save a different way
            window.status = "ELSE";
        }
    }
    catch (e) {
        window.status = e.message;
    }
}


function reset() {
        totalCurrency = 0;
        CPS = 0;
        window.localStorage.setItem("currency", "");
        window.localStorage.setItem("cps", "");
        window.localStorage.setItem("inventory", "");
        
        resetKoData();
        save();
        load();
        updateMoney();
}

function cheat() {

        totalCurrency = 2000000000;
        CPS = 100000;
        save();
        updateMoney();

}


// Setup game variables
var totalCurrency = new Number();
var CPS = new Number();
var lastSave = new Date();
var AUTO_SAVE_INTERVAL = 4000;



// Animate the click circle
// For iPhone use the onTouchStart instead of onMouseDown
function mouseDown(e) {
    showClick(1);
    $("#clickCover").removeClass("clickAnimationCircle").addClass("clickAnimationCircle");
    showClick(1,e);
    $("#clickCover").removeClass("clickAnimationCircle").addClass("clickAnimationCircle");
    var audio = document.getElementById('clickSound');
    audio.play();
    totalCurrency += 1;

}

function mouseUp(e) {
    setTimeout(function () { $('#clickCover').removeClass("clickAnimationCircle"); }, 150);
}


function showClick(num, e) {
    var evt = e ? e:window.event;
    var clickX=0, clickY=0;

    if ((evt.clientX || evt.clientY) &&
     document.body &&
     document.body.scrollLeft!=null) {
        clickX = evt.clientX + document.body.scrollLeft;
        clickY = evt.clientY + document.body.scrollTop;
    }
    if ((evt.clientX || evt.clientY) &&
     document.compatMode=='CSS1Compat' && 
     document.documentElement && 
     document.documentElement.scrollLeft!=null) {
        clickX = evt.clientX + document.documentElement.scrollLeft;
        clickY = evt.clientY + document.documentElement.scrollTop;
    }
    if (evt.pageX || evt.pageY) {
        clickX = evt.pageX;
        clickY = evt.pageY;
 }
    var obj = document.createElement("p");
    obj.setAttribute("class", "clickAnimationPlus");
    obj.setAttribute("style", "top:" + clickY + "px;left:" + clickX +"px;");
    obj.innerText = "+" + num;

    document.body.appendChild(obj);

    setTimeout(destroyClick, 300, obj);
}

function destroyClick(obj) {
    document.body.removeChild(obj);
}

// Map the the best option for performance available
window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
           window.webkitRequestAnimationFrame ||
           window.mozRequestAnimationFrame ||
           window.msRequestAnimationFrame ||
           function (callback) {
                window.setTimeout(callback, 1000 / 60);
           };
})();



function locationHashChanged() {
    
    switch(location.hash)
    {

        case "#about":
            $("#about").removeClass("hidden");
            $("#aboutMenu").addClass("active");

            $("#game").addClass("hidden");
            $("#gameMenu").removeClass("active");

            $("#contact").addClass("hidden");
            $("#contactMenu").removeClass("active");

            /*$('.navbar-collapse').toggle();*/

            break;

        case "#contact":
            $("#about").addClass("hidden");
            $("#aboutMenu").removeClass("active");

            $("#contact").removeClass("hidden");
            $("#contactMenu").addClass("active");

            $("#game").addClass("hidden");
            $("#gameMenu").removeClass("active");

            break;

        case "#":
        default:
            $("#about").addClass("hidden");
            $("#aboutMenu").removeClass("active");

            $("#contact").addClass("hidden");
            $("#contactMenu").removeClass("active");

            $("#game").removeClass("hidden");
            $("#gameMenu").addClass("active");

            break;

    }


}

window.onhashchange = locationHashChanged;


function gameLoop() {
    $("#totalCurrency").text(accounting.formatMoney(totalCurrency, "$", 0));
    $("#totalCps").text(accounting.formatNumber(CPS, 1, ","));
    requestAnimFrame(gameLoop);
    var currentTime = new Date();
    var timeSinceSave = currentTime - lastSave
    if(timeSinceSave > AUTO_SAVE_INTERVAL){
        save();
    }
        
}

function updateMoney() {
    totalCurrency += CPS;
    setTimeout(updateMoney, 1000);
}

