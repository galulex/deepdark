const CLASSES = {
  volumeSliderHandle: ".ytp-volume-slider-handle"
};

const setSliderFilter = () => {
  const slider = document.querySelector(CLASSES.volumeSliderHandle);
  if (slider) slider.style.filter = "contrast(0.1) brightness(2)";
};

const setTheme = () => {
  const meta = document.head.querySelector('meta[name="theme-color"]') || document.createElement('meta')
  meta.name = 'theme-color'
  meta.content = '#000000'
  document.head.appendChild(meta)
  setSliderFilter()
}

setTheme()
setTimeout(setTheme, 100)

document.addEventListener('DOMContentLoaded', setTheme, false)
document.addEventListener('DOMSubtreeModified', (e) => {
  const meta = document.head.querySelector('meta[name="theme-color"]')
  if (meta?.content === '#000000') return
  setTheme()
})
