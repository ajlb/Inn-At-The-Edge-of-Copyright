USE `heroku_dd2cb150d033ed5`;

INSERT INTO heroku_dd2cb150d033ed5.weather (weatherCondition, dayDescription, nightDescription)
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


INSERT INTO actions (actionName, commandBriefDescription, commandLongDescription, waysToCall, exampleCall, exampleResult)
VALUES
("get", "Pick up an item", "When you type a get command word followed by an item in your location that is free to pick up, you will add it to your inventory. If the item isn't free to pick up, you will get a result of 'You can't pick that up!'", "get, g, pick up, grab", "You pick up a ", " picks up a "),
("look", "You look around you.", "When you type a look command word with nothing after it, you will look around your location, seeing the description, possible exits, and items nearby.", "You look around.", "look, l, look around", " glances around."),
("drop", "You drop an item", "When you type a drop command word followed by an item in your inventory, you will drop it into your location.", "drop, d, discard", "You drop a ", " drops a "),
("inventory", "You check your inventory", "When you type an inventory command, you will recieve a list of all items in your inventory", "inventory, i, check inventory", "inventory", "You have 3 mushrooms, 1 branch, and a frog."),
("move", "You move through an exit", "When you type a move command word followed by an available exit from your location, you will move in that direction.", "move, m, go, walk", "You go ", " goes "),
("speak", "You speak.", "When you type a speak command word followed by other text, your other text will be spoken aloud to your location. For yelling, see yell.", "speak, s, talk, t, chat, c, say", "say Hello!", "character: Hello!"),
("wear", "You put on a wearable item.", "When you type a wear command followed by a valid item in your inventory, you will put it on if you're not already wearing something there.", "wear, put on, don", "wear green socks", "You put on green socks."),
("remove", "You take off an item you are wearing.", "When you type a remove command followed by an item you are wearing, you will take it off and add it to your inventory.", "take off, remove, doff", "remove green socks", "You take off green socks."),
("stats", "You call up your character stats.", "When you type stats, you will see a list of your stats and their values.", "stats", Null, Null),
("juggle", "You juggle something.", "When you type juggle, followed by a number, followed by an appropriate item, you will attempt to juggle that number of those items if you have them.", "juggle", Null, Null);

INSERT INTO locations
    (id,locationName, dayDescription, nightDescription, exitN, exitE, exitS, exitW, region)
