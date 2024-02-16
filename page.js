const host = window.location.hostname
const style = document.documentElement.style
const config = { attributes: false, childList: true, subtree: false }

const dom = {
  get themeColor() {
    return document.head.querySelector('meta[name="theme-color"]') || document.createElement('meta')
  },

  get colorScheme() {
    return document.head.querySelector('meta[name="color-scheme"]') || document.createElement('meta')
  },

  get contrast() {
    return style.getPropertyValue('--blackout-contrast')
  },

  set contrast(val) {
    style.setProperty('--blackout-contrast', +(val))
  },
}

const callback = (element, name, content) => {
  const observerCallback = (_, observer) => {
    const meta = dom[element]
    if (meta?.content === content) return

    observer.disconnect()
    setMeta(element, name, content)
    observer.observe(document.head, config)
  }

  return observerCallback
}

const observe = (isLight) => {
  const observerCallback = isLight ? callback('colorScheme', 'color-scheme', 'only light') : callback('themeColor', 'theme-color', '#000000')

  const observer = new MutationObserver(observerCallback)
  observer.observe(document.head, config)
}

chrome.storage.local.get({ contrast: '1.4', blockListUrls: [] }, ({ blockListUrls, contrast }) => {
  const isLight = blockListUrls.includes(host)

  observe(isLight)
  if (isLight) return setMeta('colorScheme', 'color-scheme', 'only light')

  if (dom.contrast === '') dom.contrast = contrast

  setMeta('themeColor', 'theme-color', '#000000')
})

const setMeta = (element, name, content) => {
  const meta = dom[element]
  meta.name = name
  meta.content = content
  document.head.appendChild(meta)
}
