import AWS from "aws-sdk";
const dynamodb = new AWS.DynamoDB.DocumentClient();

export async function findEndedAuctions() {
  const now = new Date();
  const params = {
    TableName: process.env.AUCTION_TABLE_NAME,
    KeyConditionExpression: "#status = :status AND endAt <= :now",
    ExpressionAttributeValues: {
      ":status": "OPEN",
      ":now": now.toISOString(),
    },
    ExpressionAttributeNames: {
      "#status": "status",
    },
  };

  const res = await dynamodb.scan(params).promise();
  return res.Items;
}
