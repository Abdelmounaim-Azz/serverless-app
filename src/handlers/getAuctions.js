import AWS from "aws-sdk";
const validator = require("@middy/validator");
import {cmnMiddleware} from "../middlewares/middy";
import createError from "http-errors";
const dynamodb = new AWS.DynamoDB.DocumentClient();
const getAuctionsSchema = {
  required: ["queryStringParameters"],
  properties: {
    queryStringParameters: {
      type: "object",
      properties: {
        status: {
          type: "string",
          enum: ["OPEN", "CLOSED"],
          default: "OPEN",
        },
      },
    },
  },
};
async function getAuctions(event, context) {
  let auctions;
  const {status} = event.queryStringParameters;
  const params = {
    TableName: process.env.AUCTION_TABLE_NAME,
    IndexName: "statusAndEndDate",
    KeyConditionExpression: "#status = :status",
    ExpressionAttributeValues: {
      ":status": status,
    },
    ExpressionAttributeNames: {
      "#status": "status",
    },
  };

  try {
    const res = await dynamodb.query(params).promise();
    auctions = res.Items;
  } catch (error) {
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(auctions),
  };
}

export const handler = cmnMiddleware(getAuctions).use(
  validator({inputSchema: getAuctionsSchema, useDefaults: true})
);
