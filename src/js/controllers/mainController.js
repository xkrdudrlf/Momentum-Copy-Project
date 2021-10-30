import mainHeadingTimeView from "../views/mainHeadingTimeView";
import mainHeadingGreetingView from "../views/mainHeadingGreetingView";
import mainFocusInputView from "../views/mainFocusInputView";
import mainFocusTaskView from "../views/mainFocusTaskView";
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

const controlMainFocus = function () {
  mainFocusInputView.render(model.state);
};

const controlMainFocusTaskInput = function (focusTaskInput) {
  if (focusTaskInput === "") model.clearFocusTask();
  else model.setFocusTask(focusTaskInput);

  mainFocusTaskView.display(focusTaskInput);
};

const controlMainFocusTask = function () {
  mainFocusTaskView.render(model.state);
};

const controlChangeFocusTask = function (updatedFocusTask) {
  if (updatedFocusTask === "") model.clearFocusTask();
  else model.setFocusTask(updatedFocusTask);

  mainFocusTaskView.hide();
  mainFocusInputView.display(updatedFocusTask);
};

export const init = function () {
  mainHeadingTimeView.addHandlerRender(controlMainHeadingTime);

  mainHeadingGreetingView.addHandlerRender(controlMainHeadingGreeting);
  mainHeadingGreetingView.addHandlerEditUsername(controlEditUsername);

  mainFocusInputView.addHandlerRender(controlMainFocus);
  mainFocusInputView.addHandlerFocusTaskInput(controlMainFocusTaskInput);

  mainFocusTaskView.addHandlerRender(controlMainFocusTask);
  mainFocusTaskView.addHandlerChangeFocusTask(controlChangeFocusTask);
};
