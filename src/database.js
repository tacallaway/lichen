'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const config = {};
if (process.env.RUN_LOCAL === "true") {
  require('dotenv').config();

  config.region = 'localhost';
  config.endpoint = 'http://localhost:8000';
  config.accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  config.secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
} else {
  config.region = process.env.LAMBDA_REGION;
}
const dynamoDb = new AWS.DynamoDB.DocumentClient(config);

module.exports = {
  put,
  update,
  scan,
  query,
};

function put(params) {
  return dynamoDb.put(params).promise();
}

function update(params) {
  return dynamoDb.update(params).promise();
}

function scan(params) {
  return dynamoDb.scan(params).promise();
}

function query(params) {
  return dynamoDb.query(params).promise();
}
