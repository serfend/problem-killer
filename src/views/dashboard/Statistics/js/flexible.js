
export default function flexible(window, document) {
  var docEl = document.documentElement
  var dpr = window.devicePixelRatio || 1
  this.pre_setting = {}
  // adjust body font size
  this.setBodyFontSize = function () {
    if (document.body) {
      this.pre_setting.docFontSize = document.body.style.fontSize
      document.body.style.fontSize = 12 * dpr + 'px'
    } else {
      document.addEventListener('DOMContentLoaded', this.setBodyFontSize)
    }
  }

  // set 1rem = viewWidth / 10
  this.setRemUnit = function () {
    var rem = docEl.clientWidth / 24
    this.pre_setting.docElFontSize = docEl.style.fontSize
    docEl.style.fontSize = rem + 'px'
  }

  // reset rem unit on page resize
  window.addEventListener('resize', () => this.setRemUnit)
  window.addEventListener('pageshow', function (e) {
    if (e.persisted) {
      this.setRemUnit()
    }
  })
  this.init = function () {
    this.pre_setting.inited = true
    this.setBodyFontSize()
    this.setRemUnit()
  }
  this.terminate = function () {
    if (this.pre_setting.inited) {
      this.pre_setting.inited = false
      document.body.style.fontSize = this.pre_setting.docFontSize
      docEl.style.fontSize = this.pre_setting.docElFontSize
    }
  }
  // detect 0.5px supports
  if (dpr >= 2) {
    var fakeBody = document.createElement('body')
    var testElement = document.createElement('div')
    testElement.style.border = '.5px solid transparent'
    fakeBody.appendChild(testElement)
    docEl.appendChild(fakeBody)
    if (testElement.offsetHeight === 1) {
      docEl.classList.add('hairlines')
    }
    docEl.removeChild(fakeBody)
  }
}
