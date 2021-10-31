import footerQuoteView from "../views/footerQuoteView";
import * as model from "../models/footerModel";

const controlFooterQuote = async function () {
  await model.getQuote();
  footerQuoteView.render(model.state);
};

export const init = function () {
  footerQuoteView.addHandlerRender(controlFooterQuote);
};
