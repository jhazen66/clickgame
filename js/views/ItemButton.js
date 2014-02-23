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

        //get the price once
        var price = self.price();
        var suffix = "";
        var abbreviatedPrice = 0;

        //abbreviate the value and set the suffix
        if(price < 1000){
            abbreviatedPrice = Math.round(price*10)/10; 
        } else if (price < 1000000) {
            abbreviatedPrice = (price / 1000);
            suffix = "K";
        } else if (price < 1000000000) {
            abbreviatedPrice = (price / 1000000);
            suffix = "M";
        } else if (price < 1000000000000) {
            abbreviatedPrice = (price / 1000000000);
            suffix = "B";
        } else if (price < 1000000000000000) {
            abbreviatedPrice = (price / 1000000000000);
            suffix = "T";
        }

        //see if there is a decimal part
        var decimals = (abbreviatedPrice + "").split(".");   

        //trim the decimal part to 2 digits
        if(decimals[1]){
            decimals[1] = decimals[1].substring(0,2);
            abbreviatedPrice = decimals[0] + "." + decimals[1];
        }

        //if the remaining decimal part is "00" then ignore it
        if ( decimals[1] && (decimals[1] == "00") ) { 
            abbreviatedPrice = decimals[0];
        }

        //concatenate all the parts to make the final string
        return "$" + abbreviatedPrice + suffix;


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

        if((self.cps * 10) < CPS && self.owned() >= self.maxSellableItems() ) {
            return false;
        }
        else if( (self.price() <= ((pCash + 10) * 5) || self.hasPlayerSeen() === "true") ){
            self.hasPlayerSeen("true");
            return true;
        } else {
            return false;
        }
    })


    // Buying an item increases the price as well
    // Using the compound interest formula
    self.buyItem = function (e) {
        
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