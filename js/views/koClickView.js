// Class representing Item Button
function ItemButton(name, price, cps, symbol, owned, basePrice) {
    var self = this;
    self.name = name;
    self.price = ko.observable(price);
    self.cps = cps;
    self.symbol = symbol;
    self.owned = ko.observable(owned);
    self.basePrice = ko.observable(basePrice);

    self.formattedPrice = ko.computed(function () {
        // Use accounting.js to format money
        return accounting.formatMoney(self.price(),"$",0);
    })

    // Check to see if a player can afford an item
    self.canAfford = ko.computed(function(){
        var pCash = koClickView.game.playerCash();
        if(self.price() <= pCash){
           return true;
        } else {
            return false;
        }
    })

    self.affordProgressValue = ko.computed(function(){
        var pCash = koClickView.game.playerCash();
        return pCash / self.price();
    })

    self.showProgress = ko.computed(function(){
        var pCash = koClickView.game.playerCash();
        if(pCash/self.price() < 1){
            return true;
        } else {
            return false;
        }
    })


    // Buying an item increases the price as well
    // Using the compound interest formula
    self.buyItem = function (e) {
        if (totalCurrency >= self.price()) {
            totalCurrency -= self.price();
            CPS += self.cps;
            // Increase the players inventory
            self.owned(self.owned() + 1);
            // Increase the item price
            self.price( self.basePrice() + (self.basePrice() * (.05 * self.owned())) );
        }
    }

    
    // Selling an item comes with a cost
    // Only return 90% of the previous purchase price
    self.sellItem = function (e){
        if(self.owned() > 0){
            // Calculate the refund
            var refund = 0;
            if(self.owned() === 1){
                refund = (self.basePrice() + (self.basePrice() * (.05 * self.owned()))  *.9);
            }else{
                refund = (self.basePrice() + (self.basePrice() * (.05 * self.owned()) - 1)  *.9);
            }
            
            // Give the refund to the player
            totalCurrency += refund;
            // Take the item from the inventory
            self.owned(self.owned() - 1);
            // Set the lower price
            self.price( self.basePrice() + (self.basePrice() * (.05 * self.owned())) );
            // Reduce the CPS
            CPS -= self.cps;
        }
    }
}


// Class representing the game
function Game(){
    var self = this;
    self.playerCash = ko.observable(0);
    self.CPS = ko.observable(0);
    self.soundState = ko.observable(false);
    
    self.formattedCPS = ko.computed(function(){
        // if(Math.round(self.CPS()*10)/10 === self.CPS())
        if(Math.round(self.CPS() * 10)/10 === Math.round(self.CPS()) ){
            return accounting.formatNumber(Math.round(self.CPS()*10)/10,0,",");
        } else {
            return accounting.formatNumber(Math.round(self.CPS()*10)/10,1,",");
        }
        
    })

    self.formattedPlayerCash = ko.computed(function(){
        return accounting.formatMoney(self.playerCash(), "$", 0);
    })
}

function Player(name){
    this.name = name;
    this.totalClicks = ko.observable(0);
    this.totalMoneySpent = ko.observable(0);
    this.totalItemsPurchased = ko.observable(0);
}



var playerStats = {
    name:"",
    totalClicks:""
}

// Viewmodel for the click application.
var koClickView =  {    
    buttons : ko.observableArray([]),
    game: new Game(),
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
    koClickView.buttons = ko.observableArray([]);
    loadKoData(clickItems);
}

function loadKoData(clickItems){
    for (var i = 0; i < clickItems.length; i++) {
        koClickView.buttons.push(new ItemButton(clickItems[i].name,
            clickItems[i].price,
            clickItems[i].cps,
            clickItems[i].symbol,
            clickItems[i].owned,
            clickItems[i].basePrice))
    }
}

loadKoData(clickItems);