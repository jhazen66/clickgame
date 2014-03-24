
// Class representing the game
function Game(appView ){
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