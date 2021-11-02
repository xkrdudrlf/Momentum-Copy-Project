import View from "./View";

class FooterQuoteView extends View {
  _parentElement = document.querySelector(".footer-center");

  async addHandlerRender(handler) {
    await handler();

    const quoteWriter = this._parentElement.querySelector(".quote-writer");
    const quote = this._parentElement.querySelector(".quote");

    this._parentElement.addEventListener("mouseenter", () => {
      let quoteMove = "-1rem";
      let quoteWriterMove = "1.8rem";
      const quoteHeight = getComputedStyle(quote).height.split("px")[0];
      if (quoteHeight > 64) {
        quoteMove = "-3rem";
        quoteWriterMove = "3rem";
      } else if (quoteHeight > 22) {
        quoteMove = "-2rem";
        quoteWriterMove = "2rem";
      }
      quote.style.transform = `translateY(${quoteMove})`;
      quoteWriter.style.transform = `translateY(${quoteWriterMove})`; // 1.8rem/ 3rem
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
