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
    const params = {
      TableName: process.env.SITE_INVENTORIES,
      KeyConditionExpression: "#SiteCode = :code",
      ExpressionAttributeNames:{
          "#SiteCode": "SiteCode"
      },
      ExpressionAttributeValues: {
          ":code": "SCNF_25"
      }
    };

    console.log('About to read database');
    const data = await db.query(params);
    console.log(data);
    callback(null, {
      statusCode: 200,
      headers,
      body: JSON.stringify({response: data.Items[0].Test })
    });
  } catch (error) {
    console.log('Error in addUser(): ', error);
    callback(null, {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: `Error adding user` })
    });
  }
}
