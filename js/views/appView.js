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
}

var playerStats = {
    name:"",
    totalClicks:""
}

// Viewmodel for the click application.
var appView =  {    
    buttons : ko.observableArray([]),
    game: new Game(),
    player: new Player(),
    playerCash : ko.observable(0),
    CPS: ko.observable(0)
}


//Game inventory data
var clickItems = [
        { name: "Mouse", price: 10, cps: .1, symbol:"img/mouse.png", owned: 0, basePrice:10 },
        { name: "Dog", price: 100, cps: 1, symbol:"img/dog.png", owned: 0, basePrice:100 },
        { name: "Chicken", price: 500, cps: 10, symbol:"img/chicken.png", owned: 0, basePrice:500 },
        { name: "Octopus", price: 3000, cps: 25, symbol:"img/octopus.png", owned: 0, basePrice:3000 },
        { name: "Millipede", price: 10000, cps: 100, symbol:"img/Millipede.png", owned: 0, basePrice:10000 }
    ];

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
            clickItems[i].basePrice))
    }
}

loadKoData(clickItems);