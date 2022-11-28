const save = event => {
  const { target: { checked: tab2window } } = event
  chrome.storage.sync.set({ tab2window })
}

const load = () => {
  chrome.storage.sync.get({ tab2window: false }, ({ tab2window }) => {
    window.tab2window.checked = tab2window
  })
}

document.getElementById('tab2window').addEventListener('change', save)
document.addEventListener('DOMContentLoaded', load)
