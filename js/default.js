// Initialize my ko view
$(document).ready(function () {
    try{
        load();
        // Apply datamodel binding
        ko.applyBindings(koClickView());
        // Start gameloop
        requestAnimFrame(gameLoop);
        // Start update money loop
        updateMoney();
        // Autosave
        setTimeout(save, 10000, koClickView);
    } catch (e) {
        window.status = e.message;
    }

    // Doesn't seem to work on Safari/Chrome on iPhone.

    //FastClick.attach(document.body);
    //var clickCoverElement = $("#clickCover");
    //alert(clickCoverElement);
    //// Add click handler for button
    //if (window.Touch) {

    //    clickCoverElement.addEventListener('touchStart', mouseDown, false);
    //    clickCoverElement.addEventListener('touchEnd', mouseUp, false);
    //    alert("Using Touch");
    //} else {
    //    clickCoverElement.addEventListener('mouseDown', mouseDown, false);
    //    clickCoverElement.addEventListener('mouseUp', mouseUp, false);
    //    alert("Using Mouse");
    //}
});

function save() {
    try {
        if (typeof (localStorage) === 'undefined') {
            alert('Your browser does not support HTML5 localStorage. Try upgrading.');
        } else {
            try {
                window.localStorage.setItem("currency", totalCurrency.toString());
                window.localStorage.setItem("cps", ClicksPS.toString());

            } catch (e) {
                if (e === QUOTA_EXCEEDED_ERR) {
                    alert('Quota exceeded!');
                }
            }

            //window.status = (localStorage.getItem("currency")); 
            //localStorage.removeItem("currency"); 
        }
    } catch (e) {
        window.status = e.message;
    }

    setTimeout(save, 10000);
}

function load() {
    try {
        window.status = "loading...";
        if (typeof (localStorage) != 'undefined') {
            var savedCurrency = parseInt(window.localStorage.getItem("currency"));
            var savedCps = parseFloat(window.localStorage.getItem("cps"));

            window.status = "savedCurrency = " + savedCurrency;
            if (!isNaN(savedCurrency)) {
                totalCurrency = savedCurrency;
            }
            if(!isNaN(savedCps)){
                ClicksPS = savedCps;
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

}

// Setup game variables
var totalCurrency = new Number();
var ClicksPS = new Number();


// Animate the click circle
// For iPhone use the onTouchStart instead of onMouseDown
function mouseDown(e) {
    showClick(1);
    $("#clickArea").removeClass("clickAnimationCircle").addClass("clickAnimationCircle");
    totalCurrency += 1;
}

function mouseUp(e) {
    setTimeout(function () { $('#clickArea').removeClass("clickAnimationCircle"); }, 150);
}

function showClick(num) {
    var obj = document.createElement("p");
    obj.setAttribute("class", "clickAnimationPlus");
    obj.innerText = "+" + num;
    document.getElementById("clickArea").appendChild(obj);
    setTimeout(destroyClick, 300, obj);
}

function destroyClick(obj) {
    document.getElementById("clickArea").removeChild(obj);
}

// Add a prototype function to numbers for handling money formating
Number.prototype.formatMoney = function (c, d, t) {
    var n = this,
        c = isNaN(c = Math.abs(c)) ? 2 : c,
        d = d == undefined ? "." : d,
        t = t == undefined ? "," : t,
        s = n < 0 ? "-" : "",
        i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "",
        j = (j = i.length) > 3 ? j % 3 : 0;
    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};

// Start the gameloop
window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
           window.webkitRequestAnimationFrame ||
           window.mozRequestAnimationFrame ||
           window.msRequestAnimationFrame ||
           function (callback) {
                window.setTimeout(callback, 1000 / 60);
           };
})();


function gameLoop() {
    document.getElementById("totalCurrency").innerText = "💰" + totalCurrency.formatMoney(0, '.', ',');
    document.getElementById("totalCps").innerText = ClicksPS.toFixed(2);
    requestAnimFrame(gameLoop);
    
}

function updateMoney() {
    totalCurrency += ClicksPS;
    setTimeout(updateMoney, 1000);
}