const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

module.exports = function(context) {
  const mongoConnectionUrl =
    'mongodb://DATABASE-URL';
  const dbName = `autostar`;

  MongoClient.connect(mongoConnectionUrl, (err, client) => {
    if (err) throw err;

    const db = client.db(dbName);

    db.collection('feedbacks')
      .find({})
      .limit(20)
      .toArray((err, result) => {
        if (err) {
          throw err;
        }
        context.log(result);
        context.res = {
          body: result,
          headers: {
            'Content-Type': 'application/json'
          }
        };
        client.close();
        context.done();
      });
  });
};
