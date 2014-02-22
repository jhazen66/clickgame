// Class representing Item Button
function ItemButton(name, price, cps, symbol, owned, basePrice, hasPlayerSeen, maxSellableItems) {
    var self = this;
    self.name = name;
    self.price = ko.observable(price);
    self.cps = cps;
    self.symbol = symbol;
    self.owned = ko.observable(owned);
    self.basePrice = ko.observable(basePrice);
    self.hasPlayerSeen = ko.observable(hasPlayerSeen);
    self.maxSellableItems = ko.observable(maxSellableItems);

    self.formattedPrice = ko.computed(function () {
        // Use accounting.js to format money
        // return accounting.formatMoney(self.price(),"$",0);
        
        if (self.owned() >= self.maxSellableItems()) {
            return "Sold out";    
        }

        if(self.price() < 1000){
           return "$" + Math.round(self.price()*10)/10; // return "$" + (Math.round(self.price()*10)/10);
        } else if (self.price() < 1000000) {
            return "$" + (self.price() / 1000).toFixed(1) + "K";
        } else if (self.price() < 1000000000) {
            return "$" + (self.price() / 1000000).toFixed(2) + "M";
        } else if (self.price() < 1000000000000) {
            return "$" + (self.price() / 1000000000).toFixed(3) + "B";
        } else if (self.price() < 1000000000000000) {
            return "$" + (self.price() / 1000000000000).toFixed(4) + "T";
        }
    })

    // Check to see if a player can afford an item
    self.canAfford = ko.computed(function(){
        var pCash = appView.game.playerCash();
        if(self.price() <= pCash){
           return true;
        } else {
            return false;
        }
    });

    self.affordProgressValue = ko.computed(function(){
        var pCash = appView.game.playerCash();
        return pCash / self.price();
    });

    self.showProgress = ko.computed(function(){
        // Check to make sure showing progres makes sense
        if(self.owned() >= self.maxSellableItems()){
            return false;
        }
        // Show progress if player doesn't have enought cash to buy
        var pCash = appView.game.playerCash();
        if(pCash/self.price() < 1){
            return true;
        } else {
            return false;
        }
    });

    self.inRange = ko.computed(function(){
        var pCash = appView.game.playerCash();
        if( (self.price() <= ((pCash + 10) * 5) || self.hasPlayerSeen() === "true") ){
            self.hasPlayerSeen("true");
            return true;
        } else {
            return false;
        }
    })


    // Buying an item increases the price as well
    // Using the compound interest formula
    self.buyItem = function (e) {
        window.stattus = self.maxSellableItems();
        if (totalCurrency >= self.price() && self.owned() < self.maxSellableItems()) {
            totalCurrency -= self.price();
            appView.player.totalMoneySpent(appView.player.totalMoneySpent() + self.price());
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