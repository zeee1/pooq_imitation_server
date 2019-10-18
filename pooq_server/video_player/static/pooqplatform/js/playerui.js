
class PlayerUI extends ComponentCore
{
	constructor(body) 
	{
     	super(body);
        this.uis = null;
        this.topBar = null;
        this.bottomBar = null;
        this.topArea = null;
        this.bottomArea = null;
        this.uiArea = null;
        this.viewArea = null;
        this.setupArea = null;
        this.playArea = null;
        this.loadingSpiner = null;
        this.initImage = null; 
        this.uiBoxes= new Array();
        this.seekBox = null;
        this.playBox = null;
        this.volumeBox = null;
        this.functionBox = null;
        this.shareBox = null;
        this.infoBox = null;
        this.viewBox = null;
        this.uiBox = null;
        this.setupBox = null;
        this.adBox = null;
        this.brandsBox = null;
        this.nextEpisodeBox = null;  
        this.previewBox=null; 
        this.rxPlayerUIController = null;
        this.rxPlayerUIResizer = null;
        this.isView = true;
        this.isUiInit= false;
        this.vodObject = null;
        this.metaObject = null;
        this.playType = "";
        this.streamType = "";
        this.finalPlayerSize = new jarvis.Rectangle(0,0,0,0);

        this.isListMode = false;
        this.isPlay = false;
        this.isInitPlay = false;
        this.isRemoteMode = false;
        this.isHalfBottomMode = true;
        this.isTabControlMode = false;
        this.isFullScreen = false;
        this.isComplete = false;
        this.isDataLoading = false;
    }

    init(id)
    {   
        this.createElements(id);
        this.createObservable();
        this.setupEvent();
        this.setPause();
        this.setUIView(false);
        this.onResize();
        return super.init();
    }
    
    remove()
    {   
        super.remove();
        if(this.rxPlayerUIResizer) this.rxPlayerUIResizer.unsubscribe();
        if(this.rxPlayerUIController) this.rxPlayerUIController.unsubscribe();
        this.rxPlayerUIController = null;
        this.rxPlayerUIResizer = null;
        this.timeBox.remove();
    }
    
    createElements(id)
    {   
        let elementProvider = new PlayerBody(this.body,id);
        elementProvider.init();
        elementProvider.writeHTML();
        super.createElements(elementProvider);

        this.uis = elementProvider.getElement("uis");
        this.topBar = elementProvider.getElement("topBar");
        this.bottomBar = elementProvider.getElement("bottomBar");
        this.topArea = elementProvider.getElement("topArea");
        this.bottomArea = elementProvider.getElement("bottomArea");
        this.uiArea = elementProvider.getElement("uiArea");
        this.viewArea = elementProvider.getElement("viewArea");
        this.playArea = elementProvider.getElement("playArea");
        this.addOnArea = elementProvider.getElement("addOnArea");
        this.setupArea = elementProvider.getElement("setupArea");
        this.initImage = elementProvider.getElement("initImage"); //new jarvis.ImageLoader(elementProvider.getElement("initImage"));
        this.loadingSpiner = new LoadingSpiner(elementProvider.getElement('loadingSpiner'));
        this.viewBox = new ViewBox(this.viewArea,this.delegate);
        this.seekBox = new SeekBox(elementProvider.getElement("seekArea"),this.delegate);
        this.playBox = new PlayBox(this.playArea,this.delegate);
        this.volumeBox = new VolumeBox(this.playArea,this.delegate);
        this.functionBox = new FunctionBox(elementProvider.getElement("functionArea"),this.delegate);
        this.shareBox = new ShareBox(elementProvider.getElement("shareArea"),this.delegate);
        this.infoBox = new InfoBox(elementProvider.getElement("infoArea"),this.delegate);
        this.previewBox = new PreviewBox(elementProvider.getElement("previewArea"),this.delegate);

        this.setupBox = new SetupBox(this.setupArea,this.delegate);
        this.brandsBox = new BrandsBox(this.uiArea,this.delegate);
        this.uiBox = new UiBox(this.uiArea,this.delegate);
        this.adBox = new AdBox(this.addOnArea,this.delegate);
        this.nextEpisodeBox = new NextEpisodeBox(this.addOnArea,this.delegate);
       

        this.uiBoxes.push(this.seekBox);
        this.uiBoxes.push(this.playBox);
        this.uiBoxes.push(this.volumeBox);
        this.uiBoxes.push(this.functionBox);
        this.uiBoxes.push(this.shareBox);
        this.uiBoxes.push(this.infoBox);
        this.uiBoxes.push(this.setupBox);
        this.uiBoxes.push(this.brandsBox);
        this.uiBoxes.push(this.uiBox);
        this.uiBoxes.push(this.adBox);
        this.uiBoxes.push(this.nextEpisodeBox);
        this.uiBoxes.push(this.previewBox);
        this.uiBoxes.push(this.viewBox);
        this.excuteUIBox('init');

       
    }

