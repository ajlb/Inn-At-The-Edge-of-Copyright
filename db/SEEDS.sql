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
("look", "You look around you.", "When you type a look command word with nothing after it, you will look around your location, seeing the description, possible exits, and items nearby.", "look, l, look around", "You look around.", " glances around."),
("drop", "You drop an item", "When you type a drop command word followed by an item in your inventory, you will drop it into your location.", "drop, d, discard", "You drop a ", " drops a "),
("inventory", "You check your inventory", "When you type an inventory command, you will recieve a list of all items in your inventory", "inventory, i, check inventory", "inventory", "You have 3 mushrooms, 1 branch, and a frog."),
("move", "You move through an exit", "When you type a move command word followed by an available exit from your location, you will move in that direction.", "move, m, go, walk", "You go ", " goes "),
("speak", "You speak.", "When you type a speak command word followed by other text, your other text will be spoken aloud to your location. For yelling, see yell.", "speak, say, talk, chat, s, t, c", "say Hello!", "character: Hello!"),
("wear", "You put on a wearable item.", "When you type a wear command followed by a valid item in your inventory, you will put it on if you're not already wearing something there.", "wear, put on, don", "wear green socks", "You put on green socks."),
("remove", "You take off an item you are wearing.", "When you type a remove command followed by an item you are wearing, you will take it off and add it to your inventory.", "take off, remove, doff", "remove green socks", "You take off green socks."),
("stats", "You call up your character stats.", "When you type stats, you will see a list of your stats and their values.", "stats", Null, Null),
("juggle", "You juggle something.", "When you type juggle, followed by a number, followed by an appropriate item, you will attempt to juggle that number of those items if you have them.", "juggle", Null, Null),
("emote", "you describe an action", "When you type an emote command word followed by text, the result will be displayed to the room as an action of your character.", "/me, emote", "/me leans against a tree", "[Character] leans against a tree"),
("sleep", "You go to sleep", "When you type a sleep command while lying down, you will go to sleep and recover HP, but you will not be able to see or hear around you. If you are attacked, you will automatically wake up.", "go to sleep, sleep", "sleep", "You fall into a deep slumber."),
("wake", "You wake up", "When you type a wake command while sleeping, you will wake up.", "wake up, wake, awake, awaken", "wake up", "You wake up."),
("position", "You change position.", "When you type a position command, you will move from your current position into the new one.", "stand up, stand, sit down, sit, lay down, lay, lie down, lie", "stand up", "You stand up."),
("give", "give an item to someone", "When you type give followed by an item in your inventory, and someone else in your location, you will give the item to them.", "give", "give a mushroom to Grizabella", "[Character] gives a mushroom to Grizabella"),
("quests", "see a list of active quests", "When you type quests, you will see a list of active quests for your character.", "quests", "quests", "[List of quests]"),
("time", "check the time", "When you type time, you will get the current game time", "time, check time", "time", "It is 1:09pm"),
("talk to", "talk to an NPC", "When you type 'talk to' followed by the name of an NPC in your location, you will be able to interact with them.", "talk to, address", "talk to clerk", "Clerk: Hi welcome to the In..."),
("help", "check command usage", "When you type help, you will get a list of all game commands. When you type help followed by a game command, you will get that command's details.", "help", "help", "[list of commands]");


INSERT INTO locations
    (id,locationName, dayDescription, nightDescription, exitN, exitE, exitS, exitW, region)
