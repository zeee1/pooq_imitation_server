class ContextMenu extends AnimationComponentCore
{
    constructor(body,delegate) 
    {
        super(body,delegate);
        this.title = null;
        this.desc = null;
        this.btnClose = null;
    }
    init()
    {   
        this.createElements();
        this.setupEvent();
        this.title.innerHTML = "POOQ Player " + PLAYER_VS;
        this.desc.innerHTML = "TEC " + DataManager.getInstance().info.htmlPlayerType;
        return super.init();
    }

    
   
    remove()
    {   
        if(this.rxAutoCloser) this.rxAutoCloser.unsubscribe();
        super.remove();
    }

    createElements()
    {   
        let elementProvider = new ContextMenuBody(this.body);
        elementProvider.init();
        elementProvider.writeHTML();
        super.createElements(elementProvider); 
        this.desc = elementProvider.getElement("desc");
        this.btnClose = elementProvider.getElement("btnClose");
        this.title = elementProvider.getElement("title");
       
    }

    setupEvent()
    {
        super.setupEvent();
        jarvis.lib.addEventListener(this.btnClose,"click",this.onClose.bind(this));

    }

    clearEvent()
    {
        super.clearEvent();
        jarvis.lib.removeEventListener(this.btnClose,"click",this.onClose.bind(this));
    }

    onClose(btn)
    {
       this.removeAni();
    }

    onSetBitMovin(btn)
    {
       DataManager.getInstance().setSetupValue(SHARED_KEY.PLAYER_TYPE,PLAYER_TYPE.BIT_MOVIN);
       window.location.reload();
    }

    onSetVideoJS(btn)
    {
       DataManager.getInstance().setSetupValue(SHARED_KEY.PLAYER_TYPE,PLAYER_TYPE.VIDEO_JS);
       window.location.reload();
    }

}



class MsgWindow extends AnimationComponentCore
{
    constructor(body,delegate) 
    {
        super(body,delegate);

        this.btnClose = null;
        this.title = null;
        this.msg = null;
        this.bottom = null;   
        this.rxAutoCloser = null;
        
    }
    init()
    {   
        this.createElements();
        this.setupEvent();
        return super.init();

    }

    setMsg(title,msg,btns=null)
    {
       
        this.title.innerHTML = "["+title+"]";
        this.msg.innerHTML = msg;
        if(btns==null)
        {
            this.setDefaultBtns();
        }
        else
        {
            this.createBtns(btns);
        }
        
    }

    setPreviewCompleteMsg(userInfo)
    {
        this.title.innerHTML = userInfo.title;
        this.msg.innerHTML = userInfo.msg;
        this.createBtns(userInfo.btns);
    }

    setApiResultMsg(result)
    {
        this.title.innerHTML = result.title;
        this.msg.innerHTML = result.msg;
        var btns = [FUNCTION_BTN_CODE.retry];
        this.createBtns(btns);
    }

    setInfoMsg(msg,infoTime = 3000)
    {

        this.title.innerHTML = "[알림]";
        this.msg.innerHTML = msg
        var btns = [FUNCTION_BTN_CODE.confirm];
        this.createBtns(btns);

        this.rxAutoCloser = Rx.Observable.interval(infoTime).take(1).subscribe
        (
            this.onClose.bind(this)
        );
    }

    setStatusMsg(status)
    {
    
        this.title.innerHTML = "[ERROR]";
        this.msg.innerHTML = PLAYER_ERROR_MSG[status.state];
        var btns = [FUNCTION_BTN_CODE.retry];
        this.createBtns(btns);
    }

   
    remove()
    {   
        if(this.rxAutoCloser) this.rxAutoCloser.unsubscribe();
        super.remove();
    }

    createElements()
    {   
        let elementProvider = new MsgWindowBody(this.body);
        elementProvider.init();
        elementProvider.writeHTML();
        super.createElements(elementProvider); 
        this.bottom = elementProvider.getElement("bottom");
        this.btnClose = elementProvider.getElement("btnClose");
        this.title = elementProvider.getElement("title");
        this.msg = elementProvider.getElement("msg");
    }

