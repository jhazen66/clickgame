function Player(name){
    var self = this;
    self.name = name;
    self.totalClicks = ko.observable(0);
    self.highestClicksPerSecond = ko.observable(0);
    self.lastClicksPerSecond = ko.observable(0);
    self.totalMoneySpent = ko.observable(0);
    self.totalItemsPurchased = ko.observable(0);
    self.clickData = ko.observableArray([]);

    self.addPlayerClickData = function(value){
        self.clickData.push(new Data("click", value));
        self.totalClicks(self.totalClicks() + 1);
    }

    self.formatTotalMoneySpent = ko.computed(function(){
        return accounting.formatMoney(self.totalMoneySpent(),"$",0);
    })
}

var playerStats = {
    name:"",
    totalClicks:""
}

// Viewmodel for the click application.
var appView =  {    

    buttons : ko.observableArray([]),
    attributions: ko.observableArray([]),
    game: new Game(),
    player: new Player(),
    playerCash : ko.observable(0),
    CPS: ko.observable(0),

    //this function launches a new page with the attribution link
    showAttribution : function(item) {
        console.log("hit function: " + item.attributionLink);
        window.open(item.attributionLink);
    }

}


//Game inventory data
var clickItems = [
        { name: "Caterpillar", price: 10, cps: .1, symbol:"images/svg/caterpillar.svg", 
          owned: 0, basePrice:10, hasPlayerSeen:false , maxSellableItems:20,
          designer: "Adam Mullin",
          attributionLink: "http://thenounproject.com/term/caterpillar/5721/" 
        },
        { name: "Mouse", price: 100, cps: 1, symbol:"images/svg/mouse.svg", 
          owned: 0, basePrice:100, hasPlayerSeen:false , maxSellableItems:30,
          designer: "Darrin Higgins",
          attributionLink: "http://thenounproject.com/term/mouse/27457/" 
        },
        { name: "Chicken", price: 1000, cps: 5, symbol:"images/svg/chicken.svg", 
          owned: 0, basePrice:1000, hasPlayerSeen:false , maxSellableItems:40,
          designer: "Adam Zubin",
          attributionLink: "http://thenounproject.com/term/chicken/33759/" 
        },        
        { name: "Cat", price: 5000, cps: 10, symbol:"images/svg/cat.svg", 
          owned: 0, basePrice:5000, hasPlayerSeen:false , maxSellableItems:50,
          designer: "Lucie Parker",
          attributionLink: "http://thenounproject.com/term/cat/1836/"
        },        
        { name: "Dog", price: 13000, cps: 25, symbol:"images/svg/dog.svg", 
          owned: 0, basePrice:13000, hasPlayerSeen:false , maxSellableItems:60,
          designer: "Marta Michalowska",
          attributionLink: "http://thenounproject.com/term/dog/8126/"
        },
        { name: "Kangaroo", price: 30000, cps: 50, symbol:"images/svg/kangaroo.svg", 
          owned: 0, basePrice:30000, hasPlayerSeen:false , maxSellableItems:70,
          designer: "Jennifer Cozzette",
          attributionLink: "http://thenounproject.com/term/kangaroo/13785/" 
        },
        { name: "Octopus", price: 100000, cps: 100, symbol:"images/svg/octopus.svg", 
          owned: 0, basePrice:100000, hasPlayerSeen:false , maxSellableItems:80,
          designer: "Jason Grube",
          attributionLink: "http://thenounproject.com/term/octopus/15331/" 
        },
        { name: "Robot", price: 1500000, cps: 250, symbol:"images/svg/robot.svg", 
          owned: 0, basePrice:1500000, hasPlayerSeen:false , maxSellableItems:90,
          designer: "Ricardo Moreira",
          attributionLink: "http://thenounproject.com/term/robot/11018/" 
        }
    ];


var media = [
    {
        symbol:"images/svg/coins.svg", 
        attributionLink:"http://thenounproject.com/term/coins/7970/", 
        designer:"Anton Håkanson"
    },
    {
        symbol:"images/svg/plus.svg", 
        attributionLink:"http://thenounproject.com/term/plus/2875/", 
        designer:"P.J. Onori"
    },
    {
        symbol:"images/svg/click.svg", 
        attributionLink:"http://thenounproject.com/term/click/12280/", 
        designer:"Rohan Gupta"
    },
    {
        symbol:"images/svg/tap.svg", 
        attributionLink:"http://thenounproject.com/term/tap-and-hold/2936/", 
        designer:"P.J. Onori"
    }
]

//jykwak: 
//helper function to reset the board
//doesn't work if this function moved below loadKoDat(clickItems); line

function resetKoData() {
    appView.buttons = ko.observableArray([]);
    loadKoData(clickItems);
}

function loadKoData(clickItems){

    for (var i = 0; i < clickItems.length; i++) {
        appView.buttons.push(new ItemButton(clickItems[i].name,
            clickItems[i].price,
            clickItems[i].cps,
            clickItems[i].symbol,
            clickItems[i].owned,
            clickItems[i].basePrice,
            clickItems[i].hasPlayerSeen,
            clickItems[i].maxSellableItems,
            clickItems[i].designer,
            clickItems[i].attributionLink))
    }
}

loadKoData(clickItems);


function loadKoAttributionData(clickItems, media){

    console.log("loading attributions");

    //first add the attributions from the list of things you can buy
    for (var i = 0; i < clickItems.length; i++) {
        appView.attributions.push({
          "symbol":clickItems[i].symbol, 
          "designer":clickItems[i].designer, 
          "attributionLink":clickItems[i].attributionLink
        })
    }

    //now add the attributions from any other media used in the app
    for (var i = 0; i < media.length; i++) {
        appView.attributions.push({
          "symbol":media[i].symbol, 
          "designer":media[i].designer, 
          "attributionLink":media[i].attributionLink
        })
    }


}

loadKoAttributionData(clickItems, media);

