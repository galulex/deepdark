chrome.tabs.onUpdated.addListener(tabToWindow)
chrome.action.onClicked.addListener(onClick)

const checkBlockList = async (tabId, changeInfo, tab) => {
  const { blockListUrls } = await chrome.storage.sync.get();

  const url = new URL(tab.url);

  if (blockListUrls?.includes(url.hostname)) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: toggle,
    });
  }
};

chrome.tabs.onUpdated.addListener(checkBlockList);

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
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: toggle,
  });

  let urls;
  const url = new URL(tab.url);

  chrome.storage.sync.get().then((result) => {
    const { blockListUrls } = result;

    if (!blockListUrls?.length) {
      urls = [url.hostname];
    } else if (blockListUrls.includes(url.hostname)) {
      urls = blockListUrls.filter((v) => v != url.hostname);
    } else {
      urls = blockListUrls.concat(url.hostname);
    }

    chrome.storage.sync.set({ blockListUrls: urls });
  });
}

function toggle() {
  const meta = document.head.querySelector('meta[name="color-scheme"]') || document.createElement('meta')
  meta.name = 'color-scheme'
  if (meta.content === 'only light') return meta.remove()

  meta.content = 'only light'
  document.head.appendChild(meta)
}
