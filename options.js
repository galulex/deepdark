const save = event => {
  const { target: { checked, value, name, type } } = event
  chrome.storage.sync.set({ [name]: ['checkbox'].includes(type) ? checked : value })
}

const load = () => {
  chrome.storage.sync.get({ tab2window: false, contrast: 0.4, darkMedia: false }, ({ tab2window, contrast, darkMedia }) => {
    window.tab2window.checked = tab2window
    window.contrast.value = contrast
    window.darkMedia.checked = darkMedia
  })
}

const openLink = () => {
  chrome.tabs.create({ url: 'chrome://flags/#enable-force-dark' })
}

const preview = (event) => {
  const { target: { value } } = event
  document.documentElement.style.setProperty('--contrast', 1 + +(value))
}

window.tab2window.addEventListener('change', save)
window.contrast.addEventListener('change', save)
window.darkMedia.addEventListener('change', save)
window.contrast.addEventListener('change', preview)
window.settingsLink.addEventListener('click', openLink)
document.addEventListener('DOMContentLoaded', load)
