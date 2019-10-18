
class BitPlayer extends Player
{
	constructor(body,delegate = new Rx.Subject(),info = new PlayerObject()) 
    {
        super(body,delegate,info);
        this.info.BIT_MOVIN_KEY = "5a4dfc9c-bf94-4e72-b059-e5f1fb6ce5b0";
        this.rxScreenRatioTypeChanger = null;

        console.log("BitPlayer init");
    }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//PROTECTED          
//
//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    doRemovePlayer()
    { 
        if(this.rxScreenRatioTypeChanger) this.rxScreenRatioTypeChanger.unsubscribe();
        if(this.player.destroy)
        {
          this.player.destroy();
        }
    }

    doCreatePlayer(source)
    {   
        let that = this;
        let config= {
                    key : this.info.BIT_MOVIN_KEY,
                    style : 
                    {
                        width       : '100%',
                        aspectratio : '16:9',
                        height      : '100%',
                        controls    : false,
                        mouse       : false,
                        ux          : false,
                        showErrors  : 'disable',
                        playOverlay : false
                    },
                    playback : 
                    {
                        autoplay : false
                    }
                };

        config.source = source;
        this.player = bitmovin.player(this.info.playerID);

        this.player.setup(config).then
        (
            function(value) 
            {
                that.delegate.next(new UIStatus(STATUS_TYPE.PLAYER,PLAYER_STATE.INITED));
            }
        )
        
    }

    doSetupEvent()
    {
        this.player.addEventHandler(bitmovin.player.EVENT.ON_READY,this.doOnReady.bind(this),false);
        this.player.addEventHandler(bitmovin.player.EVENT.ON_SOURCE_LOADED,this.doOnSourceLoaded.bind(this),false);
        this.player.addEventHandler(bitmovin.player.EVENT.ON_PLAY,this.doOnPlay.bind(this),false);
        this.player.addEventHandler(bitmovin.player.EVENT.ON_PAUSED,this.doOnPause.bind(this),false);
        this.player.addEventHandler(bitmovin.player.EVENT.ON_SEEK,this.doOnSeek.bind(this),false); 
        this.player.addEventHandler(bitmovin.player.EVENT.ON_SEEKED,this.doOnSeeked.bind(this),false);  
        this.player.addEventHandler(bitmovin.player.EVENT.ON_META,this.doOnMeta.bind(this),false);
        this.player.addEventHandler(bitmovin.player.EVENT.ON_DOWNLOAD_FINISHED,this.doOnDownloadFinished.bind(this),false); 
        this.player.addEventHandler(bitmovin.player.EVENT.ON_TIME_SHIFT,this.doOnSeek.bind(this),false);   
        this.player.addEventHandler(bitmovin.player.EVENT.ON_TIME_SHIFTED,this.doOnSeeked.bind(this),false);   
        this.player.addEventHandler(bitmovin.player.EVENT.ON_VOLUME_CHANGED,this.doOnVolumeChanged.bind(this),false); 
        //this.player.addEventHandler(bitmovin.player.EVENT.ON_FULLSCREEN_ENTER,this.doOnFullScreenEnter.bind(this),false);  
        //this.player.addEventHandler(bitmovin.player.EVENT.ON_FULLSCREEN_EXIT,this.doOnFullScreenExit.bind(this),false);  
        this.player.addEventHandler(bitmovin.player.EVENT.ON_PLAYBACK_FINISHED,this.doOnPlaybackFinished.bind(this),false);  
        this.player.addEventHandler(bitmovin.player.EVENT.ON_ERROR,this.doOnError.bind(this),false);  
        this.player.addEventHandler(bitmovin.player.EVENT.ON_STALL_STARTED,this.doOnStallStarted.bind(this),false);  
        this.player.addEventHandler(bitmovin.player.EVENT.ON_STALL_ENDED,this.doOnStallEnded.bind(this),false);   
        this.player.addEventHandler(bitmovin.player.EVENT.ON_VIDEO_PLAYBACK_QUALITY_CHANGED,this.doOnVideoPlaybackQualityChanged.bind(this),false); 
        this.player.addEventHandler(bitmovin.player.EVENT.ON_SEGMENT_PLAYBACK,this.doOnSegmentPlayback.bind(this),false); 
        this.player.addEventHandler(bitmovin.player.EVENT.ON_SEGMENT_REQUEST_FINISHED,this.doOnSegmentRequestFinished.bind(this),false);  
        this.player.addEventHandler(bitmovin.player.EVENT.ON_WARNING,this.doOnWarning.bind(this),false);   
        this.player.addEventHandler(bitmovin.player.EVENT.ON_TIME_CHANGED,this.doOnTimeChanged.bind(this),false); 
      
    }

    doClearEvent()
    {

    }

    doOnReady(data) 
    {
        super.doOnReady(data); 
        this.doOnDurationchanged(data);
    }
    
    doOnError(data) 
    {
        this.removePlayer();
        super.doOnError(data);  
    }
    
    doUnLoadStream()
    { 
        this.player.unload(); 
    }

    doLoadStream(source)
    {
        this.player.load(source);
    }

    doOnDurationchanged(data)
    {
        super.doOnDurationchanged(data);
        this.doOnAutoPlay();
    }

    doPlay()
    {
        this.player.play();  
    }

    doPause()
    {
        this.player.pause();
    }

    doSeek(t)
    { 
        if(this.info.playType == PLAY_TYPE.DVR)
        {
            t = t - this.info.duration;
            this.player.timeShift(t);
        }
        else
        {
            if(this.player.seek(t)==false)
            {
                this.delegate.next(new UIStatus(STATUS_TYPE.PLAYER,PLAYER_STATE.SEEK_DISABLE));  
            }
        }
    }

