const fetch = require('node-fetch');

module.exports = async function(context, req) {
  context.log('JavaScript HTTP trigger function processed a request.');

  const accessKey = process.env["TEXT_API_KEY"];
  const baseUri = process.env["TEXT_API_URL"];;
  const sentimentPath = '/text/analytics/v2.0/sentiment';

  const feedback = req.query.feedback || (req.body && req.body.feedback);
  context.log(typeof req.body); // should leave this as it is for now to see if it's still a string
  if (feedback) {
    const documents = {
      documents: [{ id: 1, language: 'en', text: feedback }]
    };

    const params = {
      method: 'post',
      body: JSON.stringify(documents),
      headers: {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': accessKey
      }
    };

    const res = await fetch(baseUri + sentimentPath, params);
    const json = await res.json();

    context.res = { body: json };
  } else {
    context.res = {
      status: 400,
      body: {
        error:
          'Please pass a feedback text on the query string or in the request body'
      }
    };
  }
};
