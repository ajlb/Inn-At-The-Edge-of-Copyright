
let commands = {
    "look":{"input":["look", "l"], "result":"look around the room, seeing area description, exits, and interactable objects or people"},
    "get":{"input":["get [item]", "grab [item]", "pick up [item]"], "result":"if the item is something you can pick up, you will pick it up and hold it in your hand, or add it to your inventory if your hands are full."},
    "drop":{"input":["drop", "let go of", "discard", "get rid of"], "result":"drop an item from your inventory, leaving it on the ground in the room."},
    "move":{"input":["north", "n", "east", "e", "south", "s", "west", "w", "go [direction]", "walk [direction]"], "result": "you will move through an available exit, or get a response saying that the exit specified doesn't exist"},
    "inventory":{"input":["inventory", "i"], "result":"look at what items you are carrying"},
    "act":{"input":["/me"], "result": "use /me followed by a description of an action as it would look to those around you. /me will be replaced with your character's name."},
    // "examine":{"input":["examine", "e"], "result":"look closely at an item or person."},

}
let directions = {n:"north", s:"south", w:"west", e:"east"};

let interactionWords = {
    "get":["get ", "grab ", "pick up "],
    "drop":["drop ", "let go of ", "discard ", "get rid of "],
    };
let movementWords = 
    {
        directions:["north", "n", "east", "e", "south", "s", "west", "w"],
        move:["move", "go", "climb", "walk", "run"],
    };

let woodsWalk = 
    {
        "location":{
            "North-Woods-Entrance":
            {"exits":
            {"n":"North-Woods-Path-A", "s":"Plains-X", "w":"none", "e":"none"},
            "descriptions":
            {"light":"The path into the woods is well lit by sun from the plains to the south. Large redwoods and a variety of other trees competing for the leftover scraps of sunlight seem to stretch infinitely to either side, but the path to the north is clear. It's almost as if a dividing line exists that keeps the plains on one side and the forest on the other.", "dark":"You can just make out the way forward between the dense growth of trees with the faint glow of moonlight filtering dimly into the forest entrance."},
            "items":
            [{"name":"flower", "status":"here", "description":"The flower before you has soft yellow petals radially aligned around a dark brown center. It stretches up delicately from a leafy green base."}, {"name":"branch", "status":"here", "description":"The branch in front of you is medium brown and squiggly in shape. It has a couple pokey outey jagged bits, and a couple smooth bits."}]
            },
            "North-Woods-Path-A":{"exits":
            {"n":"North-Woods-Path-B", "s":"North-Woods-Entrance", "w":"none", "e":"none"},
            "descriptions":
            {"light":"The interior of the forest is shady, but well lit with dappled sunshine falling through the canopy. Birds call out to each other, unseen in the high tree-tops. You see the path stretching north before you.", "dark":"It's almost pitch-black inside the wood, but you can just make out the path in front of you. The forest rustles around you in the night breeze, and the soft call of an owl floats in from far away."},
            "items":
            [{"name":"branch", "status":"here", "description":"The branch in front of you is dark brown, with the bark flaking off. it has a Y shape at the end."}, {"name":"mushroom", "status":"here", "description":"This mushroom is round and plump, with a tannish-brown cap."}]
            },
            "North-Woods-Path-B":{"exits":
            {"n":"Empty-Grotto", "s":"North-Woods-Path-A", "w":"none", "e":"none"},
            "descriptions":
            {"light":"The interior of the forest is shady, but well lit with dappled sunshine falling through the canopy. Birds call out to each other, unseen in the high tree-tops. North of you, you can see a brighter patch of light.", "dark":"It's almost pitch-black inside the wood, but you can just make out the path in front of you. There seems to be a patch of moonlight to the north. Do the night noises of the forest seem quieter here?"},
            },
            "Empty-Grotto":{"exits":
            {"n":"none", "s":"North-Woods-Path-B", "w":"none", "e":"none"},
            "descriptions":
            {"light":"Sunlight streams down in this small clearing. The trees tower around the edges, but this roughly circular patch of land is oddly clear of even the smallest sapling. Instead, vines, grasses, and flowers cover the ground here. You hear the raucus chatter of crows, and the swish of the leaves as the breeze dips into the clearing from above.", "dark":"The small clearing is dim but clear to your night-adjusted eyes, with moonlight streaming down from the break in the canopy. The rustling leaves and the sound of a few crickets are the only things you hear here."},
            },
            "Plains-X":{"exits":
            {"n":"North-Woods-Entrance", "s":"none", "w":"none", "e":"none"},
            "descriptions":
            {"light":"To the east, south, and west, stretch the open plains. Sunlight streams down on the tall grasses and small bushes that populate the plains. To the north, a grand forest stands, full of great redwoods and a smattering of other conifers and deciduous trees. The undergrowth seems impassibly dense, except for the path leading north from this spot.", "dark":"Around you to the east, south, and west, the moon and stars shine down on the open, windy plains, lighting the grasses and small shrubs in a grayscale symphony of motion. The forest ahead is an imposing wall of darkness, and you can just make out the trail leading in to the north."},
            },
        },
        "character":{
            "stats":{"strength":10, "stamina":10, "dexterity":10, "wisdom":10, "intelligence":10, "charisma":10},
            "wearing":{"rightHand":"empty", "leftHand":"empty", "head":"empty", "eyes":"empty", "torso":"empty", "legs":"empty", "feet":"empty"},
            "hp":50,
            "inventory":[],
        },
    };