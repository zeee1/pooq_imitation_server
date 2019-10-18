
class ListBox extends ComponentCore
{
	constructor(body) 
	{
     	super(body);
        this.loadingSpiner = null;
        this.topNavi = null;
        this.lists = null;
        this.nodata = null;
        this.textNodata = null;
        this.metaObject = null;
        this.vodObject = null;
        this.isView = false;

        this.listInfo = null;
        this.isReset = true;
        this.mode = "";
        this.isFullScreen = false;
        this.screenWidth = 1280;
    }

    init()
    {   
        this.createElements();
        this.setupEvent();
        this.setUIView(false);
        return super.init();
    }

    remove()
    {   
        super.remove();
    }
    
    createElements()
    {   
        let that = this;
        let elementProvider = new ListBoxBody(this.body);
        elementProvider.init();
        elementProvider.writeHTML();
        super.createElements(elementProvider);
        this.loadingSpiner = new LoadingSpiner(elementProvider.getElement('loadingSpiner'));
        this.nodata = elementProvider.getElement("nodata");
        this.textNodata = elementProvider.getElement("textNodata")
        this.lists = new Lists(elementProvider.getElement("listsArea"));
        this.lists.init(elementProvider).subscribe
        (
            this.sendEvent.bind(this)
        ); 

        this.topNavi = new TopNavi(elementProvider.getElement("topArea"));
        this.topNavi.init().subscribe
        (
            this.sendEvent.bind(this)
        ); 

    }

    setupEvent()
    {
        super.setupEvent();
        this.attachEvent(this.body,"resize",this.onResize.bind(this));

    }

    clearEvent()
    {
        super.clearEvent();
    }

    reset()
    {
        this.metaObject = null;
        this.vodObject = null;
        this.isReset = true;
        
    }

    sendEvent(value)
    {
        switch(value.type)
        {
            case UI_EVENT.LIST_NAVI_CAHNGED:
                this.loadDatas(value.value);
                break;
            case UI_EVENT.CHANGE_VOD:
                this.delegate.next(value);
                break;
            case COMPONENT_EVENT.SCROLL_LIST_BOTTOM:
                this.addedLoadDatas();
                break;
        }
    }

    setMode(mode)
    {
        this.mode = mode;
        this.setAble();
    }
    setFullScreen(isFullScreen)
    {
        this.isFullScreen = isFullScreen;
        this.onResize();
        this.setAble();
    }

    loadedMeta(metaObject,vodObject)
    {
        
        if(this.isReset == false) return;
        if(vodObject.type != VOD_TYPE.AD)
        {
            this.metaObject = metaObject;
            this.vodObject = vodObject;
        }
        this.setAble();
    }

    setAble()
    {
        var able = true;
        if(this.mode == PLAYER_MODE.CONDENSATION || this.mode == PLAYER_MODE.CUSTOM) able = false;
        if(this.mode == PLAYER_MODE.DEFAULT && this.isFullScreen==false) able = false;
        if(this.metaObject == null || this.vodObject == null) able = false;

       // let minWidth = DYNAMIC_SIZE.LIST_PLAYER_MIN_WIDTH + DYNAMIC_SIZE.LIST_WIDTH;
        //if(this.screenWidth <= minWidth && this.isFullScreen==false) able = false;
        if(able)
        {
            this.loadStart();
        }
        else
        {
            this.setUIView(false);
        }
        this.delegate.next(new UIEvent(UI_EVENT.LIST_STATUS_CAHNGED,able));

    }

    loadStart()
    {

        if(this.isReset == false) return;
        
        this.isReset = false;
        this.lists.dataLoad( this.vodObject);
        this.topNavi.dataLoad( this.metaObject ,this.vodObject);
       
    }

    addedLoadDatas()
    {
        if(this.listInfo == null) return;
        if(this.listInfo.isLoadAble() == false) return;
        this.loadDatasAction(false);
    }

