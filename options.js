const save = event => {
  const { target: { checked, value, name, type } } = event
  chrome.storage.sync.set({ [name]: ['checkbox'].includes(type) ? checked : value })
}

const load = () => {
  chrome.storage.sync.get({ tab2window: false, contrast: 0.4 }, ({ tab2window, contrast }) => {
    window.tab2window.checked = tab2window
    window.contrast.value = contrast
  })
}

const openLink = () => {
  chrome.tabs.create({ url: 'chrome://flags/#enable-force-dark' })
}

const preview = (event) => {
  const { target: { value } } = event
  document.documentElement.style.setProperty('--contrast', 1 + +(value))
}

document.getElementById('tab2window').addEventListener('change', save)
document.getElementById('contrast').addEventListener('change', save)
document.getElementById('contrast').addEventListener('change', preview)
document.getElementById('settingsLink').addEventListener('click', openLink)
document.addEventListener('DOMContentLoaded', load)
