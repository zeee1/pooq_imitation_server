class PlayerObject 
{
    constructor() 
    {
        this.VOLUME_KEY = "VOLUME_KEY";
       
        this.playerID='none';
        this.playerInstenceID ="";
        let v = jarvis.lib.getStorage(this.VOLUME_KEY);
        if(v == null || v == undefined || v== "") v = 0.5;
        this.volume = Number(v);
        this.cookieOption = new Object();
        this.cookieOption.domain = ".pooq.co.kr";
        this.cookieOption.path = "/";

        this.streamType = "";
        this.playType = "";
        this.duration = -1;
        this.seekRange = -1;
        this.initTime = -1;
        this.isAutoPlay =false;
        this.isCompleted = false;
        this.finalSize = new jarvis.Rectangle(0,0,0,0);
        this.playStartTime = 0;
        this.isInitPlay = false;
        this.isPlaying = false;
        this.isSeeking = false;
        this.isReady = false;
        this.screenRatioType = "contain";
        this.playRate = 1;
        this.isFirstReady = false;
        this.isPlayRateChangeAble = false;
        this.isABR= false;
        this.bitrate = "";

        this.isScaleChangeAble = true;
        if(jarvis.lib.getIEVersion2() == 12) this.isScaleChangeAble = false;
        if(jarvis.lib.isFF()) this.isScaleChangeAble = false;
    }

    reset()
    {
        this.playStartTime = Date.now();
        this.playType = "";
        this.duration = -1;
        this.initTime = -1;
        this.isCompleted = false;
        this.isPlayRateChangeAble = false;
        this.isPlaying = false;
        this.isSeeking = false;
        this.isReady = false;
        this.isABR= false;
        this.isInitPlay = false;
        this.bitrate = "";
    }
}


class Player extends ComponentCore
{
	constructor(body,delegate = new Rx.Subject(),info = new PlayerObject()) 
    {
        //var cell = document.createElement("div");
        super(body,delegate);
        this.info = info;
        this.vodObject = null;
        this.metaObject = null;
        this.isFullScreen = false;
        this.screen = body;
        this.player = null;
        this.rxFullscreenObserver = null;
       
    }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//PROTECTED          
//
//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    init(playerID="")
    {
        if(playerID != "") this.info.playerID = playerID;
        this.info.playerInstenceID = jarvis.lib.generateID("");
        //this.body.id = this.info.playerInstenceID;
        this.createElements();
        return super.init();
    }

    createElements()
    {   
    }
    
    remove()
    { 
        this.removePlayer();
        this.clearEvent();
        this.delegate = null;
        this.body = null;

    }

    removePlayer()
    {  
        if(this.player == null) return;
        if(this.rxFullscreenObserver) this.rxFullscreenObserver.unsubscribe();
        this.unload();
        this.doRemovePlayer();
        this.player = null;
        this.vodObject = null; 
        this.screen = null;
    }
    doRemovePlayer(){}

    createPlayer(source)
    { 
        this.removePlayer();
        this.doCreatePlayer(source);
        this.setupEvent();
        this.setVolume(this.info.volume);
    }
    doCreatePlayer(source){}

    setupEvent()
    {
        this.attachEvent(this.screen,"resize",this.onPlayerResize.bind(this));
        this.doSetupEvent();
    }
    doSetupEvent(){}

    clearEvent()
    {
        super.clearEvent();
        this.doClearEvent();
    }
    doClearEvent(){}


    doOnReady(data) 
    {
        this.info.isReady =true;

        if(
            this.info.playType != PLAY_TYPE.LIVE && 
            this.info.playType != PLAY_TYPE.LIVE_TM && 
            this.info.playType != PLAY_TYPE.DVR &&
            this.vodObject.type != VOD_TYPE.AD)
        {
            this.info.isPlayRateChangeAble = this.setPlaybackSpeed(this.info.playRate);
        }

        this.setScreenRatioType(this.info.screenRatioType);
        this.delegate.next(new UIStatus(STATUS_TYPE.PLAYER,PLAYER_STATE.READY,this.info));
        
        
    }

    doOnDurationchanged(data) 
    {
        let d = this.getDuration();
        if(d<=0) return;
        let limitedTime = d -10;   
        if( this.info.initTime >= limitedTime) this.info.initTime = -1;
        this.setVolume();
    }
    

