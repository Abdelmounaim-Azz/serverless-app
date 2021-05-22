import AWS from "aws-sdk";
import {cmnMiddleware} from "../middlewares/middy";
import createError from "http-errors";
const dynamodb = new AWS.DynamoDB.DocumentClient();
async function bidAuction(event, context) {
  const {id} = event.pathParameters;
  let updatedAuction;
  const {amount} = event.body;
  const dbOptions = {
    TableName: process.env.AUCTION_TABLE_NAME,
    Key: {id},
    UpdateExpression: "set highestBid.amount=:amount",
    ExpressionAttributeValues: {
      ":amount": amount,
    },
    ReturnValues: "ALL_NEW",
  };
  try {
    const res = await dynamodb.update(dbOptions).promise();
    updatedAuction = res.Attributes;
  } catch (error) {
    throw new createError.InternalServerError(error);
  }
  return {
    statusCode: 200,
    body: JSON.stringify(updatedAuction),
  };
}

export const handler = cmnMiddleware(bidAuction);
