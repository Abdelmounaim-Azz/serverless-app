import AWS from "aws-sdk";

const s3 = new AWS.S3();

export async function uploadToS3(key, body) {
  const res = await s3
    .upload({
      Bucket: process.env.AUCTION_BUCKET_NAME,
      Key: key,
      Body: body,
      ContentEncoding: "base64",
      ContentType: "image/jpeg",
    })
    .promise();

  return res.Location;
}
