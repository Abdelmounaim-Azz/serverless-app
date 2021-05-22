import AWS from "aws-sdk";
import {cmnMiddleware} from "../middlewares/middy";
import createError from "http-errors";
const dynamodb = new AWS.DynamoDB.DocumentClient();
async function getAuctions(event, context) {
  let auctions;
  try {
    const res = await dynamodb
      .scan({TableName: process.env.AUCTION_TABLE_NAME})
      .promise();
    auctions = res.Items;
  } catch (error) {
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(auctions),
  };
}

export const handler = cmnMiddleware(getAuctions);
