import { Janus } from 'janus-gateway'

export const janusLibrary = (room, password, hasAudio, hasVideo, janusCallback) => {
  let janus = null
  let videoRoomHandle = null
  let localUserId = null
  let mypvtid = null
  const maxFeedNumber = 12
  const feeds = []
  const userName = 'Vinson'
  // 远程用户通道
  const addRemoteTrack = (id, display, audio, video) => {
    let remoteHandle = null
    janus.attach({
      plugin: 'janus.plugin.videoroom',
      opaqueId: `${userName}-remote-${display}-${Janus.randomString(12)}`,
      success: pluginHandle => {
        remoteHandle = pluginHandle
        remoteHandle.simulcastStarted = false
        console.log('remote plugin sucess', remoteHandle)
        // we wait for the plugin to send us an offer
        const subscribe = {
          request: 'join',
          room: room,
          pin: password,
          ptype: 'subscriber',
          feed: id,
          private_id: mypvtid
        }
        console.log('remote subscribe: ', subscribe)
        // In case you don't want to receive audio, video or data, even if the
        // publisher is sending them, set the 'offer_audio', 'offer_video' or
        // 'offer_data' properties to false (they're true by default), e.g.:
        // subscribe["offer_video"] = false;
        // For example, if the publisher is VP8 and this is Safari, let's avoid video
        if (Janus.webRTCAdapter.browserDetails.browser === 'safari' &&
          (video === 'vp9' || (video === 'vp8' && !Janus.safariVp8))) {
          if (video) {
            video = video.toUpperCase()
          }
          subscribe.offer_video = false
        }
        remoteHandle.videoCodec = video
        remoteHandle.send({ message: subscribe })
      },
      error: err => {
        console.log('remoteTrack error: ', err)
      },
      onmessage: (msg, jsep) => {
        const event = msg.videoroom
        if (event) {
          switch (event) {
            case 'attached':
              remoteHandle.attachedTime = Date.now()
              // subscriber created and attached
              for (let i = 1; i <= maxFeedNumber; i++) {
                if (!feeds[i]) {
                  feeds[i] = remoteHandle
                  remoteHandle.rfindex = i
                  break
                }
              }
              remoteHandle.rfid = msg.id
              remoteHandle.rfdisplay = msg.display
              if (remoteHandle.spinner) {
                remoteHandle.spinner.spin()
              }
              console.log(`remote attached: id: ${remoteHandle.rfid}, name: ${remoteHandle.rfdisplay}`)
              break
            case 'event':
              // check if we got a simulcast-related event from this publiser
              if ((msg.substream !== null && msg.substream !== undefined) || (msg.temporal !== null && msg.temporal !== undefined)) {
                if (!remoteHandle.simulcastStarted) {
                  remoteHandle.simulcastStarted = true
                }
              }
              break
          }
        }
        if (jsep) {
          remoteHandle.createAnswer({
            jsep: jsep,
            // Add data:true here if you want to subscribe to datachannels as well
            // (obviously only works if the publisher offered them in the first place)
            media: { audioSend: false, videoSend: false }, // We want recvonly audio/video
            success: (jsep) => {
              const body = { request: 'start', room: room }
              remoteHandle.send({ message: body, jsep: jsep })
              console.log('remote answer successfully.')
            },
            error: (error) => {
              console.error(error)
            }
          })
        }
      },
      iceState: state => {
        console.log(`remote iceState -> state: ${state}`)
      },
      webrtcState: on => {
        console.log(`remote webrtcState -> on: ${on}`)
      },
      onlocalstream: stream => {
        console.log(`remote onlocalstream -> stream: ${stream}`)
      },
      onremotestream: stream => {
        const videoTracks = stream.getVideoTracks()
        console.log(`remote onremotestream -> stream: ${stream}, length: ${videoTracks.length}`)
        if (videoTracks?.length > 0) {
          const user = {
            userName: remoteHandle.rfdisplay,
            stream: stream
          }
          janusCallback({
            type: 'addUser',
            errorCode: 0,
            content: user
          })
        }
      },
      oncleanup: () => {
        console.log(`remote oncleanup -> id: ${remoteHandle.rfid}, name: ${remoteHandle.rfdisplay}`)
        janusCallback({
          type: 'removeUser',
          errorCode: 0,
          content: remoteHandle.rfdisplay
        })
      }
    })
  }
  Janus.init({
    debug: false,
    dependencies: Janus.useDefaultDependencies(),
    callback: () => {
      console.log('Janus Init successfully.')
      janusCallback({
        type: 'init',
        errorCode: 0
      })
      if (!Janus.isWebrtcSupported()) {
        console.log('No WebRTC support.')
        janusCallback({
          type: 'error',
          errorCode: 1
        })
        return
      }
      janus = new Janus({
        server: 'https://janus-dev.conxme.net/janusapimcu/janus',
        success: () => {
          // attach to videoRoom plugin
          console.log('start to attach to videoRoom plugin')
          janus.attach(
            {
              plugin: 'janus.plugin.videoroom',
              opaqueId: `videoroom-local-${userName}-${Janus.randomString(12)}`,
              success: pluginHandle => {
                console.log('pluginHandle: ', pluginHandle)
                janusCallback({
                  type: 'initHandle',
                  errorCode: 0,
                  content: pluginHandle
                })
                videoRoomHandle = pluginHandle
              },
              error: error => {
                Janus.error(error)
              },
              consentDialog: on => {
                console.log(`local consentDialog -> on: ${on}, userName: ${userName}`)
              },
              iceState: state => {
                console.log(`local iceState -> state: ${state}, userName: ${userName}`)
              },
              mediaState: (medium, on) => {
                console.log(`local mediaState -> medium: ${medium}, on: ${on}, userName: ${userName}`)
              },
              webrtcState: on => {
                console.log(`local webrtcState -> on: ${on}, userName: ${userName}`)
              },
              onmessage: (msg, jsep) => {
                const event = msg.videoroom
                if (event) {
                  switch (event) {
                    case 'joined':
                      localUserId = msg.id
                      mypvtid = msg.private_id
                      console.log(`joined -> id: ${localUserId} name: ${userName}`)
                      // 加入成功后，创建offer
                      videoRoomHandle.createOffer(
                        {
                          trickle: true,
                          media: { audioRecv: false, videoRecv: false, audioSend: hasAudio, videoSend: hasVideo },
                          simulcast: true,
                          simulcast2: true,
                          success: jsep => {
                            const publish = { request: 'configure', audio: true, video: true }
                            videoRoomHandle.send({ message: publish, jsep: jsep })
                            console.log(`create offer -> id: ${localUserId} name: ${userName}`)
                            // 初始状态房间的人数，并分别添加通道
                            if (msg.publishers) {
                              console.log('init publishers: ', msg.publishers)
                              for (const publisher in msg.publishers) {
                                const pId = msg.publishers[publisher].id
                                const pUserName = msg.publishers[publisher].display
                                const pAudio = msg.publishers[publisher].audio_codec
                                const pVideo = msg.publishers[publisher].video_codec
                                console.log(`init publisher: pId: ${pId}, pUserName: ${pUserName}, pAudio: ${pAudio}, pVideo: ${pVideo}`)
                                addRemoteTrack(pId, pUserName, pAudio, pVideo)
                              }
                            }
                          },
                          error: err => {
                            console.log('create offer error: ', err)
                          }
                        }
                      )
                      break
                    case 'talking':
                    case 'stopped-talking':
                      break
                    case 'event':
                      // any new feed to attach to ?
                      console.log('publishers: ', msg.publishers)
                      if (msg.publishers) {
                        for (const publisher in msg.publishers) {
                          const pId = msg.publishers[publisher].id
                          const pUserName = msg.publishers[publisher].display
                          const pAudio = msg.publishers[publisher].audio_codec
                          const pVideo = msg.publishers[publisher].video_codec
                          console.log(`publisher: pId: ${pId}, pUserName: ${pUserName}, pAudio: ${pAudio}, pVideo: ${pVideo}`)
                          addRemoteTrack(pId, pUserName, pAudio, pVideo)
                        }
                      }
                      break
                  }
                  if (jsep) {
                    videoRoomHandle.handleRemoteJsep({ jsep: jsep })
                  }
                }
              },
              onlocalstream: stream => {
                console.log(`local onlocalstream -> stream: ${stream}, userName: ${userName}`)
                const user = {
                  userName: userName,
                  stream: stream
                }
                janusCallback({
                  type: 'addUser',
                  errorCode: 0,
                  content: user
                })
              },
              onremotestream: stream => {
                console.log(`local onremotestream -> stream: ${stream}, userName: ${userName}`)
              },
              oncleanup: () => {
                console.log(`local oncleanup -> userName: ${userName}`)
              }
            }
          )
        },
        error: err => {
          console.log(`init -> ${err}`)
          janusCallback({
            type: 'error',
            errorCode: 2
          })
          janus = null
        },
        destroy: () => {
          console.log('janus destroyed!')
          janus = null
        }
      })
    }
  })
  return {
    videoRoomHandle
  }
}
