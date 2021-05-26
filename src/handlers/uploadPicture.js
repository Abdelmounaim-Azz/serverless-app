import middy from "@middy/core";
import httpErrorHandler from "@middy/http-error-handler";
import validator from "@middy/validator";
import cors from "@middy/http-cors";
import createError from "http-errors";
import {getAuctionById} from "./getAuction";
import {uploadToS3} from "../middlewares/uploadToS3";
import {setPictureUrl} from "../middlewares/setPictureUrl";
const uploadPictureSchema = {
  properties: {
    body: {
      type: "string",
      minLength: 1,
      pattern: "=$",
    },
  },
  required: ["body"],
};

export async function uploadPicture(event) {
  const {id} = event.pathParameters;
  const {email} = event.requestContext.authorizer;
  const auction = await getAuctionById(id);
  if (auction.seller !== email) {
    throw new createError.Forbidden(
      `Not allowed.only the seller can upload pictures!`
    );
  }
  const base64 = event.body.replace(/^data:image\/\w+;base64,/, "");
  const buffer = Buffer.from(base64, "base64");
  let updateRecord;
  try {
    const pictureUrl = await uploadToS3(auction.id + ".jpg", buffer);
    updateRecord = await setPictureUrl(auction.id, pictureUrl);
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }
  return {
    statusCode: 200,
    body: JSON.stringify(updateRecord),
  };
}

export const handler = middy(uploadPicture)
  .use(httpErrorHandler())
  .use(validator({inputSchema: uploadPictureSchema}))
  .use(cors());
