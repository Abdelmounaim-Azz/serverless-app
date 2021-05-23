import AWS from "aws-sdk";
import createError from "http-errors";
import validator from "@middy/validator";
import cmnMiddleware from "../middlewares/middy";
import getAuctionsSchema from "../model/geAuctionSchema";

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getAuctions(event, context) {
  const {status} = event.queryStringParameters;
  let auctions;

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
    const result = await dynamodb.query(params).promise();

    auctions = result.Items;
  } catch (error) {
    console.error(error);
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
