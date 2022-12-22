chrome.tabs.onUpdated.addListener(tabToWindow)
chrome.action.onClicked.addListener(onClick)

chrome.scripting.getRegisteredContentScripts().then((result) => {
  if (!(result || []).some((v) => v.id == "darkVersion")) {
    chrome.scripting.registerContentScripts([{
      id: "darkVersion",
      matches: ["https://*/*", "http://*/*"],
      excludeMatches: [],
      css: ["dark.css"],
      js: ["dark.js"]
    }])
  }

  if (!(result || []).some((v) => v.id == "lightVersion")) {
    chrome.scripting.registerContentScripts([{
      id: "lightVersion",
      matches: ["https://example.com/"],
      css: [],
      js: ["light.js"]
    }])
  }
})

const handleStorageChanges = async (changes, namespace) => {
  if (namespace == "sync") {
    for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
      if (key == "blockListUrls") {
        const matches = newValue?.map((v) => [`http://${v}/*`, `https://${v}/*`])?.flat();

        await chrome.scripting.updateContentScripts([{
          id: "darkVersion", excludeMatches: matches
        }])

        await chrome.scripting.updateContentScripts([{
          id: "lightVersion",
          matches: ["https://example.com/"].concat(matches)
        }])
      }
    }
  };
}

chrome.storage.onChanged.addListener(handleStorageChanges);

async function tabToWindow(id, { url }, { windowId }) {
  const { tab2window } = await chrome.storage.sync.get()
  if (!tab2window || !url) return
  const tabs = await chrome.tabs.query({ windowId })
  if (tabs.length < 2) return
  chrome.tabs.remove(id, () => {
    chrome.windows.create({ url, focused: true })
  })
}

async function onClick(tab) {
  let urls;
  const url = new URL(tab.url);

  chrome.storage.sync.get().then((result) => {
    const { blockListUrls } = result;

    if (!blockListUrls?.length) {
      urls = [url.hostname];
    } else if (blockListUrls.includes(url.hostname)) {
      urls = blockListUrls.filter((v) => !v.includes(url.hostname));
    } else {
      urls = blockListUrls.concat(url.hostname);
    }

    chrome.storage.sync.set({ blockListUrls: urls })
    chrome.tabs.reload(tab.id)
  });
}

chrome.runtime.onInstalled.addListener(openOptions)

function openOptions(details) {
  if (details?.reason === 'install') chrome.runtime.openOptionsPage()
}
