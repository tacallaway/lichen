let AWS = require("aws-sdk");
AWS.config.update({region:"us-west-2"});
var documentClient = new AWS.DynamoDB.DocumentClient();
const lineReader = require("line-reader");

let sites = {};

// load site inventories
lineReader.eachLine("data/EA_data_half_loc.csv", function(line, last) {
  let [id, siteCode, sample, species] = line.split(",");

  siteCode = stripQuotes(siteCode).trim();
  sample = stripQuotes(sample).trim() || undefined;
  species = stripQuotes(species).trim() || undefined;

  let newSite = {
    Sample: sample,
    Species: species
  };

  if (sites[siteCode]) {
    sites[siteCode].push(newSite);
  } else {
    sites[siteCode] = [ newSite ];
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

        setTimeout(() => {
          documentClient.put(params, function(err, data) {
            if (err) {
              console.log(err, err.stack);
            } else {
              console.log(`${SiteCode} added`);
            }
          });
        }, 10);
      }
    });
  }
});

function stripQuotes(text) {
  return text.replace(/^"|"$/g, '');
}