VALUES
    (1101, "Pumpkin Patch Center", "You are at the heart of a pumpkin patch. Though on the vine, and uncarved, the pumpkins you see out of the corners of your vision seem to be leering evilly at you, like jack-o-lanterns.", Null, 1102, 1103, 1109, 1105, "Halloween"),
    (1102, "Pumpkin Patch North", "The pumpkin patch stretches to the east, west and south of you. A large, dark hole sits carved into the ground to the north. The pumpkins surrounding you are craggy and crooked, and the longer you look at them, the creepier they seem.", Null, 1110, 1106, 1101, 1107, "Halloween"),
    (1103, "Pumpkin Patch East", "The pumpkin patch stretches to the north, west, and south of you. The pumpkins around you a unnervingly creepy. Uncarverd pumpkins shouldn't be creepy, should they?", Null, 1106, Null, 1109, 1101, "Halloween"),
    (1104, "Pumpkin Patch South", "The pumpkin patch stretches to the east, west, and north of you. The patch seems dark somehow even in the day. Shadows seem to take the shape of creatures watching you.", Null, Null, 1109, Null, 1108, "Halloween"),
    (1105, "Pumpkin Patch West", "The pumpkin patch stretches to the north, east, and south of you. The pumpkins clustered around you seem to be pressing closer, making what should be an open field feel alarmingly claustrophobic.", Null, 1107, 1101, 1108, Null, "Halloween"),
    (1106, "Pumpkin Patch Northeast", "The pumpkin patch surrounds you to the west and south. The pumpkins here give of an ineffible feeling of sadness, and you feel tears prick the corners of your eyes.", Null, Null, Null, 1103, 1102, "Halloween"),
    (1107, "Pumpkin Patch Northwest", "The pumpkin patch surrounds you to the east and south, and the path to the Haunted Forest beckons toward the north. The pumpkin patch radiates a sinister feeling, and the path north feels equally foreboding. You feel trapped.", Null, 1112, 1102, 1105, Null, "Halloween"),
    (1109, "Pumpkin Patch Entrance", "The pumpkin patch surrounds you to the north and west. and you can see the inn to the south. The pumpkins closest to the inn look plump and cheery, but as the patch grows more dense to the northwest, it seems to emanate menace and warning.", Null, 1101, 1103, 1011, 1104, "Halloween"),
    (1108, "Pumpkin Patch Southwest", "The pumpkin patch surrounds you to the north and east, leaving you corned against a tall fence backed by dark and impenetrable forest. The patch seems darker than you think the day should be, and what should be ordinary pumpkins are radiating ominous threat. Your pulse starts to quicken as your instincts pick up on predatory intent.", Null, 1105, 1104, Null, Null, "Halloween"),
    (1110, "Rabbit Hole", "The dark rabbit hole smells like wet earth as the sunlight from above leaves a spotlight on the ground below you. The tunnel continues to the east.", Null, Null, 1111, 1102, Null, "Halloween"),
    (1111, "South Tunnel", "The tunnel stretches to the north and west. To the north, the damp earth of the tunnel gives way to solid gray stone.", "The tunnel stretches to the north and west. To the north, the damp earth of the tunnel gives way to solid gray stone.", 1127, Null, Null, 1110, "Halloween"),
    (1112, "Path to Haunted Forest", "The Pumpkin Patch to the south gives way to a long dark tree tunnel to the north.", "The Pumpkin Patch to the south gives way to a long dark tree tunnel to the north.", 1123, Null, 1107, Null, "Halloween"),
    (1127, "West Tunnel", "The tunnel splits, stretching to the north, south, and west.", "The tunnel splits, stretching to the north, south, and west.", 1118, Null, 1111, 1113, "Halloween"),
    (1113, "East Tunnel", "The tunnel continues to the west. To the south, the ruins of an ancient cavetown lay scattered on the cave floor.", "The tunnel continues to the west. To the south, the ruins of an ancient cavetown lay scattered on the cave floor.", Null, 1127, 1114, 1115, "Halloween"),
    (1114, "Cavetown Ruins", "The ruins of old wood and stone buildings sit crumbling on the cave floor.", "The ruins of old wood and stone buildings sit crumbling on the cave floor.", 1113, Null, Null, Null, "Halloween"),
    (1115, "Crystal Cavern", "The Cavern is littered with glowing crystals of various colors that illuminate the cavern walls. The tunnel continues to the north and to the east. To the north you can hear flowing water.", "The Cavern is littered with glowing crystals of various colors that illuminate the cavern walls. The tunnel continues to the north and to the east. To the north you can hear flowing water.", 1116, 1113, Null, Null, "Halloween"),
    (1116, "Raging River", "A raging river rushes past you filling the cave with the deafening roar of water. The tunnel continues to the east and to the south, though the slippery rock surrounding the river could lead elsewhere.", "A raging river rushes past you filling the cave with the deafening roar of water. The tunnel continues to the east and to the south, though the slippery rock surrounding the river could lead elsewhere.", Null, 1117, 1115, 1119, "Halloween"),
    (1117, "Cavern Lake", "A large, still pool of water glows an eerie shade of blue, the light reflecting off the cavern walls making the ceiling sparkle like the night sky. The tunnel continues to the east and to the west.", "A large, still pool of water glows an eerie shade of blue, the light reflecting off the cavern walls making the ceiling sparkle like the night sky. The tunnel continues to the east and to the west.", Null, 1118, Null, 1116, "Halloween"),
    (1118, "Surface Elevator", "A rickety wooden elevator sits along the north wall seemlingly abandoned, begging someone to start it back up. The tunnel continues to the west and the south.", "A rickety wooden elevator sits along the north wall seemlingly abandoned, begging someone to start it back up. The tunnel continues to the west and the south.", 1218, Null, 1127, 1117, "Halloween"),
    (1123, "Tree Tunnel South", "A tunnel of looming, dark trees surrounds you. Rustlings bushes and snapping twigs can be heard out of sight just beyond the treeline. The path continues to the west", "A tunnel of looming, dark trees surrounds you. Rustlings bushes and snapping twigs can be heard out of sight just beyond the treeline. The path continues to the west", 1122, Null, 1112, Null, "Halloween"),
    (1122, "Tree Tunnel North", "The tunnel of trees you find yourself in is lined with dark trees. There seems to be a clearing in the trees up ahead to the north. The tunnel of trees continues to the south.", "The tunnel of trees you find yourself in is lined with dark trees. There seems to be a clearing in the trees up ahead to the north. The tunnel of trees continues to the south.", 1121, Null, 1123, Null, "Halloween"),
    (1121, "Large Clearing", "The large clearing you've entered is interrupted by the dark treeline at its perimeter. The path splits four ways, leading north, south, east, and west.", "The large clearing you've entered is interrupted by the dark treeline at its perimeter. The path splits four ways, leading north, south, east, and west.", 1124, 1120, 1122, 1126, "Halloween"),
    (1120, "The Seven Stones", "The small clearing you've entered is littered with small pebbles. Seven large stones surround you in a neat circle covered in stranger marks and symbols. To path you are on continues to the north and to the west.", "The small clearing you've entered is littered with small pebbles. Seven large stones surround you in a neat circle covered in stranger marks and symbols. To path you are on continues to the north and to the west.", 1119, Null, Null, 1121, "Halloween"),
    (1119, "Murky Pond", "You've found yourself on the shore of a murky green pond of which no source of water can be seen. Dark trees line the far side of the pond. A path of dirt expands to the south.", "You've found yourself on the shore of a murky green pond of which no source of water can be seen. Dark trees line the far side of the pond. A path of dirt expands to the south.", Null, Null, 1120, Null, "Halloween"),
    (1124, "The Elder Trees", "The grove of trees surrounding you is full of large, ancient trees that loom over you. They seem to be keeping you under a watchful eye. The path continues to the west and to the south.", "The grove of trees surrounding you is full of large, ancient trees that loom over you. They seem to be keeping you under a watchful eye. The path continues to the west and to the south.", Null, 1125, 1121, Null, "Halloween"),
    (1125, "The Great Tree", "The thick dark fog shrouding your environment slowly parts to reveal an impossibly large tree leering above you. The mist in the air seems to whisper about the impossible age of the great tree for the tree will outlive us all. Upon its wide trunk, you can makeup an ancient face that seems eerily familiar...", "The thick dark fog shrouding your environment slowly parts to reveal an impossibly large tree leering above you. The mist in the air seems to whisper about the impossible age of the great tree for the tree will outlive us all. Upon its wide trunk, you can makeup an ancient face that seems eerily familiar...", Null, Null, Null, 1124, "Halloween"),
    (1126, "Crazy Cat Lady's Shack", "Although worn on the outside, the inside of the shack you've entered is finely decorated and well-kept, though quite flashy and a bit out-dated. In the corner next to the crackling fireplace you notice a slightly-grizzled looking cat-like person rocking their chair back and forth.", "Although worn on the outside, the inside of the shack you've entered is finely decorated and well-kept, though quite flashy and a bit out-dated. In the corner next to the crackling fireplace you notice a slightly-grizzled looking cat-like person rocking their chair back and forth.", Null, 1121, Null, Null, "Halloween"),
    (1011, "Path to Pumpkin Patch", "The dirt path you find yourself on continues to a pumpkin patch in the north. To the east the path comes from the Inn Garden.", Null, 1109, 1009, Null, Null, "The Inn"),
    (1009, "Inn Garden", "The Inn Garden seems slightly overgrown but seems to be thriving nonetheless. The are is scattered with bushes, flowers, and small trees. The shallow pond in the corner seems home to a few wild frogs and a variety of plantlife. The garden gate leads to the west. A gap in the fence to the east take you into the backyard. The door to the Inn Kitchen sits on the south end of the garden.", Null, Null, 1008, 1007, 1011, "The Inn"),
    (1008, "Backyard", "The quaint backyard of the Inn seems a bit unkempt. A path leads to the Inn Garden in the west and the door to the kitchen sits to the south.", Null, Null, Null, 1007, 1009, "The Inn"),
    (1007, "Inn Kitchen", "The Inn kitchen smells of freshly baked bread and garlic. A bubbling pot sits on the stove unattended. Two doors lead outside to the north and the east. The swinging door to the Lobby is left slightly cracked open on the south wall.", Null, 1009, 1008, 1003, Null, "The Inn"),
    (1003, "Inn Lobby", "You enter what appears to be the Inn Lobby. Light streams in through the windows lighting the room with a soft glow. A bored clerk sits behind the counter clearly not paying attention to their work. The smell of cooking food wafts into the room through an open door on the north wall. The front door of the Inn exits to the east. Two more doors exit the room to the south and to the west.", Null, 1007, 1005, 1004, 1010, "The Inn"),
    (1004, "Inn Laundry Room", "You've entered the Inn Laundry Room. Washers and dryers line the back wall and folding station sits in the corner in front of the window. A door to the east leads outside. There appears to be an oversized mouse hole hidden behind a stack of boxes to the west. A wooden door labeled 'Lobby' sits on the north wall.", Null, 1003, 1005, Null, 1010, "The Inn"),
    (1002, "Hallway", "You see a narrow room materialize in front of you. You hear a door latch behind you and a odd hand-painted sign gently sways from a string on the locked knob: `INN AT THE EDGE - REMEMBER YOUR TOWEL - TRY help FOR HELP`. A small window looks out over a beautiful but overgrown garden. The only way out must be the stairway at the end of the hall to the east. The smell of tea and faint sounds of someone moving about down the stairs becons you forward....", Null, Null, 1003, Null, Null, "The Inn"),
    (1010, "Library", "You've entered the Inn Library. Rows upon rows of old wooden bookshelves house an innumerable amount of dusty books. A door labeled 'Lobby' sits on the east wall, though it seems that the right book on the south wall might lead elsewhere.", Null, Null, 1003, 1004, Null, "The Inn"),
    (1005, "Front Yard", "This must be the Front Yard of the Inn. The grass seems like it hasn't been cut in ages and yellow wildflowers peek through the tall grass. An old shed sits in the south end of the yard. A path to the north leads back into the Inn and continues east. Another door leads into a different part of the Inn to the west.", Null, 1003, 1201, 1006, 1004, "The Inn"),
    (1006, "Shed", "The old shed is full of junk and broken yard tools. Everything seems slightly out of place. The door you came through sits on the north wall.", Null, 1005, Null, Null, Null, "The Inn"),
    (1001, "Start Room", "Looking around, you notice a large mirror hung on the wall next to a large open wardrobe that contains a variety of items and clothing. The large window on the north wall is framed with white curtains but a large tree seems to be blocking any semblance of a view outside. A door sits on the east wall but an attempt to turn the doorknob reveals that it's locked.", Null, Null, 1002, Null, Null, "The Inn"),
    (1201, "Crossroads", "You've encountered a fork in the brick road. To the west, a dirt path trails away from the main road through a meadow of flowers and small trees. A wooden sign ahead of you says 'North -> Country Town   South -> Sky Cannon   West -> The Inn'", Null, 1203, 1204, 1202, 1105, "Country and Town"),
    (1203, "North Country Lane", "On the side of the road you see a hooded merchant with a plastic folding table on which the hooded figure displays their wares. The brick road continues to the north and south.", Null, 1208, Null, 1201, Null, "Country and Town"),
    (1202, "South Country Lane", "A wooden fence is the only thing separating the Country Lane from the woods that lie beyond. The brick road continues to the north and south.", Null, 1201, Null, 1207, Null, "Country and Town"),
    (1204, "Meadow Path", "The sweet scent of wildflowers fills the air as you scan your area. Small trees and wildgrasses cover the meadow in varying shades of green. To the east you can see a bridge crossing a bumbling creek. The dirt path meets a brick road to the west.", Null, Null, 1205, Null, 1201, "Country and Town"),
    (1205, "Creek Bridge", "The wooden bridge creaks underneath your feet as the water below flows past. The rusting metal railings on either side of the bridge are the only thing stopping one from tumbling over the edge. To the south, you can see where the creek comes to a halt. A steep hike into the mountains continues to the east. The meadow path leads away to the west.", Null, Null, 1301, 1206, 1204, "Country and Town"),
    (1206, "Pond's Edge", "The creek flows into a deep pond of which is teeming with aquatic plant life and seems deep enough to fish out of. The path you're on curves to the east and continues up gentle slope into the mountains. A quick trip north would take you to the creek bridge.", Null, 1205, 1302, Null, Null, "Country and Town"),
    (1207, "Sky Cannon", "You come upon a large metal cannon with a sign that says 'Sky Cannon'... it seems to be aiming east but no one can be sure where it leads. The road you stand on takes you north.", Null, 1202, 1403, Null, Null, "Country and Town"),
    (1208, "Town Southwest", "A small town of brick and mortar buildings surrounds you. The town road continues north and east and leads away from the town to the south.", Null, 1220, 1209, 1203, Null, "Country and Town"),
    (1209, "Town Southeast", "The town road curves past the bumbling creek and around the back of a small fenced garden, though a stacked stone wall keeps you from accessing the water. The town road continues to the north and west.", Null, 1211, Null, Null, 1208, "Country and Town"),
    (1210, "Item Store", "You've entered a brightly lit Item Store with a multitude of tools, trinkets, and clothing for sale filling the shelves around the room. A smiling clerk stands proudly behind a counter seemingly waiting for you to approach.", Null, Null, 1212, Null, 1220, "Country and Town"),
    (1211, "Town East", "Small, tough weeds peek through the small cracks in the road surface. A gap in the fence on the west side leads you into a neat garden. The town road continues to the north and south.", Null, 1214, Null, 1209, 1212, "Country and Town"),
    (1212, "Garden", "It could be said that no better-maintained garden than the one you find yourself could be found. Beautiful flowers and perfectly trimmed hedges fill the garden with a gentle atmosphere. A door on the west side of the garden leads into the brick and mortar building standing next to the garden. You should be able to fit through the gap in the fence on the east side of the garden.", Null, Null, 1211, Null, 1210, "Country and Town"),
    (1213, "Town Northwest", "You find yourself completely surrounded by the brick and mortar buildings that make up the town. The brick road makes a sharp turn to the east and south. The building on the west side of the road has an iron front door, though it seems to be locked.", Null, Null, 1214, 1220, 1216, "Country and Town"),
    (1214, "Town Northeast", "The brick road you're standing on seems to be the only barrier between the town and the nature beyond. The road splits three ways, leading you north, south, and west. A small wooden boardwalk to the east takes you to the river's edge", Null, 1217, 1215, 1211, 1213, "Country and Town"),
    (1215, "River's Edge", "You come to the edge of the gently flowing river. The water seems deep and ample for fishing. The boardwalk takes you west back to the main road.", Null, Null, Null, Null, 1214, "Country and Town"),
    (1216, "Special Item Store", "The iron door you've unlocked leads into an item store filled with rare and powerful items. There is no store clerk in sight but a small sign posted near the door reads 'Honor Code: Take what you need and leave payment'", Null, Null, 1220, Null, Null, "Country and Town"),
    (1217, "Town North", "You've come to a sharp turn in the road wrapping around a seemingly abandoned building. The road continues west and south.", Null, Null, Null, 1214, 1219, "Country and Town"),
    (1218, "Haunted Shack", "You've come upon a strange shack from which you can hear the rattling of chains and low moans. Enter the door to the west if you dare... or move back to the wishing well to the east.", Null, Null, Null, Null, 1118, "Country and Town"),
    (1219, "Wishing Well", "The brick road wraps around a stone wishing well. It sits dauntingly before you, daring anyone to toss in their valubles. A dirt path behind the well takes you west into the woods and the brick road continues east.", Null, Null, 1217, Null, 1218, "Country and Town"),
    (1220, "Town West", "The brick road beneath your feet seems worn but sturdy and one can almost imagine how busy this town once was. A brick building stands to your east with a sign atop the door that reads 'Generic Item Store'. The brick road continues to the north and south.", Null, 1213, 1210, 1208, Null, "Country and Town"),
    (1301, "Steep Hike West", "The dirt path from the west gives way to a steep stone path to the east on which, if one is not careful, it can be quite easy to slip and fall back down the mountain.", Null, Null, 1303, Null, 1205, "Mountain"),
    (1302, "Gentle Slope West", "The dirt path from the west gives way to a gently inclining stone path to the east that leads up into the mountains. The rocky surface of the mountain is littered with what looks like pumice.", Null, Null, 1311, Null, 1206, "Mountain"),
    (1303, "Steep Hike East", "The steep sloping path to the west seems mildly dangerous, though the view of the meadow below takes your breath away. A fork in the hike leads south from which you can hear the sound of a roaring waterfall. The main hike continues east and west.", Null, Null, 1304, 1306, 1301, "Mountain"),
    (1304, "Mountain Trail North", "A sharp turn in the hiking trail goes east and south. On the northern end of the trail there appears to be a rather small and oddly placed castle-style building with a sign on the door that says 'Girl's Bathroom'.", Null, 1305, Null, 1307, 1303, "Mountain"),
    (1305, "Girl's Bathroom", "Stepping into the girl's bathroom is almost like stepping into a medieval castle, though it seems to be in quite a state of disrepair. The wall is lined with shattered porcelain sinks and snapped pipes that are flooding the tile with water. Half of the wooden stalls are completely demolished though, in the further stall, you can see the head of a large cave troll sticking up above the stall divider.", Null, Null, Null, 1304, Null, "Mountain"),
    (1306, "Waterfall", "An incredibly tall waterfall pours from atop the cliffs above into a pool at the end of the path. The air is filled with a thick mist that instantly soaks you to the bone. No one seems to be able to determine where the water is draining... the stone path leads to the north.", Null, 1303, Null, Null, Null, "Mountain"),
    (1307, "Mountain Trail Center", "The stone beneath you seems to be getting quite warm at this stretch of the hike. The source of the heat seems to come from the east. The path splits to the north, east, and south.", Null, 1304, 1308, 1309, Null, "Mountain"),
    (1308, "Crater's Rim", "You find yourself at the edge of a deep volcano crater which seems to be boiling the air around. You can feel your hair being singed as you gaze upon the lake of lava below. The stone path leads away from the crater to the west.", Null, Null, Null, Null, 1307, "Mountain"),
    (1309, "Mountain Trail South", "The stone path you're walking on gently curves to the north and east, though a smaller path splits off from the main trail, leading toward a cliff.", Null, 1307, Null, 1310, 1311, "Mountain"),
    (1310, "Cliff's Edge", "You find yourself at the end of the Mountain Trail standing on the edge of a sheer south-facing cliff. The unnerving distance from here to the valley floor below seems terrifying, but one can't help but be beckoned to leap off the cliff into the clouds below. The moutain trail leads away to the north.", Null, 1309, Null, 1401, Null, "Mountain"),
    (1311, "Gentle Slope East", "The gently sloping hike through the mountains is very forgiving to those who are prone to tripping. The path continues to the east and west.", Null, Null, 1309, Null, 1302, "Mountain"),
    (1401, "Ships Hold", "At the moment you entered the atmosphere you instantly regretted your desicion and squeezed your fists and buttox as tight as they would go. Your life flashed before your eyes and ... there was a chirp and a flash. Something happened but before you have time to remember a wave of nausea washes over you... worse than any hangover you have ever had. The dimly lit room spins around you and you blink as you take in your surroundings. Certainly not a cloud you've landed in, rather a metal room of containers and a fishbowl with a fish in it. A faint sound of voices comes from the south but you can't make out what is being said.", Null, Null, Null, 1402, Null, "Vogon Space Ship"),
    (1402, "Captain's Quarters", "You may regret everything about this journey to the Sky. Ford did try to warn you afterall. A large yellow skinned creature with a nose on it's forehad stares at you and shouts loudly. You did talk to the fish first, right? To the east you hear the sounds of voices cheering.", Null, Null, 1401, Null, 1403, "Vogon Spaceship"),
    (1403, "Cafe", "A utilitarian ship's mess lies before you. Metal tables and chairs encircle a single microphone hung from the ceiling. At it is a Vogon reciting poetry. You want to quickly exit but something in the awful words being hurled at you becons you toward the Vogon Poet", Null, Null, 1402, Null, Null, "Vogon Spaceship"),
    (1404, "Sky Poppy Field", Null, Null, 1403, Null, 1405, Null, "Cloud City"),
    (1405, "Mystery Button", Null, Null, 1404, 1406, Null, Null, "Cloud City"),
    (1406, "Sky Fishing Hole", Null, Null, Null, 1407, Null, 1405, "Cloud City"),
    (1407, "Fairy Godfather's Sky Hut", Null, Null, Null, Null, Null, 1406, "Cloud City");


