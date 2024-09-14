const buttons = {
  getUrlBtn: document.querySelector("#get-url-btn"),
  getInfoBtn: document.querySelector("#get-info-btn"),
  resetDataBtn: document.querySelector("#reset-data-btn")
}
const urlInput = document.querySelector("#url-input");
const tableDataCells = document.querySelectorAll('#playlist-info tr td:nth-child(2)');

buttons.getUrlBtn.addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
    let activeTab = tabs[0];
    let tabUrl = activeTab.url;
    urlInput.value = tabUrl;
  });
});

buttons.getInfoBtn.addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    let urlValue = urlInput.value;
    let activeTabId = tabs[0].id;

    chrome.tabs.sendMessage(activeTabId, { action: "getVideoTimeElements", url: urlValue }, (response) => {
      if (chrome.runtime.lastError || response.message === "URL IS NOT A VALID YOUTUBE PLAYLIST URL") {
        alert("URL IS NOT A VALID YOUTUBE PLAYLIST URL");
        return;
      }

      if (response && response.videoTimeElements) {
        let videoTimeElements = response.videoTimeElements;

        updateTable(getPlaylistData(videoTimeElements));
      }
    });
  });
});

buttons.resetDataBtn.addEventListener("click", (resetData));

function updateTable(videoInfo) {
  tableDataCells[0].innerText = `${videoInfo.playlistDuration}`;
  tableDataCells[1].innerText = `${videoInfo.playlistAverageDuration}`;
  tableDataCells[2].innerText = `${videoInfo.playlistTotalVideos}`;
  tableDataCells[3].innerText = `${videoInfo.playlistShortestVideo}`;
  tableDataCells[4].innerText = `${videoInfo.playlistLongestVideo}`;
}

function resetData() {
  urlInput.value = "";
  tableDataCells[0].innerText = "";
  tableDataCells[1].innerText = "";
  tableDataCells[2].innerText = "";
  tableDataCells[3].innerText = "";
  tableDataCells[4].innerText = "";
}

function getPlaylistData(videoTimeElements) {
  let data = {
    playlistDuration: playlist.getPlaylistDuration(videoTimeElements),
    playlistAverageDuration: playlist.getPlaylistAverageDuration(videoTimeElements),
    playlistTotalVideos: playlist.getPlaylistTotalVideos(videoTimeElements),
    playlistShortestVideo: playlist.getPlaylistShortestVideo(videoTimeElements),
    playlistLongestVideo: playlist.getPlaylistLongestVideo(videoTimeElements)
  }

  return data;
}

function convertTimeToSeconds(time) {
  let [minutes, seconds] = time.split(":").map(Number);

  if (isNaN(minutes) || isNaN(seconds)) {
    return 0;
  }

  return (minutes * 60) + seconds;
}

function convertSecondsToTime(durationSeconds) {
  const time = {
    hours: Math.floor(durationSeconds / 3600),
    minutes: Math.floor((durationSeconds % 3600) / 60),
    seconds: durationSeconds % 60
  };

  let formattedTime = `${time.hours}:${time.minutes}:${time.seconds}`;

  return formattedTime;
}

const playlist = {
  getPlaylistDuration: (videoTimeElements) => {
    let durationSeconds = 0;

    for (let i = 0; i < videoTimeElements.length; i++) {
      let time = videoTimeElements[i]; // Example: "1:26"
      durationSeconds += convertTimeToSeconds(time);
    }

    return convertSecondsToTime(durationSeconds);
  },
  getPlaylistAverageDuration: (videoTimeElements) => {
    let durationSeconds = 0;

    for (let i = 0; i < videoTimeElements.length; i++) {
      let time = videoTimeElements[i];
      durationSeconds += convertTimeToSeconds(time);
    }

    let averageDurationSeconds = videoTimeElements.length > 0
      ? Math.round(durationSeconds / videoTimeElements.length)
      : 0;

    return convertSecondsToTime(averageDurationSeconds);
  },
  getPlaylistTotalVideos: (videoTimeElements) => {
    return videoTimeElements.length;
  },
  getPlaylistShortestVideo: (videoTimeElements) => {
    let shortestTime = Infinity;

    for (let i = 0; i < videoTimeElements.length; i++) {
      let time = videoTimeElements[i];
      let videoDuration = convertTimeToSeconds(time);

      if (videoDuration < shortestTime) {
        shortestTime = videoDuration;
      }
    }

    return convertSecondsToTime(shortestTime);
  },
  getPlaylistLongestVideo: (videoTimeElements) => {
    let longestTime = 0;

    for (let i = 0; i < videoTimeElements.length; i++) {
      let time = videoTimeElements[i];
      let videoDuration = convertTimeToSeconds(time);

      if (videoDuration > longestTime) {
        longestTime = videoDuration;
      }
    }

    return convertSecondsToTime(longestTime);
  }
}