    doSetVolume(pct)
    { 
        var v = 100*pct;
        this.player.setVolume(v);
    }
    /*
    doEnterFullscreen()
    {
        this.player.enterFullscreen();
    } 
    
    doExitFullscreen()
    {
        this.player.exitFullscreen();
    } 
    */
    doPlaybackSpeed(spd)
    {
        this.player.setPlaybackSpeed(spd);
        return true;
    } 

    doOnVideoPlaybackQualityChanged(data) 
    {
        if(isNaN(data.targetQuality.bitrate) == false)
        {
            super.doOnVideoPlaybackQualityChanged(data.targetQuality.bitrate/1000);
        }
    }

    doOnPlayerResize(bounce) 
    {
        
        if(this.rxScreenRatioTypeChanger) this.rxScreenRatioTypeChanger.unsubscribe();
        this.rxScreenRatioTypeChanger = Rx.Observable.timer(500).timeInterval().take(1).subscribe
        (
            this.setScreenRatioType.bind(this,this.info.screenRatioType)
        );
        
    }

    /*
    getThumb(t)
    {
        if(this.player==null) return;
        if(t == null || t === undefined) t = this.getCurrentPlayTime();
        return this.player.getThumb(t);
    }
    */
   
    doGetCurrentPlayTime()
    {
        if(this.player==null) return 0;
        if(this.info.duration==-1) return 0;

        var t=0;
        if(this.info.playType==PLAY_TYPE.DVR)
        {
            t = this.info.duration+this.player.getTimeShift();     
        }else
        {
            t = this.player.getCurrentTime();
        }
        return t;
    }

    getCurrentVolume()
    {
        if(this.player==null) return 0;
        return this.player.getVolume()/100;
    }

    getDuration()
    {
        if(this.player==null) return -1;
        var d = -1;
        if(this.info.playType==PLAY_TYPE.DVR)
        {
            d = - this.player.getMaxTimeShift();
        }
        else
        {
            d = this.player.getDuration();
        }
        if(d !=  this.info.duration)
        {
            this.setDuration(d,d);
        }
        return d;
    }

    

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//PRIVATE           
//
//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    getSource(vodObject)
    { 
        let source = new Object();
        if(vodObject.isDRM==true)
        {
            let headers = new Array();
            let header = new Object();
            vodObject.vodUrl = vodObject.vodUrl.replace(/http:/g, "https:");
            vodObject.drmHost = vodObject.drmHost.replace(/http:/g, "https:")

            if(vodObject.drmHeader != null)
            {
                header.name = "pallycon-customdata";
                header.value = vodObject.drmHeader;
                headers.push(header);

            }
            
            switch(vodObject.drmType)
            {
                case DRM_TYPE.WIDEVINE:
                    source.drm = {
                                    widevine:
                                    {
                                        LA_URL: vodObject.drmHost
                                    }
                                }
                    if(vodObject.drmHeader != null)
                    {
                        source.drm.widevine.headers = headers;
                    }

                    break;
                case DRM_TYPE.PLAY_READY:
                    source.drm = {
                                  playready:
                                  {
                                    LA_URL: vodObject.drmHost
                                  }
                              }
                    if(vodObject.drmHeader != null)
                    {
                        source.drm.playready.headers = headers;
                    }
                    break;

                case DRM_TYPE.FAIR_PLAY:

                    source.drm =
                    {
                        fairplay:
                        {
                            LA_URL: vodObject.drmHost,
                            certificateURL: 'https://tokyo.pallycon.com/ri/fpsKeyManager.do?siteId=U1ZN',
                            prepareContentId: function(contentId)
                            {
                                var link = document.createElement('a');
                                link.href = contentId.substring(contentId.indexOf('skd://'));
                                var host = link.hostname;
                                return host;
                            },
                            prepareCertificate: function(rawResponse)
                            {
                                
                                var responseText = String.fromCharCode.apply(null, new Uint8Array(rawResponse));
                                console.log(responseText);
                                var raw = window.atob(responseText);

                                console.log(raw);
                                var rawLength = raw.length;
                                var certificate = new Uint8Array(new ArrayBuffer(rawLength));

                                for(var i = 0; i < rawLength; i++)
                                    certificate[i] = raw.charCodeAt(i);

                               // console.log(certificate);
                                return certificate;
                            },
                            useUint16InitData: true

                        }

                    }

                    if(vodObject.drmHeader != null)
                    {
                        source.drm.fairplay.headers = headers;
                    }
                    break;

            }
        }


        if(vodObject.isVR==true)
        {
            source.vr = {
                          startupMode       : 'off',
                          startPosition     : 180,
                          initialRotation   : true,
                          initialRotateRate : 0.025
                        }
        }
        /*
        if(vodObject.isVTT==true)
        {
            source.tracks = [
                              {
                                file : vodObject.vttPath,
                                kind : 'thumbnails'
                              }
                            ]
        }
        */
    
        if(vodObject.isSignedCookie==true)
        {
            
            source.options = {
                                manifestWithCredentials    : true,
                                withCredentials            : true
                            }
        }
        if(vodObject.vodUrl.indexOf(".mpd")!=-1)
        {
            source.dash = vodObject.vodUrl;
        }
        else if(vodObject.vodUrl.indexOf(".m3u8")!=-1)
        {
            source.hls = vodObject.vodUrl;
        }
        else
        {
            source.progressive = new Array();
            source.progressive[0] = {
                                      url: vodObject.vodUrl,
                                      type: 'video/mp4'
                                    }
        }  
        return source;
    }

}


