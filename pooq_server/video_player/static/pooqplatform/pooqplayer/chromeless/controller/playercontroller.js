
class PlayerController
{
	constructor(delegate) 
	{
        this.delegate = delegate;
  		this.info = UIManager.getInstance();
        this.playerInfo = null;
        this.vodObject = null;
        this.screen = null;
  		this.player = null;
        this.playerUI = null;
        this.listBox =null;
        this.bgImage = null;
        this.playerScreen = null;
        this.screen = null;
        this.btnOpenArea = null;
        this.btnListOpen = null;
        this.msgWindows = new Array();
        this.completeBox = null;

        this.isEpisodeComplete = false;
        this.isListMode = false;
        this.rxListBoxOpener = null;

        this.isFocus = true;
        this.isClick = false;
        this.isInitPlay = false;
        this.finalTarget = null;
        this.contextMenu = null;
        this.contextIdx = 0;
    }

    init(body)
    {
        this.info.init();
       	this.createElements(body);
        this.setupEvent();
        this.playerUI.setRemoteChanged(this.player.getRemoteMode());
        if(DataManager.getInstance().getSetupValue(SHARED_KEY.INIT_USER) == true)
        {
            this.isInitPlay = true;
            this.createUserGuide();
        }
        //if(DataManager.getInstance().getSetupValue(SHARED_KEY.AUTO_PLAY_INFO) == true) this.createAutoPlayTip();
        jarvis.lib.excuteDelegate(this.delegate,"onEvent",[jarvis.EVENT.READY]);

    }

    setupEvent()
    {
        jarvis.lib.addEventListener(document,"mousedown",this.onDown.bind(this));
        //jarvis.lib.addEventListener(this.body,"mousedown",this.onDown.bind(this));
        jarvis.lib.addEventListener(this.body,"focusin",this.onFocusIn.bind(this));
        jarvis.lib.addEventListener(this.body,"focusout",this.onFocusOut.bind(this));
        this.body.addEventListener('contextmenu',this.onContextMenu.bind(this));

    }
    removeContextMenu()
    {
        if(this.contextMenu == null) return;
        this.contextMenu.removeAni();
        this.contextMenu = null;
    }

    onContextMenu(e)
    {
        this.removeContextMenu();
        this.contextIdx ++;
        if(this.contextIdx%2 == 0) return;
        this.contextMenu = new ContextMenu(document.body);
        this.contextMenu.init();
        this.contextMenu.getBody().style.top = jarvis.lib.getMouseY(e) + "px";
        this.contextMenu.getBody().style.left = jarvis.lib.getMouseX(e) + "px";
        e.preventDefault();
    }

    onDown(e)
    {
        let posX= jarvis.lib.getMouseX(e);
        let posY= jarvis.lib.getMouseY(e);
        let bounce = jarvis.lib.getAbsoluteBounce(this.screen);
        this.isFocus = jarvis.lib.hitTestPoint(new Point(posX,posY),bounce);
        if(this.isFocus == false) return;
        this.removeContextMenu();
        this.isClick = true;
    }
    onFocusIn(e)
    {
        let tg = jarvis.lib.getEventTarget(e);
        if(this.isClick == false &&  this.finalTarget != tg)
        {
            jarvis.lib.removeAttribute(this.body,'screen-tab-out');
            this.playerUI.setTabControlMode(true);
        }
        this.finalTarget = tg;
        this.isClick = false;
        
    }
    onFocusOut(e)
    {
        jarvis.lib.addAttribute(this.body,'screen-tab-out');
        this.playerUI.setTabControlMode(false);
    }

    createUserGuide()
    {
        var guide = new UserGuide(this.screen).init();
    }

    createAutoPlayTip()
    {
        if(jarvis.lib.isSafari()==true) return;
        if(DataManager.getInstance().getSetupValue(SHARED_KEY.AUTO_PLAY) == true) return;
        var tip = new InfoTip(this.screen)
        tip.init();
        tip.setMsg(INFO_MSG.AUTO_PLAY,SHARED_KEY.AUTO_PLAY_INFO);
    }

