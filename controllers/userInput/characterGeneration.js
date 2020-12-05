// Character object
function Character (name, level=1, xp=0, race="Human", profession="Sandwich-maker", wisdom, dexterity, strength, hitpoints, description) {
    this.name = name;
    this.level = level;
    this.xp = xp;
    this.race = race;
    this.profession = profession;
    this.wisdom = wisdom;
    this.dexterity = dexterity;
    this.strength = strength;
    this.hitpoints = hitpoints;
    this.description = description;
}

// method which prints all of the stats for a character
Character.prototype.printStats = function() {
	console.log("Name: " + this.name + "\nRace: " + this.race +
	"\nProfession: " + this.profession + "\nDescription:" + this.description + "\nWisdom: " + this.wisdom + "\nDexterity: " +
	this.dexterity + "\nStrength: " + this.strength + "\nHitPoints: " + this.hitpoints);
	console.log("\n-------------\n");
};

// method which determines whether or not a character's "hitpoints" are less than zero
// and returns true or false depending upon the outcome
Character.prototype.isAlive = function() {
	if (this.hitpoints > 0) {
		console.log(this.name + " is still alive!");
		console.log("\n-------------\n");
		return true;
	}
	console.log(this.name + " has died!");
	return false;
};

Character.prototype.levelUp = function(levelXP) {
    if (this.xp >= levelXP){
        this.level += 1;
        this.strength += 10;
        this.hitpoints += 20;
    }
}

// method which takes in a second object and decreases their "hitpoints" by this character's strength
Character.prototype.attack = function(player2) {
	player2.hitpoints -= this.strength;
};

Character.prototype.statsIncrease = function(statToMod, modifier) {
    this.statToMod += modifier;
}

module.exports = Character
// Testing code above

