const getUrlBtn = document.querySelector("#get-url-btn");
const urlInput = document.querySelector("#url-input");
const cells = document.querySelectorAll('#playlist-info tr td:nth-child(2)');

getUrlBtn.addEventListener("click", () => {
    browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
        const activeTab = tabs[0];
        const tabUrl = activeTab.url;
        urlInput.value = tabUrl;
      });
});

cells[0].innerText = "2h 35m 40s";
cells[1].innerText = "5m 23s";
cells[2].innerText = 28;
cells[3].innerText = "1m 50s";
cells[4].innerText = "15m 32s";