    remove()
    {
        this.player.remove();
        this.playerUI.remove();
        this.listBox.remove();
        this.player = null;
        this.playerUI = null;
        this.listBox = null;
        this.info = null;
    }

    createElements(body)
    {
        let that = this;
        this.body = body;
        jarvis.lib.addAttribute(this.body,'screen-tab-out');
        this.screen = document.createElement("div");
        jarvis.lib.addAttribute(this.screen,'screen');
        this.body.appendChild(this.screen);

        let id = jarvis.lib.generateID("POOQ_PLAYER_");
        let elementProvider = new ScreenBody(this.screen);
        elementProvider.init();
        elementProvider.writeHTML();
        this.playerScreen = elementProvider.getElement("player");
        this.playerScreen.id = id;
        this.playerScreen.ani = false;

        this.bgImage = elementProvider.getElement("bgImage");
        this.btnOpenArea = elementProvider.getElement("btnOpenArea");
        this.btnListOpen = elementProvider.getElement("btnListOpen");
        this.playerUI = new PlayerUI(this.playerScreen);
        this.player = new AwsomePlayer(this.playerScreen);
        this.listBox = new ListBox(elementProvider.getElement("listBox"));
        this.btnOpenArea.style.display = "none";

        let playerUIDelegate = this.playerUI.init(id);
        let playerDelegate = this.player.init(id);
        let listBoxDelegate = this.listBox.init();
        playerUIDelegate.getThumb = function(t){return that.player.getThumb(t);}
        playerUIDelegate.getScreenRatio = function(){return that.player.getScreenRatio();}
        playerUIDelegate.getPlayRate = function(){return that.player.getPlayRate();}

        playerDelegate.subscribe
        (
            {
                next(value)
                {
                    that.playerUI.sendStatus(value);
                    that.sendStatus(value);     
                }
            }
        ); 

        playerUIDelegate.subscribe
        (
            {
                next(value)
                {
                    that.player.sendEvent(value);
                    that.sendEvent(value);          
                }
            }
        ); 

        listBoxDelegate.subscribe
        (
            {
                next(value)
                {
                    that.sendEvent(value);
                }
            }
        );

        jarvis.lib.addEventListener(this.btnListOpen,"click",this.onListOpen.bind(this));
        jarvis.lib.addEventListener(this.screen,"resize",this.onResize.bind(this));
        this.player.castPlayerInit();
    }

    sendEvent(value)
    {

        switch(value.type)
        {
            case SETUP_EVENT.OPEN_GUIDE:
                this.createUserGuide();
                break;
            case SETUP_EVENT.OPEN_SETUP:
                this.playerUI.toggleSetupView();
                this.setOpenBtnArea();
                break;
            case SETUP_EVENT.AUTO_PLAY_CHANGE:
                DataManager.getInstance().setSetupValue(SHARED_KEY.AUTO_PLAY,value.value);
                break;
            case PLAYER_EVENT.SCREEN_RATIO_CHANGE:
                DataManager.getInstance().setSetupValue(SHARED_KEY.SCREEN_RATIO,value.value);
                break;
            case PLAYER_EVENT.PLAY_RATE_CHANGE:
                DataManager.getInstance().setSetupValue(SHARED_KEY.PLAY_RATE,value.value);
                break;
            case UI_EVENT.QUALITY_CHANGE:
                //this.loadVod(true,value.value, this.player.getCurrentPlayTime());
                this.checkPermission(true,value.value, this.player.getCurrentPlayTime());
                break;
            case UI_EVENT.SKIP_VOD:
                this.next();
                break;
            case UI_EVENT.CHANGE_VOD:
                this.load(value.value);
                break;
            case UI_EVENT.DVR_CHANGE:
                this.checkPermission(true,null,-1,value.value);
                break;
            case UI_EVENT.EPISODE_COMPLETE:
                this.isEpisodeComplete = true;
                break;   
            case UI_EVENT.NEXT_EPISODE_COMPLETE:
                this.createCompleteBox(COMPLETE_TYPE.EPISODE,value.value);
                break;
            case UI_EVENT.OPEN_POPUP:  
                this.onOpenPopup();

                break;
            case UI_EVENT.LIST_BOX_OPEN_CAHNGED:
                this.onListOpenChanged(value.value);
                break;
            case UI_EVENT.SELECTED_FUNCTION:
                this.onCallFunction(value.value);
                break;
            case UI_EVENT.UI_OPEN_CAHNGED:
                this.onUIOpenChanged(value.value);
                break;
            case UI_EVENT.LIST_STATUS_CAHNGED:
                this.onListBoxStatusChanged(value.value);
                break;
            case UI_EVENT.UPDATE_META:
                this.onUpdateMeta();
                break;            
            
        }
    }