    loadDatas(type)
    {
        if(this.metaObject == null) return;
        var apiType = "";
        var key = this.metaObject.programID;
         
        this.topNavi.setSelected(type);
         switch(type)
        {
            case LIST_TOP_TYPE.NEW_VOD:
                apiType = API_COMMAND.LIST_VOD_NEW;
                break;
            case LIST_TOP_TYPE.POPULAR_VOD:
                apiType = API_COMMAND.LIST_VOD_POPULAR;
                break;
            case LIST_TOP_TYPE.PROGRAM_VOD:
                apiType = API_COMMAND.LIST_VOD_PROGRAM;
                break;
            case LIST_TOP_TYPE.POPULAR_LIVE:
                apiType = API_COMMAND.LIST_LIVE_POPULAR;
                break;

            case LIST_TOP_TYPE.POPULAR_MOVIE:
                apiType = API_COMMAND.LIST_MOVIE_NEW;
                break;
            case LIST_TOP_TYPE.RECOMMEND_MOVIE:
                apiType = API_COMMAND.LIST_MOVIE_RECOMMEND;
                break;
            case LIST_TOP_TYPE.THEME:
                key = this.metaObject.contentID;
                apiType = API_COMMAND.LIST_THEME;
                break;
            default :
                return;
        }
        this.nodata.style.display = "none";
        this.listInfo = new ListInfo(apiType,20,key);
        this.loadDatasAction(true);
        
    }
    loadDatasAction(isReset)
    {
        this.setLoading(true);
        let that = this;
        var delegate=function(){}; 
            delegate.prototype = {
                onEvent : function(e,value)
                {
                    that.loadedDatas(isReset);  
                }
            }

        DataManager.getInstance().getLists(this.listInfo,new delegate());
        
    }

    loadedDatas(isReset)
    {
        this.setLoading(false);
        this.nodata.style.display = (this.listInfo.lists.length<1) ? "block" : "none";
        this.lists.reloadData(this.listInfo.lists,isReset);
    }

    toggleUIView()
    {
        var isView = (this.isView == false) ? true : false; 
        this.setUIView(isView);
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

    onResize()
    {
        var bounce=jarvis.lib.getAbsoluteBounce(this.body);
        var bounceTop=jarvis.lib.getRelativeBounce(this.topNavi.body);
        let h = bounce.height - bounceTop.height -  bounceTop.y;
        this.lists.body.style.height = h+"px";
    }

    setUIView(isView = true)
    {
        if(this.isView != isView)
        {
            this.isView = isView;
            if(isView)
            {
                jarvis.lib.removeAttribute(this.body,'animate-out list-box-hidden');
                jarvis.lib.addAttribute(this.body,'animate-in');
            }
            else
            {
                jarvis.lib.removeAttribute(this.body,'animate-in');
                jarvis.lib.addAttribute(this.body,'animate-out list-box-hidden');
            }
            this.lists.onResize();
            let  evt = new UIEvent(UI_EVENT.LIST_BOX_OPEN_CAHNGED,this.isView);
            this.delegate.next(evt);

            this.topNavi.setUIView(isView);
            this.lists.setUIView(isView);
        }
       
    }

    setResize(screenWidth)
    {
        this.screenWidth = screenWidth;
        this.setAble();
    }
}

class TopNavi extends ComponentCore
{
    constructor(body) 
    {
        super(body);
        this.vodObject = null;
        this.metaObject = null;
        this.pointer = null;
        this.btns = new Array();
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
        this.vodObject = null;
    }
    
    createElements()
    {   
        let elementProvider = new TopNaviBody(this.body);
        elementProvider.init();
        elementProvider.writeHTML();
        super.createElements(elementProvider);
        this.pointer = elementProvider.getElement("pointer");
        this.btns.push(elementProvider.getElement("btnNavi0"));
        this.btns.push(elementProvider.getElement("btnNavi1"));
        this.btns.push(elementProvider.getElement("btnNavi2"));
        this.setUIView(false);
    }

    setupEvent()
    {
        super.setupEvent();
        for(var i=0;i<this.btns.length;++i)
        {   
            var btn = this.btns[i];
            btn.idx= i;
            jarvis.lib.addEventListener(this.btns[i],"click",this.onSelected.bind(this,btn));
        }
    }

    clearEvent()
    {
        super.clearEvent();

        for(var i=0;i<this.btns.length;++i)
        {   
            jarvis.lib.removeEventListener(this.btns[i],"click",this.onSelected.bind(this));
        }
    }

