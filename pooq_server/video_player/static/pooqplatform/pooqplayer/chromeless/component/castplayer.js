
class CastPlayer extends Player
{
	static init(delegate)
    {

        //console.log("onGCastApi type : " + typeof cast);
        if(typeof cast != "undefined")
        {
            if(CastPlayer.inited()) 
            {
                delegate.next(new UIStatus(STATUS_TYPE.PLAYER,PLAYER_STATE.CAST_INITED));
            }
            return;
        }
        window['__onGCastApiAvailable'] = function(isAvailable) 
        {
            console.log("onGCastApiAvailable : " + isAvailable);
            if (isAvailable) 
            {
               if(CastPlayer.inited()) delegate.next(new UIStatus(STATUS_TYPE.PLAYER,PLAYER_STATE.CAST_INITED));
            }
        }
    }

    static inited()
    {
        let options = {};
        try
        {
            // options.receiverApplicationId = 'F6E41986';//'0DF7F45D'; //
            options.receiverApplicationId = '0DF7F45D';
            options.autoJoinPolicy = chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED;
        } 
        catch (e) 
        {
            console.log("CastApi : disable");
            return false;
        }
        UIManager.getInstance().isCastAble = true;
        cast.framework.CastContext.getInstance().setOptions(options);
        return true;
        
    }

    constructor(body,delegate = new Rx.Subject(),info = new PlayerObject(),remoteDelegate = new Rx.Subject()) 
    {
        super(body,delegate,info);
        this.remoteDelegate = remoteDelegate;
        this.NAME_SPACE_PROTOCOL='urn:x-cast:com.captv.pooq.chromecast';
        this.playerController = null;
        this.isConnected = false;
        this.isSeeking = false;
        this.fullscreen = false;
        this.createPlayer(null);
        this.finalPlayTime = -1;
    }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//PROTECTED          
//
//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    doRemovePlayer()
    { 
        //destroy
    }

    doCreatePlayer(source)
    {   
        if(typeof cast == "undefined") return;
        this.player = this.getPlayer();
        this.doLoadStream(source);
        this.doOnPlayerResize();
    }

    getPlayer()
    {   
        if(typeof cast == "undefined") return null;
        let player  = new cast.framework.RemotePlayer();
        this.playerController = new cast.framework.RemotePlayerController(player);
        this.playerController.addEventListener
        (
            cast.framework.RemotePlayerEventType.IS_CONNECTED_CHANGED,
            this.switchPlayer.bind(this)
        );
        return player;
    }

    switchPlayer()
    {

        if(this.player == null) return;
        if (cast && cast.framework) 
        {
            if (this.player.isConnected) 
            {
                this.createMsgbus();
                var castSession = cast.framework.CastContext.getInstance().getCurrentSession();
                let name = castSession.getCastDevice().friendlyName;
                this.isConnected = true;
                this.remoteDelegate.next(new UIStatus(STATUS_TYPE.PLAYER,PLAYER_STATE.CAST_CONNECTED,name)); 
            }
            else
            {
                this.isConnected = false;
                this.remoteDelegate.next(new UIStatus(STATUS_TYPE.PLAYER,PLAYER_STATE.CAST_DISCONNECTED)); 

            } 
           
        }   
    }

    doSetupEvent()
    {
        if(typeof cast == "undefined") return;
        var that = this;
        var castSession = cast.framework.CastContext.getInstance().getCurrentSession();
        this.playerController.addEventListener(cast.framework.RemotePlayerEventType.IS_MEDIA_LOADED_CHANGED,this.doOnReady.bind(this));
        this.playerController.addEventListener(cast.framework.RemotePlayerEventType.DURATION_CHANGED,this.doOnDurationchanged.bind(this));
        this.playerController.addEventListener(cast.framework.RemotePlayerEventType.CURRENT_TIME_CHANGED,this.doOnTimeChanged.bind(this));
        this.playerController.addEventListener(cast.framework.RemotePlayerEventType.IS_MUTED_CHANGED,this.doOnVolumeChanged.bind(this));
        this.playerController.addEventListener(cast.framework.RemotePlayerEventType.VOLUME_LEVEL_CHANGED,this.doOnVolumeChanged.bind(this));

        this.playerController.addEventListener(
            cast.framework.RemotePlayerEventType.PLAYER_STATE_CHANGED,
            function(e) 
            {

                //console.log("playerState : "+that.player.playerState);
                switch (that.player.playerState) 
                {
                    case chrome.cast.media.PlayerState.IDLE:
                        console.log("idleReason : "+that.media.idleReason);
                        that.doOnPause();
                        if(that.media.idleReason == chrome.cast.media.IdleReason.FINISHED || that.media.idleReason == null)
                        {
                            that.doOnPlaybackFinished();
                        }
                        else
                        {
                            that.checkPlaybackFinished();
                        }
                        break;
                    case chrome.cast.media.PlayerState.BUFFERING:
                        that.doOnStallStarted();
                        break;
                    case chrome.cast.media.PlayerState.PAUSED:
                        that.doOnPause();
                        that.doOnStallEnded();
                        break;
                    case chrome.cast.media.PlayerState.PLAYING:
                        that.doOnPlay();
                        that.doOnStallEnded();
                        break;
                    default :
                        break;
                }
            }
        );
        
    }

    doClearEvent()
    {

    }
    doOnReady()
    {
        this.doOnSourceLoad();
        super.doOnReady();
    }