VALUES
    (1101, "Pumpkin Patch Center", "You are at the heart of a pumpkin patch. Though on the vine, and uncarved, the pumpkins you see out of the corners of your vision seem to be leering evilly at you, like jack-o-lanterns.", Null, 1102, 1103, 1109, 1105, "Halloween"),
    (1102, "Pumpkin Patch North", "The pumpkin patch stretches to the east, west and south of you. The pumpkins surrounding you are craggy and crooked, and the longer you look at them, the creepier they seem.", Null, 1110, 1106, 1101, 1107, "Halloween"),
    (1103, "Pumpkin Patch East", "The pumpkin patch stretches to the north, west, and south of you. The pumpkins around you a unnervingly creepy. Uncarverd pumpkins shouldn't be creepy, should they?", Null, 1106, Null, 1109, 1101, "Halloween"),
    (1104, "Pumpkin Patch South", "The pumpkin patch stretches to the east, west, and north of you. The patch seems dark somehow even in the day. Shadows seem to take the shape of creatures watching you.", Null, Null, 1109, Null, 1108, "Halloween"),
    (1105, "Pumpkin Patch West", "The pumpkin patch stretches to the north, east, and south of you. The pumpkins clustered around you seem to be pressing closer, making what should be an open field feel alarmingly claustrophobic.", Null, 1107, 1101, 1108, Null, "Halloween"),
    (1106, "Pumpkin Patch Northeast", "The pumpkin patch surrounds you to the west and south. The pumpkins here give of an ineffible feeling of sadness, and you feel tears prick the corners of your eyes.", Null, Null, Null, 1103, 1102, "Halloween"),
    (1107, "Pumpkin Patch Northwest", "The pumpkin patch surrounds you to the east and south, and the path to the Haunted Forest beckons toward the north. The pumpkin patch radiates a sinister feeling, and the path north feels equally foreboding. You feel trapped.", Null, 1112, 1102, 1105, Null, "Halloween"),
    (1109, "Pumpkin Patch Entrance", "The pumpkin patch surrounds you to the north and west. and you can see the inn to the south. The pumpkins closest to the inn look plump and cheery, but as the patch grows more dense to the northwest, it seems to emanate menace and warning.", Null, 1101, 1103, 1011, 1104, "Halloween"),
    (1108, "Pumpkin Patch Southwest", "The pumpkin patch surrounds you to the north and east, leaving you corned against a tall fence backed by dark and impenetrable forest. The patch seems darker than you think the day should be, and what should be ordinary pumpkins are radiating ominous threat. Your pulse starts to quicken as your instincts pick up on predatory intent.", Null, 1105, 1104, Null, Null, "Halloween"),
    (1110, "Rabbit Hole", Null, Null, Null, 1111, 1102, Null, "Halloween"),
    (1111, "South Tunnel", Null, Null, 1127, Null, Null, 1110, "Halloween"),
    (1112, "Path to Haunted Forest", Null, Null, 1123, Null, 1107, Null, "Halloween"),
    (1127, "West Tunnel", Null, Null, 1118, Null, 1111, 1113, "Halloween"),
    (1113, "East Tunnel", Null, Null, Null, 1127, 1114, 1115, "Halloween"),
    (1114, "Cavetown Ruins", Null, Null, 1113, Null, Null, Null, "Halloween"),
    (1115, "Crystal Cavern", Null, Null, 1116, 1113, Null, Null, "Halloween"),
    (1116, "Raging River", Null, Null, Null, 1117, 1115, 1119, "Halloween"),
    (1117, "Cavern Lake", Null, Null, Null, 1118, Null, 1116, "Halloween"),
    (1118, "Surface Elevator", Null, Null, Null, 1210, 1127, 1218, "Halloween"),
    (1123, "Tree Tunnel South", Null, Null, 1122, Null, 1112, Null, "Halloween"),
    (1122, "Tree Tunnel North", Null, Null, 1121, Null, 1123, Null, "Halloween"),
    (1121, "Large Clearing", Null, Null, 1124, 1120, 1122, 1126, "Halloween"),
    (1120, "The Seven Stones", Null, Null, 1119, Null, 1121, Null, "Halloween"),
    (1119, "Murky Pond", Null, Null, Null, Null, 1120, Null, "Halloween"),
    (1124, "The Elder Trees", Null, Null, Null, 1125, 1121, Null, "Halloween"),
    (1125, "The Great Tree", Null, Null, Null, Null, Null, 1124, "Halloween"),
    (1126, "Crazy Cat Lady's Shack", Null, Null, Null, 1121, Null, Null, "Halloween"),
    (1011, "Path to Pumpkin Patch", Null, Null, 1109, 1009, 1103, Null, "The Inn"),
    (1009, "Inn Garden", Null, Null, Null, 1008, 1007, 1011, "The Inn"),
    (1008, "Backyard", Null, Null, Null, Null, 1007, 1009, "The Inn"),
    (1007, "Inn Kitchen", Null, Null, 1009, 1008, 1003, Null, "The Inn"),
    (1003, "Inn Lobby", Null, Null, 1007, 1005, 1004, 1010, "The Inn"),
    (1004, "Inn Laundry Room", Null, Null, 1003, 1005, Null, 1010, "The Inn"),
    (1002, "Hallway", Null, Null, Null, 1003, Null, Null, "The Inn"),
    (1010, "Library", Null, Null, Null, 1003, 1004, Null, "The Inn"),
    (1005, "Front Yard", Null, Null, 1003, 1201, 1006, 1004, "The Inn"),
    (1006, "Shed", Null, Null, 1005, Null, Null, Null, "The Inn"),
    (1001, "Start Room", Null, Null, Null, 1002, Null, Null, "The Inn"),
    (1201, "Crossroads", Null, Null, 1203, 1204, 1202, 1105, "Country and Town"),
    (1203, "North Country Lane", Null, Null, 1208, Null, 1201, Null, "Country and Town"),
    (1202, "South Country Lane", Null, Null, 1201, Null, 1207, Null, "Country and Town"),
    (1204, "Meadow Path", Null, Null, Null, 1205, Null, 1201, "Country and Town"),
    (1205, "Creek Bridge", Null, Null, Null, 1301, 1206, 1204, "Country and Town"),
    (1206, "Pond's Edge", Null, Null, 1205, 1302, Null, Null, "Country and Town"),
    (1207, "Sky Cannon", Null, Null, 1202, 1403, Null, Null, "Country and Town"),
    (1208, "Town Southwest", Null, Null, 1220, 1209, 1203, Null, "Country and Town"),
    (1209, "Town Southeast", Null, Null, 1211, Null, Null, 1208, "Country and Town"),
    (1210, "Item Store", Null, Null, Null, 1212, Null, 1220, "Country and Town"),
    (1211, "Town East", Null, Null, 1214, Null, 1209, 1212, "Country and Town"),
    (1212, "Garden", Null, Null, Null, 1211, Null, 1210, "Country and Town"),
    (1213, "Town Northwest", Null, Null, Null, 1214, 1220, 1216, "Country and Town"),
    (1214, "Town Northeast", Null, Null, 1217, 1215, 1211, 1213, "Country and Town"),
    (1215, "River's Edge", Null, Null, Null, Null, Null, 1214, "Country and Town"),
    (1216, "Special Item Store", Null, Null, Null, 1220, Null, Null, "Country and Town"),
    (1217, "Town North", Null, Null, Null, Null, 1214, 1219, "Country and Town"),
    (1218, "Haunted Shack", Null, Null, Null, Null, Null, 1118, "Country and Town"),
    (1219, "Wishing Well", Null, Null, Null, 1217, Null, 1218, "Country and Town"),
    (1301, "Steep Hike West", Null, Null, Null, 1303, Null, 1205, "Mountain"),
    (1302, "Gentle Slope West", Null, Null, Null, 1311, Null, 1206, "Mountain"),
    (1303, "Steep Hike East", Null, Null, Null, 1304, 1306, 1301, "Mountain"),
    (1304, "Mountain Trail North", Null, Null, 1305, Null, 1307, 1303, "Mountain"),
    (1305, "Girl's Bathroom", Null, Null, Null, Null, 1304, Null, "Mountain"),
    (1306, "Waterfall", Null, Null, 1303, Null, Null, Null, "Mountain"),
    (1307, "Mountain Trail Center", Null, Null, 1304, 1308, 1309, Null, "Mountain"),
    (1308, "Crater's Rim", Null, Null, Null, Null, Null, 1307, "Mountain"),
    (1309, "Mountain Trail South", Null, Null, 1307, Null, 1310, 1311, "Mountain"),
    (1310, "Cliff's Edge", Null, Null, 1309, Null, 1401, Null, "Mountain"),
    (1311, "Gentle Slope East", Null, Null, Null, 1309, Null, 1302, "Mountain"),
    (1401, "Entrance to Cloud City", Null, Null, 1310, Null, 1402, Null, "Cloud City"),
    (1402, "Sky Pond", Null, Null, Null, 1401, Null, 1403, "Cloud City"),
    (1403, "Sky Ruins", Null, Null, Null, 1402, 1404, Null, "Cloud City"),
    (1404, "Sky Poppy Field", Null, Null, 1403, Null, 1405, Null, "Cloud City"),
    (1405, "Mystery Button", Null, Null, 1404, 1406, Null, Null, "Cloud City"),
    (1406, "Sky Fishing Hole", Null, Null, Null, 1407, Null, 1405, "Cloud City"),
    (1407, "Fairy Godfather's Sky Hut", Null, Null, Null, Null, Null, 1406, "Cloud City");


