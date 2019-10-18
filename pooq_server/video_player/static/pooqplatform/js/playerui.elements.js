class BrandsBox extends PlayerUIBox
{
    constructor(body,delegate) 
    {
        super(body,delegate);
        this.isActive = false;
        this.brands = null;
        this.banners = null;
      
    }
    init()
    {   
        this.createElements();
        return super.init();
    }
    
    remove()
    {   
        super.remove();
    }

    createElements()
    {   
        let elementProvider = new BrandsBoxBody(this.body);
        elementProvider.init();
        elementProvider.writeHTML();
        super.createElements(elementProvider); 
    }

    reset()
    {
        super.reset();        
    }
    
    uiReset()
    {
        this.isActive = false;
        this.banners = null;
        this.brands = null;
        this.cell.innerHTML = "";
    }

    load(vodObject)
    {
        super.load(vodObject);
        if(this.vodObject.adObject == null) return;
        if(this.vodObject.adObject.brands.length < 1) return;
        this.banners = new Array();
        this.brands = new Array();
        this.isActive = true;
                
    }
   
    sendStatus(status)
    {
        if(this.isActive == false) return;
        
        switch(status.state)
        {
            case PLAYER_STATE.TIME_CHANGE:
                this.setTime(status.value);
                break;
        }
    }
    
    getBrands(t)
    {
        var brands = new Array();
        for(var i = 0; i< this.vodObject.adObject.brands.length; ++i)
        {
            var brand = this.vodObject.adObject.brands[i];
            if(brand.viewstart<=t && brand.viewend>t)
            {
                brands.push(brand);
            }
        }
        return brands;
    }

    addBrand(brand)
    {
        
        var banner = document.createElement("img");
        jarvis.lib.addAttribute(banner,"banner");
        this.cell.appendChild(banner);
        banner.style.top = (brand.topPos == -1) ? null : brand.topPos;
        banner.style.left = (brand.leftPos == -1) ? null : brand.leftPos;
        banner.style.bottom = (brand.bottomPos == -1) ? null : brand.bottomPos;
        banner.style.right = (brand.rightPos == -1) ? null : brand.rightPos;
        banner.style.width = (brand.imageWidth == -1) ? null : brand.imageWidth;
        banner.style.height = (brand.imageHeight == -1) ? null : brand.imageHeight;
        banner.src = brand.imageUrl;

        this.brands.push(brand);
        this.banners.push(banner);

        jarvis.lib.addEventListener(banner,"click",this.onBannerLink.bind(this));
        
        
    }

    onBannerLink(e)
    {
        let idx = this.banners.indexOf(e.target);
        if(idx == -1) return;
        let brand = this.brands[idx];
        LogManager.getInstance().sendLog(brand.clickTracking); 
        window.open(brand.clickThrough);
    }

    removeBrand(idx)
    {
        this.cell.removeChild(this.banners[idx]);
        
    }

    setTime(t)
    {
        var currentBrands = this.getBrands(t);

        var newBanners = new Array();
        var newBrands = new Array();
        for(var i = 0; i < this.brands.length; ++i)
        {
            if(currentBrands.indexOf(this.brands[i]) == -1)
            {
                this.removeBrand(i);   
            }else
            {
                newBanners.push(this.banners[i]);
                newBrands.push(this.brands[i]);
            }
        }

        this.brands= newBrands;
        this.banners = newBanners;

        for(var i = 0; i< currentBrands.length; ++i)
        {
            if(this.brands.indexOf(currentBrands[i]) == -1) this.addBrand(currentBrands[i]);    
        }
    }
}


class AdBox extends PlayerUIBox
{
    constructor(body,delegate) 
    {
        super(body,delegate);
        this.btnSkip = null;
        this.btnAd = null;
        this.skipTime = -1;
        this.duration = -1;
        this.continueTime = 45;
        this.skipAble = false;
      
    }
    init()
    {   
        this.createElements();
        this.setupEvent();
        return super.init();
    }
    
    remove()
    {   
        super.remove();
    }

    createElements()
    {   
        let elementProvider = new AdBoxBody(this.body);
        elementProvider.init();
        elementProvider.writeHTML();
        super.createElements(elementProvider); 
        this.btnSkip = elementProvider.getElement("btnSkip");
        this.btnAd = elementProvider.getElement("btnAd");
    }

    setupEvent()
    {
        super.setupEvent();
        jarvis.lib.addEventListener(this.btnSkip,"click",this.onSkip.bind(this));
        jarvis.lib.addEventListener(this.btnAd,"click",this.onAdLink.bind(this));

    }

    clearEvent()
    {
        super.clearEvent();
        jarvis.lib.removeEventListener(this.btnSkip,"click",this.onSkip.bind(this));
        jarvis.lib.removeEventListener(this.btnAd,"click",this.onAdLink.bind(this));
    }

    onSkip()
    {
        if(!this.skipAble) return;
        LogManager.getInstance().sendLog(this.vodObject.adObject.skip); 
        this.vodObject.adObject.skip = "";
        this.delegate.next(new UIEvent(UI_EVENT.SKIP_VOD));

    }
    onAdLink()
    {
        LogManager.getInstance().sendLog(this.vodObject.adObject.linkTracking); 
        this.vodObject.adObject.linkTracking = "";
        if(this.vodObject.adObject.linkTarget == "_blank")
        {
            window.open(this.vodObject.adObject.link);
        }
        else
        {
            location.href = this.vodObject.adObject.link;
        }
    }

    reset()
    {

        super.reset();
        
    }
    
    uiReset()
    {
        this.cell.style.display = "none";  
        this.btnSkip.style.display = "none";
        this.btnAd.style.display = "none";
        this.skipTime = -1;
        this.duration = -1;
        this.continueTime = 45;
        this.skipAble = false;
    }

    load(vodObject)
    {
        super.load(vodObject);
        if(this.vodObject.type != VOD_TYPE.AD) return;
        
        this.cell.style.display = "block";  
        if(this.vodObject.adObject.skipTime > 0)
        {
            this.skipTime = this.vodObject.adObject.skipTime;
            this.btnSkip.style.display = "block";  
            this.setTime(0);
        }
        if(this.vodObject.adObject.link != "") this.btnAd.style.display = "block"; 
                
    }
   
    sendStatus(status)
    {
        if(this.vodObject == null) return;
        if(this.vodObject.type != VOD_TYPE.AD && this.vodObject.prerollRequestObject == null) return;
        
        switch(status.state)
        {
            case PLAYER_STATE.READY:
                this.sendMediaLog("start","0");   
                break;
            case PLAYER_STATE.PREVIEW_DURATION_CHANGE:
            case PLAYER_STATE.DURATION_CHANGE:
                this.duration = status.value;
                if(this.vodObject.type == VOD_TYPE.AD)
                {
                    this.continueTime = this.vodObject.adObject.progressOffset;
                }
                else
                {
                    this.continueTime = (this.duration < 45) ? Math.floor(this.duration*0.9) : this.continueTime;
                    this.continueTime = (this.continueTime <39) ? 39 : this.continueTime;
                }
                break;
            // case PLAYER_STATE.PREVIEW_TIME_CHANGE:
            case PLAYER_STATE.TIME_CHANGE:
                
                let t = status.value;
                if(this.vodObject.type == VOD_TYPE.AD) this.setTime(t);
                this.sendLog(t);
                break;

            case PLAYER_STATE.FINISHED:
                this.sendADLog("complete");
                this.sendMediaLog("complete","4/4");
                break;

        }
    }

