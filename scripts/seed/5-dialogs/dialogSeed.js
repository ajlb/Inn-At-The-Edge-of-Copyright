module.exports = [
    {
        NPC: 'Ford',
        dialogObj: {
            messages: [
                { // 0
                    message: 'Hi welcome to the Inn... what can I do for you I guess...',
                    exampleResponses: ["Where am I?", "Who are you?", "Goodbye"],
                    allowedResponses: [{
                        "responses": ["where am i", "where am i?"],
                        "route": 1
                    }, {
                        "responses": ["who are you", "who are you?"],
                        "route": 2
                    }, {
                        "responses": ["goodbye", "bye"],
                        "route": 5
                    }]
                },
                { // 1
                    message: "Didn't I just tell you? You're in the Inn! It's just down the road from the Town and east of the Pumpkin Patch...",
                    exampleResponses: ["The Inn?", "Who are you?", "Goodbye"],
                    allowedResponses: [{
                        "responses": ["who are you", "who are you?", "who"],
                        "route": 2
                    }, {
                        "responses": ["goodbye", "bye"],
                        "route": 5
                    }, {
                        responses: ["the inn?", "the inn"],
                        route: 3
                    }]
                },
                { // 2
                    message: "The name's Ford and despite my appearance, I'm actually just an intricately folded towel... don't ask",
                    exampleResponses: ["Where am I?", "You're a towel?", "Goodbye"],
                    allowedResponses: [{
                        "responses": ["where am i", "where am i?"],
                        "route": 1
                    }, {
                        "responses": ["goodbye", "bye"],
                        "route": 5
                    }, {
                        responses: ["you're a towel?", "you're a towel", "youre a towel", "youre a towel?", "your a towel", "your a towel?", "a towel", "a towel?", "towel", "as a towel?", "as a towel"],
                        route: 4
                    }]
                },
                { // 3
                    message: "You know, the Inn at the Edge of Copyright! The infinitely infamous pit stop where various travellers from around the universe take rest. Most of you I see only once and then you disappear beyond the crossroads. In fact, I’m the only one to have ever returned, as a towel no less!",
                    exampleResponses: ["You're a towel?", "Disappearances?", "Who are you?", "Goodbye"],
                    allowedResponses: [{
                        responses: ["you're a towel?", "you're a towel", "youre a towel", "youre a towel?", "your a towel", "your a towel?", "a towel", "a towel?", "towel", "as a towel?", "as a towel"],
                        route: 4
                    }, {
                        "responses": ["who are you", "who are you?"],
                        "route": 2
                    }, {
                        "responses": ["goodbye", "bye"],
                        "route": 5
                    }, {
                        "responses": ["disappearances", "disappearances?", "disappear", "disappear?", "dissapearances", "dissapearances?", "dissapear", "dissapear?", "dissappearances", "dissappearances?", "dissappear", "dissappear?"],
                        "route": 6
                    }]
                },
                { // 4
                    message: "Most of you don’t ask me that question thinking it rather rude… but between you and me I can not shake the experience of turning into this form. It happened just up there you know... *points to the sky and shudders*",
                    exampleResponses: ["Where am I?", "Who are you?", "Goodbye"],
                    allowedResponses: [{
                        "responses": ["where am i", "where am i?"],
                        "route": 1
                    }, {
                        "responses": ["who are you", "who are you?"],
                        "route": 2
                    }, {
                        "responses": ["goodbye", "bye"],
                        "route": 5
                    }]
                },
                { // 5
                    message: "Before you leave, be sure to check your pockets.  The Infinite Improbability Drive from the Heart-of-Gold does strange things and you may have a helpful item in there, or just pocket lint.",
                    exampleResponses: ["Where am I?", "Who are you?"],
                    allowedResponses: [{
                        "responses": ["where am i", "where am i?"],
                        "route": 1
                    }, {
                        "responses": ["who are you", "who are you?"],
                        "route": 2
                    }]
                },
                { // 6
                    message: "I dare not mention more, it brings back too many troubling memories…. Some fond ones sure, like Arthur and that magnificent invention called a sandwich… oh hey you’re a sandwich-maker. Can you make me a sandwich?",
                    exampleResponses: ["Here's your sandwich!", "No thanks"],
                    allowedResponses: [{
                        "responses": ["here's your sandwich!", "heres your sandwich", "sandwich"],
                        "route": 7
                    }, {
                        "responses": ["no thanks"],
                        "route": 8
                    }]
                },
                { // 7
                    message: "Such a Hoopy Frood you are!",
                    exampleResponses: ["Where am I?", "Who are you?", "Goodbye"],
                    allowedResponses: [{
                        "responses": ["where am i", "where am i?"],
                        "route": 1
                    }, {
                        "responses": ["who are you", "who are you?"],
                        "route": 2
                    }, {
                        "responses": ["goodbye", "bye"],
                        "route": 5
                    }]
                },
                { // 8
                    message: "Oh well, maybe I can find Arthur and get one",
                    exampleResponses: ["Where am I?", "Who are you?", "Goodbye"],
                    allowedResponses: [{
                        "responses": ["where am i", "where am i?"],
                        "route": 1
                    }, {
                        "responses": ["who are you", "who are you?"],
                        "route": 2
                    }, {
                        "responses": ["goodbye", "bye"],
                        "route": 5
                    }]
                },
            ]
        }
    },
    {
        NPC: "Great Tree",
        dialogObj: {
            messages: [
                { // 0
                    message: 'Hallo. Guten Tag',
                    exampleResponses: ["Where am I?", "Who are you?", "Goodbye"],
                    allowedResponses: [{
                        "responses": ["where am i", "where am i?"],
                        "route": 2
                    }, {
                        "responses": ["who are you", "who are you?"],
                        "route": 1
                    }, {
                        "responses": ["goodbye", "bye", "adios"],
                        "route": 5
                    }]
                },
                { // 1
                    message: 'I am the Great Tree of Old! All those who have knelt before me have been gifted with the abilities of legend! They shall never be defeated',
                    exampleResponses: ["I kneel", "Who are you?", "Goodbye"],
                    allowedResponses: [{
                        "responses": ["kneel", "i kneel"],
                        "route": 2
                    }, {
                        "responses": ["who are you", "who are you?"],
                        "route": 2
                    }, {
                        "responses": ["goodbye", "bye", "adios"],
                        "route": 5
                    }]
                },
                { // 2
                    message: `Oh sorry I didn't mention that was a limited offer I was running last summer... but I can give you this apple?`,
                    exampleResponses: ["Where am I?", "Who are you?", "Goodbye"],
                    allowedResponses: [{
                        "responses": ["where am i", "where am i?"],
                        "route": 1
                    }, {
                        "responses": ["who are you", "who are you?"],
                        "route": 2
                    }, {
                        "responses": ["goodbye", "bye", "adios"],
                        "route": 5
                    }]
                }
            ]
        }
    }
]