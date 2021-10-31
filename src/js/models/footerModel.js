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
  };

  state.todo[state.todo.currDir].push(item);
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
    const res = await fetch(`${config.RANDOM_QUOTE_API_ADDR}`, header);
    const data = await res.json();

    state.quote.content = data.content;
    state.quote.writer = data.originator.name;
  } catch (err) {
    console.error(err);
  }
};

export const switchCategory = function (newCategory) {
  state.todo.currDir = newCategory;
};