INSERT INTO quests (questTitle, dialogue, hints, XPorItem, reward, completionItem, questToken)
VALUES ("Find my missing sock.", "I'm pretty sure I put it in the washing machine, but it didn't come out of the dryer. Can you help me?;Oh thank you! I'm so glad. I live at 4532 Little Bittle Lane, out east of the inn.", "I suppose you could my closet, but I already looked twice...", True, 500, 101, Null);


INSERT INTO items (itemName, `description`, category, torsoSlot, legsSlot, feetSlot)
VALUES
("branch", "a dry, brown branch", "nature", 0, 0, 0),
("mushroom", "a small, white mushroom with a round top", "nature", 0, 0, 0),
("sock", "a lone argyle sock, blue and yellow", "household", 0, 0, 0),
("pumpkin pie", "a whole pumpkin pie! It smells like autumn", "food", 0, 0, 0),
("collar", "A red collar with a silver buckle. It has pictures of fish on it.", "clothing", 0, 0, 0),
("leather gloves", "nice leather gloves. They look protective.", "armor", 0, 0, 0),
("blue shirt", "a simple blue linen shirt, good for warm weather", "clothing", 1, 0, 0),
("fancy shirt", "a fancy white linen shirt with detail in many colors along all the edges", "clothing", 1, 0, 0),
("brown pants", "a pair of simple brown linen pants, excellent for warm weather", "clothing", 0, 1, 0),
("fancy slacks", "a pair of fancy pressed black slacks, made of fine wool", "clothing", 0, 1, 0),
("green socks", "a pair of green cotton socks", "clothing", 0, 0, 1),
("dull ring", "a dull metal ring with signs of many years of wear", "tools", 0, 0, 0);

