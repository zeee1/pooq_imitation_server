
class AwsomePlayerObject extends PlayerObject 
{
    constructor() 
    {
        super();
        this.PERMISSION_INVALID_TIME = 60*60*5.5;
        this.originVodUrl = "";
        this.getPermissionTime = -1;
        this.seekPosition = 0;
        this.isMoveAble = true;
        this.isRemoteMode = false;
        this.LIVE_DURATION = 3600;
        this.spentTime  = 0;
        this.playerType = DataManager.getInstance().info.htmlPlayerType;
        this.isInitConvertible = true; 
    }

    reset()
    {
        this.getPermissionTime = -1;
        this.isMoveAble = true;
        super.reset();
    }
}

class AwsomePlayer extends ComponentInjector
{
	constructor(body) 
    {
        let delegate = new Rx.Subject();
        let playerDelegate = new Rx.Subject();
        let info = new AwsomePlayerObject();
        var originPlayer = null;        
        
        if(info.playerType == PLAYER_TYPE.VIDEO_JS)
        {
            originPlayer = new VideoPlayer(body,playerDelegate,info);
        }
        else
        {
            originPlayer = new BitPlayer(body,playerDelegate,info);
        }
        
        //let originPlayer = new HLSPlayer(body,playerDelegate,info);
        //let originPlayer = new VideoPlayer(body,playerDelegate,info);
        //let originPlayer = new HTML5Player(body,playerDelegate,info);
        super(body,[originPlayer],delegate);
        this.playerBody = body;
        this.originPlayer = originPlayer;
        this.info = info;
        this.vodObject = null;
        this.metaObject = null;
        this.playerDelegate = playerDelegate;
        this.rxQvodRangeIncreaser = null;
        this.rxQvodRangeLoader = null;
        this.rxQvodRangeCloser = null;
        this.rxPreviewTimer = null;
        this.rxBookMarkShotGun = null;
        this.rxBufferObserver = null;
        this.rxMoveController = null;
    }

    init(playerID)
    {
        super.init([playerID]);
        

        this.info.playRate = DataManager.getInstance().getSetupValue(SHARED_KEY.PLAY_RATE);
        this.info.screenRatioType = DataManager.getInstance().getSetupValue(SHARED_KEY.SCREEN_RATIO);

        let that = this;
        let playerSubscription = this.playerDelegate.subscribe
        (
            this.sendStatus.bind(this)
            
        ); 
        return this.delegate;
    }
    castPlayerInit()
    {
        CastPlayer.init(this.delegate);
    }
    castPlayerInited()
    {
        if(this.remotePlayer != null) return;
        let remoteDelegate = new Rx.Subject();
        remoteDelegate.subscribe
        (
           this.sendRemoteStatus.bind(this)
        ); 
        this.remotePlayer = new CastPlayer(this.body,new Rx.Subject(),this.info,remoteDelegate);
        this.remotePlayer.init();
        this.remotePlayer.switchPlayer();
    }
    remove()
    {
        super.remove();
        this.removeRX();
    }

    sendEvent(event)
    {
        switch(event.type)
        {
            case PLAYER_EVENT.PLAY:
                this.play();
                break;
            case PLAYER_EVENT.PAUSE:
                this.pause();
                break;
            case PLAYER_EVENT.MOVE:
                this.move(event.value);
                break;
            case PLAYER_EVENT.SEEK_CHANGE:
                this.seek(event.value);
                break;
            case PLAYER_EVENT.VOLUME_CHANGE:
                this.setVolume(event.value);
                break;
            case PLAYER_EVENT.FULLSCREEN_ENTER:
                this.excute('setFullScreen',[true]);
                break;
            case PLAYER_EVENT.FULLSCREEN_EXIT:
                this.excute('setFullScreen',[false]);
                break;
            case PLAYER_EVENT.SCREEN_RATIO_CHANGE:
                this.excute('setScreenRatioType',[event.value]);
                break;
            case PLAYER_EVENT.PLAY_RATE_CHANGE:
                this.excute('setPlaybackSpeed',[event.value]);
                break;

        }
    }
    sendRemoteStatus(status)
    {
        switch(status.state)
        {

            case PLAYER_STATE.CAST_CONNECTED:
                this.setRemoteMode(true);
                break;
            case PLAYER_STATE.CAST_DISCONNECTED:
                this.setRemoteMode(false);
                break;
        }
    }