    excuteUIBox(command,args)
    {
        for(var i = 0; i< this.uiBoxes.length; ++i)
        {
            var ui = this.uiBoxes[i];
            args ? ui[command].apply(ui,args) : ui[command].apply(ui);
        }
    }

    setupEvent()
    {
        super.setupEvent();
        jarvis.lib.addEventListener(this.uis,"mousemove",this.onUIView.bind(this));
        jarvis.lib.addEventListener(this.uiBox.body,"click",this.onUIClick.bind(this));
        this.attachEvent(this.body,"resize",this.onResize.bind(this));
        let that = this;
        this.seekBox.uiDelegate.subscribe
        (
            this.uiBox.sendEvent.bind(this.uiBox)
        ); 
    }

    setTabControlMode(tabControlMode)
    {
        this.isTabControlMode = tabControlMode;
        this.onUIView();
    }

    clearEvent()
    {
        super.clearEvent();
        jarvis.lib.removeEventListener(this.uis,"mousemove",this.onUIView.bind(this));
        jarvis.lib.removeEventListener(this.uiBox.body,"click",this.onUIClick.bind(this));
        
    }
    onUIClick(e)
    {
        this.onUIView();
        this.setupBox.setUIView(false);
    }

    reset()
    {
        this.excuteUIBox('reset');
        this.isHalfBottomMode = true;
        this.needResize();
    }

    setMode(mode)
    {
        if(mode == PLAYER_MODE.CONDENSATION) this.setupBox.setUIView(false);
        this.excuteUIBox('setMode',[mode]);
        this.needResize();
    }

    updatedMeta(metaObject)
    {
        this.metaObject = metaObject;
        this.excuteUIBox('updatedMeta',[metaObject]);
    }

    loadedMeta(metaObject)
    {
        this.metaObject = metaObject;
        this.initImage.src =this.metaObject.initImage;
        //this.initImage.load(this.metaObject.initImage);
        this.excuteUIBox('loadedMeta',[metaObject]);
        this.initImage.style.display="block";  

    }

    load(vodObject)
    {
        this.isPlay = false;
        this.isComplete = false;
        this.isInitPlay = false;
        this.vodObject = vodObject;
        this.isHalfBottomMode = (this.vodObject.previewData != null) ? false : true;
        this.excuteUIBox('load',[vodObject]);
        this.needResize();
        this.isView = false;
        this.onUIView();

    }

    sendStatus(status)
    {

        this.excuteUIBox('sendStatus',[status]);
        switch(status.state)
        { 

            case PLAYER_STATE.CAST_INITED:
                this.needResize();
                break;
            case PLAYER_STATE.REMOTE_CHANGED:
                this.setRemoteChanged(status.value.isRemoteMode);
                break;
            case PLAYER_STATE.READY:
                this.setReady(status.value);
                break;
            case PLAYER_STATE.PLAY_START:
                this.setPlayStart();
                break;
            case PLAYER_STATE.PLAY:
                this.setPlay();
                break;
            case PLAYER_STATE.PAUSED:
                this.setPause();
                if(this.isDataLoading == false)
                {
                    this.setLoading(false);
                    this.excuteUIBox('sendStatus',[new UIStatus(STATUS_TYPE.PLAYER,PLAYER_STATE.STALLED)]);
                }
                
                break;
            case PLAYER_STATE.FINISHED:
                this.setComplete();
                break;
            case PLAYER_STATE.RESIZE:
                //this.setResize(status.value);
                break;
            case PLAYER_STATE.DATA_LOAD:
                this.isDataLoading = true;
            case PLAYER_STATE.LOAD:
            case PLAYER_STATE.STALL:
                this.setLoading(true);
                break;

            case PLAYER_STATE.DATA_LOADED:
                this.isDataLoading = false;
            case PLAYER_STATE.LOADED:
            case PLAYER_STATE.STALLED:
                this.setLoading(false);
                break;
            case PLAYER_STATE.FULLSCREEN_EXIT:
                this.onFullScreenChanged(false);
                break;
            case PLAYER_STATE.FULLSCREEN_ENTER:
                this.onFullScreenChanged(true);
                break;

        }
        
    }

