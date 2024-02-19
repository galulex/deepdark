chrome.tabs.onCreated.addListener(tabToWindow)
chrome.action.onClicked.addListener(onClick)
chrome.commands.onCommand.addListener(async (_, tab) => {
  if (tab) onClick(tab)
})

async function tabToWindow({ id: tabId, windowId }) {
  const { tab2window } = await chrome.storage.local.get()
  if (!tab2window) return

  const tabs = await chrome.tabs.query({ windowId })
  if (tabs.length < 2) return

  await chrome.windows.create({ focused: true, tabId })
}

async function onClick({ id, url }) {
  const host = (new URL(url)).hostname

  chrome.storage.local.get({ blockListUrls: [] }, ({ blockListUrls }) => {
    const index = blockListUrls.indexOf(host);
    (index === -1) ? blockListUrls.push(host) : blockListUrls.splice(index, 1)

    chrome.storage.local.set({ blockListUrls })
    chrome.tabs.reload(id)
  });
}

chrome.runtime.onInstalled.addListener(openOptions)

function openOptions(details) {
  if (details?.reason === 'install') chrome.runtime.openOptionsPage()
}
