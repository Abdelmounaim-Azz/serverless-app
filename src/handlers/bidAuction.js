import AWS from "aws-sdk";
import {cmnMiddleware} from "../middlewares/middy";
import {getAuctionById} from "./getAuction";
import createError from "http-errors";
const dynamodb = new AWS.DynamoDB.DocumentClient();
const placeBidSchema = {
  properties: {
    body: {
      type: "object",
      properties: {
        amount: {
          type: "number",
        },
      },
      required: ["amount"],
    },
  },
  required: ["body"],
};
async function bidAuction(event, context) {
  const {id} = event.pathParameters;
  const {amount} = event.body;
  const auction = await getAuctionById(id);
  if (auction.status === "CLOSED") {
    throw new createError.Forbidden("This auction has been closed!");
  }
  if (amount <= auction.highestBid.amount) {
    throw new createError.Forbidden(
      `Your bid must be higher than ${auction.highestBid.amount}!`
    );
  }

  const params = {
    TableName: process.env.AUCTION_TABLE_NAME,
    Key: {id},
    UpdateExpression: "set highestBid.amount = :amount",
    ExpressionAttributeValues: {
      ":amount": amount,
    },
    ReturnValues: "ALL_NEW",
  };

  let updatedAuction;

  try {
    const result = await dynamodb.update(params).promise();
    updatedAuction = result.Attributes;
  } catch (error) {
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(updatedAuction),
  };
}
export const handler = cmnMiddleware(bidAuction).use(
  validator({inputSchema: placeBidSchema})
);
