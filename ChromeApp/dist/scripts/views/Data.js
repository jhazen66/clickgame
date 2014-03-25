// Class to hold game data for stats
function Data(key, value){
	var self = this;
	self.time = ko.observable(new Date());
	self.key = ko.observable(key);
	self.value = ko.observable(value);
}