chrome.tabs.onUpdated.addListener(tabToWindow)

async function tabToWindow(id, { url }, { windowId }) {
  const { tab2window } = await chrome.storage.sync.get()
  if (!tab2window || !url) return
  const tabs = await chrome.tabs.query({ windowId })
  if (tabs.length < 2) return
  chrome.tabs.remove(id, () => {
    chrome.windows.create({ url, focused: true })
  })
}
