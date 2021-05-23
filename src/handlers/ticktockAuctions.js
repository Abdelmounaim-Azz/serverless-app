import createError from "http-errors";
import {findEndedAuctions} from "../middlewares/findEndedAuctions";
import {closeAuctions} from "../middlewares/closeAuctions";

async function ticktockAuctions(event, context) {
  try {
    const auctionsToClose = await findEndedAuctions();
    const closePromises = auctionsToClose.map((auction) =>
      closeAuctions(auction)
    );
    await Promise.all(closePromises);
    return {closed: closePromises.length};
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }
}

export const handler = ticktockAuctions;
