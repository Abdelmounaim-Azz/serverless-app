import {v4 as uuid} from "uuid";
import AWS from "aws-sdk";
import {cmnMiddleware} from "../middlewares/middy";
import createError from "http-errors";
const dynamodb = new AWS.DynamoDB.DocumentClient();
async function createAuction(event, context) {
  const {title} = event.body;
  const now = new Date();
  const auction = {
    id: uuid(),
    title,
    status: "OPEN",
    createdAt: now.toISOString(),
    highestBid: {
      amount: 0,
    },
  };
  try {
    await dynamodb
      .put({
        TableName: process.env.AUCTION_TABLE_NAME,
        Item: auction,
      })
      .promise();
  } catch (error) {
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 201,
    body: JSON.stringify(auction),
  };
}

export const handler = cmnMiddleware(createAuction);
