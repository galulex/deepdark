const setTheme = () => {
  const meta = document.head.querySelector('meta[name="color-scheme"]') || document.createElement('meta')
  meta.name = 'color-scheme'
  if (meta.content === 'only light') return

  meta.content = 'only light'
  document.head.appendChild(meta)

  setTimeout(() => document.body.style.marginLeft = "1px", 50)
  setTimeout(() => document.body.style.marginLeft = "0px", 100)
}

setTheme()
setTimeout(setTheme, 100)

document.addEventListener('DOMContentLoaded', setTheme, false)
document.addEventListener('DOMSubtreeModified', (e) => {
  const meta = document.head.querySelector('meta[name="color-scheme"]')
  if (meta?.content === 'only light') return
  setTheme()
})