INSERT INTO quests (questTitle, dialogue, hints, XPorItem, reward, completionItem, questToken)
VALUES ("Find my missing sock.", "I'm pretty sure I put it in the washing machine, but it didn't come out of the dryer. Can you help me?;Oh thank you! I'm so glad. I live at 4532 Little Bittle Lane, out east of the inn.", "I suppose you could my closet, but I already looked twice...", True, 500, 101, Null);


INSERT INTO items (itemName, `description`, category)
VALUES
("branch", "a dry, brown branch", "nature"),
("mushroom", "a small, white mushroom with a round top", "nature"),
("sock", "a lone argyle sock, blue and yellow", "household"),
("pumpkin pie", "a whole pumpkin pie! It smells like autumn", "food"),
("collar", "A red collar with a silver buckle. It has pictures of fish on it.", "clothing"),
("leather gloves", "nice leather gloves. They look protective.", "armor");

UPDATE items SET HPeffect = 10 WHERE itemName = "leather gloves";

INSERT INTO items (itemName, `description`, category, neckSlot, DEXeffect)
VALUES ("collar", "a red collar with a silver buckle. It has pictures of fish on it.", "clothing", 1, 2);


INSERT INTO players (email, `password`, characterName, isLiving, isNPC, WIS, DEX, STR, HP, race, class, inventory, backstory, description, headSlot, neckSlot, torsoSlot, rightHandSlot, leftHandSlot, legsSlot, feetSlot, ringSlot, handsSlot, twoHands)
VALUES
    ("email@email.com", "verysecure", "Magical Mr. Mistofelees", True, True, 10, 10, 10, 50, "Cat", "Mage", True, "Felix has lived in the inn since he showed up as a young cat. He came in one morning when the innkeeper opened the door, and never left.", "A black and white cat with short hair, and a slight notch in their right ear", 0, 121, 0, 0, 0, 0, 0, 0, 0, 0),
    ("sampleemail@email.com", "superPass", "Grizibella", True, True, 10, 10, 10, 50, "Cat", "Mage", True, "Grizibella has been in the forest since 1981, and keeps a very fine, if unusual, house there. She will occassionally talk to travelers.", "A humanoid cat person covered with long matted gray hair that seems to have fallen out in tufts from a few locations.", 0,0,0,0,0,0,0,0,0,0);



INSERT INTO inventories (locator_id, item_id, quantity, currentlyEquipped)
VALUES ("P1", 61, 1, 1),
("L1102", 1, 1, 0),
("P11", 11, 2, 0),	 
("P11", 1, 1, 0),
("L1101", 1, 1, 1),
("L1101", 31, 4, 0),
("L1102", 11, 1, 0);

