const setTheme = () => {
  const meta = document.head.querySelector('meta[name="theme-color"]') || document.createElement('meta')
  meta.name = 'theme-color'
  meta.content = '#000000'
  document.head.appendChild(meta)

  chrome.storage.sync.get({ contrast: '1.4' }, ({ contrast }) => {
    document.documentElement.style.setProperty('--blackout-contrast', +(contrast))
  })
}

setTheme()
setTimeout(setTheme, 100)

document.addEventListener('DOMContentLoaded', setTheme, false)
document.addEventListener('visibilitychange', setTheme)

document.addEventListener('DOMSubtreeModified', (e) => {
  const meta = document.head.querySelector('meta[name="theme-color"]')
  if (meta?.content === '#000000') return
  setTheme()
})