    sendLog(t)
    {
        if(this.duration<0) return;

        let tick=this.duration/4;
        let loger = LogManager.getInstance();

        if(this.continueTime < t)
        {
            this.sendMediaLog("continue",this.continueTime);
            this.sendADLog("progressUrl");   
        }

        if(0 < t)
        {   
            this.sendADLog("impression");  
            this.sendADLog("start");   
        }

        if(tick < t)
        {
            this.sendADLog("firstQuartile"); 
            this.sendMediaLog("firstQuartile","1/4");

        }

        if(tick*2 < t)
        {
            this.sendADLog("midPoint"); 
            this.sendMediaLog("midPoint","2/4");
            
        }

        if(tick*3 < t)
        {
            this.sendADLog("thirdQuartile"); 
            this.sendMediaLog("thirdQuartile","3/4");
        }

        if(30 <= t) this.sendADLog("thirtySeconds");

    }

    sendMediaLog(type,pos)
    {
        if(this.vodObject.prerollRequestObject == null) return; 
        if(!this.vodObject.prerollRequestLogs[type])
        {
            this.vodObject.prerollRequestLogs[type]=true; 
            if(this.isRemoteMode) return;
            DataManager.getInstance().sendMediaLog(this.vodObject.prerollRequestObject,pos);
        } 
    }

    sendADLog(type)
    {
        if(this.vodObject.adObject == null) return;
        LogManager.getInstance().sendLog(this.vodObject.adObject[type]);  
        this.vodObject.adObject[type] = "";
    }

    setTime(t)
    {
        if(this.skipTime<0) return;
        if(this.skipAble) return;
        
        var remainT = Math.round(this.skipTime - t);
        this.skipAble = (remainT <= 0) ? true : false;
        this.btnSkip.innerHTML = (remainT <= 0) ? "광고 건너뛰기 >" : remainT + "초 후 건너뛰기";
        
    }
}

class NextEpisodeBox extends PlayerUIBox
{
    constructor(body,delegate) 
    {
        super(body,delegate);
        this.VIEW_TIME = 60;
        this.COUNT_TIME = 5;
        this.img = null;
        this.btnPlay = null;
        this.btnStop = null;
        this.duration = -1;
        this.isView = false;
        this.episode = null;
        this.title = "";

        this.isCounting = false;
        this.isCountStop = false;
        this.isActive = true;
        this.isClosed = false;



    }
    init()
    {   
        this.createElements();
        this.setupEvent();
       
        return super.init();
    }
    
    remove()
    {   
        super.remove();
    }

    createElements()
    {   
        let elementProvider = new NextEpisodeBoxBody(this.body);
        elementProvider.init();
        elementProvider.writeHTML();
        super.createElements(elementProvider); 

        this.img = elementProvider.getElement("img");
        this.btnPlay = elementProvider.getElement("btnPlay");
        this.btnStop = elementProvider.getElement("btnStop");

        this.btnPlay.tabIndex = "-1";
        this.btnStop.tabIndex = "-1";

    }

    setupEvent()
    {
        super.setupEvent();
        jarvis.lib.addEventListener(this.btnPlay,"click",this.onPlay.bind(this));
        jarvis.lib.addEventListener(this.img,"click",this.onPlay.bind(this));
        jarvis.lib.addEventListener(this.btnStop,"click",this.onStop.bind(this));
        jarvis.lib.addEventListener(this.img,"mouseover",this.onOver.bind(this));
        jarvis.lib.addEventListener(this.img,"mouseout",this.onOut.bind(this));
    }

    onOver(e)
    {
        jarvis.lib.addAttribute(this.img,'img-over');
    }
    onOut(e)
    {
        jarvis.lib.removeAttribute(this.img,'img-over');
    }


    clearEvent()
    {
        super.clearEvent();
    }

    onPlay()
    {
        var vodObject = new VodObject(this.vodObject.type,this.episode.contentID,this.vodObject.resolution,this.vodObject.isDVR,true);
        vodObject.initTime = 0;
        this.delegate.next(new UIEvent(UI_EVENT.CHANGE_VOD,vodObject));

    }

    onStop()
    {
        if(this.isCounting == true) this.isCountStop = true;
        this.isClosed = true;
        this.setUIView(false);
    }

    reset()
    {
        super.reset();
        this.duration = -1;
        this.title = "";
        this.episode = null;
        this.isClosed = false;
        this.isCounting = false;
        this.isCountStop = false;
        this.setUIView(false);
    }

    
    sendStatus(status)
    {
        switch(status.state)
        {
            case PLAYER_STATE.DURATION_CHANGE:
                this.duration = status.value;
                break;

            case PLAYER_STATE.TIME_CHANGE:
                this.setTime(status.value);
                break;

            case PLAYER_STATE.FINISHED:
                this.setFinished();
                break;

        }
    }


    setTime(t)
    {
        if(this.isActive == false) return;
        if(this.episode == null) return;
        if(this.duration == -1) return;

        let remainTime = this.duration - t;
        if(remainTime > this.vodObject.nextTriggerSeconds)
        {

            if(this.isView ==true)
            {
                this.setUIView(false);
                this.btnPlay.innerHTML = this.title;
            }
            return;
        }

        var isAutoPlay = DataManager.getInstance().getSetupValue(SHARED_KEY.AUTO_PLAY);
        if(isAutoPlay==false) return;
        
        if(remainTime <= this.COUNT_TIME && this.vodObject.autoNextTrigger == true)
        {
            
            this.isCounting = true;
            if(this.isCountStop == false) this.setUIView(true);
            this.btnPlay.innerHTML =  this.title + "<br>" + Math.round(remainTime) + "초 후";
        }
        else
        {
            if(this.isClosed == false) this.setUIView(true);
            this.btnPlay.innerHTML = this.title;
        }
    }

    setFinished()
    {
        if(this.isActive ==false) return;
        if(this.episode == null) return;
        if(this.vodObject.autoNextTrigger == false) return;
        var isAutoPlay = DataManager.getInstance().getSetupValue(SHARED_KEY.AUTO_PLAY);
        this.delegate.next(new UIEvent(UI_EVENT.EPISODE_COMPLETE));
        
        if(isAutoPlay == true)
        {
            this.onPlay();
        }
        else
        {
            this.delegate.next(new UIEvent(UI_EVENT.NEXT_EPISODE_COMPLETE,this.metaObject));
            this.reset();
        }
    }
    

    load(vodObject)
    {
        super.load(vodObject);
        this.isActive = true;
        if(this.vodObject.type == VOD_TYPE.AD) this.isActive = false;
        if(this.vodObject.isPreview == true) this.isActive = false;
        if(this.metaObject.nextEpisode == null) this.isActive = false;
        if(this.isActive == false) return;
        
        this.episode = this.metaObject.nextEpisode;
        this.img.src = this.episode.image;
        this.title = "다음회차 " + this.episode.episodeNumber + "회";
        
    }

    setUIView(isView)
    {
        if(this.isView != isView)
        {
            this.isView = isView;
            if(isView)
            {
                if(this.episode == null) return;
                jarvis.lib.removeAttribute(this.cell,'animate-out next-episode-box-hidden');
                jarvis.lib.addAttribute(this.cell,'animate-in');
                this.btnPlay.tabIndex = null;
                this.btnStop.tabIndex = null;
            }
            else
            {
                jarvis.lib.removeAttribute(this.cell,'animate-in');
                jarvis.lib.addAttribute(this.cell,'next-episode-box-hidden');
                this.btnPlay.tabIndex = "-1";
                this.btnStop.tabIndex = "-1";
            }
        }
    }

    


}

class InfoBox extends PlayerUIBox
{
    constructor(body,delegate) 
    {
        super(body,delegate);
        this.textInfo = null;
        this.icon = null;
        this.btnHomeShopping = null;     
        this.homeShoppingData = null;  
    }
    init()
    {   
        this.createElements();
        this.setupEvent();
        return super.init();
    }
    
    remove()
    {   
        super.remove();
    }

    createElements()
    {   
        let elementProvider = new InfoBoxBody(this.body);
        elementProvider.init();
        elementProvider.writeHTML();
        super.createElements(); 
        this.textInfo = elementProvider.getElement("textInfo");
        this.icon = elementProvider.getElement("icon");
        this.btnHomeShopping = elementProvider.getElement("btnHomeShopping");
    }

