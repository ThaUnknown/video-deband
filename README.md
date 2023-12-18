<h1 align="center">
	video-deband
</h1>

Automatically deband a video using a WebGL shader to get rid of those pesky compression artifacts.

## Functions:
```js
import VideoDeband from 'video-deband'

const deband = new VideoDeband(document.querySelector('video'))

document.body.append(deband.canvas)

// or if you need a video element or stream
// keep in mind these don't include audio

const vid = deband.getVideo()
vid.requestPictureInPicture()

const stream = deband.getStream()
rtcpeerconnection.addTrack(stream.getTracks()[0], stream)

// later cleanup
deband.destroy()

// or
deband.dispose()

// or in typescript to clean up automatically
using deband = new VideoDeband(document.querySelector('video'))

```