    sendStatus(status)
    {
        let that = this;
        if(status.type == STATUS_TYPE.PLAYER_ERROR) this.shotBookMark(true,status.state);
        //console.log("sendStatus : "+status.state);
        switch(status.state)
        {

            case PLAYER_STATE.AUTO_PLAY_STOP:
                onAutoPlayStop();
                break;
            case PLAYER_STATE.PLAY_START:
                previewCheck();
                break;
            case PLAYER_STATE.PLAY:
                this.startBookMark();
                break;
            case PLAYER_STATE.PAUSE:
                this.endBookMark();
                break;
            case PLAYER_STATE.FINISHED:
                this.info.spentTime = 0;
                this.endBookMark();
                break;
            case PLAYER_STATE.STALL:
                //console.log("sendStatus : "+status.state);
                this.startBufferObserver();
                break;
            case PLAYER_STATE.STALLED:
                //console.log("sendStatus : "+status.state);
                this.endBufferObserver();
                break;
        }
        
        if(this.info.playType != PLAY_TYPE.LIVE_TM) 
        {
            this.delegate.next(status);
            return;
        }
        
        switch(status.state)
        {
            case PLAYER_STATE.READY:
            case PLAYER_STATE.DURATION_CHANGE:
            case PLAYER_STATE.PLAY_RANGE_CHANGE:
            case PLAYER_STATE.TIME_CHANGE:
                return;
            
            case PLAYER_STATE.LOAD:
                this.info.isSeeking = true;
                status = new UIStatus(STATUS_TYPE.PLAYER,PLAYER_STATE.SEEK,this.info.seekPosition);
                break;
            case PLAYER_STATE.LOADED:
                this.info.isSeeking = false;
                status = new UIStatus(STATUS_TYPE.PLAYER,PLAYER_STATE.SEEKED);
                this.delegate.next(status);
                status = new UIStatus(STATUS_TYPE.PLAYER,PLAYER_STATE.TIME_CHANGE,this.info.seekPosition);
               
                break;
        }

        this.delegate.next(status);

        function previewCheck()
        {
            if(that.vodObject.isPreview == false) return;
            
            if(that.vodObject.type != VOD_TYPE.LIVE && that.vodObject.type != VOD_TYPE.LIVE_TM) return;
            if(that.rxPreviewTimer) that.rxPreviewTimer.unsubscribe();
            that.delegate.next(new UIStatus(STATUS_TYPE.PLAYER,PLAYER_STATE.PREVIEW_DURATION_CHANGE,that.vodObject.previewTime));

            let pt = that.vodObject.previewTime - that.info.spentTime;
           
            if(pt<1) pt = 1;
            that.rxPreviewTimer = Rx.Observable.interval(1000).take(pt).subscribe
            (
                {
                    next(value)
                    {
                        that.info.spentTime ++;
                        that.delegate.next(new UIStatus(STATUS_TYPE.PLAYER,PLAYER_STATE.PREVIEW_TIME_CHANGE,value));
                    },
                    complete(value)
                    {
                        that.unload();
                        that.excute('forceComplete');
                    }
                }   
            );

        }

        function onAutoPlayStop()
        {

            if(that.info.playType == PLAY_TYPE.LIVE_TM || that.info.playType == PLAY_TYPE.LIVE)
            {
                that.info.isPlaying = true;
                that.pause();
            }

        }     
    }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//PUBLIC          
//
//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    

    dataLoad()
    {
        this.delegate.next(new UIStatus(STATUS_TYPE.PLAYER,PLAYER_STATE.DATA_LOAD));
        //this.delegate.next(new UIStatus(STATUS_TYPE.PLAYER,PLAYER_STATE.STALL));
    }
    dataLoaded()
    {
        this.delegate.next(new UIStatus(STATUS_TYPE.PLAYER,PLAYER_STATE.DATA_LOADED));
        //this.delegate.next(new UIStatus(STATUS_TYPE.PLAYER,PLAYER_STATE.STALLED));
    }

    unload()
    { 
        this.excute('unload');
        this.removeRX();
    }

    removeRX()
    {
        if(this.rxQvodRangeIncreaser) this.rxQvodRangeIncreaser.unsubscribe();
        if(this.rxQvodRangeLoader) this.rxQvodRangeIncreaser.unsubscribe();
        if(this.rxQvodRangeCloser) this.rxQvodRangeCloser.unsubscribe();

        if(this.rxPreviewTimer) this.rxPreviewTimer.unsubscribe();
        if(this.rxBookMarkShotGun) this.rxBookMarkShotGun.unsubscribe();
        if(this.rxBufferObserver) this.rxBufferObserver.unsubscribe();
        if(this.rxMoveController) this.rxMoveController.unsubscribe();
    }
    