    sendStatus(status)
    {
        if(status.type == STATUS_TYPE.PLAYER_ERROR) this.playError(status);
        
       // if(status.state != PLAYER_STATE.TIME_CHANGE) console.log(status);
        switch(status.state)
        {

            case PLAYER_STATE.CAST_INITED:
                this.player.castPlayerInited();
                break;

            case PLAYER_STATE.CAST_DISABLE:
                this.onCastDisable();
                break;
            case PLAYER_STATE.PLAY_START:
                this.isEpisodeComplete = false;
                break;
            case PLAYER_STATE.PERMISSION_INVALID:
            case PLAYER_STATE.PERMISSION_COMPLETE:
                this.loadVod(true);
                break;
            case PLAYER_STATE.PERMISSION_CHECK:
                this.checkPermission(null,null,null,null,false);
                break;
            case PLAYER_STATE.FINISHED:
                if(this.isEpisodeComplete == false) this.next();
                break;

            case PLAYER_STATE.FULLSCREEN_ENTER:
                this.onFullScreenChanged(true);
                break;
            case PLAYER_STATE.FULLSCREEN_EXIT:
                this.onFullScreenChanged(false);
                break;
        }

    }
    
    onListBoxStatusChanged(isAble)
    {
        this.btnOpenArea.style.display = (isAble) ? "block" : "none";
    }

    onFullScreenChanged(isFullScreen)
    {
        this.listBox.setFullScreen(isFullScreen);
    }
    
    setOpenBtnArea()
    {
        var isOpen = this.playerUI.getSetupView();
        if(isOpen && this.isListMode==false)
        {
            let bounce = jarvis.lib.getAbsoluteBounce(this.screen);
            let minSize = 675;
            if(bounce.height < minSize)
            {
                this.btnOpenArea.style.marginTop = (-42 + ((bounce.height - minSize)/2)) + "px";
            }else
            {
                this.btnOpenArea.style.marginTop = null;
            }
        }
        else
        {
            this.btnOpenArea.style.marginTop = null;
        }

    }
    onOpenPopup()
    {
        if(this.playerInfo == null) return;
        this.player.pause();
        var playData = new Object();
        playData.type = this.playerInfo.vodObject.type;
        playData.contentID = this.playerInfo.vodObject.contentID;
        playData.resolution = this.playerInfo.vodObject.resolution;
        playData.isDVR = this.playerInfo.vodObject.isDVR;
        playData.isAutoPlay = true;
        openPopupPlayer(playData);
    }

    isCondensationModeAble()
    {
        if(this.player.info.isRemoteMode == true) return false;
        return true;
    }

    setMode(mode)
    {
        this.playerUI.setMode(mode);
        if(this.completeBox != null) this.completeBox.setMode(mode);
        this.listBox.setMode(mode);
    }

    loadCustomVod(vodObject)
    {
        let meta = new MetaObject();
        this.playerUI.loadedMeta(meta);
        this.player.loadedMeta(meta);
        this.playerUI.load(vodObject);
        this.player.load(vodObject);  
        this.vodObject = vodObject;
    }