    setupEvent()
    {
        super.setupEvent();
        jarvis.lib.addEventListener(this.btnHomeShopping,"click",this.onHomeShopping.bind(this));

    }

    clearEvent()
    {
        super.clearEvent();
        jarvis.lib.removeEventListener(this.btnHomeShopping,"click",this.onHomeShopping.bind(this));
    }

    onHomeShopping()
    {
        if(this.homeShoppingData == null) return;
        window.open(this.homeShoppingData.orderUrl);
    }

    reset()
    {
        super.reset();
       
    }

    uiReset()
    {
        super.uiReset();
        this.icon.style.display = "none";  
        this.btnHomeShopping.style.display = "none";  
        this.textInfo.innerHTML = "";
        this.textInfo.style.width = null;
        this.homeShoppingData = null; 
    }

    updatedMeta(metaObject)
    {
        super.updatedMeta(metaObject);
        this.textInfo.innerHTML = this.metaObject.viewTitle;
        this.setResize();
    }

    load(vodObject)
    {
        super.load(vodObject);
        this.textInfo.innerHTML = (this.vodObject.type == VOD_TYPE.AD) ? INFO_MSG.AD : this.metaObject.viewTitle;
        switch(this.vodObject.type)
        {
            case VOD_TYPE.QVOD:
                this.icon.style.display = "block"; 
                this.icon.src = UIManager.getInstance().getInfoIconPath(IMG_PATH.ICON_QVOD);
                break;
        }

        if(this.vodObject.type == VOD_TYPE.AD) return;
        if(this.metaObject.isHomeShopping == true)  this.loadHomeShopping();

                
    }

    loadHomeShopping()
    {
        var that = this;
        var delegate=function(){}; 
            delegate.prototype = {
                            onEvent : function(e,value)
                            {
                                switch(e){
                                    case jarvis.EVENT.COMPLETE:
                                        that.setHomeShoppingData(value);
                                        break;

                                    case jarvis.EVENT.ERROR:
                                        console.log("loadHomeShopping err skip");
                                        break;

                                }
                            }
            }

        DataManager.getInstance().getHomeshoppingInfo(this.metaObject.channelID,new delegate());
    }

    setHomeShoppingData(data)
    {
        this.homeShoppingData = data;
        this.btnHomeShopping.style.display = (this.homeShoppingData.orderUrl != "") ? "block"  : "none";
        this.setResize();
    }

    sendStatus(status)
    {
        switch(status.state)
        {
            case UI_STATE.RESIZE:
                this.setResize(status.value);
                break;

        }
    }

    setResize()
    {
        this.textInfo.style.width = null;
        var size = jarvis.lib.getAbsoluteBounce(this.body).width;
        size = (this.icon.style.display == "block") ? size - (jarvis.lib.getAbsoluteBounce(this.icon).width+DYNAMIC_SIZE.UI_MARGIN) : size;
        size = (this.btnHomeShopping.style.display == "block") ? size - (jarvis.lib.getAbsoluteBounce(this.btnHomeShopping).width+(DYNAMIC_SIZE.UI_MARGIN*2)) : size;
        if(jarvis.lib.getAbsoluteBounce(this.textInfo).width>size) this.textInfo.style.width = size+"px";
    }

}

class ShareBox extends PlayerUIBox
{
    constructor(body,delegate) 
    {
        super(body,delegate);
        this.btnDownload = null;
        this.btnShare = null;
        this.btnTM = null;
        this.btnTMOn = null;  
        this.btnTMOff = null;  
        this.btnCast = null;
        this.textInfo = null;
        this.isCastAble = UIManager.getInstance().isCastAble;

    }
    init()
    {   
        this.createElements();
        this.setupEvent();
        return super.init();
    }
    

    remove()
    {   
        super.remove();
    }
    
    createElements()
    {   
        let elementProvider = new ShareBoxBody(this.body);
        elementProvider.init();
        elementProvider.writeHTML();
        super.createElements();

        this.btnDownload = elementProvider.getElement("btnDownload");
        this.btnShare = elementProvider.getElement("btnShare");
        this.btnTM = elementProvider.getElement("btnTM");
        this.btnTMOn = elementProvider.getElement("btnTMOn");
        this.btnTMOff = elementProvider.getElement("btnTMOff");
        this.btnCast = elementProvider.getElement("btnCast");
        this.textInfo = elementProvider.getElement("textInfo");
        this.setCastBtn();
    }


    setupEvent()
    {
        super.setupEvent();

        jarvis.lib.addEventListener(this.btnDownload,"click",this.onDownload.bind(this));
        jarvis.lib.addEventListener(this.btnShare,"click",this.onShare.bind(this));
        jarvis.lib.addEventListener(this.btnTMOn,"click",this.onTM.bind(this,false));
        jarvis.lib.addEventListener(this.btnTMOff,"click",this.onTM.bind(this,true));

    }

    clearEvent()
    {
        super.clearEvent();
        jarvis.lib.removeEventListener(this.btnDownload,"click",this.onDownload.bind(this));
        jarvis.lib.removeEventListener(this.btnShare,"click",this.onShare.bind(this));
        jarvis.lib.removeEventListener(this.btnTMOn,"click",this.onTM.bind(this,false));
        jarvis.lib.removeEventListener(this.btnTMOff,"click",this.onTM.bind(this,true));
    }

    reset()
    {
        super.reset();
        this.btnTM.style.display = 'none';
        this.textInfo.style.display = 'none';
        this.btnDownload.style.display = 'none';
        this.btnShare.style.display = 'none';
        this.setCastBtn();
    }

    setCastBtn()
    {
        this.btnCast.style.display = (this.isCastAble == true) ? "block" : "none";
    }

    load(vodObject)
    {
        super.load(vodObject);
        if (this.vodObject.type == VOD_TYPE.AD) return;
        this.setTimeMachine();
        if(this.metaObject == null) return;
        this.btnDownload.style.display = (this.metaObject.isDownloadAble) ? "block" : "none";
        this.btnShare.style.display = (this.vodObject.isShareAble) ? "block" : "none";
    }

    setMode(mode)
    {
        if(mode == PLAYER_MODE.CONDENSATION)
        {
            this.textInfo.style.display = 'none';
        }
        else
        {
            this.setTimeMachine();
        }
    }
    
    setTimeMachine()
    {
        if(this.vodObject == null) return;
        if(this.metaObject == null) return;
        if(this.metaObject.isTimemachine == false) return;
        this.btnTM.style.display = 'block';    
        if(this.vodObject.isDVR)
        {
            this.btnTMOn.style.display = 'block';
            this.btnTMOff.style.display = 'none';
            this.textInfo.style.display = 'none';
        }
        else
        {
            this.btnTMOn.style.display = 'none';
            this.btnTMOff.style.display = 'block';
            var isTMInfo = DataManager.getInstance().getSetupValue(SHARED_KEY.TM_INFO);
            if(isTMInfo == false) return;
            this.textInfo.style.display = 'block';
            this.textInfo.innerHTML = INFO_MSG.TM;
            DataManager.getInstance().setSetupValue(SHARED_KEY.TM_INFO,false);
        }
    }


    onDownload()
    {
        this.delegate.next(new UIEvent(PLAYER_EVENT.FULLSCREEN_EXIT));
        showDownloadLayout();
    }

    onShare()
    {
        this.delegate.next(new UIEvent(PLAYER_EVENT.FULLSCREEN_EXIT));
        showShareLayout();
    }

    onTM(isOn)
    {
        this.delegate.next(new UIEvent(UI_EVENT.DVR_CHANGE,isOn));
    }

    sendStatus(status)
    {
        switch(status.state)
        {
            case PLAYER_STATE.CAST_INITED:

                this.isCastAble = true;
                this.setCastBtn();
                break;
        }
    }
    

}

