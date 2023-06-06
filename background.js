chrome.tabs.onCreated.addListener(tabToWindow)
chrome.tabs.onRemoved.addListener(focusParent)
chrome.action.onClicked.addListener(onClick)
chrome.commands.onCommand.addListener(async (_, tab) => {
  if (!tab) return
  onClick(tab)
});

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

async function tabToWindow({ id: tabId, windowId }) {
  const { tab2window } = await chrome.storage.sync.get()
  if (!tab2window) return

  const tabs = await chrome.tabs.query({ windowId })
  if (tabs.length < 2) return

  const win = await chrome.windows.create({ focused: true, tabId}, (win) => {
    setTimeout(() => {
      chrome.windows.update(win.id, { focused: true })
    }, 100)
  })
}

async function focusParent(id, info) {
  const win = await chrome.windows.getLastFocused()
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
