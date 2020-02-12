let AWS = require("aws-sdk");
AWS.config.update({region:"us-west-2"});
let dynamodb = new AWS.DynamoDB();
const lineReader = require("line-reader");

// load site inventories
lineReader.eachLine("data/site_inventories_FINALDATA_21March2019.csv", function(line) {
  let [siteCode, siteCode2, ecoRegion3, ecoRegion4] = line.split(",");

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
      }
    },
    ReturnConsumedCapacity: "TOTAL",
    TableName: "SiteInventories"
  }

  dynamodb.putItem(params, function(err, data) {
    if (err) {
      console.log(err, err.stack);
    } else {
      console.log(`${SiteCode} added`);
    }
  });
});
