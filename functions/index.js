const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

exports.newMessageAlert = functions.database.ref('/messages/{message}')
  .onWrite((event) => {
    const message = event.data.val();

    const getTokens = admin.database().ref('users').once('value').then((snapshot) => {
      const tokens = [];
      snapshot.forEach((user) => {
        const token = user.child('token').val();
        if (token) tokens.push(token);
      });
      return tokens;
    });

    const getAuthor = admin.auth().getUser(messsage.uid);

    Promise.all([getTokens, getAuthor]).then((tokens, author) => {
      const payload = {
        notification: {
          title: `Hot Take from ${author.displayName}`,
          body: message.content,
          icon: author.photoURL
        }
      };

      auth.messaging().sendTodDevice(tokens, payload).catch(console.error);
    });
  });