    createBtns(btns)
    {   
        for(var i=0;i<btns.length;++i)
        {
            var btn = document.createElement("button");
            jarvis.lib.addAttribute(btn,"btn-default btn-line font-middle");
            var key = btns[i];
            btn.key = key;
            btn.idx = i;
            btn.innerHTML = key;
            this.bottom.appendChild(btn);
            jarvis.lib.addEventListener(btn,"click",this.onBtnSelected.bind(this,btn));
        }
    }

    setupEvent()
    {
        super.setupEvent();
        jarvis.lib.addEventListener(this.btnClose,"click",this.onClose.bind(this));

    }

    clearEvent()
    {
        super.clearEvent();
        jarvis.lib.removeEventListener(this.btnClose,"click",this.onClose.bind(this));
    }

    onClose()
    {
        if(this.rxAutoCloser) this.rxAutoCloser.unsubscribe();
        this.removeAni();
    }

    onBtnSelected(btn)
    {
        let evt = new ComponentEvent(COMPONENT_EVENT.SELECT_ROW,btn);
        this.delegate.next(evt);
        this.onClose();
    }

}


class InfoTip extends AnimationComponentCore
{
    constructor(body,delegate) 
    {
        super(body,delegate);
        this.btnClose = null;
        this.msg = null; 
        
    }
    init(css="")
    {   
        this.createElements(css);
        jarvis.lib.addAttribute(this.getBody(),css);
        this.setupEvent();
        return super.init();
    }

    setMsg(msg,key)
    {
        this.msg.innerHTML = msg;
        DataManager.getInstance().setSetupValue(key,false);
    }

    remove()
    {   
        super.remove();
    }

    createElements()
    {   
        let elementProvider = new InfoTipBody(this.body);
        elementProvider.init();
        elementProvider.writeHTML();
        super.createElements(elementProvider); 
        this.btnClose = elementProvider.getElement("btnClose");
        this.msg = elementProvider.getElement("msg");
    }

    setupEvent()
    {
        super.setupEvent();
        jarvis.lib.addEventListener(this.btnClose,"click",this.onClose.bind(this));

    }

    clearEvent()
    {
        super.clearEvent();
    }

    onClose()
    {
        this.removeAni();
    }
}



class UserGuide extends AnimationComponentCore
{
    constructor(body,delegate) 
    {
        super(body,delegate);
        this.btnClose = null;
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
        let elementProvider = new UserGuideBody(this.body);
        elementProvider.init();
        elementProvider.writeHTML();
        super.createElements(elementProvider); 
        this.btnClose = elementProvider.getElement("btnClose");
    }

    setupEvent()
    {
        super.setupEvent();
        jarvis.lib.addEventListener(this.btnClose,"click",this.onClose.bind(this));

    }

    clearEvent()
    {
        super.clearEvent();
        jarvis.lib.removeEventListener(this.btnClose,"click",this.onClose.bind(this));
    }

    onClose()
    {
        DataManager.getInstance().setSetupValue(SHARED_KEY.INIT_USER,false);
        this.removeAni();
    }

}
class EpisodeCompleteBox extends ComponentCore
{
    constructor(body,delegate) 
    {
        super(body,delegate);
        this.uiDelegate = new Rx.Subject();
        this.title = null;
        this.btnReplay = null;
        this.prevList = null;
        this.prevImg = null;
        this.prevTitle = null;
        this.prevBtn = null;
        this.nextList = null;
        this.nextImg = null;
        this.nextBtn = null;
        this.nextTitle = null;
        this.vodObject = null;
        this.metaObject = null;
    }
    
    init(vodObject,metaObject)
    {   
        this.vodObject = vodObject;
        this.metaObject = metaObject;
        this.createElements();
        this.setupEvent();
        this.setList(this.metaObject.prevEpisode,"prev");
        this.setList(this.metaObject.nextEpisode,"next");
        this.title.innerHTML = INFO_MSG.COMPLETE_EPISODE;
        this.uiDelegate.next(new UIEvent(UI_EVENT.COMPLETE_BOX_LOADED));
        return super.init();
    }
    
    remove()
    {   
        super.remove();
        this.vodObject = null;
        this.metaObject = null;
    }

