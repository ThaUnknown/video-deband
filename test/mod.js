import VideoDeband from '../src/main.js'

const video = document.querySelector('video')

const deband = new VideoDeband(video)

// video.src = '../video/fucked.mkv#t=49'
deband.canvas.classList.add('h-400')
deband.canvas.style.width = 'unset'
window.dd = deband

video?.parentElement.append(deband.canvas)
const a = deband.getVideo()
a.classList.add('h-400')
video?.parentElement.append(a)
const x = {
  RGB: {
    'BT.709': 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\'><filter id=\'f\'><feColorMatrix type=\'matrix\' values=\'1 0 1.5746 0 0 1 -0.1873 -0.4683 0 0 1 1.8556 0 0 0 0 0 0 1 0\'/></filter></svg>#f")',
    'BT.601': 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\'><filter id=\'f\'><feColorMatrix type=\'matrix\' values=\'1 0 1.402 0 0 1 -0.3441 -0.7141 0 0 1 1.772 0 0 0 0 0 0 1 0\'/></filter></svg>#f")'
  },
  'BT.601': {
    'BT.709': 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\'><filter id=\'f\'><feColorMatrix type=\'matrix\' values=\'1.0863 -0.0723 -0.014 0 0 0.0965 0.8451 0.0584 0 0 -0.0141 -0.0277 1.0418 0 0 0 0 0 1 0\'/></filter></svg>#f")',
    'BT.601': 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\'><filter id=\'f\'><feColorMatrix type=\'matrix\' values=\'1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0\'/></filter></svg>#f")'
  },
  'BT.709': {
    'BT.709': 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\'><filter id=\'f\'><feColorMatrix type=\'matrix\' values=\'1 0 0 0 0 0 1.0001 0 0 0 0 0 1 0 0 0 0 0 1 0\'/></filter></svg>#f")',
    'BT.601': 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\'><filter id=\'f\'><feColorMatrix type=\'matrix\' values=\'0.9137 0.0784 0.0079 0 0 -0.1049 1.1722 -0.0671 0 0 0.0096 0.0322 0.9582 0 0 0 0 0 1 0\'/></filter></svg>#f")'
  },
  'BT.2020': {
    'BT.709': 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\'><filter id=\'f\'><feColorMatrix type=\'matrix\' values=\'1.05 -0.046 -0.004 0 0 0.0547 0.9608 -0.0155 0 0 0.0036 0.0093 0.9871 0 0 0 0 0 1 0\'/></filter></svg>#f")',
    'BT.601': 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\'><filter id=\'f\'><feColorMatrix type=\'matrix\' values=\'0.9637 0.0334 0.0029 0 0 -0.0463 1.1304 -0.084 0 0 0.0153 0.0394 0.9453 0 0 0 0 0 1 0\'/></filter></svg>#f")'
  },
  FCC: {
    'BT.709': 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\'><filter id=\'f\'><feColorMatrix type=\'matrix\' values=\'1.0873 -0.0736 -0.0137 0 0 0.0974 0.8494 0.0531 0 0 -0.0127 -0.0251 1.0378 0 0 0 0 0 1 0\'/></filter></svg>#f")',
    'BT.601': 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\'><filter id=\'f\'><feColorMatrix type=\'matrix\' values=\'1.001 -0.0008 -0.0002 0 0 0.0009 1.005 -0.006 0 0 0.0013 0.0027 0.996 0 0 0 0 0 1 0\'/></filter></svg>#f")'
  },
  SMPTE240M: {
    'BT.709': 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\'><filter id=\'f\'><feColorMatrix type=\'matrix\' values=\'0.9993 0.0006 0.0001 0 0 -0.0004 0.9812 0.0192 0 0 -0.0034 -0.0114 1.0148 0 0 0 0 0 1 0\'/></filter></svg>#f")',
    'BT.601': 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\'><filter id=\'f\'><feColorMatrix type=\'matrix\' values=\'0.913 0.0774 0.0096 0 0 -0.1051 1.1508 -0.0456 0 0 0.0063 0.0207 0.973 0 0 0 0 0 1 0\'/></filter></svg>#f")'
  }
}

const context = canvas.getContext('2d')
window.cc = context
const selected = x.RGB['BT.709']
context.filter = selected
function loop () {
  context.filter = selected
  context.drawImage(video, 0, 0)
  context.filter = selected
  video?.requestVideoFrameCallback(loop)
}
video?.requestVideoFrameCallback(loop)
console.log(context)
