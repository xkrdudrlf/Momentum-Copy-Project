export const state = {
  username: "User",
  clockMode: 12,
};

export const setUsername = function (username) {
  state.username = username;
  localStorage.setItem("username", username);
};

const init = function () {
  const username = localStorage.getItem("username");
  if (username) state.username = username;
};

init();