    createElements()
    {   
        let elementProvider = new EpisodeCompleteBoxBody(this.body);
        elementProvider.init();
        elementProvider.writeHTML();
        super.createElements(elementProvider); 
        this.title = elementProvider.getElement("infoTitle");
        this.btnReplay = elementProvider.getElement("btnReplay");
        this.prevList = elementProvider.getElement("prevList");
        this.nextList = elementProvider.getElement("nextList");
        this.prevImg = elementProvider.getElement("prevImg");
        this.prevTitle = elementProvider.getElement("prevTitle");
        this.nextImg = elementProvider.getElement("nextImg");
        this.nextTitle = elementProvider.getElement("nextTitle");
        this.prevBtn = elementProvider.getElement("prevBtn");
        this.nextBtn = elementProvider.getElement("nextBtn");

    }

    setList(episode,type)
    {
        if(episode == null)
        {
            this[type+"List"].style.display = "none";
            return;
        }
        this[type+"Img"].src = episode.image;
        let str = (type == "prev") ? "이전회차 "+episode.episodeNumber+"회" : "다음회차 "+episode.episodeNumber+"회";
        this[type+"Title"].innerHTML = str;
        this[type+"Btn"].innerHTML = str;
        jarvis.lib.addEventListener(this[type+"Btn"],"click",this[type+"Play"].bind(this));
        jarvis.lib.addEventListener(this[type+"Btn"],"mouseover",this.onOver.bind(this[type+"Img"]));
        jarvis.lib.addEventListener(this[type+"Btn"],"mouseout",this.onOut.bind(this[type+"Img"]));
    }

    onOver(e)
    {
        jarvis.lib.addAttribute(this,'img-over');
    }
    onOut(e)
    {
        jarvis.lib.removeAttribute(this,'img-over');
    }

    setupEvent()
    {
        super.setupEvent();
        jarvis.lib.addEventListener(this.btnReplay,"click",this.onReplay.bind(this));
    }

    clearEvent()
    {
        super.clearEvent();
        jarvis.lib.removeEventListener(this.btnReplay,"click",this.onReplay.bind(this));
    }
    prevPlay()
    {
        var vodObject = new VodObject(this.vodObject.type,this.metaObject.prevEpisode.contentID,this.vodObject.resolution,this.vodObject.isDVR,true);
        this.delegate.next(new UIEvent(UI_EVENT.CHANGE_VOD,vodObject));
    }
    nextPlay()
    {
        var vodObject = new VodObject(this.vodObject.type,this.metaObject.nextEpisode.contentID,this.vodObject.resolution,this.vodObject.isDVR,true);
        this.delegate.next(new UIEvent(UI_EVENT.CHANGE_VOD,vodObject));
    }
    onReplay()
    {
        this.delegate.next(new UIEvent(PLAYER_EVENT.PLAY));
    }
}

class ClipCompleteBox extends ComponentCore
{
    constructor(body,delegate) 
    {
        super(body,delegate);
        this.uiDelegate = new Rx.Subject();
        this.btnReplay = null;
        this.img = null;
        this.btnFull = null;
       
    }
    
    init(vodObject,metaObject)
    {   
        this.vodObject = vodObject;
        this.metaObject = metaObject;
        this.createElements();
        this.setupEvent();
        if(this.metaObject == null) return;

        switch(this.metaObject.linkType)
        {
            case "channel":
                if(this.metaObject.channelID == "") return;
                this.btnFull.innerHTML = "Live 채널 바로가기";
                break;
            case "onair":
                if(this.metaObject.programID == "") return;
                this.btnFull.innerHTML = "QuickVOD 바로가기";
                break;
            default:
                if(this.metaObject.programID == "") return;
                this.btnFull.innerHTML = "VOD 바로가기";
                break;   

        }
        this.uiDelegate.next(new UIEvent(UI_EVENT.COMPLETE_BOX_LOADED));
        this.img.src =  this.metaObject.image;
        return super.init();
    }
    
    remove()
    {   
        super.remove();
        this.vodObject = null;
        this.metaObject = null;
    }

    createElements()
    {   
        let elementProvider = new ClipCompleteBoxBody(this.body);
        elementProvider.init();
        elementProvider.writeHTML();
        super.createElements(elementProvider);  this.title = elementProvider.getElement("infoTitle");
        this.btnReplay = elementProvider.getElement("btnReplay");
        this.img = elementProvider.getElement("img");
        this.btnFull = elementProvider.getElement("btnFull");

    }



