import {findEndedAuctions} from "../middlewares/findEndedAuctions";
import {closeAuctions} from "../middlewares/closeAuctions";
import createError from "http-errors";
async function ticktockAuctions(event, context) {
  // try {
  const AuctionsToclose = await findEndedAuctions();
  AuctionsToclose.map((auction) => console.log(auction.id));
  //   const closeEndedAuctions = AuctionsToclose.map((auction) =>
  //     closeAuctions(auction.id)
  //   );
  //   await Promise.all(closeEndedAuctions);
  //   return {
  //     statusCode: 204,
  //     closedAuctions: closeEndedAuctions.length,
  //   };
  // } catch (error) {
  //   throw new createError.InternalServerError(error);
  // }
}

export const handler = ticktockAuctions;
