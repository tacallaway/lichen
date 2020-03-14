let AWS = require("aws-sdk");
const lineReader = require("line-reader");

const config = {
  convertEmptyValues: true //convert empty strings to null
};
if (process.env.RUN_LOCAL === "true") {
  require('dotenv').config();

  config.region = 'localhost';
  config.endpoint = 'http://localhost:8000';
  config.accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  config.secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
} else {
  config.region = process.env.LAMBDA_REGION;
}
const documentClient = new AWS.DynamoDB.DocumentClient(config);

// LOAD SITE INVENTORIES
lineReader.eachLine("data/site_inventories_FINALDATA_21March2019.txt", function(line) {
  let [SiteCode, SiteCode2, EcoRegion3, EcoRegion4, Source, Country, State, County, USNF_NRA_NP, WildernessArea, DetailedLocalityData, Lat, Lng, Elevation, CollectionDate, Collectors, SpeciesInventory, ElementalAnalysis, Notes] = line.split("\t");

  let params = {
    Item: {
      SiteCode,
      SiteCode2,
      EcoRegion3,
      EcoRegion4,
      Source,
      Country,
      State,
      County,
      USNF_NRA_NP,
      WildernessArea,
      DetailedLocalityData,
      Lat,
      Lng,
      Elevation,
      CollectionDate,
      Collectors,
      SpeciesInventory,
      ElementalAnalysis,
      Notes
    },
    ReturnConsumedCapacity: "TOTAL",
    TableName: "SiteInventories"
  }

  documentClient.put(params, function(err, data) {
    if (err) {
      console.log(err, err.stack);
      process.exit(1);
    } else {
      console.log(`${SiteCode} added`);
    }
  });
});

// LOAD EA DATA
let sites = {};

lineReader.eachLine("data/EA_data_half_loc.txt", function(line, last) {
  let [Id, SiteCode, Sample, Species] = line.split("\t");

  let newSite = {
    Sample: Sample,
    Species: Species
  };

  if (sites[SiteCode]) {
    sites[SiteCode].push(newSite);
  } else {
    sites[SiteCode] = [ newSite ];
  }

  if (last) {
    Object.keys(sites).forEach(SiteCode => {
      if (SiteCode) {
        const Data = sites[SiteCode];
        let params = {
          Item: {
            Id,
            SiteCode,
            Data
          },
          ReturnConsumedCapacity: "TOTAL",
          TableName: "EAData"
        }

        documentClient.put(params, function(err, data) {
          if (err) {
            console.log(err, err.stack);
          } else {
            console.log(`${SiteCode} added`);
          }
        });
      }
    });
  }
});
