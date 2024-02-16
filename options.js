const save = event => {
  const { target: { checked, value, name, type } } = event
  chrome.storage.local.set({ [name]: ['checkbox'].includes(type) ? checked : value })
}

const load = () => {
  chrome.storage.local.get({ tab2window: false, contrast: 1.4 }, ({ tab2window, contrast }) => {
    window.tab2window.checked = tab2window
    window.contrast.value = contrast
  })
}

const openLink = () => {
  chrome.tabs.create({ url: 'chrome://flags/#enable-force-dark' })
}

const preview = (event) => {
  const { target: { value } } = event
  document.documentElement.style.setProperty('--contrast', value)
}

window.tab2window.addEventListener('change', save)
window.contrast.addEventListener('change', save)
window.contrast.addEventListener('change', preview)
window.settingsLink.addEventListener('click', openLink)
document.addEventListener('DOMContentLoaded', load)