    load(vodObject=this.playerInfo.vodObject)
    {
        this.clearCompleteBox();
        this.clearMsgWindows();
        this.listBox.reset();
        this.playerUI.reset();
        this.player.unload();
        this.player.dataLoad();
        if(this.playerInfo != null) this.playerInfo.remove();
        this.playerInfo = new PlayerInfo(vodObject);

        let that = this;
        var delegate=function(){}; 
            delegate.prototype = {
                onEvent : function(e,value)
                {
                    switch(e)
                    {
                        case jarvis.EVENT.ALARM:
                            that.player.dataLoaded();
                            that.loadAlarmPopup(value.postData,value);
                            break;
                        case jarvis.EVENT.UPDATE:
                            that.updatedMeta()
                            break;
                        case jarvis.EVENT.COMPLETE:
                            that.player.dataLoaded();
                            that.loadedMeta()
                            break;
                        case jarvis.EVENT.ERROR:
                            that.player.dataLoaded();
                            that.loadError(value);
                            break;
                    }      
                }
            }

        this.playerInfo.init(new delegate());
        
    }
    onUpdateMeta()
    {
        if(this.playerInfo == null) return;
        this.playerInfo.updateMeta();
    }
    updatedMeta()
    {
        this.playerUI.updatedMeta(this.playerInfo.metaObject);
    }

    loadedMeta()
    {
        this.bgImage.src = this.playerInfo.metaObject.getInitImage();
        this.playerUI.loadedMeta(this.playerInfo.metaObject);
        this.player.loadedMeta(this.playerInfo.metaObject);

        this.next();
    }

    retryVod(vodObject=this.playerInfo.vodObject)
    {
        this.clearCompleteBox();
        this.clearMsgWindows();
        this.playerInfo.vodObject = vodObject;
        this.player.dataLoad();
        this.playerInfo.load();
    }

    checkPermission(isAutoPlay=null,resolution=null,playTime = -1,isDVR=null,isRedirect = true)
    {
        if(this.playerInfo == null) return;
        if(this.playerInfo.vodObject.isAllow == false && isRedirect == true && isDVR == null ) this.loadVod(isAutoPlay,resolution,playTime ,isDVR);
        if(this.playerInfo.vodObject.isAllow == true || isDVR != null ) this.playerInfo.checkPermission(isAutoPlay,resolution,playTime,isDVR,isRedirect);
        
    }

    loadVod(isAutoPlay=null,resolution=null,playTime = -1,isDVR=null)
    {
        this.clearCompleteBox();
        this.clearMsgWindows();
        if(this.playerInfo == null) this.playerInfo = new PlayerInfo(new VodObject());
        this.playerInfo.vodObject.resolution = (resolution!=null) ? resolution : this.playerInfo.vodObject.resolution;
        isDVR = (isDVR!=null) ? isDVR : this.playerInfo.vodObject.isDVR;
        this.playerInfo.vodObject.setDVR(isDVR);
        this.playerInfo.vodObject.initTime = (playTime!=-1) ? playTime : this.playerInfo.vodObject.initTime;
        this.playerInfo.vodObject.isAutoPlay = (isAutoPlay!=null) ? isAutoPlay : this.playerInfo.vodObject.isAutoPlay;
        this.player.dataLoad();
        this.playerInfo.load();
    }

    next()
    {
        if(this.playerInfo.isComplete())
        {
            this.playComplete();
            return;
        }
        let vodObject = this.playerInfo.getCurrentVod("");  
        if(this.vodObject != null)
        {
            if(vodObject.type != VOD_TYPE.AD && this.playerInfo.isRechangePreroll() == true)
            {
                this.playerInfo.loadRechargePrerolls();
                return;
            }
            if(
                vodObject.type != VOD_TYPE.AD &&
                this.vodObject.type != VOD_TYPE.AD &&
                vodObject.contentID != this.vodObject.contentID)
            {
                jarvis.lib.excuteDelegate(this.delegate,"onEvent",[jarvis.EVENT.UPDATE,vodObject]);
            }
        }
        this.vodObject = vodObject;
        if(this.isInitPlay == true)
        {
            this.vodObject.isAutoPlay = false;
            this.isInitPlay = false;
        }
        //vodObject.vodUrl = "";
        this.listBox.loadedMeta(this.playerInfo.metaObject,vodObject);
        this.playerUI.load(vodObject);
        this.player.load(vodObject);  

        if(vodObject.vodUrl == "") this.playError({state:PLAYER_ERROR.DISABLE}); 
        if(typeof isPlayAd == "undefined") return;
        if(this.vodObject.type == VOD_TYPE.AD)
        {
            isPlayAd(true);
        }
        else
        {
            isPlayAd(false);
        }
        
    }