    loadedMeta(metaObject)
    {
        let isUpdate = true;
        if(this.metaObject) isUpdate = (this.metaObject.updateKey == metaObject.updateKey) ? false : true;
        
        this.metaObject = metaObject;
        if(isUpdate) this.info.spentTime = 0;
        this.excute('loadedMeta',[metaObject]);
    }

    checkRemoteAble()
    {
        var isAble = true;
        if(this.vodObject.type == VOD_TYPE.AD) isAble = false;
        //if(this.vodObject.isDVR == true) isAble = false;
        if(this.vodObject.isRadio == true) isAble = false;
        return isAble;
    }


    getRemoteMode()
    {
        return this.info.isRemoteMode;
    }
    setRemoteMode(isRemoteMode)
    {
        if(this.vodObject == null) return;

        if(isRemoteMode == this.info.isRemoteMode) return;
        let finalTime = this.getCurrentPlayTime();
        if(isRemoteMode)
        {
            this.removeDependencies(this.originPlayer);
            this.remotePlayer.delegate = this.playerDelegate;
            this.addDependencies(this.remotePlayer);
            this.originPlayer.unload();
        }
        else
        {
            this.removeDependencies(this.remotePlayer);
            this.addDependencies(this.originPlayer);
            this.remotePlayer.unload();
        }
        this.info.isRemoteMode = isRemoteMode;
        this.delegate.next(new UIStatus(STATUS_TYPE.PLAYER,PLAYER_STATE.REMOTE_CHANGED,{isRemoteMode:this.info.isRemoteMode}));
        if(this.vodObject.initTime == -1) this.vodObject.initTime = finalTime;
        this.vodObject.isAutoPlay = true; 
        this.loadedMeta(this.metaObject);
        this.load(this.vodObject);
    }

    setPlayerTec(tec)
    {
        if(tec == this.info.playerType) return;
        if(this.originPlayer)
        {

            this.removeDependencies(this.originPlayer);
            this.originPlayer.remove();
        }

        this.info.playerType = tec;

        if(this.info.playerType == PLAYER_TYPE.VIDEO_JS)
        {
            this.originPlayer = new VideoPlayer(this.playerBody,this.playerDelegate,this.info);
        }
        else
        {
            this.originPlayer = new BitPlayer(this.playerBody,this.playerDelegate,this.info);
        }
        this.originPlayer.init();
        this.addDependencies(this.originPlayer);

    }


    getVideoJSConvertible()
    {
        if(this.info.isInitConvertible == false) return false;
        this.info.isInitConvertible = false;
        //console.log(this.vodObject);
        if(this.vodObject.contentID == "M12") return true;
        if(this.vodObject.contentID.indexOf('MV_C901') != -1) return true;
        if(this.vodObject.contentID.indexOf('E') != -1) return true;
        return false;
    }

    load(vodObject)
    {
        this.removeRX();
        this.vodObject = vodObject;
        //this.vodObject.vodUrl = "http://h.captv.co.kr/pooqcdn-vod-dev/public/mp4/C2301/origin.mp4";
        if(this.getVideoJSConvertible() == true) this.setPlayerTec(PLAYER_TYPE.VIDEO_JS);

        if(this.remotePlayer != null)
        {
            let isRemoteAble = this.checkRemoteAble();
            //console.log("isRemoteAble : " + isRemoteAble);
            //console.log("isConnected : " + this.remotePlayer.isConnected);
            //console.log("current remoteMode : " + this.info.isRemoteMode);
            if(isRemoteAble == false && this.info.isRemoteMode == true)
            {
                this.setRemoteMode(false);
                return;
            }
            else if(isRemoteAble == true && this.remotePlayer.isConnected == true && this.info.isRemoteMode == false)
            {
                this.setRemoteMode(true);
                return;
            }

            if(isRemoteAble == false && this.remotePlayer.isConnected == true) this.delegate.next(new UIStatus(STATUS_TYPE.PLAYER,PLAYER_STATE.CAST_DISABLE));
        }
        
        if(vodObject.vodUrl == null || vodObject.vodUrl == "null" || vodObject.vodUrl == "") return;
        
        this.info.originVodUrl = vodObject.vodUrl;
        if(vodObject.isDVR == true && vodObject.initTime == -1) vodObject.initTime = this.info.LIVE_DURATION;
        vodObject.vodUrl = vodObject.isDVR ? this.getLivePositionPath(vodObject.initTime) : this.info.originVodUrl;
        this.excute('load',[vodObject]);

        this.info.getPermissionTime = this.getCurrentTime();
        this.initLiveTm();
        this.initQvodRangeCheck(vodObject);
    }

