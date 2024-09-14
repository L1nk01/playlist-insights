function getVideoTimeElements(url) {
  const urlType = checkUrlType(url);

  if (urlType === 1) { // Playlist
    return document.querySelectorAll("div#content.style-scope.ytd-playlist-video-renderer #container ytd-thumbnail #thumbnail #overlays ytd-thumbnail-overlay-time-status-renderer #time-status #text");
  } else if (urlType === 2) { // Watching a playlist video
    return document.querySelectorAll('ytd-playlist-panel-video-renderer #overlays ytd-thumbnail-overlay-time-status-renderer .badge-shape-wiz__text');
  } else {
    return [];
  }
}

function checkUrlType(url) {
  let path = new URL(url).pathname;
  let params = new URL(url).searchParams;

  let urlType = path.startsWith('/playlist') ? 1 : 
  path.startsWith('/watch') && params.has('list') ? 2 :
  path.startsWith('/watch' && !params.has('list')) ? 3 :
  0;

  return urlType;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getVideoTimeElements") {
    let url = request.url;
    let urlType = checkUrlType(url);

    if (urlType === 1 || urlType === 2) { // Playlist or playlist video
      let videoTimeElements = getVideoTimeElements(url);
      videoTimeElements = Array.from(videoTimeElements).map(element => element.innerText.trim());

      sendResponse({
        message: "URL processed",
        videoTimeElements: videoTimeElements
      });
    } else {
      sendResponse({
        message: "URL IS NOT A VALID YOUTUBE PLAYLIST URL"
      });
    }
  }
});
