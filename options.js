const save = ({ target: { checked, value, name, type } }) => {
  chrome.storage.local.set({ [name]: ['checkbox'].includes(type) ? checked : value })
}

const openLink = () => {
  chrome.tabs.create({ url: 'chrome://flags/#enable-force-dark' })
}

const preview = ({ target: { value } }) => {
  document.documentElement.style.setProperty('--contrast', value)
}

chrome.storage.local.get({ tab2window: false, contrast: 1.4 }, ({ tab2window, contrast }) => {
  window.tab2window.checked = tab2window
  window.contrast.value = contrast
  preview({ target: window.contrast })
})

window.tab2window.addEventListener('change', save)
window.contrast.addEventListener('change', save)
window.contrast.addEventListener('change', preview)
window.settingsLink.addEventListener('click', openLink)
