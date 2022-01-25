let localDebug = false;

const WINDOW_HOST = window.location.hostname;
if (WINDOW_HOST === "127.0.0.1" || WINDOW_HOST === "localhost") {
  localDebug = true;
}

const dbQuery = "selectAll";

async function queryExecute(dbQuery, localDebug) {
  // This function connects to the database in the back-end,
  // and executes a SQL query.
  // Function arguments are a string making reference to the type of query
  // and a Boolean corresponding to whether the app. is executing locally

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

let resultCollection = {
  type: "FeatureCollection",
  features: [],
};

let exampleJson = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {},
      geometry: {
        type: "MultiPolygon",
        coordinates: [
          [
            [
              [-114.1015362739563, 51.094830654212124],
              [-114.10033464431761, 51.094830654212124],
              [-114.10033464431761, 51.09534274439191],
              [-114.1015362739563, 51.09534274439191],
              [-114.1015362739563, 51.094830654212124],
            ],
            [
              [-114.1, 51.1],
              [-114.2, 51.2],
              [-114.3, 51.3],
              [-114.4, 51.5],
              [-114.1, 51.1],
            ],
          ],
        ],
      },
    },
  ],
};

result
  .then((r) => {
    console.log("Number of records:", r.rowCount);
    console.log("Fields:", r.fields);
    console.log("Records:");
    r.rows.forEach((elem) => {
      console.log("id:", elem.id);
      console.log("population:", elem.population);
      console.log("geometry:", elem.geom);

      resultCollection.features.push({
        type: "Feature",
        properties: {
          // id: elem.id,
          // population: elem.population,
        },
        geometry: JSON.parse(elem.geom),
      });
    });

    return resultCollection;
  })
  .then((data) => {
    addDataToMap(data);
  });

let map = L.map("map").setView([55, -98], 5);

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
  style: {
    color: "red",
  },
})
  .bindPopup(function (layer) {
    return "Hola";
  })
  .addTo(map);

const addDataToMap = (data) => {
  console.log("resultCollection:", data);
  jsonLayer.addData(data);
};
