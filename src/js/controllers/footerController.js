import footerQuoteView from "../views/footerQuoteView";
import footerTodoModalView from "../views/footerTodoModalView";
import * as model from "../models/footerModel";

const controlFooterQuote = async function () {
  // await model.getQuote();
  footerQuoteView.render(model.state);
};

const controlFooterTodoModal = function () {
  footerTodoModalView.render(model.state);
};

const controlSwitchCategory = function (newCategory) {
  model.switchCategory(newCategory);
  footerTodoModalView.update(model.state);
};

const controlAddItem = function (newItem) {
  model.addItem(newItem);
  return model.state;
};

const controlUpdateItem = function (updatedItem) {
  model.updateItem(updatedItem);
};

export const init = function () {
  footerQuoteView.addHandlerRender(controlFooterQuote);
  footerTodoModalView.addHandlerRender(controlFooterTodoModal);
  footerTodoModalView.addHanlderSwitchCategory(controlSwitchCategory);
  footerTodoModalView.addHandlerCategoryDropdown(controlSwitchCategory);
  footerTodoModalView.addHandlerAddItem(controlAddItem);
  footerTodoModalView.addHandlerItemCheckbox(controlUpdateItem);
  footerTodoModalView.addHandlerUpdateItem(controlUpdateItem);
};
