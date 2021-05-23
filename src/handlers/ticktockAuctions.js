import createError from "http-errors";
import {findEndedAuctions} from "../middlewares/findEndedAuctions";
import {closeAuctions} from "../middlewares/closeAuctions";

async function ticktockAuctions(event, context) {
  try {
    const auctionsToClose = await findEndedAuctions();
    const closedAuctions = auctionsToClose.map((auction) =>
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