class UiBox extends PlayerUIBox
{
    constructor(body,delegate) 
    {
        super(body,delegate);

        this.uiSet =null;  
        this.btnBack = null;
        this.btnFront = null;
        this.btnCenter = null;
        this.btnPlay = null;
        this.btnPause = null;   
        this.seekInfo = null; 
        this.playType = null;
        this.isLoading = false;
    }

    init()
    {   
        this.createElements();
        this.setupEvent();
        this.setPause();
        return super.init();
    }
    
    remove()
    {   
        super.remove();
    }
    
    createElements()
    {   
        let elementProvider = new UiBoxBody(this.body);
        elementProvider.init();
        elementProvider.writeHTML();
        super.createElements();
        this.uiSet = elementProvider.getElement("uiSet");
        this.seekInfo = elementProvider.getElement("seekInfo");
        this.btnBack = elementProvider.getElement("btnBack");
        this.btnFront = elementProvider.getElement("btnFront");
        this.btnCenter = elementProvider.getElement("btnCenter");
        this.btnPlay = elementProvider.getElement("btnPlay");
        this.btnPause = elementProvider.getElement("btnPause");
    }


    setupEvent()
    {
        super.setupEvent();
        jarvis.lib.addEventListener(this.btnBack,"click",this.onBack.bind(this));
        jarvis.lib.addEventListener(this.btnFront,"click",this.onFront.bind(this));
        jarvis.lib.addEventListener(this.btnPlay,"click",this.onPlay.bind(this));
        jarvis.lib.addEventListener(this.btnPause,"click",this.onPause.bind(this));

    }

    clearEvent()
    {
        super.clearEvent();
        jarvis.lib.removeEventListener(this.btnBack,"click",this.onBack.bind(this));
        jarvis.lib.removeEventListener(this.btnFront,"click",this.onFront.bind(this));
        jarvis.lib.removeEventListener(this.btnPlay,"click",this.onPlay.bind(this));
        jarvis.lib.removeEventListener(this.btnPause,"click",this.onPause.bind(this));
    }

    reset()
    {
        super.reset();
        this.btnCenter.style.display = 'none';
        this.seekInfo.style.display = 'none';
       
    }

    uiReset()
    {
        super.uiReset();
        this.btnBack.style.display = 'none';
        this.btnFront.style.display = 'none';
        this.playType = null;
    }

    load(vodObject)
    {
        super.load(vodObject);
        this.btnCenter.style.display = 'block';
        this.uiSet.style.display = "block";
    }

    onBack()
    {
        this.delegate.next(new UIEvent(PLAYER_EVENT.MOVE,-10));
    }

    onFront()
    {
        this.delegate.next(new UIEvent(PLAYER_EVENT.MOVE,10));
    }

    onPlay()
    {
        this.delegate.next(new UIEvent(PLAYER_EVENT.PLAY));
    }

    onPause()
    {
        this.delegate.next(new UIEvent(PLAYER_EVENT.PAUSE));
    }

    sendEvent(value)
    {
        switch(value.type)
        {
            case PLAYER_EVENT.SEEK_MOVE:
            
                this.uiSet.style.display = 'none';
                this.seekInfo.style.display = 'block';
                this.seekInfo.innerHTML = value.value;

                break;
            case PLAYER_EVENT.SEEK_MOVING:
                this.seekInfo.innerHTML = value.value;
                break;

            case PLAYER_EVENT.SEEK_MOVED:
                this.uiSet.style.display = 'block';
                this.seekInfo.style.display = 'none';
                break;
        }
    }

    sendStatus(status)
    {
         switch(status.state)
        {
            case PLAYER_STATE.READY:
                this.setPlayType(status.value);
                this.setPause();
                break;
            case PLAYER_STATE.PLAY:
                this.setPlay();
                break;
            case PLAYER_STATE.PAUSED:
                this.setPause();
                //this.setLoading(false);
                break;
            case PLAYER_STATE.DATA_LOAD:
            case PLAYER_STATE.LOAD:
            case PLAYER_STATE.STALL:
                this.setLoading(true);
                break;

            case PLAYER_STATE.DATA_LOADED:
            case PLAYER_STATE.LOADED:
            case PLAYER_STATE.STALLED:
                this.setLoading(false);
                break;
        }
    }

    setMode(mode)
    {
        super.setMode(mode);
        this.setUISetView();
    }

    setPlayType(value)
    {
       
        this.playType = value.playType;
        this.setBtns();

    }

    setBtns()
    {
        if(this.vodObject == null) return;
        if(this.vodObject.isSeekAble== false) return;
        this.btnBack.style.display = 'block';
        this.btnFront.style.display = 'block';
    }

    setPlay()
    {
        this.btnPlay.style.display = "none";
        this.btnPause.style.display = "block";
    }
    
    setPause()
    {
        this.btnPlay.style.display = "block";
        this.btnPause.style.display = "none";  
    }
    setUISetView()
    {
        if(this.currentMode == PLAYER_MODE.CONDENSATION || this.isLoading == true)
        {
            this.uiSet.style.display = "none";
        }else
        {
            this.uiSet.style.display = "block"; 
        }
    }
    setLoading(isLoading)
    {
        this.isLoading = isLoading;
        this.setUISetView();
    }

}


class ViewBox extends PlayerUIBox
{
    constructor(body,delegate) 
    {
        super(body,delegate);
        this.infoSet =null;  
        this.infoIcon = null;
        this.infoText = null;
        
    }
    init()
    {   
        this.createElements();
        return super.init();
    }
    
    remove()
    {   
        super.remove();
    }
    
    createElements()
    {   
        let elementProvider = new ViewBoxBody(this.body);
        elementProvider.init();
        elementProvider.writeHTML();
        super.createElements();
        this.infoSet = elementProvider.getElement("infoSet");
        this.infoIcon = elementProvider.getElement("icon");
        this.infoText = elementProvider.getElement("text");
       

    }

    uiReset()
    {
        super.uiReset();
        this.infoSet.style.display = 'none';
    }


    sendStatus(status)
    {
        switch(status.state)
        {
            case PLAYER_STATE.READY:
                this.setPlayType(status.value);
                break;
        }
    }

    setPlayType(value)
    {
        if(value.streamType == STREAM_TYPE.AUDIO)
        {
            this.infoSet.style.display = 'block';
            this.infoIcon.src = UIManager.getInstance().getInfoIconPath(IMG_PATH.ICON_AUDIO);
            this.infoText.innerHTML = INFO_MSG.AUDIO;
        }

    }
}


class Flag extends ComponentCore
{
    constructor(body,delegate) 
    {
        super(body);
        this.playerDelegate = delegate;
        this.text = null;
        this.pos = -1;
    }

    init()
    {   
        this.createElements();
        this.setupEvent();
        return super.init();
    }

    remove()
    {   
        this.playerDelegate = null;
        super.remove();
    }

    createElements()
    {
        let elementProvider = new FlagBody(this.body);   
        elementProvider.init();
        elementProvider.writeHTML();
        super.createElements(elementProvider);
        this.text = elementProvider.getElement('text');
    }

    setupEvent()
    {
        super.setupEvent();
        jarvis.lib.addEventListener(this.getBody(),"click",this.onSeek.bind(this));
    }

    setData(obj)
    {
        this.pos = obj.t;
        this.text.innerHTML = obj.v;
    }

    onSeek(e)
    {
        this.playerDelegate.next(new UIEvent(PLAYER_EVENT.SEEK_CHANGE,this.pos));
    }
    
}

class SeekBox extends PlayerUIBox
{
	constructor(body,delegate) 
	{
        super(body,delegate);
        
       
        this.bar = null;
        this.barRange = null;
        this.barProgress = null;
        this.barPrev = null;
        this.seekRange = null;
        
        this.thumb = null;
        this.preview = null;
       
        this.playType = "";
        this.barSize = new jarvis.Rectangle();
        this.seekAblePct = 1;
        this.isSeeking=false;
        this.isControlAble=false;
       
        this.duration = 0;
        this.currentTime = 0;
        this.flags = null;
        this.vttSize = new jarvis.Rectangle();

        this.rxLiveTimer = null;
    }
    init()
    {   
        this.createElements();
        this.setupEvent();
        this.setupDelegate();
        this.reset();
        this.onSeekActive(false);
        return super.init();
    }
    
