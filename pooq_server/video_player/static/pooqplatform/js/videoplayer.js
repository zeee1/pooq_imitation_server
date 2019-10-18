
class VideoPlayer extends HTML5Player
{
	constructor(body,delegate = new Rx.Subject(),info = new PlayerObject()) 
    {
        super(body,delegate,info);
        this.video = null;
        this.qualityLevel = null;
        this.hls = null;

        console.log("VideoPlayer init");
    }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//PROTECTED          
//
//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    doRemovePlayer()
    { 
        super.doRemovePlayer();
        if(this.video != null)
        {
            this.video.dispose();
            this.video = null;
        }
    }
    
    doCreatePlayer(source)
    {   
        this.player = this.getPlayer();
        this.player.id = "videojs" + this.info.playerInstenceID;
        
        let config = {
                        controls: false,
                        html5: {
                            hls: {
                                withCredentials: true
                            }
                        }

        }


        this.video = videojs(this.player.id,config);
        this.video.eme({customClass: 'eme'});
        this.qualityLevel = this.video.qualityLevels();
       
        var myCustomCallback = function(player, mediaPlayer)
        {
           mediaPlayer.setXHRWithCredentials(true);
        };
        
        if(videojs.Html5DashJS) videojs.Html5DashJS.hook('beforeinitialize', myCustomCallback);
        this.doLoadStream(source);
        this.doOnPlayerResize();
    }

    doSetupEvent()
    {

        super.doSetupEvent();
        this.qualityLevel.on("addqualitylevel",this.onAddedVideoPlaybackQuality.bind(this));
        this.qualityLevel.on("change",this.doOnVideoPlaybackQualityChanged.bind(this));
    }

    doClearEvent()
    {
        super.doClearEvent();
    }


    
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//PUBLIC          
//
//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    onAddedVideoPlaybackQuality(data) 
    {
        let qualityLevel = data.qualityLevel;
        
        if(isNaN(qualityLevel.bitrate) == false)
        {
            //qualityLevel.enabled = (qualityLevel.bitrate >= 1000000 ) ? qualityLevel.enabled : false;
            //console.log("qualityLevel.bitrate : " + qualityLevel.bitrate +" : "+ qualityLevel.enabled);
            
        }

        //if(this.hls != null) this.hls.dispose();
        this.hls = this.video.tech({ IWillNotUseThisInPlugins: true }).hls;
        this.hls.xhr.beforeRequest = this.doOnSegmentPlayback.bind(this);

    }

    doOnSegmentPlayback(options) 
    {

        //console.log(options);
        /*
        if(this.info.isPlaying == false)
        {
            if(this.info.playType == PLAY_TYPE.LIVE || this.info.playType == PLAY_TYPE.LIVE_TM) options.uri = "";            
        }
        console.log(options);
        return options;
        */
    }

    doOnVideoPlaybackQualityChanged(data) 
    {
        if(!this.qualityLevel.levels_) return;
        let qualityLevel = this.qualityLevel.levels_[data.selectedIndex];
        
        super.doOnVideoPlaybackQualityChanged(qualityLevel.bitrate/1000);
    }
    
    doPlaybackSpeed(spd)
    {
        this.video.playbackRate(spd);
        return true;
    } 
    
    doUnLoadStream()
    { 
        super.doUnLoadStream();
        if(this.hls == null) return
        if(this.hls.masterPlaylistController_) this.hls.masterPlaylistController_.dispose();
        //console.log(this.hls);
        this.hls = null;
           
    }
     
    doLoadStream(source)
    {
        this.video.src(source);
        if(this.info.isAutoPlay) this.video.play();
        
    }

    getSource(vodObject)
    {

        let source = new Object();
        if(vodObject.isSignedCookie==true) source.withCredentials = true;
        source.src = vodObject.vodUrl;
        source.type = "video/mp4";
        if(vodObject.vodUrl.indexOf(".m3u8")!=-1) source.type = "application/x-mpegURL";
        if(vodObject.vodUrl.indexOf(".mpd")!=-1) source.type = "application/dash+xml";


        if(vodObject.isDRM==true)
        {
            console.log("vodObject.isDRM "+ vodObject.isDRM )

            vodObject.vodUrl = vodObject.vodUrl.replace(/http:/g, "https:");
            vodObject.drmHost = vodObject.drmHost.replace(/http:/g, "https:")

            let headers = new Array();
            let header = new Object();
            if(vodObject.drmHeader != null) header["pallycon-customdata"] = vodObject.drmHeader;
            switch(vodObject.drmType) {
                case DRM_TYPE.WIDEVINE:
                    source.keySystemOptions = [];
                    source.keySystemOptions.push({
                        name:'com.widevine.alpha',
                        options: {
                            serverURL: vodObject.drmHost,
                            httpRequestHeaders:header
                        }
                    });
                    break;
                case DRM_TYPE.PLAY_READY:
                    source.keySystemOptions = [];
                    source.keySystemOptions.push({
                        name:'com.microsoft.playready',
                        options: {
                            serverURL: vodObject.drmHost,
                            httpRequestHeaders:header
                        }
                    });
                    break;

                case DRM_TYPE.FAIR_PLAY:

                    source.keySystems =
                    {
                        "com.apple.fps.1_0": {

                            licenseUri:vodObject.drmHost,
                            httpRequestHeaders : header,
                            certificateUri: 'https://tokyo.pallycon.com/ri/fpsKeyManager.do?siteId=U1ZN',
                            getContentId: function(emeOptions, initData)
                            {
                                var contentId = String.fromCharCode.apply(null, new Uint16Array(initData.buffer));
                                var link = document.createElement('a');
                                link.href = contentId.substring(contentId.indexOf('skd://'));
                                var host = link.hostname;
                                return host;
                            }
                        }
                    }
                    break;
            }
        }
        return source;
    }

}

    