UPDATE items SET HPeffect = 10 WHERE itemName = "leather gloves";
UPDATE items SET ringSlot = 1 WHERE itemName = "dull ring";

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

INSERT INTO races (raceName, `description`, STRbonus, DEXbonus, WISbonus, HPbonus)
VALUES ("Human", "a typical human from Earth wearing a bathrobe", 0, 2, 0, 0),
("Cat", "like a housecat but the size of an average human", 3, 0, 0, 0),
("Faerie", "a delicate fairy-like creature, but wickedly clever", 0, 0, 3, 0),
("Ogre", "your basic not-so-smart super tough brute", 0, 0, 0, 3),
("Gnome", "tiny but nimble and tenacious", 0, 3, 0, 0),
("Unicorn", "stunningly magestic creature - but no hands", 0, 0, 8, 0),
("Flamingo", "a plastic neon pink lawn flamingo that has survived several severe hurricanes", 0, 0, 0, 10);

INSERT INTO professions (className, `description`)
VALUES ("Sandwich-maker", "a maker of sandwiches"),
("Rogue", "the elusive thief/assasin/ninja with cat like reflexes"),
("Bard", "storyteller/singer/thespian/dancer woo-er of all the races... if you have the skill"),
("Mage", "a magical profession like wizards"),
("Healer", "good with bandages, mending and some spells"),
("Lawn art", "a job where you love to stand firm and willfully ignore the HOA inspectors that insist you be removed"),
("Warrior", "we are not at war yet but still, you aim to be ready for battle should it come knocking"),
("Hunter", "a bit ruff and gruff skilled at ranged tasks, tends to wander and not get lost");

