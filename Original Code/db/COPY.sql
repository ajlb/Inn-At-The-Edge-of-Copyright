-- Make current players table into players-old, then restart server to create new players table
INSERT INTO players (id, email, password, characterName, level, xp, isLiving, isNPC, WIS, DEX, STR, HP, race, class, abilities, inventory, backstory, description, headSlot, neckSlot, torsoSlot, rightHandSlot, leftHandSlot, legsSlot, feetSlot, ringSlot, handsSlot, twoHands)
SELECT *
FROM `players-old`;