    remove()
    {   
        super.remove();
    }
    
    createElements()
    {   

        let elementProvider = new SeekBoxBody(this.body);
        elementProvider.init();
        elementProvider.writeHTML();
        super.createElements();

         
        this.bar = elementProvider.getElement("bar");
        this.barRange = elementProvider.getElement("barRange");
        
        this.barProgress = elementProvider.getElement("barProgress");
        this.barPrev = elementProvider.getElement("barPrev");
        this.seekRange = elementProvider.getElement("seekRange");
        this.thumb  = elementProvider.getElement("thumb");
        this.preview = elementProvider.getElement("preview");
    }


    setupEvent()
    {
        super.setupEvent();

        jarvis.lib.addEventListener(this.bar,"mouseover",this.onSeekActive.bind(this,true));
        jarvis.lib.addEventListener(this.bar,"mouseout",this.onSeekActive.bind(this,false));
        jarvis.lib.addEventListener(this.seekRange,"click",this.onSeek.bind(this));

    }

    clearEvent()
    {
        super.clearEvent();
        jarvis.lib.removeEventListener(this.bar,"mouseover",this.onSeekActive.bind(this,true));
        jarvis.lib.removeEventListener(this.bar,"mouseout",this.onSeekActive.bind(this,false));
        jarvis.lib.removeEventListener(this.seekRange,"click",this.onSeek.bind(this));

    }

    onSeekActive(isAc)
    {

        if(this.vodObject == null) return;
        if(this.vodObject.isSeekAble == false) return;
        if(isAc == true)
        {
            this.thumb.style.opacity = 1;
        }
        else
        {
            this.thumb.style.opacity = 0;
        }
    }

    onSeek(e)
    {
        this.setBarSize();
        let bodySize = jarvis.lib.getAbsoluteBounce(this.body);
        var posX= jarvis.lib.getMouseX(e);
        posX=posX-this.barSize.x-bodySize.x;
        let pct = posX/this.barSize.width;
        let t = this.duration * pct;
        this.delegate.next(new UIEvent(PLAYER_EVENT.SEEK_CHANGE,t));
    }


    sendStatus(status)
    {
        let that = this;
        switch(status.state)
        {
            
            case PLAYER_STATE.READY:
                this.setPlayType(status.value.playType);
                this.setTime(0);
                break;
            case PLAYER_STATE.DURATION_CHANGE:
                this.setBarSize();
                this.setDuration(status.value);
                this.createFlags();
                break;
            case PLAYER_STATE.VTT_LOADED:
                this.setVtts(status.value);
                break;
            case PLAYER_STATE.PLAY_RANGE_CHANGE:
                this.setPlayRange(status.value);
                break;
            case PLAYER_STATE.TIME_CHANGE:
                this.setTime(status.value);
                break;
            case PLAYER_STATE.SEEK:
                this.setSeek(status.value);
                break;
            case PLAYER_STATE.SEEKED:
            case PLAYER_STATE.SEEK_DISABLE:
                this.setSeeked();
                break;
            case UI_STATE.RESIZE:
            case PLAYER_STATE.RESIZE:
                this.setBarSize();
                break;
            case PLAYER_STATE.PLAY_START:
                this.setSeekingAble();
                break;
        }
       

    }

    setBarSize()
    {
        if(this.bar == null) return;
        this.barSize = jarvis.lib.getRelativeBounce(this.bar);
    }

    reset()
    {
        super.reset();
        this.uiReset();
        this.preview.style.display = "none";
        this.barProgress.style.width = '0px';
        this.barPrev.style.width = '0px';
        //this.barRange.style.width = '0px';
        this.seekRange.style.width = '0px';

    }

    uiReset()
    {
        this.endLiveTimer();
        
        this.thumb.style.display = "none";  
        this.thumb.style.left = '0px'
        this.preview.removeAttribute('style');
        jarvis.lib.removeAttribute(this.barProgress,'progress-quick progress-ad');
        this.vttSize = null;
        this.duration = 0;
        this.currentTime = 0;
        
        this.bar.style.display = "none";  
        this.seekRange.style.display = "none";     
        this.removeFlags();
    }

    createFlags()
    {
        this.removeFlags();
        if(this.vodObject == null) return;
        if(this.vodObject.flags == null) return;
        this.flags = new Array();
        for(var i=0;i<this.vodObject.flags.length;++i)
        {
            var obj = this.vodObject.flags[i];

            if(obj.t > this.duration) return;
            var pct = obj.t/this.duration*100;
            var flag = new Flag(this.bar,this.delegate);
            flag.init();
            flag.setData(obj);
            var body = flag.getBody()
            body.style.left = pct+"%";
            this.flags.push(flag);
        }

    }
    removeFlags()
    {
        if(this.flags == null) return;
        for(var i=0;i<this.flags.length;++i)
        {
            this.flags[i].remove();
        }
        this.flags = null;
    }

    viewFlags(isView)
    {
        if(this.flags == null) return;
        for(var i=0;i<this.flags.length;++i)
        {
            this.flags[i].getBody().style.display = (isView == true) ? "block" : "none";  
        }
    }

    setMode(mode)
    {
        super.setMode(mode);
    }

    updatedMeta(metaObject=null)
    {
        super.updatedMeta(metaObject);
        if(this.playType != PLAY_TYPE.LIVE) return;
          
        var timeRange = this.metaObject.playEndTime - this.metaObject.playStartTime;
        this.duration = timeRange;     
        this.setPlayRange(timeRange);
        this.updatePlayTime();
        this.bar.style.display = "block";  
    }

    load(vodObject)
    {
        super.load(vodObject);
        switch(vodObject.type)
        {
            case VOD_TYPE.AD: 
                jarvis.lib.addAttribute(this.barProgress,'progress-ad');             
                break;
            case VOD_TYPE.QVOD: 
                jarvis.lib.addAttribute(this.barProgress,'progress-quick');          
                break;
            default:
                break;
        }

    }

    setSeekingAble()
    {
        this.seekRange.style.display = (this.vodObject.isSeekAble)?"block" :"none";     
        this.thumb.style.display = (this.vodObject.isSeekAble)?"block" :"none";    
    }

    setPlayType(type)
    {
        this.playType = type;
        switch(this.playType)
        {
            case PLAY_TYPE.LIVE:
                this.updatedMeta();
                this.startLiveTimer();
                break;
            default:
        
                break;
        }

    }

    startLiveTimer()
    {
        this.endLiveTimer();
        this.rxLiveTimer = Rx.Observable.interval(1000).timeInterval().subscribe
        (
            this.onLiveTimeCheck.bind(this)
        );
    }
    endLiveTimer()
    {
        if(this.rxLiveTimer) this.rxLiveTimer.unsubscribe();
    }

    onLiveTimeCheck()
    {
        if(this.metaObject == null) return;
        if(this.metaObject.playUpdateTime == -1) return;
        var now = new Date();
        this.metaObject.playCurrentTime = now.getTime();
        if(this.metaObject.playCurrentTime >= this.metaObject.playUpdateTime)
        {
            this.metaObject.playUpdateTime = -1;
            this.delegate.next(new UIEvent(UI_EVENT.UPDATE_META));
        }

        this.updatePlayTime();
        
    }

    updatePlayTime()
    {
        let pct = (this.metaObject.playCurrentTime - this.metaObject.playStartTime)/this.duration;
        pct = pct>1 ? 1 : pct;
        let size = 100*pct;
        this.barProgress.style.width = size+'%';
    }