    //player custom event
    doOnAutoPlay() 
    {
        if(this.info.isAutoPlay)
        {
            this.player.play();  
            this.delegate.next(new UIStatus(STATUS_TYPE.PLAYER,PLAYER_STATE.AUTO_PLAY_START));
        }else
        {
            this.delegate.next(new UIStatus(STATUS_TYPE.PLAYER,PLAYER_STATE.AUTO_PLAY_STOP));
        }
        
        
    }

    doOnSourceLoad(data) 
    {
        this.delegate.next(new UIStatus(STATUS_TYPE.PLAYER,PLAYER_STATE.LOAD));
    } 
    doOnSourceLoaded(data) 
    {
        this.delegate.next(new UIStatus(STATUS_TYPE.PLAYER,PLAYER_STATE.LOADED));
    } 

    doOnPlay(data) 
    {
        /*
        if(this.info.isInitPlay == false)
        {
            this.info.isInitPlay = true;
            this.delegate.next(new UIStatus(STATUS_TYPE.PLAYER,PLAYER_STATE.PLAY_START));
           
        }*/
        this.info.isPlaying =true;
        this.delegate.next(new UIStatus(STATUS_TYPE.PLAYER,PLAYER_STATE.PLAY));
    }

    doOnInitPlay() 
    {
       
        if( this.info.playType == PLAY_TYPE.LIVE)
        {
            this.info.initTime = 0;
            return;
        }
        console.log("doOnInitPlay : " + this.info.initTime + "  " + this.info.playerInstenceID);
        let canSeek = this.seek(this.info.initTime);
        if(canSeek) this.info.initTime = 0; 
    }

    doOnPause(data) 
    {
        this.info.isPlaying = false;
        this.delegate.next(new UIStatus(STATUS_TYPE.PLAYER,PLAYER_STATE.PAUSED));
    }

    doOnSeek(data) 
    {  
        this.info.isSeeking = true;
        this.delegate.next(new UIStatus(STATUS_TYPE.PLAYER,PLAYER_STATE.SEEK,data.seekTarget));
    }

    doOnSeeked(data)  
    {     
        this.info.isSeeking = false;
        this.delegate.next(new UIStatus(STATUS_TYPE.PLAYER,PLAYER_STATE.SEEKED));
        this.doOnTimeChanged(data);
    }

    doOnVolumeChanged(data) 
    {
        if(this.info.isReady==false) return;
        let pct = this.getCurrentVolume();
        jarvis.lib.setStorage(this.info.VOLUME_KEY,String(pct));
        this.setVolumeChanged(pct);
    }

    doOnFullScreenEnter(data) 
    {
        this.isFullScreen = true;
        this.delegate.next(new UIStatus(STATUS_TYPE.PLAYER,PLAYER_STATE.FULLSCREEN_ENTER));
    }

    doOnFullScreenExit(data) 
    {
        this.isFullScreen = false;   
        this.delegate.next(new UIStatus(STATUS_TYPE.PLAYER,PLAYER_STATE.FULLSCREEN_EXIT));
    }

    doOnPlaybackFinished(data) 
    {          
        if(this.info.isCompleted) return;
        this.info.isCompleted = true;
        this.delegate.next(new UIStatus(STATUS_TYPE.PLAYER,PLAYER_STATE.PAUSED)); 
        //console.log("doOnPlaybackFinished");
        this.delegate.next(new UIStatus(STATUS_TYPE.PLAYER,PLAYER_STATE.FINISHED));          
    }

    onPlayerResize(data) 
    {
        var bounce=jarvis.lib.getAbsoluteBounce(this.screen);
        var isChange = this.checkFullscreen();
        if( bounce.width != this.info.finalSize.width || bounce.height != this.info.finalSize.height || isChange == true)
        {
            this.info.finalSize = bounce;
            this.delegate.next(new UIStatus(STATUS_TYPE.PLAYER,PLAYER_STATE.RESIZE,this.info.finalSize));
        }
        this.doOnPlayerResize(bounce);
        
    }
    doOnPlayerResize(bounce){}

    doOnError(data) 
    {
        this.doOnPause();
        this.delegate.next(new UIStatus(STATUS_TYPE.PLAYER_ERROR,PLAYER_ERROR.PLAY_BACK,this.vodObject));   
    }