    play()
    {
        
        if(this.vodObject == null) return;
        if(this.isPermissionInvalid()==true)
        {  
            var t = this.getCurrentPlayTime();
            console.log("PermissionInvalid : " + t);
            this.vodObject.initTime = t;
            this.delegate.next(new UIStatus(STATUS_TYPE.PLAYER,PLAYER_STATE.PERMISSION_INVALID));
            return;                            
        }
        if(this.info.isCompleted == true)
        {
            console.log("PermissionComplete");
            this.vodObject.initTime = -1;
            this.delegate.next(new UIStatus(STATUS_TYPE.PLAYER,PLAYER_STATE.PERMISSION_COMPLETE));
            return;
        }
        this.delegate.next(new UIStatus(STATUS_TYPE.PLAYER,PLAYER_STATE.PERMISSION_CHECK));
        this.excute('play');
    }

    pause()
    {
            
        this.excute('pause');
    }

    togglePlay()
    {
        if(this.info.isPlaying == true)
        {
            this.pause();
        }else
        {
            this.play();
        }
    }

    moveSeek(amount)
    {
        this.move(amount);
    }

    moveVolume(amount)
    {
        var v = this.info.volume;
        var mv = Number(v) + Number(amount);
        this.setVolume(mv);
    }

    move(t)
    {
        if(this.vodObject == null) return;
        if(this.vodObject.isSeekAble == false) return;
        if(this.info.isMoveAble == false) return;
        var c = this.getCurrentPlayTime();
        var d = this.getDuration();
        t = c + t;
        if(t<0) t=0;
        if(t>d) t=d;

        this.info.isMoveAble = false;


        this.seek(t)
        if(this.rxMoveController) this.rxMoveController.unsubscribe();
        this.rxMoveController = Rx.Observable.interval(300).take(1).subscribe
        (
            this.resetMoveAble.bind(this)
        );
    }

    resetMoveAble()
    {
        this.info.isMoveAble = true;
    }

    seek(t)
    {
        if(this.vodObject == null) return;
        if(this.vodObject.isSeekAble == false) return;
        if(this.info.isCompleted == true) return;
        if(this.info.playType != PLAY_TYPE.LIVE_TM)
        {
            this.excute('seek',[t]);
            return;
        }
        if(this.info.isSeeking) return;
        if(this.info.seekPosition == Math.floor(t)) return;
        this.vodObject.vodUrl = this.getLivePositionPath(t);
        this.excute('loadStream',[0,true]);
        
    }

    getThumb(t)
    {
        t = t+10; // for ms
        if (t >= this.info.duration-10) t = this.info.duration-10;
        return this.get('getThumb',[t]);
    }
    
    getScreenRatio()
    {
        return this.info.screenRatioType;
    }
    getPlayRate()
    {
        return this.info.playRate;
    }
    setFullScreen(value)
    {
        this.excute('setFullScreen',[value]);

    }
    setVolume(v)
    {
        this.excute('setVolume',[v]);
    }
    
    getDuration()
    {
        if(this.vodObject.type == VOD_TYPE.QVOD)
        {
            return (this.info.duration == -1) ? 0 : this.info.duration;
        }

        else if(this.info.playType == PLAY_TYPE.LIVE_TM)
        {
            this.info.duration = this.info.LIVE_DURATION;
            this.excute("setDuration");
            return this.info.duration;
        }
        return this.get('getDuration');
    }

    getCurrentPlayTime()
    {
        if(this.info.playType == PLAY_TYPE.LIVE_TM) return this.info.seekPosition;
        var t = this.get('getCurrentPlayTime');
        t = (t==null)? 0 : t;
        return t;
    }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//PRIVATE           
//
//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    getLivePositionPath(t)
    { 
        t = t<0 ? 0 : t;
        this.info.seekPosition = Math.floor(t);
        var conjunction = "";
        conjunction = (this.info.originVodUrl.indexOf("?")==-1) ? "?" : "&";
        let path = this.info.originVodUrl + conjunction + "seek=" + (this.info.LIVE_DURATION-this.info.seekPosition);
        
        return path;
    }


    getCurrentTime()
    {
        var timeStamp = Date.now()/1000;
        return timeStamp;
    }
    
