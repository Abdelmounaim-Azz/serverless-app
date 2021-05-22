import AWS from "aws-sdk";
import {cmnMiddleware} from "../middlewares/middy";
import createError from "http-errors";
const dynamodb = new AWS.DynamoDB.DocumentClient();
async function getAuction(event, context) {
  let auction;
  const {id} = event.pathParameters;
  try {
    const result = await dynamodb
      .get({
        TableName: process.env.AUCTION_TABLE_NAME,
        Key: {id},
      })
      .promise();
    auction = result.Item;
  } catch (error) {
    throw new createError.InternalServerError(error);
  }

  if (!auction) {
    throw new createError.NotFound(`Auction  not found!`);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(auction),
  };
}

export const handler = cmnMiddleware(getAuction);