    doOnStallStarted(data) 
    {
        this.delegate.next(new UIStatus(STATUS_TYPE.PLAYER,PLAYER_STATE.STALL));
    }

    doOnStallEnded(data) 
    {
        this.delegate.next(new UIStatus(STATUS_TYPE.PLAYER,PLAYER_STATE.STALLED));
    }

    doOnVideoPlaybackQualityChanged(bitrate) 
    {
        if(isNaN(bitrate)) bitrate = "";
        this.info.isABR = (bitrate=="") ? false : true;
        this.info.bitrate = bitrate;
        console.log("bitrate changed :"+bitrate);
        this.delegate.next(new UIStatus(STATUS_TYPE.PLAYER,PLAYER_STATE.QUALITY_CHANGED,bitrate));
    }

    doOnTimeChanged(data) 
    {
        var t = this.getCurrentPlayTime();

        if(this.info.initTime != 0)
        {
            if(this.info.initTime != -1) this.doOnInitPlay(); 
        }
        if(this.info.isInitPlay == false && this.info.isPlaying == true)
        {
            this.info.isInitPlay = true;
            this.delegate.next(new UIStatus(STATUS_TYPE.PLAYER,PLAYER_STATE.PLAY_START));
           
        }
        if(this.info.isCompleted == true && t!=0) this.info.isCompleted = false;
        this.delegate.next(new UIStatus(STATUS_TYPE.PLAYER,PLAYER_STATE.TIME_CHANGE,t));
    }

    doOnQualityChanged(bitrate = "")
    {
        
    }

    doOnMeta(data){}
    doOnDownloadFinished(data){}
    doOnSegmentPlayback(data){}
    doOnSegmentRequestFinished(data){}
    doOnWarning(data){}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//PUBLIC          
//
//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    unload()
    {   
        if(this.player!=null) 
        {
            this.doPause();
            this.doUnLoadStream();
        }
        this.info.reset();
        this.removeSignedCookie();
        this.delegate.next(new UIStatus(STATUS_TYPE.PLAYER,PLAYER_STATE.UNLOADED));
    }
    doUnLoadStream(){}

    loadedMeta(metaObject)
    {
        this.metaObject = metaObject;
    }

    load(vodObject)
    {
        //this.unload();
        this.info.reset();

        this.vodObject = vodObject;
        this.vodObject.isSignedCookie = this.setSignedCookie(this.vodObject.awsCookie);
        this.delegate.next(new UIStatus(STATUS_TYPE.PLAYER,PLAYER_STATE.STALL));
        this.loadStream(this.vodObject.initTime ,this.vodObject.isAutoPlay);
        this.vodObject.initTime = -1;
        
    }

    reload(t, isAutoPlay)
    {
        this.loadStream(t, isAutoPlay);
    }

    loadStream(t , isAutoPlay)
    {
        this.setPlayType(this.vodObject);
        this.delegate.next(new UIStatus(STATUS_TYPE.PLAYER,PLAYER_STATE.LOAD));
        this.vodObject.isSignedCookie = this.setSignedCookie(this.vodObject.awsCookie);
        this.info.initTime = t;
        this.info.initTime = (this.info.initTime<=0)? -1 : this.info.initTime;
        this.info.isAutoPlay = isAutoPlay;

       
        let source = this.getSource(this.vodObject); 
        if(this.player==null)
        {
            this.createPlayer(source);
        }
        else
        {
            this.doLoadStream(source);
        }    
    }
    doLoadStream(source){}
    
    forceComplete()
    {
        this.doOnPlaybackFinished(null);
    }

    play()
    {
        if(this.player==null) return;
        if(this.info.isReady==false)
        {
            this.reload(-1, true); 
            return;
        }  
        if(this.info.isPlaying==true) return;
        this.doPlay();  
    }
    doPlay(){}

    pause()
    {
        if(this.player==null) return;
        if(this.info.isPlaying==false) return;
        this.doPause();

        if(this.info.playType == PLAY_TYPE.LIVE)
        {
            this.unload();
        }
    }
    doPause(){}

    move(t)
    { 
        var c = this.getCurrentPlayTime();
        var d = this.getDuration();
        t = c + t;
        if(t<0) t=0;
        if(t>d) t=d;
        this.seek(t)
    }

