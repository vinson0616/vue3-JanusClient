import { Janus } from 'janus-gateway'

export const janusLibrary = (janusCallback) => {
  let janus = null
  let videoRoomHandle = null
  let audioHandle = null
  let localUserId = null
  let mypvtid = null
  const maxFeedNumber = 20
  const feeds = []
  let roomNumber = ''
  let roomPin = ''
  let userName = 'Vinson'
  let hasAudio = true
  let hasVideo = true
  let audioUp = false
  let clientId = null
  const roomHost = false
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
          room: roomNumber,
          pin: roomPin,
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
              const body = { request: 'start', room: roomNumber }
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
  // 本地Janus初始化
  const addLocalTrack = (joinRoomCallback) => {
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
            clientId = Janus.randomString(12)
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
                  joinRoomCallback()
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
                  if (on) {
                    console.log('start to audioBridge plugin.')
                    audioBridgeTrack()
                  }
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
                        if (msg.error) {
                          console.error(msg.error)
                          janusCallback({
                            type: 'error',
                            errorCode: 100,
                            content: msg.error
                          })
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
                  janusCallback({
                    type: 'destoryed',
                    errorCode: 0
                  })
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
  }
  // mcu audio plugin
  const audioBridgeTrack = () => {
    const audioOpaqueId = `${roomNumber}-audiobridge-${userName}-${Janus.randomString(12)}`
    janus.attach(
      {
        plugin: 'janus.plugin.audiobridge',
        opaqueId: audioOpaqueId,
        success: pluginHandle => {
          audioHandle = pluginHandle
          console.log(`audiobridge -> attach success! room_host: ${roomHost}, audioHandle: `, audioHandle)
          if (roomHost) {
            createAudioBridge()
          } else {
            joinAudioBridge()
          }
        },
        error: error => {
          console.error(error)
        },
        consentDialog: on => {
          console.log(`audioBridgeTrack -> Consent dialog : ${on}`)
        },
        iceState: state => {
          console.log(`audioBridgeTrack -> iceState: ${state}`)
        },
        mediaState: (media, on) => {
          console.log(`audioBridgeTrack -> mediaState: ${media}, on: ${on}`)
        },
        webrtcState: on => {
          console.log(`audioBridgeTrack -> webrtcState: ${on}`)
        },
        onmessage: (msg, jsep) => {
          const event = msg.audiobridge
          if (event) {
            if (event === 'joined') {
              // Successfully joined, negotiate WebRTC now
              if (msg.id) {
                if (!audioUp) {
                  audioUp = true
                  // Publish our stream
                  audioHandle.createOffer({
                    media: { video: false }, // This is an audio only room
                    success: jsep => {
                      Janus.debug('Got SDP!', jsep)
                      const publish = { request: 'configure', muted: false }
                      audioHandle.send({ message: publish, jsep: jsep })
                    },
                    error: error => {
                      Janus.error('WebRTC error:', error)
                    }
                  })
                }
              }

              // Any room participant?
              if (msg.participants) {
                const list = msg.participants
                for (const f in list) {
                  const muted = list[f].muted
                  const display = list[f].display
                  janusCallback({
                    type: 'addUser',
                    errorCode: 0,
                    content: {
                      userName: display,
                      muted: muted
                    }
                  })
                  if (muted) {
                    janusCallback({
                      type: 'mutedChange',
                      errorCode: 0,
                      content: {
                        userName: display,
                        muted: muted
                      }
                    })
                  }
                }
                console.log(`audioBridgeTrack -> participants: ${list.length}`)
              }
            } else if (event === 'roomchanged') {
            } else if (event === 'destroyed') {
              console.log('audioBridgeTrack -> audio room has been destroyed')
            } else if (event === 'talking' || event === 'stopped-talking') {
              const username = JSON.parse(atob(msg.id)).username
              if (event === 'talking') {
                // talking
                janusCallback({
                  type: 'talkingChange',
                  errorCode: 0,
                  content: {
                    userName: username,
                    talking: true
                  }
                })
                console.log('talking: ', username)
              } else {
                // stop talking
                janusCallback({
                  type: 'talkingChange',
                  errorCode: 0,
                  content: {
                    userName: username,
                    talking: false
                  }
                })
                console.log('stop talking: ', username)
              }
            } else if (event === 'event') {
              if (msg.participants) {
                const list = msg.participants
                for (const f in list) {
                  const muted = list[f].muted
                  const display = list[f].display
                  janusCallback({
                    type: 'mutedChange',
                    errorCode: 0,
                    content: {
                      userName: display,
                      muted: muted
                    }
                  })
                }
              } else if (msg.error) {
              }
              // Any new feed to attach to?
              if (msg.leaving) {
                // // One of the participants has gone away?
                // const leaving = msg["leaving"];
                // const leaving_obj = JSON.parse(atob(leaving));
                // console.log('Leaving: ', leaving_obj)
              }
            }
          }
          if (jsep) {
            audioHandle.handleRemoteJsep({ jsep: jsep })
          }
        },
        onlocalstream: stream => {
          console.log('audioBridgeTrack -> onlocalstream', stream)
        },
        onremotestream: stream => {
          janusCallback({
            type: 'mcuAudio',
            errorCode: 0,
            content: stream
          })
        },
        oncleanup: stream => {
          Janus.log('IFC myclient ::: audioBridgeTrack:attach:oncleanup() ::: Got a cleanup notification :::')
          audioUp = false
        }
      })
  }
  // 加入MCU audio plugin
  const joinAudioBridge = () => {
    console.log('joinAudioBridge')
    const audioIdObj = {
      username: userName,
      uniq_id: clientId
    }
    const join = {
      request: 'join',
      room: roomNumber,
      pin: roomPin,
      display: userName,
      muted: false,
      codec: 'opus',
      quality: 4,
      id: btoa(JSON.stringify(audioIdObj))
    }
    audioHandle.send({
      message: join,
      success: data => {
        console.log(`joinAudioBridge -> Room: ${this.room}`, data)
      },
      error: error => {
        console.log('joinAudioBridge -> error: ', error)
      }
    })
  }
  // 创建MCU audio plugin
  const createAudioBridge = () => {
    console.log('createAudioBridge')
  }
  // mute audio
  const audioMuted = (muted) => {
    if (audioHandle) {
      audioHandle.send({ message: { request: 'configure', muted: muted } })
      janusCallback({
        type: 'mutedChange',
        errorCode: 0,
        content: {
          userName: userName,
          muted: muted
        }
      })
    }
  }
  // mute video
  const videoMuted = (muted) => {
    if (videoRoomHandle) {
      if (muted) {
        videoRoomHandle.muteVideo()
      } else {
        videoRoomHandle.unmuteVideo()
      }
    }
  }
  // share
  const startShare = () => {
    alert('test')
  }
  // 加入房间
  const joinRoom = (room, password, name, audio, video) => {
    roomNumber = room
    roomPin = password
    userName = name
    hasAudio = audio
    hasVideo = video
    addLocalTrack(() => {
      // join the room
      const join = {
        request: 'join',
        room: room,
        pin: password,
        ptype: 'publisher',
        display: userName
      }
      console.log(`room: ${join.room}, userName: ${join.display}`)
      videoRoomHandle.send({ message: join })
    })
  }
  // 离开房间
  const leaveRoom = () => {
    if (janus) {
      janus.destroy(
        {
          cleanupHandles: true,
          notifyDestroyed: true
        }
      )
    }
  }
  return {
    videoRoomHandle,
    joinRoom,
    leaveRoom,
    audioMuted,
    videoMuted,
    startShare
  }
}
