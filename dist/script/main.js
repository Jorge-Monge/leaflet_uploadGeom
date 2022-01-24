let localDebug = false;

const WINDOW_HOST = window.location.hostname;
if (WINDOW_HOST === "127.0.0.1" || WINDOW_HOST === "localhost") {
  localDebug = true;
}

const dbQuery = "";

async function queryExecute(dbQuery, localDebug) {
  // This function connects to the database in the back-end,
  // and executes a SQL query.
  // Function arguments are a SQL query

  return (
    await fetch("/.netlify/functions/pg_connect", {
      method: "POST",
      headers: { Accept: "application/json" },
      body: JSON.stringify({
        // The actual value of the "selectAllQuery" is stored in the
        // back-end for security.
        httpMessage: {
          dbQuery,
          localDebug,
        },
      }),
    })
  ).json(); // return ends
} // queryExecute ends

let result = queryExecute(dbQuery, localDebug);
result.then((a) => console.log("result:", a));

let map = L.map("map").setView([55, -98], 5);

let exampleJson = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {},
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-114.1015362739563, 51.094830654212124],
            [-114.10033464431761, 51.094830654212124],
            [-114.10033464431761, 51.09534274439191],
            [-114.1015362739563, 51.09534274439191],
            [-114.1015362739563, 51.094830654212124],
          ],
        ],
      },
    },
  ],
};

L.tileLayer(
  "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
  {
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: "mapbox/streets-v11",
    tileSize: 512,
    zoomOffset: -1,
    accessToken:
      "pk.eyJ1Ijoiam9yZGltb25rIiwiYSI6ImNreXF0cm5naTBuZXUycGxlZm56cWd1cTkifQ.BEnRM4VFmit_rC8X7SzfXw",
  }
).addTo(map);

let jsonLayer = L.geoJSON((data = null), {
  style: function (feature) {
    return { color: feature.properties.color };
  },
})
  .bindPopup(function (layer) {
    return "Hola";
  })
  .addTo(map);

jsonLayer.addData(exampleJson);