    seek(t)
    { 

        if(this.info.isSeeking) return;
        if(this.player==null || this.info.duration<=0 || this.info.playType == PLAY_TYPE.LIVE)
        {
            this.delegate.next(new UIStatus(STATUS_TYPE.PLAYER,PLAYER_STATE.SEEK_DISABLE)); 
            return false;
        } 

        if(t<0)
        {
            t=0;
        }
        else if(t>=this.info.duration)
        {
            t=this.info.duration-1;
        }
        this.doSeek(Math.floor(t));
        return true;
    }
    doSeek(t){} 


    setVolume(pct = this.info.volume)
    { 
        if(this.player==null) return;
        if(pct>1) pct = 1;
        if(pct<0) pct = 0;
        this.doSetVolume(pct);
        this.setVolumeChanged(pct);
    }

    doSetVolume(pct){} 

    setVolumeChanged(pct)
    { 
       this.info.volume = pct;
       this.delegate.next(new UIStatus(STATUS_TYPE.PLAYER,PLAYER_STATE.VOLUME_CHANGED,this.info.volume));
    }

    getThumb(t)
    {
        if(!this.vtts) return null;     
        let vtt = this.findVtt(t);  
        if(vtt == null) return null;  
        return vtt.thumb;
    }
    getCurrentVolume()
    {
        return 0;
    }
    getCurrentPlayTime()
    {
        if(this.info.playType == PLAY_TYPE.LIVE){
            
            var now = Date.now();
            var t = now - this.info.playStartTime;
            return t/1000;   
        }
        return this.doGetCurrentPlayTime();
    }
    doGetCurrentPlayTime()
    {
        return 0;
    }
    getDuration()
    {
        return 0;
    }

    getIsABR()
    {
        return this.info.isABR;
    }

    getBitrate()
    {
        return this.info.bitrate;
    }

    setPlaybackSpeed(spd)
    { 
        if(this.player==null) return false;
        if(!this.doPlaybackSpeed(spd)) return false;
        this.info.playRate = spd; 
        this.delegate.next(new UIStatus(STATUS_TYPE.PLAYER,PLAYER_STATE.PLAY_RATE_CHANGED,spd));
        return true;
    }
    
    doPlaybackSpeed(spd)
    {
        return false;
    } 



    setDuration(d=this.info.duration, r = -1)
    {
        if(d==0) return;
        this.info.duration = d;
        this.info.seekRange = (r==-1)? d : r;
        this.delegate.next(new UIStatus(STATUS_TYPE.PLAYER,PLAYER_STATE.DURATION_CHANGE,this.info.duration));
        this.delegate.next(new UIStatus(STATUS_TYPE.PLAYER,PLAYER_STATE.PLAY_RANGE_CHANGE,this.info.seekRange));
    }

    setFullScreen(value)
    {
    
        this.setFullScreenCss(value);
        if(value==true)
        {
            this.enterFullscreen();         
        }
        else
        {
            this.exitFullscreen();
        }
        if(this.rxFullscreenObserver) this.rxFullscreenObserver.unsubscribe();
        this.rxFullscreenObserver = Rx.Observable.timer(100).timeInterval().take(10).subscribe
        (
            this.checkFullscreen.bind(this)
        );
    }

    setScreenRatioType(type)
    {

        let video = document.querySelector("video");
        if(video == null) return;
        this.info.screenRatioType = type;
        video.style.objectFit = type;
        this.delegate.next(new UIStatus(STATUS_TYPE.PLAYER,PLAYER_STATE.SCREEN_RATIO_CHANGED,type));
    }

    

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//PRIVATE           
//
//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    

    setPlayType(vodObject)
    { 
        switch(vodObject.type)
        {
            case VOD_TYPE.LIVE: 
                this.info.playType = PLAY_TYPE.LIVE;
                break;
            case VOD_TYPE.QVOD: 
                this.info.playType = PLAY_TYPE.QVOD;
                break;
            default:
                this.info.playType = PLAY_TYPE.VOD;
            break; 
        }
        this.info.playType = (vodObject.isDVR == true) ? PLAY_TYPE.LIVE_TM : this.info.playType;// PLAY_TYPE.DVR
        this.info.streamType = vodObject.isRadio ? STREAM_TYPE.AUDIO : STREAM_TYPE.VIDEO;
        if(this.info.playType == PLAY_TYPE.VOD || this.info.playType == PLAY_TYPE.QVOD) this.loadVtt(this.vodObject.vttPath);
        
    }

