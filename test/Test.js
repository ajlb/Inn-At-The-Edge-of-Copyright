const should = require('should');
const io = require('socket.io-client');

const socketURL = 'http://localhost:3001';

const options = {
  transports: ['websocket'],
  'force new connection': true
};

let chatUser1 = { 'authString': 'auth0|6005dc94b13e57007686f051' };
let chatUser2 = { 'authString': 'auth0|6005dd65bf5750007034b135' };
let chatUser3 = { 'authString': 'auth0|6005dcfc1309e30069c4b987' };

describe("Chat Server", function () {
  it('Should broadcast entrance to all users (40 millisecond padding added)', function (done) {
    const client1 = io(socketURL, options);
    const client2 = io(socketURL, options);
    let usersEntered = 0;

    function endTest() {
      usersEntered.should.equal(2);
      client2.disconnect();
      chatUser2.data = undefined;
      client1.disconnect();
      chatUser1.data = undefined;
      done();
    }

    client1.on('connect', function (data) {
      client1.emit('log in', chatUser1.authString);
      client1.on('playerData', (message) => {
        chatUser1.data = message;
      })
      client1.on('move', function ({ actor, direction, action }) {
        usersEntered += action === "leave" ? -1 : 1;
        direction.should.equal('ether');
      });



      client2.on('connect', function (data) {
        client2.emit('log in', chatUser2.authString);
        client2.on('playerData', (message) => {
          chatUser2.data = message;
          setTimeout(endTest, 40);
        })
      });
    });
  });



  it('Should be able to broadcast messages', function (done) {
    const client1 = io(socketURL, options);
    const client2 = io(socketURL, options);
    const client3 = io(socketURL, options);

    function endTest() {
      client2.disconnect();
      chatUser2.data = undefined;
      client1.disconnect();
      chatUser1.data = undefined;
      client3.disconnect();
      chatUser3.data = undefined;
      done();
    }

    const newMessage = 'Hello World';
    let messages = 0;

    const checkMessage = function (client) {
      client.on('speak', function (message) {
        message.should.be.String();
        should(message.endsWith(newMessage)).be.true();
        client.disconnect();
        messages++;
        if (messages === 3) {
          endTest();
        };
      });
    };

    checkMessage(client1);

    client1.on('connect', function (data) {
      client1.emit('log in', chatUser1.authString);
      checkMessage(client2);

      client2.on('connect', function (data) {
        client2.emit('log in', chatUser2.authString);
        checkMessage(client3);

        client3.on('connect', function (data) {
          client3.emit('log in', chatUser3.authString);
          client3.on('playerData', (message) => {
            chatUser3.data = message;
            client3.emit('speak', { message:newMessage, user: chatUser3.data.characterName, location: chatUser3.data.lastLocation });
          })
        });
      });
    });
  });

  it('Should send back a message saying you need to log in, if you haven\'t', function (done) {
    const client1 = io.connect(socketURL, options);

    client1.on('connect', function (data) {
      client1.emit('log in', "You must log in first! Type 'log in [username]'");
    });
    client1.on('logFail', failMessage => {
      failMessage.should.equal("You must log in first! Type 'log in [username]'");
      client1.disconnect();
      done();
    })
  })

  it('Should send user data', function (done) {
    const client1 = io.connect(socketURL, options);

    client1.on('connect', function (data) {
      client1.emit('log in', chatUser1.authString);
    });
    client1.on('playerData', (message) => {
      should(message).be.a.Object();
      should(message).have.property('characterName');
      client1.disconnect();
      done();
    })
  })

  it('Should send a user with an invalid authString to character creation', done => {
    const client1 = io.connect(socketURL, options);

    client1.on('connect', data => {
      client1.emit('log in', "invalidauthString@noplace.edu");
    });
    client1.on('logFail', failMessage => {
      failMessage.should.equal('new user');
      client1.disconnect();
      done();
    });
  })

  it('Should send whispers (40 milliseconds padding added)', function (done) {
    let client1, client2, client3;
    let clientData1, clientData2, clientData3;
    clientArray = [client1, client2, client3];
    clientDataArray = [clientData1, clientData2, clientData3];

    const newMessage = 'Hello Hello Hello!'
    let messages = 0;

    const completeTest = function () {
      messages.should.equal(1);
      client1.disconnect();
      client2.disconnect();
      client3.disconnect();
      done();
    };

    const checkPrivateMessage = function (client) {
      client.on('whisperTo', function ({ message, userFrom }) {
        message.should.equal(newMessage);
        userFrom.should.equal(clientData3.characterName);
        messages++;
        setTimeout(completeTest, 40);
        // if () {
        //   /* The first client has received the message
        //   we give some time to ensure that the others
        //   will not receive the same message. */
        // };
      });
    };



    client1 = io.connect(socketURL, options);
    checkPrivateMessage(client1);

    client1.on('connect', function (data) {
      client1.emit('log in', chatUser1.authString);

      client1.on('playerData', (message) => {
        should(message).be.a.Object();
        should(message).have.property('characterName');
        clientData1 = message;
      })//end client1.on('playerData)

      client2 = io.connect(socketURL, options);
      checkPrivateMessage(client2);

      client2.on('connect', function (data) {
        client2.emit('log in', chatUser2.authString);

        client2.on('playerData', (message) => {
          should(message).be.a.Object();
          should(message).have.property('characterName');
          clientData2 = message;
        })//end client2.on('playerData)

        client3 = io.connect(socketURL, options);
        checkPrivateMessage(client3);

        client3.on('connect', function (data) {
          client3.emit('log in', chatUser3.authString);

          client3.on('playerData', (message) => {
            should(message).be.a.Object();
            should(message).have.property('characterName');
            clientData3 = message;

            client3.emit('whisper', { message: `${clientData1.characterName} ${newMessage}`, userData: clientData3 });
          })//end client3.on('playerData')


        });//end client3.on('connect')
      });//end client2.on('connect')
    });//end client1.on('connect')
  });//end it('Should send whispers')


});//end describe('Chat Server')