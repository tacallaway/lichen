'use strict';

const db = require('../database');

module.exports = {
  get: getSites
};

async function getSites(event, context, callback) {
  console.log('Method called: getSites');

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  };

  try {
    const siteCode = event['pathParameters'] && event['pathParameters']['SiteCode'];

    if (siteCode) {
      const promises = [
        db.query(buildParams(process.env.SITE_INVENTORIES, siteCode)),
        db.query(buildParams(process.env.EA_DATA, siteCode))
      ];
      const [si, ea] = await Promise.all(promises);

      let data = {};

      if (si.Items) {
        data = {
          ...si.Items[0],
          EAData: ea.Items[0] && ea.Items[0].Data || []
        }
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({data})
      };
    } else {
      const params = {
        TableName: process.env.SITE_INVENTORIES
      };

      const latLngOnly = event['queryStringParameters'] && event['queryStringParameters']['LatLngOnly'];
      if (latLngOnly === 'true') {
        params.ProjectionExpression = 'SiteCode, Lat, Lng'
      };

      const data = await db.scan(params);

      const includeEAData = event['queryStringParameters'] && event['queryStringParameters']['IncludeEA'];

      if (includeEAData) {
        const promises = [];

        data.Items.forEach(item => {
          promises.push(db.query(buildParams(process.env.EA_DATA, item.SiteCode)));
        });

        await Promise.all(promises).then(result => {
          result.forEach((item, index) => {
            if (item.Count > 0) {
              data.Items[index].EAData = item.Items[0].Data;
            }
          });
        });

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ data: data.Items })
        };
      } else {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ data: data.Items })
        };
      }
    }
  } catch (error) {
    console.log('Error in getSites(): ', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: `Error getting sites` })
    };
  }
}

function buildParams(tableName, siteCode) {
  return {
    TableName: tableName,
    KeyConditionExpression: "SiteCode = :code",
    ExpressionAttributeValues: {
        ":code": siteCode
    }
  };
}