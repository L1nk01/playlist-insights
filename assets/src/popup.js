const getUrlBtn = document.querySelector("#get-url-btn");
const urlInput = document.querySelector("#url-input");

getUrlBtn.addEventListener("click", () => {
    browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
        const activeTab = tabs[0];
        const tabUrl = activeTab.url;
        urlInput.value = tabUrl;
        // Puedes hacer algo más con la URL, como enviarla al popup o almacenarla.
      });
});