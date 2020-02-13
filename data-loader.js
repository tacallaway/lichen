let AWS = require("aws-sdk");
AWS.config.update({region:"us-west-2"});
let dynamodb = new AWS.DynamoDB();
const lineReader = require("line-reader");

// load site inventories
lineReader.eachLine("data/site_inventories_FINALDATA_21March2019.csv", function(line) {
  let [siteCode, siteCode2, ecoRegion3, ecoRegion4, source, country, state, county, USNF_NRA_NP, wildernessArea, detailedLocalityData, lat, long, elevation, collectionDate, collectors, speciesInventory, elementalAnalysis, notes] = line.split(",");

  let params = {
    Item: {
      SiteCode: {
        S: siteCode
      },
      SiteCode2: {
        S: siteCode2
      },
      EcoRegion3: {
        S: ecoRegion3
      },
      EcoRegion4: {
        S: ecoRegion4
      },
      Source: {
        S: source
      },
      Country: {
        S: country
      },
      State: {
        S: state
      },
      County: {
        S: county
      },
      USNF_NRA_NP: {
        S: USNF_NRA_NP
      },
      WildernessArea: {
        S: wildernessArea
      },
      DetailedLocalityData: {
        S: detailedLocalityData
      },
      Lat: {
        S: lat
      },
      Long: {
        S: long
      },
      Elevation: {
        S: elevation
      },
      CollectionDate: {
        S: collectionDate
      },
      Collectors: {
        S: collectors
      },
      SpeciesInventory: {
        S: speciesInventory
      },
      ElementalAnalysis: {
        S: elementalAnalysis
      },
      Notes: {
        S: notes
      }
    },
    ReturnConsumedCapacity: "TOTAL",
    TableName: "SiteInventories"
  }

  dynamodb.putItem(params, function(err, data) {
    if (err) {
      console.log(err, err.stack);
    } else {
      console.log(`${siteCode} added`);
    }
  });
});