    setupEvent()
    {
        super.setupEvent();
        jarvis.lib.addEventListener(this.btnReplay,"click",this.onReplay.bind(this));
        jarvis.lib.addEventListener(this.btnFull,"click",this.onFullVideo.bind(this));
        jarvis.lib.addEventListener(this.btnFull,"mouseover",this.onOver.bind(this));
        jarvis.lib.addEventListener(this.btnFull,"mouseout",this.onOut.bind(this));
    }

   
    clearEvent()
    {
        super.clearEvent();
        jarvis.lib.removeEventListener(this.btnReplay,"click",this.onReplay.bind(this));
        jarvis.lib.removeEventListener(this.btnFull,"click",this.onFullVideo.bind(this));
        jarvis.lib.removeEventListener(this.btnFull,"mouseover",this.onOver.bind(this));
        jarvis.lib.removeEventListener(this.btnFull,"mouseout",this.onOut.bind(this));
    }

    onOver(e)
    {
        jarvis.lib.addAttribute(this.img,'img-over');
    }
    onOut(e)
    {
        jarvis.lib.removeAttribute(this.img,'img-over');
    }
    onFullVideo()
    {
        var path = "";
        switch(this.metaObject.linkType)
        {
            case "channel":
                path = "https://www.pooq.co.kr/player/live.html?channelid="+this.metaObject.channelID;
                break;
            case "onair":
            default:
                path = "https://www.pooq.co.kr/player/vod.html?programid="+this.metaObject.programID;
                break;   

        }
        location.href = path;
        
    }
   
    onReplay()
    {

        this.delegate.next(new UIEvent(PLAYER_EVENT.PLAY));
    }
}


class CompleteUI extends ComponentCore
{
    constructor(body,delegate) 
    {
        super(body,delegate);
        this.uiDelegate = new Rx.Subject();
        this.uiSet = null;
        this.loadingSpiner = null;
        
    }
    init()
    {
        this.uiSet.style.opacity = 0;
        this.setLoading(true);
        return super.init();
    }

    inited()
    {   
        this.setLoading(false);
        jarvis.lib.addAttribute(this.uiSet,"animate-in");    
        this.uiSet.style.opacity = 1;
    }

    createElements(elementProvider)
    {   
        super.createElements(elementProvider); 
        this.loadingSpiner = new LoadingSpiner(elementProvider.getElement('loadingSpiner'));
        this.uiSet = elementProvider.getElement("uiSet ");
    }

    setLoading(isLoading)
    {
        if(isLoading)
        {
            this.loadingSpiner.play();
        }
        else
        {
            this.loadingSpiner.stop();
        }
    }

}

class RecommendVodBox extends CompleteUI
{
    constructor(body,delegate) 
    {
        super(body,delegate);
        this.listWidth = -1;
        this.listMargin = 10;
        this.listSize = 3;
        this.title = null;
        this.vodObject = null;
        this.metaObject = null;
        this.uiSet = null;
        this.listArea = null;
        this.btnPrev = null;
        this.btnNext = null;
        this.pageIdx = 0;
        this.totalPage =0;
        this.recommendationInfo = null;
        this.datas = new Array();
        this.lists = new Array();
    }
    init(vodObject,metaObject)
    {   
        this.vodObject = vodObject;
        this.metaObject = metaObject;
        this.createElements();
        this.setListSize();
        this.setupEvent();
        this.load();
        return super.init();
    }

    setListSize()
    {
       
       switch(this.metaObject.contentType)
       {
            case VOD_TYPE.MOVIE:
            case VOD_TYPE.PROGRAM:
                this.listWidth = 130;
                this.listSize = 5;
                jarvis.lib.addAttribute(this.btnPrev,'btn-v');
                jarvis.lib.addAttribute(this.btnNext,'btn-v');
                break;

            default:
                this.listWidth = 206;
                this.listSize = 3;
                break;

        }
    }

    load()
    {
        let that = this;
        var delegate=function(){}; 
            delegate.prototype = {
                onEvent : function(e,value)
                {
                    switch(e){
                        case jarvis.EVENT.COMPLETE:
                            that.setDatas(value);
                        
                            break;

                        case jarvis.EVENT.ERROR:
                            that.title.innerHTML = INFO_MSG.COMPLETE_DEFAULT;
                            break;

                    }
                    that.inited();

                }
            }

        DataManager.getInstance().getPostRecommendations(this.metaObject,new delegate());
        
    }
    
