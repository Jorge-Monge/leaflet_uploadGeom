//https://gis.stackexchange.com/questions/35171/creating-proper-geojson-from-postgis-data-using-node-js

const { Pool } = require("pg");

async function execute(dbQuery, localDebug) {
  // In local debugging, obtain the env. variables from a local file
  let local;
  if (localDebug === true) {
    local = require("../envs.js");
  }

  const pgPool = new Pool({
    user: process.env.DB_USER || local.DB_USER,
    host: process.env.DB_HOST || local.DB_HOST,
    database: process.env.DB_DATABASE || local.DB_DATABASE,
    password: process.env.DB_PASSWORD || local.DB_PASSWORD,
    connectionTimeoutMillis: 0, // 50 secs
    idleTimeoutMillis: 0,
  });

  let query;
  if (dbQuery === "selectAll") {
    query = `
      SELECT id,
        population,
        prov_abbrev,
        ST_AsGeoJSON(ST_TRANSFORM(geom, 4326)) AS geom
      FROM statscan_dissemination_areas
      WHERE prov_abbrev = 'AB'
      LIMIT 10000
      `;
  }

  var res = await pgPool.query(query);
  await pgPool.end();
  return res;
}

exports.handler = async function (event, context, callback) {
  // This function will answer to POST requests, where the client
  // will pass a database query to the back-end. This query will
  // be executed against the database, and the result passed to
  // the client (front-end)

  // The http request's body is an object that will have the following keys:
  // - "dbQuery": a reference in order to obtain the actual SQL query.
  // - "localDebug": whether the app. is executing locally

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