    dataLoad(metaObject,vodObject)
    {
        if(this.vodObject == null || (this.vodObject.type != vodObject.type))
        {
            this.metaObject = metaObject;
            this.vodObject = vodObject;
            this.onNaviChange();
            return;
        }
        var needChange = false;
        switch(vodObject.type)
        {
            case VOD_TYPE.VOD:
            needChange = (this.metaObject.programID != metaObject.programID) ? true : false;
            break;
        }
        this.metaObject = metaObject;
        this.vodObject = vodObject; 
        if(needChange == true) this.onNaviChange();

    }
    
    setSelected(type)
    {
        var selectedBtn = null;
        for(var i=0;i<this.btns.length;++i)
        {   
            var btn = this.btns[i];
            jarvis.lib.removeAttribute(btn,'btn-navi-selected');
            if(btn.key == type) selectedBtn = btn;
        }
        if(selectedBtn == null) return;
        jarvis.lib.addAttribute(selectedBtn,'btn-navi-selected');
        let bounce = jarvis.lib.getRelativeBounce(selectedBtn);
        this.pointer.style.width = bounce.width+"px";
        this.pointer.style.left = bounce.x+"px";
    }

    onNaviChange()
    {
        var types = new Array();
        switch(this.vodObject.type)
        {
            case VOD_TYPE.VOD:
                types.push(LIST_TOP_TYPE.PROGRAM_VOD);
                types.push(LIST_TOP_TYPE.POPULAR_VOD);
                types.push(LIST_TOP_TYPE.POPULAR_LIVE);
                break;

            case VOD_TYPE.MOVIE:
                if(this.metaObject == null || this.metaObject.isPooqZone == false)
                {
                    types.push(LIST_TOP_TYPE.RECOMMEND_MOVIE);
                    types.push(LIST_TOP_TYPE.POPULAR_MOVIE);
                    types.push(LIST_TOP_TYPE.THEME);
                }
                else
                {
                    types.push(LIST_TOP_TYPE.POPULAR_MOVIE);
                    types.push(LIST_TOP_TYPE.POPULAR_VOD);
                    types.push(LIST_TOP_TYPE.POPULAR_LIVE);
                }
                
                break;

            default:
                types.push(LIST_TOP_TYPE.NEW_VOD);
                types.push(LIST_TOP_TYPE.POPULAR_VOD);
                types.push(LIST_TOP_TYPE.POPULAR_LIVE);
                break;
        }
        this.createNavi(types);
        let  evt = new UIEvent(UI_EVENT.LIST_NAVI_CAHNGED,this.btns[0].key);
        this.delegate.next(evt);
    }

    setUIView(isView)
    {
        for(var i=0;i<this.btns.length;++i)
        {   
            this.btns[i].tabIndex = (isView) ? null : "-1";
        }
    }

    createNavi(types)
    {
        let lang = types.length;
        let size = Math.floor(jarvis.lib.getAbsoluteBounce(this.body).width / types.length);
        console.log("size : " + size);
        for(var i=0;i<this.btns.length;++i)
        {   
            
            var btn = this.btns[i];
            if(i<lang)
            {
                var type = types[i];
                btn.key = type;
                btn.innerHTML = type;
                btn.style.width = size+"px";
                btn.style.display = "block";
            }else
            {
                btn.style.display = "none";
            }
        }
    }

    onSelected(btn)
    {
        let  evt = new UIEvent(UI_EVENT.LIST_NAVI_CAHNGED,btn.key);
        this.delegate.next(evt);
    }

}


class Lists extends ComponentCore
{
    constructor(body,delegate) 
    {
        super(body,delegate);

        this.LIST_VOD_HEIGHT = 112;
        this.LIST_MOVIE_HEIGHT = 223;
        this.LIST_THEME_HEIGHT = 196;
        this.lineHeight = -1;
        this.datas = new Array();
        this.lists = new Array();
        this.scrollLists = null;
        this.selectedList = null;
        this.type = "";
        this.isView = false;
    }

    init(elementProvider)
    {   
        this.createElements(elementProvider);
        this.setupEvent();
        return super.init();
    }

    dataLoad(vodObject)
    {
        this.vodObject = vodObject;
    }

