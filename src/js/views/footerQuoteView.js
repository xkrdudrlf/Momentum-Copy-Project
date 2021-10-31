import View from "./View";

class FooterQuoteView extends View {
  _parentElement = document.querySelector(".footer-center");

  async addHandlerRender(handler) {
    await handler();

    const quoteWriter = this._parentElement.querySelector(".quote-writer");
    const quote = this._parentElement.querySelector(".quote");

    this._parentElement.addEventListener("mouseenter", () => {
      quote.style.transform = "translateY(-1rem)";
      quoteWriter.style.transform = "translateY(1.8rem)";
      quoteWriter.style.opacity = 1;
    });

    this._parentElement.addEventListener("mouseleave", () => {
      quote.style.transform = "translateY(0rem)";
      quoteWriter.style.transform = "translateY(0rem)";
      quoteWriter.style.opacity = 0;
    });
  }

  _generateMarkup() {
    return `
      <div class="quote-writer">
        ${this._data.quote.writer}
      </div>
      <div class="quote">
        ${this._data.quote.content}
      </div>
    `;
  }
}

export default new FooterQuoteView();