    remove()
    {   
        super.remove();
        this.removeLists();
        this.vodObject = null;
        this.recommendationInfo = null;
    }

    createElements()
    {   
        let elementProvider = new RecommendVodBoxBody(this.body);
        elementProvider.init();
        elementProvider.writeHTML();
        super.createElements(elementProvider); 
        this.title = elementProvider.getElement("infoTitle");
        this.btnPrev = elementProvider.getElement("btnPrev");
        this.btnNext = elementProvider.getElement("btnNext");
        this.uiSet = elementProvider.getElement("uiSet");
        this.listArea = elementProvider.getElement("listArea");
    }
    
    setDatas(recommendationInfo)
    {
        if(this.vodObject == null) return;
        this.recommendationInfo = recommendationInfo;
        this.datas = this.recommendationInfo.getLists(this.vodObject);
        if(this.datas.length<1)
        {
            this.title.innerHTML = INFO_MSG.COMPLETE_DEFAULT;
            return;
        }
        this.uiDelegate.next(new UIEvent(UI_EVENT.COMPLETE_BOX_LOADED));
        this.title.innerHTML = (this.vodObject.type == VOD_TYPE.MOVIE) ? INFO_MSG.COMPLETE_RECOMMEND_MOVIE : INFO_MSG.COMPLETE_RECOMMEND;
        this.totalPage = Math.ceil(this.datas.length / this.listSize);
        this.pageIdx = 0;
        this.setLists();
        
    }

    setLists()
    {
        jarvis.lib.removeAttribute(this.btnPrev,'btn-passive');
        jarvis.lib.removeAttribute(this.btnNext,'btn-passive');
        if((this.totalPage-1) <= this.pageIdx) jarvis.lib.addAttribute(this.btnNext,'btn-passive');
        if(0 >= this.pageIdx) jarvis.lib.addAttribute(this.btnPrev,'btn-passive');
        this.removeLists();

        let start = this.pageIdx * this.listSize;
        var end = start + this.listSize;
        end = (end > this.datas.length) ? this.datas.length : end;
        var size = 700;//jarvis.lib.getAbsoluteBounce(this.listArea).width;
        var fullWidth = (this.listWidth*this.listSize) + (this.listMargin*(this.listSize-1));
        var posX = Math.floor((size - fullWidth)/2);
        var that = this;
        for(var i =start; i<end;++i)
        {
            var list = null;
            switch(this.metaObject.contentType)
            {
                case VOD_TYPE.MOVIE:
                    list = new RecommendMovieList(this.listArea,this.delegate)
                    break;
                case VOD_TYPE.PROGRAM:
                    list = new RecommendProgramList(this.listArea,this.delegate);
                    break;
                default:
                    list = new RecommendVodList(this.listArea,this.delegate);
                    break;

            }
            list.init(this.datas[i],(i-start) * 50);
            this.lists.push(list);
            list.cell.style.left = posX + "px";
            list.cell.style.top = 0;
            posX += (this.listWidth+this.listMargin);
        }
    }

    removeLists()
    {
        for(var i =0; i<this.lists.length;++i)
        {
            this.lists[i].remove();
        }
        this.lists = new Array();
    }


    setupEvent()
    {
        super.setupEvent();
        jarvis.lib.addEventListener(this.btnPrev,"click",this.onPrev.bind(this));
        jarvis.lib.addEventListener(this.btnNext,"click",this.onNext.bind(this));

    }

    clearEvent()
    {
        super.clearEvent();
        jarvis.lib.removeEventListener(this.btnPrev,"click",this.onPrev.bind(this));
        jarvis.lib.removeEventListener(this.btnNext,"click",this.onNext.bind(this));
    }

    onPrev()
    {
        let idx = this.pageIdx -1;
        if(idx < 0) return;
        this.pageIdx = idx;
        this.setLists();
    }

    onNext()
    {
        let idx = this.pageIdx +1;
        if(idx >= this.totalPage) return;
        this.pageIdx = idx;
        this.setLists();
    }

}

class RecommendList extends AnimationComponentCore
{
    constructor(body,uiDelegate) 
    {
        super(body);
        this.uiDelegate = uiDelegate;
        this.btn = null;
        this.img = null;
        this.aniBody = null;
        this.episodeObject = null;
       
    }

    doReadyAni()
    {
        super.doReadyAni();
        this.aniBody.style.top = "100px";
    }

