import {v4 as uuid} from "uuid";
import AWS from "aws-sdk";
import validator from "@middy/validator";
import createError from "http-errors";
import {cmnMiddleware} from "../middlewares/middy";

const dynamodb = new AWS.DynamoDB.DocumentClient();
const createAuctionSchema = {
  properties: {
    body: {
      type: "object",
      properties: {
        title: {
          type: "string",
        },
      },
      required: ["title"],
    },
  },
  required: ["body"],
};
async function createAuction(event, context) {
  const {title} = event.body;
  const {email} = event.requestContext.authorizer;
  const now = new Date();
  const endDate = new Date();
  endDate.setHours(now.getHours() + 1);

  const auction = {
    id: uuid(),
    title,
    status: "OPEN",
    createdAt: now.toISOString(),
    endAt: endDate.toISOString(),
    highestBid: {
      amount: 0,
    },
    seller: email,
  };

  try {
    await dynamodb
      .put({
        TableName: process.env.AUCTION_TABLE_NAME,
        Item: auction,
      })
      .promise();
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 201,
    body: JSON.stringify(auction),
  };
}

export const handler = cmnMiddleware(createAuction).use(
  validator({inputSchema: createAuctionSchema})
);
