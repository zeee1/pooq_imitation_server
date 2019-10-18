
class HTML5Player extends Player
{
	constructor(body,delegate = new Rx.Subject(),info = new PlayerObject()) 
    {
        super(body,delegate,info);
        this.fullscreen = false; 
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
    getPlayer()
    {   
        let player = document.createElement("video");
        player.preload='auto';
        player.style.width="100%";
        player.style.height="100%";
        this.screen.appendChild(player);
        return player;
    }
    doCreatePlayer(source)
    {   
        this.player = this.getPlayer();
        this.doLoadStream(source);
        this.doOnPlayerResize();
    }

    doSetupEvent()
    {
        this.player.addEventListener("loadstart", this.doOnSourceLoad.bind(this), false);
        this.player.addEventListener("loadedmetadata", this.doOnReady.bind(this), false);
        this.player.addEventListener("timeupdate", this.doOnTimeChanged.bind(this), false);
        this.player.addEventListener("seeking", this.doOnSeek.bind(this), false);
        this.player.addEventListener("seeked", this.doOnSeeked.bind(this), false);
        this.player.addEventListener("pause", this.doOnPause.bind(this), false); 
        this.player.addEventListener("playing", this.doOnPlay.bind(this), false);
        this.player.addEventListener("loadeddata", this.doOnSourceLoaded.bind(this), false);
        this.player.addEventListener("waiting", this.doOnStallStarted.bind(this), false);
        this.player.addEventListener("suspend", this.doOnStallEnded.bind(this), false);
        this.player.addEventListener("stalled", this.doOnStallEnded.bind(this), false);
        this.player.addEventListener("ended", this.doOnPlaybackFinished.bind(this), false);
        this.player.addEventListener("error", this.doOnError.bind(this), false);
        this.player.addEventListener("canplay", this.doOnStallEnded.bind(this), false);
        this.player.addEventListener("cuechange", this.doCueChange.bind(this), false);


    }
 
    doClearEvent()
    {

    }

    doOnReady(data) 
    {
        super.doOnReady(data); 
        this.doOnDurationchanged(data);
    }

    doOnSeek(data) 
    {  
        this.info.isSeeking = true;
        this.delegate.next(new UIStatus(STATUS_TYPE.PLAYER,PLAYER_STATE.SEEK,this.player.currentTime));
    }

    doOnPlayerResize(bounce) 
    {
        //this.player.style.width = 
    }
    doCueChange(data) 
    {
        console.log(data);
    }

    doEnterFullscreen()
    {
        this.enterFullscreen();
    } 
    
    doExitFullscreen()
    {
        this.exitFullscreen();
    } 

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//PUBLIC          
//
//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    doUnLoadStream()
    { 
        this.vtts = null;
        //if(this.player) this.player.src = "";
    }

    doLoadStream(source)
    {
        this.player.src = source.src;
        this.player.autoplay= (this.info.isAutoPlay) ? "autoplay" : "";

    }

    getSource(vodObject)
    { 
        let source = new Object();
        source.src = vodObject.vodUrl;
        this.loadVtt(vodObject.vttPath);
        return source;
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
        this.player.currentTime = t;
    }

    doPlaybackSpeed(spd)
    {
        this.player.playbackRate = spd;
        return true;
    }

    doSetVolume(pct)
    { 
        this.player.volume = pct;
        this.doOnVolumeChanged(); 
    }
    
    
    getCurrentVolume()
    {
        if(this.player==null) return 0;
        return this.player.volume;
    }
    
    doGetCurrentPlayTime()
    {
        if(this.player==null) return 0;
        if(this.info.duration==-1) return 0;
        return this.player.currentTime;
    }
    
   

    getDuration()
    {
        if(this.player==null) return 0;
        var d = -1;
        if(this.player.duration == null || String(this.player.duration) == "NaN" || this.player.duration == 0 || this.info.playType == PLAY_TYPE.LIVE_TM)
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


}

    