    createCompleteBox(type,value)
    {
        if( this.playerInfo == null ) return;
        this.clearCompleteBox();
        let that = this;
        let completeBox = new CompleteBox(this.screen);
        completeBox.init(type,DataManager.getInstance().mode,this.playerInfo.vodObject,value).subscribe
        (
            {
                next(e)
                {
                    that.sendEvent(e);
                    that.player.sendEvent(e);
                }
            }
        );
        this.completeBox = completeBox;
    }

    clearCompleteBox()
    {
        if(this.completeBox==null) return;
        this.completeBox.onClose();
        this.completeBox = null;
    }

    clearMsg(msg)
    {
        var newMsgWindows = new Array();
        
        for(var i=0;i<this.msgWindows.length;++i)
        {
            if(msg == this.msgWindows[i])
            {
                //msg.onClose();
            }
            else
            {
                newMsgWindows.push(msg);
            }
        }
        this.msgWindows = newMsgWindows;
    }

    clearMsgWindows()
    {
        for(var i=0;i<this.msgWindows.length;++i)
        {
            this.msgWindows[i].onClose();
        }
        this.msgWindows = new Array();
    }

    loadError(result,vod = this.playerInfo.vodObject)
    {
        if(result.isRedirect == false) this.player.unload();
        this.getMsgWindow("load").setApiResultMsg(result);
    }

    playError(status)
    {   
        this.playerUI.reset();
        this.getMsgWindow("retryVod").setStatusMsg(status);
    }

    playComplete(value=null)
    { 
        if(this.playerInfo.vodObject.postData != null)
        {
            this.loadAlarmPopup(this.playerInfo.vodObject.postData);
        }
        else if(this.isEpisodeComplete == false)
        {
            switch(this.playerInfo.vodObject.type)
            {
                case VOD_TYPE.CLIP :
                    this.createCompleteBox(COMPLETE_TYPE.CLIP,this.playerInfo.metaObject);
                    break;
                default:
                    this.createCompleteBox(COMPLETE_TYPE.RECOMMEND,this.playerInfo.metaObject);
                    break;
            }
        }
    }

    loadAlarmPopup(userInfo,vod)
    {
        var msgWindow = this.getMsgWindow().setPreviewCompleteMsg(userInfo);
    }
    
    getMsgWindow(callback)
    {
        let that = this;
        var msg = new MsgWindow(this.screen);
        msg.init().subscribe
        (
            {
                next(e)
                {
                    that.onCallFunction(e.row.key,callback);
                    that.clearMsg(msg);
                }
            }
        ); 
        this.msgWindows.push(msg);
        return msg;
    }

    onCallFunction(key,callback)
    {
        //gotoSignup()
        switch(key)
        {
            case FUNCTION_BTN_CODE.cancel:
            case FUNCTION_BTN_CODE.confirm:
                break;

            case FUNCTION_BTN_CODE.verify:
                this.player.setFullScreen(false);
                gotoAuthorization();
                break;
                
            case FUNCTION_BTN_CODE.retry:
                this[callback]();
                break;
            case FUNCTION_BTN_CODE.eventpurchase:
                this.player.pause();
                this.player.setFullScreen(false);
                showEventVoucherPopup();
                break;
            case FUNCTION_BTN_CODE.login:
                this.player.pause();
                this.player.setFullScreen(false);
                showLoginLayout();
                break;
            case FUNCTION_BTN_CODE.join:
                this.player.setFullScreen(false);
                gotoSignup();
                break;
            case FUNCTION_BTN_CODE.purchase:
                this.player.setFullScreen(false);
                this.player.pause();
                if(this.playerUI.vodObject != null && this.playerUI.metaObject != null)
                {
                    showVoucherPopup(this.playerUI.vodObject.type,
                                 this.playerUI.vodObject.contentID,
                                 this.playerUI.metaObject.programID,
                                 this.playerUI.metaObject.channelID,
                                 this.playerUI.metaObject.cpid);
                }else
                {
                    showVoucherPopup();
                }
                
                
                break;
            case FUNCTION_BTN_CODE.quality:
                this.playerUI.openSetupList(SETUP_TYPE.QUALITY);
                
                break;
        }     

    }

