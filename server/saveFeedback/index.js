const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

module.exports = function(context, req) {
  const mongoConnectionUrl =
    'mongodb://DATABASE-URL';
  const dbName = `autostar`;

  MongoClient.connect(mongoConnectionUrl, (err, client) => {
    if (err) throw err;

    const db = client.db(dbName);

    const feedback = req.query.feedback || (req.body && req.body.feedback);
    const rating = req.query.rating || (req.body && req.body.rating);
    const imgUrl = generateRandomImg();

    if (feedback && rating) {
      db.collection('feedbacks').insertOne(
        {
          feedback,
          rating: parseInt(rating, 10),
          imgUrl
        },
        (err, result) => {
          if (err) throw err;
          context.res = {
            body: result.ops,
            headers: {
              'Content-Type': 'application/json'
            }
          };
          client.close();
          context.done();
        }
      );
    } else {
      context.res = {
        status: 400,
        body: {
          error:
            'Please pass feedback and rating on the query string or in the request body'
        }
      };
    }
  });
};

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRandomImg() {
  const id = getRandomInt(1, 100);
  const manOrWoman = ['men', 'women'][getRandomInt(0, 1)];
  return `https://randomuser.me/api/portraits/${manOrWoman}/${id}.jpg`;
}