    reloadData(datas,isReset)
    {
        this.datas = datas;
        if(this.datas.length > 0)
        {
            this.type = this.datas[0].type;
            switch(this.type)
            {
                case VOD_TYPE.MOVIE:
                    this.lineHeight = this.LIST_MOVIE_HEIGHT; 
                    break;
                case LIST_TYPE.THEME:
                    this.lineHeight = this.LIST_THEME_HEIGHT; 
                    break;
                default:
                    this.lineHeight = this.LIST_VOD_HEIGHT; 
                    break;
            }
             

        }
        this.scrollLists.reloadData(datas.length,isReset,this.lineHeight)
    }
    
    remove()
    {   
        this.removeLists();
        if(this.scrollLists!=null)
        {
            this.scrollLists.remove();
            this.scrollLists = null;
        }
        super.remove();
     
    }

    createElements(elementProvider)
    {   
        super.createElements();
        this.scrollLists = new ScrollLists(elementProvider.getElement('listsArea'),this.lineHeight);
        this.scrollLists.init();
    }

    setupEvent()
    {
        super.setupEvent();
        let that = this;
        this.scrollLists.delegate.subscribe
        (
            {
                next(evt)
                {
                    switch(evt.type)
                    {
                        case COMPONENT_EVENT.ADD_ROW:
                            that.createList(evt.row,evt.value);
                            break;
                        case COMPONENT_EVENT.REMOVE_ROW:
                            that.removeList(evt.value);
                            break;
                        case COMPONENT_EVENT.SCROLL_LIST_BOTTOM :
                            that.delegate.next(evt);
                            break;
                     

                    } 
                }
            }
        ); 
        
    }

    clearEvent()
    {
        super.clearEvent();          
    }


    getList(row,idx)
    {   
        if(idx<0) return null;
        if(idx >= this.datas.length) return null;
        let list = null;
        switch(this.type)
        {
            case VOD_TYPE.MOVIE:
                list = new MovieList(row);
                break;
            case LIST_TYPE.THEME:
                list = new ThemeList(row);
                break;
            default:
                list = new VodList(row);
                break;
        }
        return list;
    }

    createList(row,idx)
    {
        let list= this.getList(row,idx);
        if(list == null) return;
        let data = this.datas[idx];
        list.init(data).subscribe ( this.onSelectedList.bind(this)); 
        
        list.setUIView(this.isView);
        this.lists[idx] = list;

        if(this.vodObject == null) return;
        if(this.vodObject.contentID == data.contentID) this.setSelectedList(list);
    }
    
    setSelectedList(list)
    {
        if(this.selectedList != null) this.selectedList.setSelected(false);
        this.selectedList = list;
        list.setSelected(true);
    }

    onSelectedList(value)
    {
        this.setSelectedList(value.row);
        let listObject = value.value;
        var vodObject = new VodObject(listObject.type,listObject.contentID,null,false,true);
        this.delegate.next(new UIEvent(UI_EVENT.CHANGE_VOD,vodObject));
    }

    setUIView(isView)
    {
        this.isView = isView;
        if(this.lists != null)
        {
            for(var i=0; i<this.lists.length;++i)
            {
               if(this.lists[i] != null) this.lists[i].setUIView(this.isView);
            }   
        }
    }

    removeLists()
    {
        if(this.lists != null)
        {
            for(var i=0; i<this.lists.length;++i)
            {
                this.removeList(i);
            }
            this.lists = null;
        }
    }

    getSelectedList(value)
    {
        if(this.lists != null)
        {
            for(var i=0; i<this.lists.length;++i)
            {
                if(this.lists[i] != null) if(this.lists[i].hasValue(value) == true ) return this.lists[i];
            }   
        }
        return null;
    }

    removeList(idx)
    {
        if(this.lists[idx] == null) return;
        if(this.selectedList == this.lists[idx]) this.selectedList = null;
        this.lists[idx].remove();
        this.lists[idx] = null;
    }

    onResize()
    {
        this.scrollLists.onResize();
    }
}

class ThemeList extends ScrollListCore
{
    constructor(body) 
    {
        super(body);
        this.btn = null;
        this.title = null;
        this.textListNum = null;
        this.themeObject = null;
        
    }
    init(themeObject)
    {   
        this.themeObject = themeObject;
        this.createElements();
        this.setupEvent();
        this.title.innerHTML = this.themeObject.viewTitle;
        this.textListNum.innerHTML = this.themeObject.listNum;
        
        return super.init();
    }