    onCastDisable()
    {
        if(this.vodObject == null) return;
        var msg = new MsgWindow(this.screen);
        msg.init();
        if(this.vodObject.type == VOD_TYPE.AD) msg.setInfoMsg(INFO_MSG.CAST_DISABLE_AD);
        if(this.vodObject.isRadio == true && this.vodObject.isRadioChannel== true) msg.setInfoMsg(INFO_MSG.CAST_DISABLE_RADIO);
        if(this.vodObject.isRadio == true && this.vodObject.isRadioChannel== false) msg.setInfoMsg(INFO_MSG.CAST_DISABLE_AUDIO);
       
    }

    onResize(needAni = false)
    {

        let bounce = jarvis.lib.getAbsoluteBounce(this.screen);
        if(needAni)
        {
            if(this.playerScreen.ani == false)
            {
                this.playerScreen.ani = true;
                jarvis.lib.addAttribute(this.playerScreen,'animate-in');
            }
            
        }
        else
        {
            this.playerScreen.ani = false;
            jarvis.lib.removeAttribute(this.playerScreen,'animate-in');
        }
        
        if(this.isListMode == false)
        {
            this.playerScreen.style = null;
        }
        else
        {
            let w = bounce.width - DYNAMIC_SIZE.LIST_WIDTH -(DYNAMIC_SIZE.LIST_PLAYER_MARGIN*2);
            if(w < DYNAMIC_SIZE.LIST_PLAYER_MIN_WIDTH) w=DYNAMIC_SIZE.LIST_PLAYER_MIN_WIDTH;
            let h = Math.round(w*9/16);
            let y = Math.round((bounce.height - h)/2);

            this.playerScreen.style.left = DYNAMIC_SIZE.LIST_PLAYER_MARGIN+"px";
            this.playerScreen.style.top = y+"px";
            this.playerScreen.style.width = w+"px";
            this.playerScreen.style.height = h+"px";
        }
        this.setOpenBtnArea();
        this.listBox.setResize(bounce.width);
        if(this.completeBox) this.completeBox.setResize(bounce);
    }

    onUIOpenChanged(isOpen)
    {   
        if(this.isListMode == true)
        {
            this.btnOpenArea.style.opacity = 1;
            return;
        }
        this.btnOpenArea.style.opacity = (isOpen) ? 1 : 0;
    }

    onListOpen()
    {
        this.listBox.toggleUIView();
    }

    onListOpenChanged(isOpen)
    {
        if(this.rxListBoxOpener != null) this.rxListBoxOpener.unsubscribe();
        this.isListMode = isOpen;
        this.playerUI.isListMode = this.isListMode;
        this.setOpenBtnArea();
        if(this.isListMode)
        {
            jarvis.lib.removeAttribute(this.btnOpenArea,'btn-open-area-hidden');
            
        }
        else
        {
            jarvis.lib.addAttribute(this.btnOpenArea,'btn-open-area-hidden');
        }
        this.rxListBoxOpener = Rx.Observable.timer(400).timeInterval().take(1).subscribe
        (
            this.onListOpenComplete.bind(this)
        );
        this.onResize(true);
        this.playerUI.onResize();
        
    }

    onListOpenComplete()
    {
        if(this.isListMode)
        {
            jarvis.lib.removeAttribute(this.btnListOpen,'animate-flip');
            jarvis.lib.addAttribute(this.btnListOpen,'animate-origin');
        }
        else
        {
            jarvis.lib.removeAttribute(this.btnListOpen,'animate-origin animate-flip');
            jarvis.lib.addAttribute(this.btnListOpen,'animate-flip');
        }
        this.rxListBoxOpener = null;
        this.onResize(false);
        this.playerUI.onResize();

    }


}