    setDuration(duration)
    {
        if(this.playType==PLAY_TYPE.LIVE) return;
        this.duration=duration;
        switch(this.playType)
        {
    
            case PLAY_TYPE.DVR: 
            case PLAY_TYPE.LIVE_TM: 
                this.isControlAble = true;
                break;
            default: 
                this.isControlAble = true;
                break;
        }
        this.bar.style.display = "block";  
        
    }
    

    setPlayRange(range)
    {
        let pct = range/this.duration;
        let size = Math.round(100*pct);
        this.barRange.style.width = size+'%';
        this.seekRange.style.width = size+'%';
        this.seekAblePct = pct;
    }

    setTime(t)
    {
        if(this.playType==PLAY_TYPE.LIVE) return;
        if(this.isSeeking==true) return;
        this.currentTime = t;
        let pct = t/this.duration;
        pct = pct>1 ? 1 : pct;
        let size = 100*pct;
        this.barProgress.style.width = size+'%';
        this.thumb.style.left = size+'%';
        
    }

    setSeek(t)
    {
        this.isSeeking=true;
        let pct = t/this.duration;
        let size = 100*pct;
        this.barPrev.style.width=size+"%";
    }

    setSeeked()
    {
        this.isSeeking=false;
        this.barPrev.style.width="0";
    }
    setVtts(vtts)
    {
        this.vttSize = new jarvis.Rectangle();
        this.vttSize.width = vtts.thumbWidth;
        this.vttSize.height = vtts.thumbHeight;
    }
    viewPreview(pos)
    {

        if(this.vodObject.isSeekAble == false) return;
        if(this.duration<=0) return;
        this.setBarSize();
        pos = pos>this.barSize.width ? this.barSize.width : pos;
        pos = pos<0 ? 0 : pos;
        
        
        var t = this.duration*pos/this.barSize.width;
        this.preview.innerHTML = this.getTimeStr(t);
        
        var size= jarvis.lib.getAbsoluteBounce(this.preview);
        var div = Math.round(size.width/2);
        pos = pos - div;
        pos += this.barSize.x;

        var min = this.barSize.x;
        var max = this.barSize.width - size.width + this.barSize.x;
        pos = (pos<min) ? min : pos 
        pos = (pos>max) ? max : pos

        this.preview.style.left = pos+"px";
        
        var thumb = (this.flags == null) ? this.delegate.getThumb(t) : null;
        if (thumb && this.vttSize) 
        {
            var ratio =0.5;
            var margin = 10;
            var w = Math.floor(thumb.w * ratio)-margin;
            var h = Math.floor(thumb.h * ratio)-margin;
            var wid = this.vttSize.width * ratio;
            var hei = this.vttSize.height * ratio;
            
            this.preview.style.backgroundColor = '#000';
            this.preview.style.backgroundRepeat = 'no-repeat';
            this.preview.style.backgroundImage = 'url("' + thumb.url + '")';
            this.preview.style.backgroundSize = wid+"px "+hei+"px";
            this.preview.style.backgroundPosition = '-' + (thumb.x*ratio) + 'px -' + (thumb.y*ratio) + 'px';
            this.preview.style.height = h + 'px';
            this.preview.style.width = w + 'px';
            this.preview.style.lineHeight = (h*2 - margin) + "px";
            this.preview.style.verticalAlign = 'bottom';
            this.preview.style.top = -(h+10) + "px";

            this.preview.style.border = "1px solid #fff";

        }
        else
        {
            this.preview.style.backgroundImage = null;
            this.preview.style.top = '-10px';
        } 

    }

    

    getTimeStr(t)
    {
        var str = "";
        if(this.playType==PLAY_TYPE.DVR || this.playType==PLAY_TYPE.LIVE_TM)
        {
            t = this.duration - t;
            str = t <= 0 ? "LIVE" : "-"+jarvis.lib.getTimeStr( Math.round(t));
        }
        else
        {
            str = jarvis.lib.getTimeStr( Math.round(t),':');
        }
        return str;
    }

    setupDelegate()
    {
        super.setupEvent();
        
        var that = this;
        var gestureStartPos = 0;

        var gestureDelegate=function(){}; 
        gestureDelegate.prototype = {
                          
            stateChange :function(e,point)
            {
                if(e==jarvis.GestureElement.START)
                {
                    startGesture(gestureElement.startPosA[0].x)
                }
                else if(e==jarvis.GestureElement.MOVE_H)
                {
                    moveGesture(gestureElement.changePosA[0].x);
                }
                else if(e==jarvis.GestureElement.END)
                {
                    endGesture(gestureElement.changePosA[0].x)
                }
            }
                              
        }
        var gestureElement=new  jarvis.GestureElement(this.seekRange,new gestureDelegate(),false,true); 
        
        var dragDelegate=function(){}; 
        dragDelegate.prototype = 
        {
                                    
            startDrag : function(point)
            {
                startDrag();
            },
            moveDrag : function(point)
            {
                var pct = dragElement.valueX; 
                moveDrag(pct);
            },
            endDrag : function(point)
            {
                var pct = dragElement.valueX; 
                endDrag(pct);
            }
        }
        var dragElement = new  jarvis.DragElement(this.thumb,new dragDelegate());

        var moveDelegate=function(){}; 
        moveDelegate.prototype = 
        {
            startMove : function(point)
            {
                if(that.vodObject == null) return;
                if(that.vodObject.isSeekAble == false) return;
                that.preview.style.display="block";
                that.viewPreview(point.x);             
            },
            move : function(point)
            {
                that.viewPreview(point.x);
            },
            endMove : function(point)
            {
                that.preview.style.display="none";
            }
        }
        var moveElement = new  jarvis.MoveElement(this.bar ,new moveDelegate());

        function startGesture(pos)
        {
            if(pos === undefined) return;
            gestureStartPos = pos-that.barSize.x;
            that.preview.style.display="block";
            that.viewPreview(gestureStartPos);
            startDrag(); 
        }

        function moveGesture(pos)
        {
            if(pos === undefined) return;
            
            that.isSeeking=true;
            pos = pos+gestureStartPos;
            that.viewPreview(pos);
            var pct = pos/that.barSize.width;
            moveDrag(pct);
        }

        function endGesture(pos)
        {
            if(pos === undefined) return;
            
            that.isSeeking=true;
            that.preview.style.display="none";
            var pct = (pos+gestureStartPos)/that.barSize.width;
            endDrag(pct);
        }

        function startDrag()
        {
            if(that.isSeeking==true) return;
            if(that.isControlAble==false) return;
            that.isSeeking=true;    
            let view = that.getTimeStr(that.currentTime);
            that.uiDelegate.next(new UIEvent(PLAYER_EVENT.SEEK_MOVE,view));
        }

        function moveDrag(pct)
        {
            if(that.isSeeking==false) return;
            if(that.isControlAble==false) return;
            
            pct = pct>that.seekAblePct  ? that.seekAblePct : pct;

            let t = that.duration * pct;
            let view = that.getTimeStr(t);
            that.uiDelegate.next(new UIEvent(PLAYER_EVENT.SEEK_MOVING,view));

            pct = pct*100;
            that.barPrev.style.width=pct+"%";
            that.thumb.style.left=pct+"%";
        }


        function endDrag(pct)
        {
            if(that.isSeeking==false) return;
            if(that.isControlAble==false) return;
            
            that.isSeeking=false;
            pct = pct>that.seekAblePct ? that.seekAblePct : pct;

            let t = that.duration * pct;
            that.delegate.next(new UIEvent(PLAYER_EVENT.SEEK_CHANGE,t));

            let view = that.getTimeStr(t);
            that.uiDelegate.next(new UIEvent(PLAYER_EVENT.SEEK_MOVED,view));
        } 
    }    
}



