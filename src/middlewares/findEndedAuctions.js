import AWS from "aws-sdk";
const dynamodb = new AWS.DynamoDB.DocumentClient();

export async function findEndedAuctions() {
  const now = new Date();
  const params = {
    TableName: process.env.AUCTION_TABLE_NAME,
    IndexName: "statusAndEndDate",
    KeyConditionExpression: "#status = :status AND endAt <= :now",
    ExpressionAttributeValues: {
      ":status": "OPEN",
      ":now": now.toISOString(),
    },
    ExpressionAttributeNames: {
      "#status": "status",
    },
  };

  const res = await dynamodb.query(params).promise();
  return res.Items;
}
