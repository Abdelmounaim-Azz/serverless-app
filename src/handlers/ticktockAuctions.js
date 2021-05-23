import {findEndedAuctions} from "../middlewares/findEndedAuctions";
import {closeAuctions} from "../middlewares/closeAuctions";
import createError from "http-errors";
async function ticktockAuctions(event, context) {
  try {
    const AuctionsToclose = await findEndedAuctions();
    const closeEndedAuctions = AuctionsToclose.map((auction) =>
      closeAuctions(auction.id)
    );
    await Promise.all(closeEndedAuctions);
    return {
      closedAuctions: closeEndedAuctions.length,
    };
  } catch (error) {
    throw new createError.InternalServerError(error);
  }
}

export const handler = ticktockAuctions;
