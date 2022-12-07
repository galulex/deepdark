chrome.tabs.onUpdated.addListener(tabToWindow)
chrome.action.onClicked.addListener(onClick)

async function tabToWindow(id, { url }, { windowId }) {
  const { tab2window } = await chrome.storage.sync.get()
  if (!tab2window || !url) return
  const tabs = await chrome.tabs.query({ windowId })
  if (tabs.length < 2) return
  chrome.tabs.remove(id, () => {
    chrome.windows.create({ url, focused: true })
  })
}

function onClick(tab) {
  chrome.scripting.executeScript({target: { tabId: tab.id }, func: toggle })
}

function toggle() {
  const meta = document.head.querySelector('meta[name="color-scheme"]') || document.createElement('meta')
  meta.name = 'color-scheme'
  if (meta.content === 'only light') return meta.remove()

  meta.content = 'only light'
  document.head.appendChild(meta)
}