    doInitAni()
    {
        super.doInitAni();
        this.aniBody.style.top = 0;
    }

    init(episodeObject,delay)
    {   
        this.episodeObject = episodeObject;
        this.createElements();
        this.setupEvent();
        this.img.src = this.episodeObject.image;
        return super.init(delay);
    }

    remove()
    {   
        super.remove();
        this.episodeObject = null;
        this.uiDelegate = null;
    }
    createElements(elementProvider)
    {
        super.createElements(elementProvider);
    }

    setupEvent()
    {
        super.setupEvent();
        jarvis.lib.addEventListener(this.btn,"click",this.onSelected.bind(this));
        jarvis.lib.addEventListener(this.btn,"mouseover",this.onOver.bind(this));
        jarvis.lib.addEventListener(this.btn,"mouseout",this.onOut.bind(this));
    }

    clearEvent()
    {
        super.clearEvent();
        jarvis.lib.removeEventListener(this.btn,"click",this.onSelected.bind(this));
        jarvis.lib.removeEventListener(this.btn,"mouseover",this.onOver.bind(this));
        jarvis.lib.removeEventListener(this.btn,"mouseout",this.onOut.bind(this));
    }

    onOver(e)
    {
        jarvis.lib.addAttribute(this.img,'img-over');
    }
    onOut(e)
    {
        jarvis.lib.removeAttribute(this.img,'img-over');
    }

    onSelected()
    {
    }

}


class RecommendVodList extends RecommendList
{
    constructor(body,uiDelegate) 
    {
        super(body,uiDelegate);
        this.title = null;
        this.subTitle = null;   
    }


    init(episodeObject,delay)
    {   
        super.init(episodeObject,delay);
        this.title.innerHTML = this.episodeObject.title;
        this.subTitle.innerHTML = this.episodeObject.subTitle;
        return this.delegate;
    }

    remove()
    {   
        super.remove();
    }

    createElements()
    {   
        let elementProvider = new RecommendVodListBody(this.body);
        elementProvider.init();
        elementProvider.writeHTML();
        super.createElements(elementProvider); 
        this.aniBody = elementProvider.getElement("aniBody");
        this.title = elementProvider.getElement("title");
        this.subTitle = elementProvider.getElement("subTitle");
        this.img = elementProvider.getElement("img");
        this.btn = elementProvider.getElement("btn");
    }

    onSelected()
    {
        var vodObject = new VodObject(this.episodeObject.type,this.episodeObject.contentID,null,null,true);
        this.uiDelegate.next(new UIEvent(UI_EVENT.CHANGE_VOD,vodObject));
    }

}

class RecommendProgramList extends RecommendList
{
    constructor(body,uiDelegate) 
    {
        super(body,uiDelegate);
        this.subTitle = null;       
    }

    init(episodeObject,delay)
    {   
        super.init(episodeObject,delay);
        this.subTitle.innerHTML = this.episodeObject.subTitle;
        return this.delegate;
    }

    remove()
    {   
        super.remove();
    }

    createElements()
    {   
        let elementProvider = new RecommendProgramListBody(this.body);
        elementProvider.init();
        elementProvider.writeHTML();
        super.createElements(elementProvider); 
        this.aniBody = elementProvider.getElement("aniBody");
        this.subTitle = elementProvider.getElement("subTitle");
        this.img = elementProvider.getElement("img");
        this.btn = elementProvider.getElement("btn");
    }

    onSelected()
    {
        let that = this;
        var delegate=function(){}; 
            delegate.prototype = {
                onEvent : function(e,value)
                {
                    switch(e){
                        case jarvis.EVENT.COMPLETE:
                            that.move(value);
                            break;

                        case jarvis.EVENT.ERROR:
                            that.move(that.episodeObject.contentID);
                            break;

                    }
                }
            }

        DataManager.getInstance().getContentID(this.episodeObject.contentID,new delegate());

       
    }

    move(contentID)
    {
        var vodObject = new VodObject(this.episodeObject.type,contentID,null,null,true);
        this.uiDelegate.next(new UIEvent(UI_EVENT.CHANGE_VOD,vodObject));
    }

}

class RecommendMovieList extends RecommendList
{
    constructor(body,uiDelegate) 
    {
        super(body,uiDelegate);
        this.icon = null;
    }

