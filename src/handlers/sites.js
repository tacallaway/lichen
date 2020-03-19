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
    const siteCode = event['queryStringParameters'] && event['queryStringParameters']['SiteCode'];

    if (siteCode) {
      const params = {
        TableName: process.env.SITE_INVENTORIES,
        KeyConditionExpression: "SiteCode = :code",
        ExpressionAttributeValues: {
            ":code": siteCode
        }
      };

      const data = await db.query(params);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({data: data.Items })
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

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({data: data.Items })
      };
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
