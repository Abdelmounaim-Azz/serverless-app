import AWS from "aws-sdk";
import {cmnMiddleware} from "../middlewares/middy";
import createError from "http-errors";
const dynamodb = new AWS.DynamoDB.DocumentClient();
async function getAuctions(event, context) {
  let auctions;
  const {status} = event.queryStringParameters;
  let auctions;

  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
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

export const handler = cmnMiddleware(getAuctions);