    delayInit()
    { 
        if(this.themeObject != null) this.img.src = this.themeObject.image;
    }

    remove()
    {   
        super.remove();
        this.themeObject = null;
        this.img.src = null;
    }

    createElements()
    {   
        let elementProvider = new ThemeListBody(this.body);
        elementProvider.init();
        elementProvider.writeHTML();
        super.createElements(elementProvider); 
        this.title = elementProvider.getElement("title");
        this.textListNum = elementProvider.getElement("textListNum");
        this.img = elementProvider.getElement("img"); 
        this.btn = elementProvider.getElement("btn");
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


    setUIView(isView)
    {
        this.btn.tabIndex = (isView) ? null : "-1";
    }

    onSelected()
    {
        if(this.themeObject == null) return;
        if(this.themeObject.viewMore == "") return;

        window.open(this.themeObject.viewMore);
    }

}


class VodList extends ScrollListCore
{
    constructor(body) 
    {
        super(body);
        this.btn = null;
        this.title = null;
        this.subTitle = null;
        this.img = null;
        this.icon = null;
        this.progress = null;
        this.listObject = null;
        this.isSelected = false;
    }
    init(listObject)
    {   
        this.listObject = listObject;
        this.createElements();
        this.setupEvent();
        this.title.innerHTML = this.listObject.viewTitle;
        this.subTitle.innerHTML = this.listObject.subTitle;
        if(this.listObject.type == VOD_TYPE.QVOD)
        {
            this.icon.style.display = 'block';
            this.icon.src = UIManager.getInstance().getInfoIconPath(IMG_PATH.ICON_QVOD);
        }
        let ratio = (this.listObject.type == VOD_TYPE.LIVE) ? this.listObject.playRatio : this.listObject.viewRatio;
        if(this.progress) this.progress.style.width = (ratio * 100) +"%";
        
        
        return super.init();
    }

    delayInit()
    { 
        if(this.listObject != null) this.img.src = this.listObject.image;
    }

    remove()
    {   
        super.remove();
        this.listObject = null;
        this.img.src = null;
    }

    getElementProvider()
    {
        return new VodListBody(this.body);
    }

    createElements()
    {   
        let elementProvider = this.getElementProvider();
        elementProvider.init();
        elementProvider.writeHTML();
        super.createElements(elementProvider); 
        this.title = elementProvider.getElement("title");
        this.subTitle = elementProvider.getElement("subTitle");
        this.img = elementProvider.getElement("img");
        this.icon = elementProvider.getElement("icon");
        this.btn = elementProvider.getElement("btn");
        this.progress = elementProvider.getElement("progress");
        this.doCreateElements(elementProvider);
    }

    doCreateElements(elementProvider)
    {   
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


    setUIView(isView)
    {
        this.btn.tabIndex = (isView) ? null : "-1";
    }

    setSelected(isSelected)
    {
       if(isSelected == this.isSelected) return;
       this.isSelected = isSelected;
       if(this.isSelected)
       {
            jarvis.lib.addAttribute(this.cell,'list-selected');
       }
       else
       {
            jarvis.lib.removeAttribute(this.cell,'list-selected');
       }
    }

}


class MovieList extends VodList
{
    constructor(body) 
    {
        super(body);
        this.starRate = null;
        this.iconAge = null;
        this.textDuration = null;
    }

    init(listObject)
    {   
        super.init(listObject);
        let iconPath = UIManager.getInstance().getAgeIconPath(this.listObject.targetAge);
        if(iconPath == "")
        {
            this.iconAge.style.display = "none";
        }
        else
        {
            this.iconAge.src = iconPath;
        }
        this.textDuration.innerHTML = this.listObject.playTime;
        this.starRate.style.width = (100 * this.listObject.rate / 10) + "px";
        return this.delegate;
    }

    getElementProvider()
    {
        return new MovieListBody(this.body);
    }

    doCreateElements(elementProvider)
    {   
        this.textDuration = elementProvider.getElement("textDuration");
        this.iconAge = elementProvider.getElement("iconAge");
        this.starRate = elementProvider.getElement("starRate");
        
    }
}
