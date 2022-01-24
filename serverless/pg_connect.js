const { Pool } = require("pg");

async function execute(dbQuery, localDebug) {
  //   const pgPool = new Pool({
  //     user: DB_USER,
  //     host: DB_HOST,
  //     database: DB_DATABASE,
  //     password: DB_PASSWORD,
  //   });
  // This function receives a string corresponding to
  // a database query, and returns the result as a JSON

  return { message: "Hola" };
  //var res = await pgPool.query(dbQuery);
  //await pgPool.end();
  //return res;
}

exports.handler = async function (event, context, callback) {
  // This function will answer to GET requests.
  // It will normally be used with POST requests, where the client
  // will pass a database query to the back-end. This query will
  // be executed against the database, and the result passed to
  // the client (front-end)

  // The http request's body is an object that will have the following keys:
  // - "dbQuery": Its content will be a string, corresponding to the key in the
  //      sqlQueries object (in this file). With this key, we can get the actual SQL query.

  var httpMessage = JSON.parse(event.body).httpMessage;
  let dbQuery = httpMessage.dbQuery;
  let localDebug = httpMessage.localDebug;

  var response = await execute(dbQuery, localDebug);

  callback(null, {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers":
        "Origin, X-Requested-With, Content-Type, Accept",
    },
    body: JSON.stringify(response),
  }); // Returns JSON
};
