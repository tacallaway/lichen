let AWS = require("aws-sdk");
const lineReader = require("line-reader");

const config = {
  convertEmptyValues: true //convert empty strings to null
};
if (process.env.RUN_LOCAL) {
  config.region = 'localhost';
  config.endpoint = 'http://localhost:8000';
  config.accessKeyId = 'AKIAZCTEU7SNDWFP33PB';
  config.secretAccessKey = '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';
} else {
  config.region = "us-west-2";
}
var documentClient = new AWS.DynamoDB.DocumentClient(config);

// LOAD SITE INVENTORIES
lineReader.eachLine("data/site_inventories_FINALDATA_21March2019.txt", function(line) {
  let [SiteCode, SiteCode2, EcoRegion3, EcoRegion4, Source, Country, State, County, USNF_NRA_NP, WildernessArea, DetailedLocalityData, Lat, Long, Elevation, CollectionDate, Collectors, SpeciesInventory, ElementalAnalysis, Notes] = line.split("\t");

  let params = {
    Item: {
      SiteCode,
      siteCode2: SiteCode2,
      ecoRegion3: EcoRegion3,
      ecoRegion4: EcoRegion4,
      source: Source,
      country: Country,
      state: State,
      county: County,
      USNF_NRA_NP,
      wildernessArea: WildernessArea,
      detailedLocalityData: DetailedLocalityData,
      lat: Lat,
      long: Long,
      elevation: Elevation,
      collectionDate: CollectionDate,
      collectors: Collectors,
      speciesInventory: SpeciesInventory,
      elementalAnalysis: ElementalAnalysis,
      notes: Notes || " "
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
