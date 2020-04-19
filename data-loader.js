let AWS = require("aws-sdk");
const lineReader = require("line-reader");

const args = process.argv.slice(2);

if (args < 2) {
  console.log('Usage: npm run load-data <site_inventory_file> <EA_data_file>');
  return;
}

const [siteInventoryFile, eaDataFile] = args;

require('dotenv').config();
const config = {
  convertEmptyValues: true, //convert empty strings to null
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
};

// RUN_LOCAL is used for local testing only and requires `npm run start-local-debug` before running loader
if (process.env.RUN_LOCAL === "true") {
  config.region = 'localhost';
  config.endpoint = 'http://localhost:8000';
} else {
  config.region = process.env.LAMBDA_REGION;
}

const documentClient = new AWS.DynamoDB.DocumentClient(config);

// LOAD SITE INVENTORIES
lineReader.eachLine(siteInventoryFile, function (line) {
  let [
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
  ] = line.split("\t"); // converted to tab-delimited file since some data included commas

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

  documentClient.put(params, err => {
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

lineReader.eachLine(eaDataFile, function (line, last) {
  let [
    Id,
    SiteCode,
    Sample,
    Species,
    ycollect,
    ypublish,
    tech,
    CaPERC,
    KPERC,
    MgPERC,
    NPERC,
    PPERC,
    SPERC,
    Al,
    As,
    B,
    Ba,
    Cd,
    Co,
    Cr,
    Cu,
    Fe,
    Mn,
    Mo,
    Na,
    Ni,
    Pb,
    Se,
    Si,
    Sr,
    Ti,
    V,
    Zn,
    Cl,
    Br,
    Rb,
    Cu_Zn,
    Fe_Ti,
    F,
    lat,
    lng
  ] = line.split("\t");

  let newSite = {
    Id,
    Sample,
    Species,
    ycollect,
    ypublish,
    tech,
    CaPERC,
    KPERC,
    MgPERC,
    NPERC,
    PPERC,
    SPERC,
    Al,
    As,
    B,
    Ba,
    Cd,
    Co,
    Cr,
    Cu,
    Fe,
    Mn,
    Mo,
    Na,
    Ni,
    Pb,
    Se,
    Si,
    Sr,
    Ti,
    V,
    Zn,
    Cl,
    Br,
    Rb,
    Cu_Zn,
    Fe_Ti,
    F,
    lat,
    lng
  };

  // merge the EA data if we have more than one row of EA data for a site
  if (sites[SiteCode]) {
    sites[SiteCode].push(newSite);
  } else {
    sites[SiteCode] = [newSite];
  }

  if (last) {
    Object.keys(sites).forEach(SiteCode => {
      if (SiteCode) {
        const Data = sites[SiteCode];
        let params = {
          Item: {
            SiteCode,
            Data
          },
          ReturnConsumedCapacity: "TOTAL",
          TableName: "EAData"
        }

        documentClient.put(params, err => {
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
