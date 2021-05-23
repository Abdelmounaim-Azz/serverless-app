import AWS from "aws-sdk";
const dynamoDB = new AWS.DynamoDB.DocumentClient();

export const findEndedAuctions = async () => {
  const now = new Date();
  const params = {
    TableName: process.env.AUCTION_TABLE_NAME,
    IndexName: "statusAndEndDate",
    KeyConditionPartition: "#status=:status AND endAt <= :now",
    ExpressionAttributeValues: {
      ":status": "OPEN",
      ":now": now.toISOString(),
    },
    ExpressionAttributeNames: {
      "#status": "status",
    },
  };
  const res = await dynamoDB.query(params).promise();
  return res.Items;
};