    init(episodeObject,delay)
    {   
        super.init(episodeObject,delay);
        let iconPath = UIManager.getInstance().getAgeIconPath(this.episodeObject.targetAge);
        if(iconPath == "")
        {
            this.icon.style.display = "none";
        }
        else
        {
            this.icon.src = iconPath;
        }
        return this.delegate;
    }

    remove()
    {   
        super.remove();
    }

    createElements()
    {   
        let elementProvider = new RecommendMovieListBody(this.body);
        elementProvider.init();
        elementProvider.writeHTML();
        super.createElements(elementProvider); 
        this.aniBody = elementProvider.getElement("aniBody");
        this.icon = elementProvider.getElement("icon");
        this.img = elementProvider.getElement("img");
        this.btn = elementProvider.getElement("btn");
    }

    onSelected()
    {
        var vodObject = new VodObject(this.episodeObject.type,this.episodeObject.contentID,null,null,true);
        this.uiDelegate.next(new UIEvent(UI_EVENT.CHANGE_VOD,vodObject));
    }

}


class CompleteBox extends AnimationComponentCore
{
    constructor(body,delegate) 
    {
        super(body,delegate);
        this.type = "";
        this.btnClose = null;
        this.btnReplay = null;
        this.replaySet = null;
        this.uiArea = null;
        this.component = null;
        this.hasComponent = false;
        this.finalSize = null;
        this.MIN_WIDTH = 750;
        this.currentMode = "";
    }
    init(type,mode,vodObject,value)
    {   
        this.type = type;
        this.createElements(vodObject,value);
        this.setupEvent();
        this.setMode(mode);
        return super.init();
    }
    
    remove()
    {   
        super.remove();
    }

    createElements(vodObject,value)
    {   
        let elementProvider = new CompleteBoxBody(this.body);
        elementProvider.init();
        elementProvider.writeHTML();
        super.createElements(elementProvider); 
        this.btnClose = elementProvider.getElement("btnClose");
        this.btnReplay = elementProvider.getElement("btnReplay");
        this.replaySet = elementProvider.getElement("replaySet");
        this.uiArea = elementProvider.getElement("uiArea");
        let that = this;
        switch(this.type)
        {
            case COMPLETE_TYPE.EPISODE :
                this.component = new EpisodeCompleteBox(this.uiArea,this.delegate);
                break;
            case COMPLETE_TYPE.CLIP :
                this.component = new ClipCompleteBox(this.uiArea,this.delegate);
                break;
            case COMPLETE_TYPE.RECOMMEND :
                this.component = new RecommendVodBox(this.uiArea,this.delegate);
                break;
        }
        this.component.uiDelegate.subscribe
        (
            {
                next(value)
                {
                    that.hasComponent = true;
                    that.checkComponent();

                }
            }
        ); 
        this.component.init(vodObject,value);
    }

    setupEvent()
    {
        super.setupEvent();
        jarvis.lib.addEventListener(this.btnClose,"click",this.onClose.bind(this));
        jarvis.lib.addEventListener(this.btnReplay,"click",this.onReplay.bind(this));

    }

    clearEvent()
    {
        super.clearEvent();
        jarvis.lib.removeEventListener(this.btnClose,"click",this.onClose.bind(this));
        jarvis.lib.removeEventListener(this.btnReplay,"click",this.onReplay.bind(this));
    }

    setMode(mode)
    {
        this.currentMode = mode;
        this.checkComponent();
    }
    checkComponent()
    {
        var isAble = true;
        if(this.currentMode == PLAYER_MODE.CONDENSATION) isAble = false;
        if(this.component == null) isAble = false;
        if(this.hasComponent == false) isAble = false;
        if(this.finalSize != null && this.finalSize.width < this.MIN_WIDTH) isAble = false;
        
        if(isAble)
        {
            this.uiArea.style.display = "block";
            this.replaySet.style.display = "none";
        }else
        {
            this.uiArea.style.display = "none";
            this.replaySet.style.display = "block";
        }
    }

    setResize(bounce)
    {
        this.finalSize = bounce;
        this.checkComponent();
    }

    onClose()
    {
        if(this.component != null) this.component.remove();
        this.component = null;
        this.removeAni();
    }

    onReplay()
    {
        this.delegate.next(new UIEvent(PLAYER_EVENT.PLAY));
    }

}