    isPermissionInvalid()
    {
        if(this.info.getPermissionTime == -1) return true;

        var diff = this.getCurrentTime() - this.info.getPermissionTime;
        return (diff > this.info.PERMISSION_INVALID_TIME) ? true : false;
    }
    initLiveTm()
    {
        if(this.info.playType != PLAY_TYPE.LIVE_TM) return;

        this.delegate.next(new UIStatus(STATUS_TYPE.PLAYER,PLAYER_STATE.READY,this.info));
        let liveDuration = this.info.LIVE_DURATION;
        this.delegate.next(new UIStatus(STATUS_TYPE.PLAYER,PLAYER_STATE.DURATION_CHANGE,liveDuration));
        this.delegate.next(new UIStatus(STATUS_TYPE.PLAYER,PLAYER_STATE.PLAY_RANGE_CHANGE,liveDuration));
        
    }

    startBookMark()
    {
        this.endBookMark();
        if(this.vodObject == null) return;
        if(this.info.isRemoteMode) return;
        if(this.vodObject.type == VOD_TYPE.AD) return;
        if(this.vodObject.type == VOD_TYPE.CLIP) return;
        if(this.vodObject.isAllow==false) return;
        
        this.rxBookMarkShotGun = Rx.Observable.interval(10000).subscribe
        (
            this.onShotBookMark.bind(this)
        );
    }
    endBookMark()
    {
        if(this.rxBookMarkShotGun) this.rxBookMarkShotGun.unsubscribe();
    }

    startBufferObserver()
    {
        this.endBufferObserver();
        if(this.vodObject == null) return;
        if(this.info.isRemoteMode) return;
        if(this.vodObject.type == VOD_TYPE.AD) return;
        if(this.vodObject.type == VOD_TYPE.CLIP) return;

        //console.log("startBufferObserver");
        this.rxBufferObserver = Rx.Observable.interval(2000).take(1).subscribe
        (
            this.shotBookMark.bind(this,true,PLAYER_ERROR.BUFFER_DELAY,-1)
        );
    }

    endBufferObserver()
    {
        //console.log("endBufferObserver");
        if(this.rxBufferObserver) this.rxBufferObserver.unsubscribe();
    }

    onShotBookMark(n)
    {
        if(this.info.isPlaying == false) return;
        this.shotBookMark(false,"");
    }

    shotBookMark(isLog,errorCode="",times = -1)
    {
        if(this.vodObject == null) return;
        var playData = new Object();
        playData.currentTime = this.getCurrentPlayTime();
        playData.isABR = this.get('getIsABR');
        playData.BR = this.get('getBitrate');
        playData.playerType = this.info.playerType;
        playData.errorCode =(errorCode != "") ? PLAYER_ERROR_CODE[errorCode] : errorCode;
      
        if(times == -1)
        {
            
            DataManager.getInstance().sendBookMark (this.vodObject,isLog,playData);
        }
        else
        {
            DataManager.getInstance().sendBookMarkTest (this.vodObject,isLog,playData,times);
        }
        
    }

    initQvodRangeCheck(vodObject)
    {
        
        if(this.rxQvodRangeIncreaser) this.rxQvodRangeIncreaser.unsubscribe();
        if(this.rxQvodRangeLoader) this.rxQvodRangeLoader.unsubscribe();
        if(this.rxQvodRangeCloser) this.rxQvodRangeCloser.unsubscribe();
        if(this.info.isRemoteMode) return;
        if(this.info.playType != PLAY_TYPE.QVOD) return;

        let that = this;
        let subscription = Rx.Observable.interval(1000).take(300);
        
        this.rxQvodRangeIncreaser = subscription.subscribe
        (
            {
                next(value)
                {
                    that.info.seekRange ++;
                    that.info.seekRange = (that.info.seekRange>that.info.duration)? that.info.duration : that.info.seekRange;
                    that.delegate.next(new UIStatus(STATUS_TYPE.PLAYER,PLAYER_STATE.PLAY_RANGE_CHANGE,that.info.seekRange));
                } 
            }   
        );

        this.rxQvodRangeLoader = subscription.first().subscribe
        (
            {
                next(value)
                {
                    if(vodObject.isPreview)
                    {
                        that.excute("setDuration",[vodObject.previewTime,vodObject.previewTime]);   
                        return;
                    }

                    var delegate=function(){}; 
                        delegate.prototype = {
                                        onEvent : function(e,value)
                                        {
                                            switch(e){
                                                case jarvis.EVENT.COMPLETE:
                                                    that.excute("setDuration",[value.duration,value.range]);   
                                                    break;
                                            }      
                                        }
                        }
                    DataManager.getInstance().getQVodTime(vodObject,new delegate());
                } 
            }
        )

        this.rxQvodRangeCloser = subscription.last().subscribe
        (
            this.initQvodRangeCheck.bind(this,vodObject)
        )

    }    
}







