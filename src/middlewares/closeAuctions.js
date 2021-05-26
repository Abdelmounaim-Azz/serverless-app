import AWS from "aws-sdk";
const dynamodb = new AWS.DynamoDB.DocumentClient();
const sqs = new AWS.SQS();

export async function closeAuctions(auctionToBeClosed) {
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

  await dynamodb.update(params).promise();
  const {title, seller, highestBid} = auctionToBeClosed;
  const {amount, bidder} = highestBid;
  if (amount === 0) {
    await sqs
      .sendMessage({
        QueueUrl: process.env.MAIL_QUEUE_URL,
        MessageBody: JSON.stringify({
          subject: "No one bid on your auction!",
          recipient: seller,
          body: `Sorry! We would like to inform you that your item "${title}" did not receive any bids. wish you good luck for the next time!`,
        }),
      })
      .promise();
    return;
  }
  const sendMsgToSeller = sqs
    .sendMessage({
      QueueUrl: process.env.MAIL_QUEUE_URL,
      MessageBody: JSON.stringify({
        subject: "Auction has been closed and Item has been sold.",
        recipient: seller,
        body: `Congratulations!Your item ${title} has been sold for $${amount}`,
      }),
    })
    .promise();
  const sendMsgToBidder = sqs
    .sendMessage({
      QueueUrl: process.env.MAIL_QUEUE_URL,
      MessageBody: JSON.stringify({
        subject: "Hooray!you just won an auction.",
        recipient: bidder,
        body: `Congratulations on winning an auction of ${title} for a $${amount}.`,
      }),
    })
    .promise();
  return Promise.all([sendMsgToSeller, sendMsgToBidder]);
}