    onFullScreenChanged(isFullScreen)
    {
        this.isFullScreen = isFullScreen;
        if(this.rxPlayerUIResizer) this.rxPlayerUIResizer.unsubscribe();
        this.rxPlayerUIResizer = Rx.Observable.timer(200).timeInterval().take(1).subscribe
        (
            this.onForceResize.bind(this)
        );
    }

    onForceResize()
    {
        this.onResize();
        this.needResize();
    }

    onUIView()
    {
        if(this.isView == false) this.setUIView(true);   
        if(this.rxPlayerUIController) this.rxPlayerUIController.unsubscribe();
        if(this.isTabControlMode == true) return;
        this.rxPlayerUIController = Rx.Observable.timer(3000).timeInterval().take(1).subscribe
        (
            this.setUIView.bind(this,false)
        );
    }
    
    setReady(value)
    {
        this.playType = value.playType;
        this.streamType = value.streamType;
        this.loadingSpiner.stop();
        this.setInitImageView();
        
    }
    setRemoteChanged(isRemoteMode)
    {
        this.isRemoteMode = isRemoteMode;
        this.excuteUIBox('setRemoteChanged',[isRemoteMode]);
        this.setInitImageView();
    }

    setPlayStart()
    {
       this.isInitPlay = true;
       this.setInitImageView();
    }

    setComplete()
    {
        this.isComplete = true;
        document.body.style.cursor = "auto";
        this.setInitImageView();
    }

    setInitImageView()
    {
        var isView = false;
        if(this.isRemoteMode == true) isView = true;
        if(this.streamType == STREAM_TYPE.AUDIO) isView = true;
        if(this.isInitPlay == false) isView = true;
        if(this.isComplete == true) isView = true;

        if(this.playType == PLAY_TYPE.LIVE || this.playType == PLAY_TYPE.LIVE_TM)
        {
            isView = (this.isPlay) ? isView : true;
        }  

        this.initImage.style.display = (isView == true) ? "block" : "none";
    }

    setPlay()
    {
        this.isPlay = true;
        this.setInitImageView();
    }
    
    setPause()
    {
        this.isPlay = false;
        this.setInitImageView();
    }

    setLoading(isLoading)
    {
        (isLoading) ? this.loadingSpiner.play() : this.loadingSpiner.stop();
    }

    needResize()
    {

        if(this.finalPlayerSize == null) return;
        let status = new UIStatus(STATUS_TYPE.PLAYER,UI_STATE.RESIZE,this.finalPlayerSize);
        this.excuteUIBox('sendStatus',[status]);
        // this.initImage.resize();
        this.setResizeTop(this.finalPlayerSize);
        this.setResizeBottom(this.finalPlayerSize);
    }

    onResize()
    {
        var bounce=jarvis.lib.getAbsoluteBounce(this.body);
        if(bounce.width == this.finalPlayerSize.width && bounce.height == this.finalPlayerSize.height) return;
        let status = new UIStatus(STATUS_TYPE.PLAYER,UI_STATE.RESIZE,bounce);
        this.excuteUIBox('sendStatus',[status]);
        this.setResize(bounce);
       
    }

    setResize(rect)
    {
        this.finalPlayerSize = rect;
        if(this.isUiInit == false)
        {
            this.excuteUIBox('uiInit');
            this.isUiInit = true;

        }
       // this.initImage.resize();
        this.setResizeTop(rect);
        this.setResizeBottom(rect);

    }

    setResizeTop(rect)
    {
        let shareSize = jarvis.lib.getAbsoluteBounce(this.shareBox.body);
        this.shareBox.body.style.right = DYNAMIC_SIZE.AREA_MARGIN + "px";
        this.infoBox.body.style.left = DYNAMIC_SIZE.AREA_MARGIN + "px";
        this.infoBox.body.style.width = (rect.width - shareSize.width - (DYNAMIC_SIZE.AREA_MARGIN *3)) + "px";
        this.infoBox.setResize();
    }

    setResizeBottom(rect)
    {

        let volumeSize = jarvis.lib.getAbsoluteBounce(this.volumeBox.body);
        let functionSize = jarvis.lib.getAbsoluteBounce(this.functionBox.body);
        this.functionBox.body.style.right = DYNAMIC_SIZE.AREA_MARGIN + "px";
        
        this.playArea.style.left = DYNAMIC_SIZE.AREA_MARGIN + "px";
        this.seekBox.body.style.width = rect.width  + "px"; 
        this.setSetupPosition();
    }