    doOnTimeChanged()
    {
        super.doOnTimeChanged();
        if(this.isSeeking) this.doOnSeeked();
        this.checkPlaybackFinished();   
    }
    doOnSeek(data)
    {
        this.isSeeking = true;
        super.doOnSeek(data);
    } 
    doOnSeeked(data)
    {
        this.isSeeking = false;
        super.doOnSeeked(data);
    } 
    doEnterFullscreen()
    {
        this.enterFullscreen();
    } 
    
    doExitFullscreen()
    {
        this.exitFullscreen();
    } 

    setPlayType(vodObject)
    { 
        super.setPlayType(vodObject);
        this.info.streamType = STREAM_TYPE.REMOTE;
    }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//PUBLIC          
//
//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    doUnLoadStream()
    { 
        //this.playerController.stop();
    }


    doLoadStream(source)
    {
        if(typeof cast == "undefined") return;
        if(source == null)return;
       
        var t = (source.initTime>0)? source.initTime : 0;
        let that = this;
        var castSession = cast.framework.CastContext.getInstance().getCurrentSession();
        var mediaInfo = new chrome.cast.media.MediaInfo(source.vodUrl, 'video/mp4');
        var meta = new chrome.cast.media.GenericMediaMetadata();
        meta.metadataType = chrome.cast.media.MetadataType.GENERIC;

    
        meta.title =  (source.type == VOD_TYPE.AD) ? INFO_MSG.AD : this.metaObject.viewTitle;
        meta.subtitle =  (source.type == VOD_TYPE.AD) ? "" : this.metaObject.channelTitle;
        meta.images = [{'url': this.metaObject.initImage}];

        var customData = new Object();
        customData.type = this.vodObject.type;
        customData.contentID = this.vodObject.contentID;
        customData.isAllowed = this.vodObject.isAllow;
        customData.awsCookie = this.vodObject.awsCookie;
        customData.licenseCustomData = this.vodObject.drmHeader;
        customData.licenseUrl = this.vodObject.drmHost;
        customData.previewTime = this.vodObject.previewTime;
        customData.bookMarkData = DataManager.getInstance().info.getBookMarkData(this.vodObject);
        customData.prerollRequestObject = this.vodObject.prerollRequestObject;
        customData.prerollMediaLogData = (this.vodObject.prerollRequestObject != null) 
                                            ? DataManager.getInstance().info.getMedialogParam(this.vodObject.prerollRequestObject,0) : null;                                    
        
       // console.log(customData);
        this.media = castSession.getMediaSession();
        mediaInfo.currentTime = Number(t);
        mediaInfo.customData = customData;
        mediaInfo.metadata = meta;
        var request = new chrome.cast.media.LoadRequest(mediaInfo);
        castSession.loadMedia(request).then
        (
            function()
            {
                that.doOnSourceLoaded(this);
            },
            function(errorCode) { console.log('Error code: ' + errorCode); }
        );

    }

    getSource(vodObject)
    { 
        this.loadVtt(vodObject.vttPath);
        return vodObject;
    }

    doPlay()
    {
        if(this.player==null) return;
        if (this.player.isPaused) this.playerController.playOrPause();   
    }

    doPause()
    {
        if (this.player.isPaused == false) this.playerController.playOrPause();
    }

    doSeek(t)
    { 
        this.player.currentTime = t;
        this.doOnSeek({seekTarget:t}); 
        this.playerController.seek();
        
    }

    doSetVolume(pct)
    { 
        if(pct == 0)
        {
            if(this.player.isMuted == false) this.playerController.muteOrUnmute();
        }
        else
        {
            if(this.player.isMuted == true) this.playerController.muteOrUnmute();
            this.player.volumeLevel = pct;
            this.playerController.setVolumeLevel();
        }
    }

    getCurrentVolume()
    {
        if(this.player.isMuted) return 0;
        return this.player.volumeLevel;
    }

    getCurrentPlayTime()
    {   
        if(this.isConnected==false) return this.finalPlayTime;
        if(this.player==null) return 0;
        if(this.info.duration==-1) return 0;
        this.finalPlayTime = (this.player.currentTime>0) ? this.player.currentTime : this.finalPlayTime;
        return this.player.currentTime;
    }
    
   

    getDuration()
    {
        if(this.player==null) return 0;
        var d = -1;
        if(this.player.duration == null || String(this.player.duration) == "NaN" || this.player.duration == 0)
        {
            d = 0;
        }else
        {
            d = this.player.duration;
        }

        if(d !=  this.info.duration)
        {
            this.setDuration(d,d);
        }
        return d;
    }


    createMsgbus()
    {
        var castSession = cast.framework.CastContext.getInstance().getCurrentSession();
        castSession.addMessageListener(this.NAME_SPACE_PROTOCOL,this.reciveMsg.bind(this));
    }
    
    reciveMsg(msg,value)
    {
        
        var command = "";
        var jsonData = null;
        if(value.indexOf(RECEIVER_COMMAND.STOP_CASTING) != -1)
        {
            command = value;
        }
        else
        {
            jsonData = JSON.parse(value);
            command = jsonData.command;
            
        }
        console.log("cast msg : " + command);
        switch(command)
        {
            case RECEIVER_COMMAND.SEND_QVOD_RANGE:
                let qvodRange = Number(jsonData.qvodRange);
                let qvodDuration = Number(jsonData.qvodDuration);
                this.setDuration(qvodRange,qvodDuration);
                break;
            case RECEIVER_COMMAND.STOP_CASTING:
                cast.framework.CastContext.getInstance().endCurrentSession(true);
                break;  
        }

    }



}