class VolumeBox extends PlayerUIBox
{
    constructor(body,delegate) 
    {
        super(body,delegate);
        this.playType = "";
        this.duration = 0;
        this.textTime = null;
        this.textDuration = null;
        this.btnVolumeOn = null;
        this.btnVolumeOff = null;
        this.bar = null;
        this.barProgress = null;
        this.barPrev = null;
        this.volumeRange = null;
        this.thumb = null;
        this.isDraging = false;
        this.barSize = new jarvis.Rectangle();
        this.isControlAble=false;   
    }
    init()
    {   
        this.createElements();
        this.barSize = jarvis.lib.getAbsoluteBounce(this.bar);
        this.setupEvent();
        this.setupDelegate();
        this.setVolume(0);
        this.onBarView(false);
        return super.init();
    }
    
    remove()
    {   
        super.remove();
    }

    reset()
    {
        super.reset();
        this.textTime.innerHTML =  "";
        this.textDuration.innerHTML =  "";
    }

    updatedMeta(metaObject=null)
    {
        super.updatedMeta(metaObject);
        if(this.playType != PLAY_TYPE.LIVE) return;
        this.textTime.innerHTML = this.metaObject.startTime;
        this.textDuration.innerHTML =  "/ "+this.metaObject.endTime;    
    }

    load(vodObject)
    {   
        super.load(vodObject);
        this.body.style.display = "block";
    }

    createElements()
    {   
        let elementProvider = new VolumeBoxBody(this.body);
        elementProvider.init();
        elementProvider.writeHTML();
        super.createElements();
        this.textTime = elementProvider.getElement("textTime");
        this.textDuration = elementProvider.getElement("textDuration");  
        this.btnVolumeOn = elementProvider.getElement("btnVolumeOn");
        this.btnVolumeOff = elementProvider.getElement("btnVolumeOff");
       
        this.bar = elementProvider.getElement("bar");
        this.barProgress = elementProvider.getElement("barProgress");
        this.barPrev = elementProvider.getElement("barPrev");
        this.volumeRange = elementProvider.getElement("volumeRange");
        this.thumb  = elementProvider.getElement("thumb");

    }

    setupEvent()
    {
        super.setupEvent();
        jarvis.lib.addEventListener(this.body,"mouseover",this.onBarView.bind(this,true));
        jarvis.lib.addEventListener(this.body,"mouseout",this.onBarView.bind(this,false));
        jarvis.lib.addEventListener(this.volumeRange,"click",this.onVolumeChange.bind(this));
        jarvis.lib.addEventListener(this.btnVolumeOn,"click",this.onVolumeSet.bind(this,0));
        jarvis.lib.addEventListener(this.btnVolumeOff,"click",this.onVolumeSet.bind(this,0.5));    

    }

    clearEvent()
    {
        super.clearEvent();
        
    }

    onBarView(isView)
    {
        this.thumb.style.display = (isView) ? 'block' : 'none';
        this.bar.style.width = (isView) ? this.barSize.width + 'px' : '0';
    }

    onVolumeChange(e)
    {
        this.barSize = jarvis.lib.getAbsoluteBounce(this.bar);
        var posX= jarvis.lib.getMouseX(e);
        posX=posX-this.barSize.x;
        let pct = posX/this.barSize.width;
        this.delegate.next(new UIEvent(PLAYER_EVENT.VOLUME_CHANGE,pct));
    }
    onVolumeSet(pct)
    {
        this.delegate.next(new UIEvent(PLAYER_EVENT.VOLUME_CHANGE,pct));
    }

    sendStatus(status)
    {
        switch(status.state)
        {
            case PLAYER_STATE.VOLUME_CHANGED:
                this.setVolume(status.value);
                break;

            case PLAYER_STATE.READY:
                this.setPlayType(status.value.playType);
                break;
            case PLAYER_STATE.DURATION_CHANGE:
                this.setDuration(status.value);
                break;
            
            case PLAYER_STATE.TIME_CHANGE:
                this.setTime(status.value);
                break;
        }
    }

    setPlayType(type)
    {
        this.playType = type;
        switch(this.playType)
        {
            case PLAY_TYPE.LIVE:
                this.updatedMeta();
                break;
        }

    }

    setDuration(duration)
    {
        if(this.playType==PLAY_TYPE.LIVE) return;
        this.duration = duration;
        switch(this.playType)
        {
    
            case PLAY_TYPE.DVR: 
            case PLAY_TYPE.LIVE_TM: 
                this.textDuration.innerHTML =  "";
                break;
            default: 
                this.textDuration.innerHTML =  "/"+ this.getTimeStr(this.duration);
                break;
        }
        this.setTime(0);
    }

    setTime(t)
    {
        if(this.playType==PLAY_TYPE.LIVE) return;
        this.textTime.innerHTML = this.getTimeStr(t);
    }

    getTimeStr(t)
    {
        var str = "";
        if(this.playType==PLAY_TYPE.DVR || this.playType==PLAY_TYPE.LIVE_TM)
        {
            
            str = "";
        }
        else
        {
            str = jarvis.lib.getTimeStr( Math.round(t),':');
        }
        return str;
    }
    
    setVolume(v)
    {
        let size = Math.round(100*v);
        this.barPrev.style.display = "none";
        this.barPrev.style.width="0";
        this.barProgress.style.width = size+'%';
        this.thumb.style.left = size+'%';
        if(v<=0)
        {
            this.btnVolumeOn.style.display = "none";
            this.btnVolumeOff.style.display = "block";
        }
        else
        {
            this.btnVolumeOn.style.display = "block";
            this.btnVolumeOff.style.display = "none";
        }
    }

    setupDelegate()
    {
        var that = this;
        
        var dragDelegate=function(){}; 
        dragDelegate.prototype = 
        {
                                    
            startDrag : function(point)
            {
                startDrag();
            },
            moveDrag : function(point)
            {
                var pct = dragElement.valueX; 
                moveDrag(pct);
            },
            endDrag : function(point)
            {
                var pct = dragElement.valueX; 
                endDrag(pct);
            }
        }
        var dragElement = new  jarvis.DragElement(this.thumb,new dragDelegate());
 
        function startDrag()
        {
            that.isDraging=true;    
            that.barPrev.style.display = "block";
        }

        function moveDrag(pct)
        {
            if(that.isDraging==false) return;
            pct = pct;
            pct = pct>1  ? 1 : pct;
            pct = pct*100;
            that.barPrev.style.width=pct+"%";
            that.thumb.style.left=pct+"%";
        }

        function endDrag(pct)
        {
            if(that.isDraging==false) return;
            pct = pct;
            that.isSeeking=false;
            pct = pct> 1 ? 1 : pct;
            that.delegate.next(new UIEvent(PLAYER_EVENT.VOLUME_CHANGE,pct));
        }       
    }
    
}


class PlayBox extends PlayerUIBox
{
    constructor(body,delegate) 
    {
        super(body,delegate);
        this.btnPlay = null;
        this.btnPause = null;
        
    }
    init()
    {   
        this.createElements();
        this.setupEvent();
        return super.init();
    }
    
    remove()
    {   
        super.remove();
    }
    
    createElements()
    {   
        let elementProvider = new PlayBoxBody(this.body);
        elementProvider.init();
        elementProvider.writeHTML();
        super.createElements();
        this.btnPlay = elementProvider.getElement("btnPlay");
        this.btnPause = elementProvider.getElement("btnPause");
      
    }

    setupEvent()
    {
        super.setupEvent();
        jarvis.lib.addEventListener(this.btnPlay,"click",this.onPlay.bind(this));
        jarvis.lib.addEventListener(this.btnPause,"click",this.onPause.bind(this));
        
    }

    clearEvent()
    {
        super.clearEvent();
        jarvis.lib.removeEventListener(this.btnPlay,"click",this.onPlay.bind(this));
        jarvis.lib.removeEventListener(this.btnPause,"click",this.onPause.bind(this));
    }

    uiInit()
    {
        super.uiInit();
    }
    reset()
    {
        super.reset();
        this.setPause();
    }

    onPlay()
    {
        this.delegate.next(new UIEvent(PLAYER_EVENT.PLAY));
    }

    onPause()
    {
        this.delegate.next(new UIEvent(PLAYER_EVENT.PAUSE));
    }