    setSignedCookie(awsCookie)
    { 
        if(awsCookie == "" || awsCookie == null || awsCookie == undefined)
        {
            this.removeSignedCookie();
            return false;
        }
        else
        {

            var cookies=awsCookie.split(";");
            var kv;
            var option = this.info.cookieOption;
            for(var i=0;i<cookies.length;++i)
            {
                kv=cookies[i].split("=");
                if(kv.length==2) jarvis.lib.setCookie(kv[0],kv[1],option);
            }
            return true;
        }
    }

    removeSignedCookie()
    { 
        if(this.vodObject == null) return;
        var awsCookie = this.vodObject.awsCookie;
        if(awsCookie == "" || awsCookie == null || awsCookie == undefined)
        {
            return
        }
        else
        {
            var cookies=awsCookie.split(";");
            var kv;
            var option = this.info.cookieOption;
            for(var i=0;i<cookies.length;++i)
            {
                
                kv=cookies[i].split("=");
                if(kv.length==2) jarvis.lib.deleteCookie(kv[0],option.path,option.domain);
            }
        }
    }

    getSource(vodObject)
    { 
        return null;
    }

    checkPlaybackFinished()
    {
        if(this.info.playType == PLAY_TYPE.LIVE) return;
        if(this.info.playType == PLAY_TYPE.LIVE_TM) return;
        if(this.info.duration<1) return;
        if(this.getCurrentPlayTime() >= this.getDuration()-1) this.doOnPlaybackFinished(null);
    }

    checkFullscreen() 
    {
        var isFullScreen = ((typeof document.webkitIsFullScreen) !== 'undefined') ? document.webkitIsFullScreen : document.mozFullScreen;
        if(this.isFullScreen != isFullScreen)
        {
            if(isFullScreen == true)
            {
                this.doOnFullScreenEnter();
            }else
            {
                this.doOnFullScreenExit();
            }
            this.setFullScreenCss(isFullScreen);
            return true;
        } 
        return false;
    }

    setFullScreenCss(isFullScreen)
    {
        
        if(this.info.isScaleChangeAble)
        {
            jarvis.lib.removeAttribute(document.body,'zoom');
            if(isFullScreen)
            {
                jarvis.lib.scale = 1.3;
                jarvis.lib.addAttribute(document.body,'zoom');
            }
            else
            {
                jarvis.lib.scale = 1.0;
            }
        }
    }
    
    enterFullscreen()
    {
        if (this.screen.parentNode == null) return;
        if (this.screen.parentNode.requestFullscreen) this.screen.parentNode.requestFullscreen();
        if (this.screen.parentNode.mozRequestFullScreen) this.screen.parentNode.mozRequestFullScreen();
        if (this.screen.parentNode.webkitRequestFullscreen) this.screen.parentNode.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
 
    } 
    
    exitFullscreen()
    {
        if (document.cancelFullScreen) document.cancelFullScreen();
        if (document.mozCancelFullScreen) document.mozCancelFullScreen();
        if (document.webkitCancelFullScreen) document.webkitCancelFullScreen();
    } 

    loadVtt(path)
    { 
        let that = this;
        var delegate=function(){}; 
            delegate.prototype = {
                            onEvent : function(e,value)
                            {
                                switch(e){
                                    case jarvis.EVENT.COMPLETE:
                                        that.sortVtt(value);
                                        break;
                                }      
                            }
            }
        DataManager.getInstance().getVtts(path,new delegate());
    }

    sortVtt(value)
    {
        function compare(big,small)
        {
            if(big.startTime>small.startTime) return true;
            return false;
        }
        this.vtts = jarvis.Sort.quick(value.vtts,compare);
        this.delegate.next(new UIStatus(STATUS_TYPE.PLAYER,PLAYER_STATE.VTT_LOADED,value));
    }

    findVtt(t)
    {
        let that = this;
        let len = this.vtts.length;
        function finder(idx)
        {
            let vtt =  that.vtts[idx];
            if(t >= vtt.startTime && t < vtt.endTime) return 0;
            if(t < vtt.startTime) return -1;
            if(t >= vtt.endTime) return 1;
        }

        let find = jarvis.Sort.binSearch(len,finder);
        return this.vtts[find];
    }

}


