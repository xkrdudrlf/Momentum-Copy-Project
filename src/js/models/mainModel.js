export const state = {
  username: "User",
  clockMode: 12, // 12 or 24
  focusTask: "",
  mode: "input", // "input" or "task"
};

export const setUsername = function (username) {
  state.username = username;
  localStorage.setItem("username", username);
};

export const setFocusTask = function (focusTask) {
  state.focusTask = focusTask;
  localStorage.setItem("focusTask", focusTask);

  state.mode = "task";
  localStorage.setItem("focusMode", "task");
};

export const clearFocusTask = function () {
  state.focusTask = "";
  localStorage.setItem("focusTask", "");

  state.mode = "input";
  localStorage.setItem("focusMode", "input");
};

const init = function () {
  const username = localStorage.getItem("username");
  if (username) state.username = username;

  const focusTask = localStorage.getItem("focusTask");
  if (focusTask) state.focusTask = focusTask;

  const focusMode = localStorage.getItem("focusMode");
  if (focusMode) state.mode = focusMode;
};

init();