    sendStatus(status)
    {
        switch(status.state)
        {
            case PLAYER_STATE.PLAY:
                this.setPlay();
                break;
            case PLAYER_STATE.PAUSED:
                this.setPause();
                break;
        }
    }

    setPlay()
    {
        this.btnPlay.style.display = "none";
        this.btnPause.style.display = "block";
    }
    
    setPause()
    {
        this.btnPlay.style.display = "block";
        this.btnPause.style.display = "none";  
    }

    
}


class FunctionBox extends PlayerUIBox
{
    constructor(body,delegate) 
    {
        super(body,delegate);
        this.setupSet = null;
        this.btnSetup = null;
        this.btnPopup = null;
        this.btnFullScreen = null;
        this.btnFullScreenOn = null;
        this.btnFullScreenOff = null;
        this.isFullScreen = false;
        this.iconQuality=null;
        
    }
    init()
    {   
        this.createElements();
        this.setupEvent();
        this.setFullScreen(false);
        return super.init();
    }
    
    remove()
    {   
        super.remove();
    }
    
    createElements()
    {   
        let elementProvider = new FunctionBoxBody(this.body);
        elementProvider.init();
        elementProvider.writeHTML();
        super.createElements();
        this.setupSet = elementProvider.getElement("setupSet");
        this.iconQuality = elementProvider.getElement("iconQuality");
        this.btnSetup = elementProvider.getElement("btnSetup");
        this.btnPopup = elementProvider.getElement("btnPopup");
        this.btnFullScreen = elementProvider.getElement("btnFullScreen");
        this.btnFullScreenOn = elementProvider.getElement("btnFullScreenOn");
        this.btnFullScreenOff = elementProvider.getElement("btnFullScreenOff");
    }

    setupEvent()
    {
        super.setupEvent();
        jarvis.lib.addEventListener(this.btnSetup,"click",this.onSetup.bind(this));
        jarvis.lib.addEventListener(this.btnPopup,"click",this.onPopup.bind(this));
        jarvis.lib.addEventListener(this.btnFullScreenOn,"click",this.onFullScreen.bind(this,false));
        jarvis.lib.addEventListener(this.btnFullScreenOff,"click",this.onFullScreen.bind(this,true));

    }

    clearEvent()
    {
        super.clearEvent();
        jarvis.lib.removeEventListener(this.btnSetup,"click",this.onSetup.bind(this));
        jarvis.lib.removeEventListener(this.btnPopup,"click",this.onPopup.bind(this));
        jarvis.lib.removeEventListener(this.btnFullScreenOn,"click",this.onFullScreen.bind(this,false));
        jarvis.lib.removeEventListener(this.btnFullScreenOff,"click",this.onFullScreen.bind(this,true));
    }

    uiInit()
    {
        super.uiInit();
    }
    reset()
    {
        super.reset();
        this.iconQuality.style.display = "none";
        this.iconQuality.src = "";
    }

    setMode(mode)
    {
        super.setMode(mode);
        this.btnFullScreen.style.display = (mode == PLAYER_MODE.CONDENSATION) ? "none" : "block";
        this.setPopupBtn();
        this.setSetupBtn();
    }

    setSetupBtn()
    {
        if(this.currentMode == PLAYER_MODE.CONDENSATION)
        {
            this.setupSet.style.display = "none";
            return;
        }
        this.setupSet.style.display = "block";

    }

    setPopupBtn()
    {
        if(this.currentMode == PLAYER_MODE.POPUP || this.currentMode == PLAYER_MODE.CONDENSATION || this.isFullScreen == true)
        {
            this.btnPopup.style.display = "none";
        }
        else
        {
            this.btnPopup.style.display = "block";
        }
    }

    load(vodObject)
    {   
        super.load(vodObject);

        let iconPath = (vodObject.type == VOD_TYPE.AD) ? "" : UIManager.getInstance().getQualityIconPath(vodObject.quality);
        if(iconPath != "")
        {
            this.iconQuality.src = iconPath;
            this.iconQuality.alt = vodObject.quality + "화질";
            this.iconQuality.style.display = "block";
        }else
        {
            this.iconQuality.alt = "";
            this.iconQuality.style.display = "none";
        }
        this.setSetupBtn();
        
    }

    onSetup()
    {
        this.delegate.next(new UIEvent(SETUP_EVENT.OPEN_SETUP));   
    }

    onPopup()
    {
        if(this.vodObject == null) return;
        this.delegate.next(new UIEvent(UI_EVENT.OPEN_POPUP));   
    }

    onFullScreen(isFullScreen)
    {
        //if(this.vodObject == null) return;
        if(isFullScreen == true)
        {
            this.delegate.next(new UIEvent(PLAYER_EVENT.FULLSCREEN_ENTER));
        }
        else
        {
            this.delegate.next(new UIEvent(PLAYER_EVENT.FULLSCREEN_EXIT));
        }

    }

    sendStatus(status)
    {
        switch(status.state)
        {
            case PLAYER_STATE.FULLSCREEN_ENTER:
                this.setFullScreen(true);
                break;
            case PLAYER_STATE.FULLSCREEN_EXIT:
                this.setFullScreen(false);
                break;

        }
    }

    setFullScreen(isFullScreen)
    {
        this.isFullScreen = isFullScreen;
        if(isFullScreen == true)
        {
            this.btnFullScreenOn.style.display = "block";
            this.btnFullScreenOff.style.display = "none";
        }
        else
        {
            this.btnFullScreenOn.style.display = "none";
            this.btnFullScreenOff.style.display = "block";
        } 
        this.setPopupBtn();
    }
}


class PreviewBox extends PlayerUIBox
{
    constructor(body,delegate) 
    {
        super(body,delegate);
        this.btns = null;
        this.msg = null;
    }
    init()
    {   
        this.createElements();
        this.setupEvent();
        this.reset();
        return super.init();
    }
    

    remove()
    {   
        super.remove();
    }
    
    createElements()
    {   
        let elementProvider = new PreviewBoxBody(this.body);
        elementProvider.init();
        elementProvider.writeHTML();
        super.createElements();
        this.msg = elementProvider.getElement("msg");
    }

    removeBtns()
    {
        if(this.btns == null) return;

        for(var i=0;i<this.btns.length;++i)
        {
            this.body.removeChild(this.btns[i]);
        }
        this.btns = null;
        
    }
    createBtns(btnDatas)
    {   
        this.removeBtns();
        this.btns = new Array()
        for(var i=0;i<btnDatas.length;++i)
        {
            
            var btn = document.createElement("button");
            jarvis.lib.addAttribute(btn,"btn-default btn-line-white position-left font-middle");
            var data = btnDatas[i];
            btn.key= data;
            btn.innerHTML = data;
            this.body.appendChild(btn);
            this.btns.push(btn);
            jarvis.lib.addEventListener(btn,"click",this.onBtnSelected.bind(this,btn));
            
        }
    
    }

    uiReset()
    {
       this.removeBtns();
    }

    reset()
    {
        super.reset();
        this.uiReset();
    }

    load(vodObject)
    {
        super.load(vodObject);
        if(this.vodObject.previewData == null) return;
        this.msg.innerHTML = this.vodObject.previewData.msg;
        this.createBtns(this.vodObject.previewData.btns);
    }

    onBtnSelected(btn)
    {
      
        let evt = new UIEvent(UI_EVENT.SELECTED_FUNCTION,btn.key);
        this.delegate.next(evt);
    }

    sendStatus(status)
    {
        switch(status.state)
        {
            case UI_STATE.RESIZE:
                this.setResize(status.value);
                break;

        }
    }

    setResize(rect)
    {
        this.msg.style.width = null;
        var size = jarvis.lib.getAbsoluteBounce(this.body).width;
        var msgSize = jarvis.lib.getRelativeBounce(this.msg);
        var limitW = size - (msgSize.x*2);
        if(msgSize.width > limitW) this.msg.style.width = limitW+"px";
    }

    

}


