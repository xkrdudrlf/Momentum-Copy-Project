import mainHeadingTimeView from "../views/mainHeadingTimeView";
import mainHeadingGreetingView from "../views/mainHeadingGreetingView";
import * as model from "../models/mainModel";

const controlMainHeadingTime = function () {
  mainHeadingTimeView.render(model.state);
};

const controlMainHeadingGreeting = function () {
  mainHeadingGreetingView.render(model.state);
};

const controlEditUsername = function (updatedUsername) {
  model.setUsername(updatedUsername);
};

export const init = function () {
  mainHeadingTimeView.addHandlerRender(controlMainHeadingTime);
  mainHeadingGreetingView.addHandlerRender(controlMainHeadingGreeting);
  mainHeadingGreetingView.addHandlerEditUsername(controlEditUsername);
};