    setSetupPosition()
    {
        let bodySize = jarvis.lib.getAbsoluteBounce(this.body);
        let setupBtnSize = jarvis.lib.getAbsoluteBounce(this.functionBox.btnSetup);
        var pos = this.finalPlayerSize.width - (setupBtnSize.x - bodySize.x) - 65;
        pos = pos < DYNAMIC_SIZE.AREA_MARGIN ? DYNAMIC_SIZE.AREA_MARGIN : pos;
        this.setupBox.body.style.right = pos + "px";    
    }

    toggleSetupView()
    {
        this.setSetupPosition();
        this.setupBox.toggleUIView();
    }

    getSetupView()
    {
        return this.setupBox.isView;
    }

    openSetupList(key)
    {
        this.setUIView();
        this.setupBox.openSubList(key);
    }

    setUIView(isView = true)
    {

        if(this.isView != isView)
        {
            this.isView = isView;
            if(isView)
            {
                jarvis.lib.removeAttribute(this.topArea,'animate-out top-area-hidden');
                jarvis.lib.removeAttribute(this.bottomArea,'animate-out bottom-area-hidden bottom-area-half');
                jarvis.lib.removeAttribute(this.uiArea,'animate-out ui-area-hidden');
                jarvis.lib.removeAttribute(this.setupArea,'animate-out setup-area-hidden');
                jarvis.lib.removeAttribute(this.topBar,'animate-out top-bar-hidden');
                jarvis.lib.removeAttribute(this.bottomBar,'animate-out bottom-bar-hidden');
                jarvis.lib.addAttribute(this.topArea,'animate-in');
                jarvis.lib.addAttribute(this.bottomArea,'animate-in');
                jarvis.lib.addAttribute(this.uiArea,'animate-in');
                jarvis.lib.addAttribute(this.setupArea,'animate-in');
                jarvis.lib.addAttribute(this.topBar,'animate-in');
                jarvis.lib.addAttribute(this.bottomBar,'animate-in');
                if(this.isHalfBottomMode == true) jarvis.lib.addAttribute(this.bottomArea,'bottom-area-half');
                document.body.style.cursor = "auto";
            } 
            else
            {
                jarvis.lib.removeAttribute(this.topArea,'animate-in');
                jarvis.lib.removeAttribute(this.bottomArea,'animate-in bottom-area-half');
                jarvis.lib.removeAttribute(this.uiArea,'animate-in');
                jarvis.lib.removeAttribute(this.setupArea,'animate-in');
                jarvis.lib.removeAttribute(this.topBar,'animate-in');
                jarvis.lib.removeAttribute(this.bottomBar,'animate-in');
                jarvis.lib.addAttribute(this.topArea,'animate-out top-area-hidden');
                jarvis.lib.addAttribute(this.bottomArea,'animate-out bottom-area-hidden');
                jarvis.lib.addAttribute(this.uiArea,'animate-out ui-area-hidden');
                jarvis.lib.addAttribute(this.setupArea,'animate-out setup-area-hidden');
                jarvis.lib.addAttribute(this.topBar,'animate-out top-bar-hidden');
                jarvis.lib.addAttribute(this.bottomBar,'animate-out bottom-bar-hidden');
                document.body.style.cursor = (this.isFullScreen==true && this.isListMode==false && this.isComplete==false) ? "none" :"auto";
            }

            let  evt = new UIEvent(UI_EVENT.UI_OPEN_CAHNGED,this.isView);
            this.delegate.next(evt);
        }
    }
    
}

class PlayerUIBox extends ComponentCore
{
    constructor(body,delegate = new Rx.Subject()) 
    {
        super(body,delegate);
        this.uiDelegate = new Rx.Subject();
        this.vodObject = null;
        this.metaObject = null;
        this.currentMode = "";
        this.isRemoteMode = false;
    }

    init(id)
    {   
        super.init();
        this.reset();
        return this.delegate;
    }

    uiInit()
    {
       
        
    }

    reset()
    {
        this.uiReset();
        this.vodObject = null;
        //this.metaObject = null;
    }

    uiReset()
    {
        
    }
    
    updatedMeta(metaObject)
    {
        if(metaObject!=null) this.metaObject = metaObject;
    }

    loadedMeta(metaObject)
    {
        this.metaObject = metaObject;
    }

    load(vodObject)
    {   
        this.uiReset();
        this.vodObject = vodObject;
    }

    setRemoteChanged(isRemoteMode)
    {
        this.isRemoteMode = isRemoteMode;
    }

    setMode(mode){
        this.currentMode = mode;
    }
    sendStatus(status){}
    sendEvent(event){}
    
}




