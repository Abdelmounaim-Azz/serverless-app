import createError from "http-errors";
import {findEndedAuctions} from "../middlewares/findEndedAuctions";
import {closeAuctions} from "../middlewares/closeAuctions";

async function ticktockAuctions(event, context) {
  try {
    const isAuctionClosed = await findEndedAuctions();
    const closedAuctions = isAuctionClosed.map((auction) =>
      closeAuctions(auction)
    );
    await Promise.all(closedAuctions);
    return {success: "true", numAuctionsClosed: closedAuctions.length};
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }
}

export const handler = ticktockAuctions;
