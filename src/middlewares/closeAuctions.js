import AWS from "aws-sdk";

const dynamodb = new AWS.DynamoDB.DocumentClient();

export async function closeAuction(auctionToBeClosed) {
  const params = {
    TableName: process.env.AUCTION_TABLE_NAME,
    Key: {id: auctionToBeClosed.id},
    UpdateExpression: "set #status = :status",
    ExpressionAttributeValues: {
      ":status": "CLOSED",
    },
    ExpressionAttributeNames: {
      "#status": "status",
    },
  };

  const res = await dynamodb.update(params).promise();

  return res;
}