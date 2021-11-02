import * as config from "../config";

export const state = {
  quote: {
    content:
      "It doesn't matter who you are, where you come from. The ability to triumph begins with you, Always.",
    writer: "Ophra Winfrey",
  },
  todo: {
    currDir: "Today", // "Today" or "Inbox" or "Done"
    Inbox: [],
    Today: [],
    Done: [],
  },
};

export const addItem = function (newItem) {
  const item = {
    checked: false,
    name: newItem,
    id: state.todo[state.todo.currDir].length,
  };

  state.todo[state.todo.currDir].push(item);
  localStorage.setItem(
    state.todo.currDir,
    JSON.stringify(state.todo[state.todo.currDir])
  );
};

export const updateItem = function (updatedItem) {
  const itemToUpdate = state.todo[state.todo.currDir][updatedItem.id];
  itemToUpdate.checked = updatedItem.checked;
  itemToUpdate.name = updatedItem.name;

  localStorage.setItem(
    state.todo.currDir,
    JSON.stringify(state.todo[state.todo.currDir])
  );
};

export const deleteItem = function (itemId) {
  const currDir = state.todo[state.todo.currDir];
  currDir.forEach((item, i) => {
    if (i >= itemId && i + 1 < currDir.length) {
      item.checked = currDir[i + 1].checked;
      item.name = currDir[i + 1].name;
    }
  });
  currDir.pop();

  localStorage.setItem(
    state.todo.currDir,
    JSON.stringify(state.todo[state.todo.currDir])
  );
};

export const moveItem = function (destCategory, itemId) {
  const currDir = state.todo[state.todo.currDir];
  const itemToMove = { ...currDir[itemId] };

  deleteItem(itemId);

  itemToMove.id = state.todo[destCategory].length;
  state.todo[destCategory].push(itemToMove);

  localStorage.setItem(
    state.todo.currDir,
    JSON.stringify(state.todo[state.todo.currDir])
  );
  localStorage.setItem(destCategory, JSON.stringify(state.todo[destCategory]));
};

export const getQuote = async function () {
  try {
    const header = {
      method: "GET",
      headers: {
        "x-rapidapi-key": `${config.RAKUTEN_RAPID_API_KEY}`,
        "x-rapidapi-host": `${config.RAKUTEN_RAPID_API_HOST}`,
      },
    };
    let res, data;
    while (true) {
      res = await fetch(`${config.RANDOM_QUOTE_API_ADDR}`, header);
      data = await res.json();
      if (data.content.length <= 100) break;
    }
    state.quote.content = data.content;
    state.quote.writer = data.originator.name;
  } catch (err) {
    console.error(err);
  }
};

export const switchCategory = function (newCategory) {
  state.todo.currDir = newCategory;
};

const init = function () {
  state.todo.Inbox = JSON.parse(localStorage.getItem("Inbox")) ?? [];
  state.todo.Today = JSON.parse(localStorage.getItem("Today")) ?? [];
  state.todo.Done = JSON.parse(localStorage.getItem("Done")) ?? [];
};

init();
