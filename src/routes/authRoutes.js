const express = require('express');
const {
  MongoClient,
} = require('mongodb');
const debug = require('debug')('app:authRoutes');

const authRouter = express.Router();

function router() {
  // This time we are using the Post method for posting the data to the server
  authRouter.route('/signUp')
    .post((req, res) => {
      // We shall now save the user credentials into the mongodb database
      // Pull the username and password from the request body
      const {
        username,
        password
      } = req.body;
      const dbName = 'libraryApp';
      const url = 'mongodb://localhost:27017';
      (async function addUser() {
        let client;
        try {
          client = await MongoClient.connect(url);
          debug('Connected correctly to server');
          const db = client.db(dbName);
          const col = db.collection('users');
          const user = {
            username,
            password
          };
          const results = await col.insertOne(user);
          debug(results);
          req.login(results.ops[0], () => {
            res.redirect('/auth/profile');
          });
        } catch (err) {
          debug(err);
        }
      }())
      //debug(req.body);
      //res.json(req.body);
    });
  authRouter.route('/profile')
    .get((req, res) => {
      res.json(req.user);
    });
  return authRouter;
}

module.exports = router;