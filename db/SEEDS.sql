INSERT INTO heroku_dd2cb150d033ed5.weather (`weatherCondition`, `dayDescription`, `nightDescription`)
VALUES
("clear sky", "The sun shines bright in the sky above you, with nary a cloud in sight.", "The moon shines bright above you in the star-splashed night sky."),
("few clouds", "The sun is shining high in the sky, with pretty white clouds wafting along in the breeze.", "The moon shines down on you from a starry sky with a few dark shadows of clouds."),
("scattered clouds", "The sky is gray with clouds, spread evenly across the sky like a dour blanket.", "The night is dark, with clouds covering the moon and stars."),
("broken clouds", "The sky is patchy with clouds and blue, shards of light shining through briefly only to be obscured by clouds.", "The night sky shows patches of shadow and patches of starry brightness."),
("shower rain", "Rain spatters down from a cloudy sky, but bits of blue show here and there.", "Rain mists down from the dark night sky."),
("rain", "Rain pours down from a sky uniformly covered by gray clouds.", "Rain pours down from the dark sky."),
("thunderstorm", "Rain is sheeting down from ominously dark clouds lit by slashes of lightning. Thunder booms from time to time.", "Rain sheets down as the dark night is pierced by shards of lightning and the booming crack of thunder."),
("snow", "Snow drifts down from the white sky.", "Snow drifts down in the darkness with a soft patter."),
("mist", "The landscape is partially obscured by a damp mist.", "Wavering moonlight filters down through the damp mist.");


INSERT INTO actions (actionName, function, selfDescription, roomDescription)
VALUES ("get", "getItem()", "You pick up a ", " picks up a "),
("look", "lookAround()", "You look around.", " glances around."),
("drop", "dropItem()", "You drop a ", " drops a "),
("inventory", "checkInventory()", Null, Null); 


INSERT INTO help (commandName, commandBriefDescription, commandLongDescription, waysToCall, exampleCall, exampleResult)
VALUES
("get", "Pick up an item.", "When you type a get command word followed by an item in your location that is free to pick up, you will add it to your inventory. If the item isn't free to pick up, you will get a result of 'You can't pick that up!'", "get (g), pick up, grab, take", "get the mushroom", "You pick up a mushroom."),
("drop", "Drop an item.", "When you type a drop command word followed by an item in your inventory, you will drop it into your location.", "drop (d), discard", "drop mushroom", "You drop a mushroom."),
("look", "You look around you", "When you type a look command word with nothing after it, you will look around your location, seeing the description, possible exits, and items nearby.", "look (l), look around", "look around", "You look around. \n An Empty Room: \n Four bare, white walls surround you. A simple bed and a chest are the room's only furniture. A wooden door leads west.");


INSERT INTO locations (locationName, locationDayDescription, exitN, exitE, exitS, exitW)
VALUES ("Pumpkin Patch Center", "You are at the heart of a pumpkin patch. Though on the vine, and uncarved, the pumpkins you see out of the corners of your vision seem to be leering evilly at you, like jack-o-lanterns.", 11, 21, 31, 41),
("Pumpkin Patch North", "The pumpkin patch stretches the the east, west and south of you. The pumpkins surrounding you are craggy and crooked, and the longer you look at them, the creepier they seem.", Null, 51, 1, 61),
("Pumpkin Patch East", "The pumpkin patch stretches to the north, west, and south of you. The pumpkins around you a unnervingly creepy. Uncarverd pumpkins shouldn't be creepy, should they?", 51, Null, 71, 1);


INSERT INTO quests (questTitle, Line1, Line2, Hint1, XPorItem, reward, completionItem)
VALUES ("Find my missing sock.", "I'm pretty sure I put it in the washing machine, but it didn't come out of the dryer. Can you help me?", "Oh thank you! I'm so glad. I live at 4532 Little Bittle Lane, out east of the inn.", "I suppose you could my closet, but I already looked twice...", True, 500, 101);


INSERT INTO items (itemName, description, category)
VALUES
("branch", "a dry, brown branch", "nature"),
("mushroom", "a small, white mushroom with a round top", "nature"),
("sock", "a lone argyle sock, blue and yellow", "household"),
("pumpkin pie", "a whole pumpkin pie! It smells like autumn", "food");


INSERT INTO players (email, password, characterName, isLiving, isNPC, WIS, DEX, STR, HP, race, class, inventory, backstory, description, headSlot, neckSlot, torsoSlot, rightHandSlot, leftHandSlot, legsSlot, feetSlot, ringSlot, handsSlot, twoHands)
VALUES
("moop@mop.com", "verysecure", "Felix", True, True, 10, 10, 10, 50, "Cat", "Rogue", True, "Felix has lived in the inn since he showed up as a young cat. He came in one morning when the innkeeper opened the door, and never left.", "A black and white cat with short hair, and a slight notch in their right ear", 0, 121, 0, 0, 0, 0, 0, 0, 0, 0);


