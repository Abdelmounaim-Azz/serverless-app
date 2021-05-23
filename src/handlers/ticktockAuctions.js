import {findEndedAuctions} from "../middlewares/findEndedAuctions";
async function ticktockAuctions(event, context) {
  const isAuctionClosed = await findEndedAuctions();
  console.log(isAuctionClosed);
}

export const handler = ticktockAuctions;
