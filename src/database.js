'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const config = {};
if (process.env.RUN_LOCAL) {
  config.region = 'localhost';
  config.endpoint = 'http://localhost:8000';
  config.accessKeyId = 'AKIAZCTEU7SNDWFP33PB';
  config.secretAccessKey = '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';
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
