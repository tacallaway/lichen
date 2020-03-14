'use strict';

const db = require('../database');

module.exports = {
  get: getSites
};

async function getSites(event, context, callback) {
  console.log('Method called: getSites');

  var headers = {
    'Content-Type': 'application/json'
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
      callback(null, {
        statusCode: 200,
        headers,
        body: JSON.stringify({response: data.Items })
      });
    } else {
      const params = {
        TableName: process.env.SITE_INVENTORIES
      };

      const data = await db.scan(params);
      callback(null, {
        statusCode: 200,
        headers,
        body: JSON.stringify({response: data.Items })
      });
    }
  } catch (error) {
    console.log('Error in getSites(): ', error);
    callback(null, {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: `Error getting sites` })
    });
  }
}
