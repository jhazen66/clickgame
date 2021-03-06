"use strict";

// Setup game variables
var totalCurrency = 0;
var CPS = 0;
var lastSave = new Date();
var AUTO_SAVE_INTERVAL = 4000;
var lastClicks = 0;
var lastClicksPerSecond = 0;
var appView = {};


// Initialize my ko view
$(document).ready(function () {

    //setup the inventory
    try{
        //window.localStorage.setItem("inventory", "");
        load();
        // Apply datamodel binding
        ko.applyBindings(appView);
        // Start gameloop
        requestAnimFrame(gameLoop);
        // Start update money loop
        updateMoney();
    } catch (e) {
        window.status = e.message;
    }

    //set my event listeners

    //event handlers for the click button.  Use touchstart on iOS to avoid click delay
    //the following code ensures that we don't process both events on systems that take both
    $('#clickCover').on('touchstart click', function(event){
            event.stopPropagation();
            event.preventDefault();
            if(event.handled !== true) {

                mouseDown(event);

                event.handled = true;
            } else {
                return false;
            }
    });


    //this code causes the bootstrap menu to collapse when clicked.
    $('.nav a').on('click', function () {
        $("#myMenu").toggleClass('in collapse');
    });


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
                window.localStorage.setItem("inventory", ko.toJSON(appView));
                window.localStorage.setItem("totalClicks", appView.player.totalClicks());
                window.localStorage.setItem("totalMoneySpent", appView.player.totalMoneySpent());
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

// Load any existing data
function load() {
    try {
        window.status = "loading...";
        if (typeof (localStorage) != 'undefined') {
            var savedCurrency = parseInt(window.localStorage.getItem("currency"));
            var savedCps = parseFloat(window.localStorage.getItem("cps"));
            var inventory = window.localStorage.getItem("inventory");
            var totalClicks = parseInt(window.localStorage.getItem("totalClicks"));
            var totalMoneySpent = parseInt(window.localStorage.getItem("totalMoneySpent"));

            if(!isNaN(totalMoneySpent)){
                appView.player.totalMoneySpent(totalMoneySpent);
            }
            if (!isNaN(savedCurrency)) {
                totalCurrency = savedCurrency;
            }
            if(!isNaN(savedCps)){
                CPS = savedCps;
            }
            if(!isNaN(totalClicks)){
                appView.player.totalClicks(totalClicks);
            }
            if(inventory.length > 10){
                appView.buttons = ko.observableArray([]);
                loadKoData(JSON.parse(inventory).buttons);
            }
        } else {
            //Save a different way
            window.status = "ELSE";
        }

        window.status = "";
    }
    catch (e) {
        window.status = e.message;
    }
}


function reset() {
        totalCurrency = 0;
        CPS = 0;
        // Clear all the local Storage data
        appView.player.totalClicks(0);
        appView.player.totalMoneySpent(0);
        window.localStorage.clear();
        resetKoData();
        save();
        window.location.reload();
}

function cheat() {

        totalCurrency = totalCurrency + 5000000;
        save();
        updateMoney();
        window.location.reload();

}


// Animate the click circle
function mouseDown(e) {

    var clicks = 1;

    //only give the multiplier if manual clicks is already above 200
    if(appView.player.totalClicks() > 200){
        if(lastClicksPerSecond > 8){
            clicks = 6;
        } else if (lastClicksPerSecond > 7){
            clicks = 5;
        } else if (lastClicksPerSecond > 6){
            clicks = 4;
        } else if (lastClicksPerSecond > 5){
            clicks = 3;
        } else if (lastClicksPerSecond > 4){
            clicks = 2;
        } 
    }


    $("#clickCover").removeClass("clickAnimationCircle").addClass("clickAnimationCircle");

    showClick(clicks,e);
    appView.player.addPlayerClickData(clicks); 
    totalCurrency += clicks;

    setTimeout(function () { $('#clickCover').removeClass("clickAnimationCircle"); }, 150);

}


function showClick(num, evt) {
    // var evt = e ? e:window.event;
    var clickX=0, clickY=0;

    if ((evt.clientX || evt.clientY) &&
     document.documentElement &&
     document.documentElement.scrollLeft!=null) {
        clickX = evt.clientX + document.documentElement.scrollLeft;
        clickY = evt.clientY + document.documentElement.scrollTop;
    }
    if ((evt.clientX || evt.clientY) &&
     document.compatMode=='CSS1Compat' && 
     document.documentElement && 
     document.documentElement.scrollLeft!=null) {
        clickX = evt.clientX + document.documentElement.scrollLeft;
        clickY = evt.clientY + document.documentElement.scrollTop;
    }

    //needed this for iOS
    if (evt.originalEvent.pageX || evt.originalEvent.pageY) {
        clickX = evt.originalEvent.pageX;
        clickY = evt.originalEvent.pageY;
    }

    //if I still do not have a good value, try again.  Needed for Chrome on android.
    if (clickX == 0 && evt.originalEvent.targetTouches) {
        clickX = evt.originalEvent.targetTouches[0].pageX;
        clickY = evt.originalEvent.targetTouches[0].pageY;        
    }
    
    clickX = clickX - 15;

    //setup the new animated value and element
    var clickString = "$" + num;
    var obj = document.createElement("p");
    obj.setAttribute("class", "clickAnimationPlus");
    obj.setAttribute("style", "top:" + clickY + "px;left:" + clickX +"px;");


    //doge support! such wow!
    var coverImage = $("#clickCover").css( "background-image" );
    var doge = /doge/.test(coverImage);

    if(doge){

        var x = Math.floor((Math.random()*5));
        var str = new Array();
        str[0] = "wow //BUILD";
        str[1] = "such css";
        str[2] = "so win";
        str[3] = "very touch";
        str[4] = "much html";

        clickString = str[x];

        x = Math.floor((Math.random()*4));
        str[0] = "blue";
        str[1] = "yellow";
        str[2] = "red";
        str[3] = "green";

        obj.setAttribute("style", "top:" + clickY + "px;left:" + clickX +"px; color:" + str[x] +";" );

    }


    obj.innerHTML = clickString;

    var ele = document.body.appendChild(obj);

    ele.innerHTML = clickString;

    setTimeout(destroyClick, 600, ele);

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

// Handle app navigation
function showPage(arg) {

    console.log("showGame: " + arg);

    switch(arg)
    {
        case "credits":
            $("#about").removeClass("hidden");
            $("#aboutMenu").addClass("active");

            $("#game").addClass("hidden");
            $("#gameMenu").removeClass("active");

            $("#extras").addClass("hidden");
            $("#extrasMenu").removeClass("active");

            $("#animationDiv").addClass("hidden");
            $("#animationDiv").removeClass("active");

            /*$('.navbar-collapse').toggle();*/

            break;

        case "extras":
            $("#about").addClass("hidden");
            $("#aboutMenu").removeClass("active");

            $("#extras").removeClass("hidden");
            $("#extrasMenu").addClass("active");

            $("#game").addClass("hidden");
            $("#gameMenu").removeClass("active");

            $("#animationDiv").addClass("hidden");
            $("#animationDiv").removeClass("active");

            break;

        case "game":
        default:
            $("#about").addClass("hidden");
            $("#aboutMenu").removeClass("active");

            $("#extras").addClass("hidden");
            $("#extrasMenu").removeClass("active");

            $("#game").removeClass("hidden");
            $("#gameMenu").addClass("active");

            $("#animationDiv").removeClass("hidden");
            $("#animationDiv").addClass("active");

            break;

    }



}


function gameLoop() {
    // Update the knockout view model to refelect player cash
    appView.game.playerCash(totalCurrency);
    appView.game.CPS(CPS);

    // Execute the game loop on the next animation frame
    requestAnimFrame(gameLoop);
    
    var currentTime = new Date();
    var timeSinceSave = currentTime - lastSave
    // Check if the game has been saved in the last 10 seconds
    if(timeSinceSave > AUTO_SAVE_INTERVAL){
        save();
    }
        
}

// Update the player's money every second by their CPS rate
function updateMoney() {
    // Check the player clicks since last update
    var clickRate = appView.player.totalClicks() - lastClicks;

    if(clickRate > appView.player.highestClicksPerSecond()){
        appView.player.highestClicksPerSecond(clickRate);
    }
    appView.player.lastClicksPerSecond(clickRate);
    // Add the auto generated clicks
    totalCurrency += CPS;
    // Update the knockout view model to refelect player cash
    appView.game.playerCash(totalCurrency);
    // Set the last clicks to the players new totalClick number
    lastClicks = appView.player.totalClicks();
    lastClicksPerSecond = clickRate;


    setTimeout(updateMoney, 1000);

}


// credit to http://cubiq.org/remove-onclick-delay-on-webkit-for-iphone
// for the fix to the iOS delay below

function NoClickDelay(el) {
    this.element = el;
    if( window.Touch ) this.element.addEventListener('touchstart', this, false);
}

NoClickDelay.prototype = {
    handleEvent: function(e) {
        switch(e.type) {
            case 'touchstart': this.onTouchStart(e); break;
            case 'touchmove': this.onTouchMove(e); break;
            case 'touchend': this.onTouchEnd(e); break;
        }
    },

    onTouchStart: function(e) {
        e.preventDefault();
        this.moved = false;

        this.element.addEventListener('touchmove', this, false);
        this.element.addEventListener('touchend', this, false);
    },

    onTouchMove: function(e) {
        this.moved = true;
    },

    onTouchEnd: function(e) {
        this.element.removeEventListener('touchmove', this, false);
        this.element.removeEventListener('touchend', this, false);

        if( !this.moved ) {
            // Place your code here or use the click simulation below
            var theTarget = document.elementFromPoint(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
            if(theTarget.nodeType == 3) theTarget = theTarget.parentNode;

            var theEvent = document.createEvent('MouseEvents');
            theEvent.initEvent('click', true, true);
            theTarget.dispatchEvent(theEvent);
        }
    }
};
