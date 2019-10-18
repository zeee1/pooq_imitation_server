const SETUP_TYPE = Object.freeze
(
    {
        QUALITY:"화질설정",
        SCREEN_RATIO: "화면비율",
        PLAY_RATE:"재생속도",
        OPTION:"기타옵션"
    }
);



const SETUP_SCREEN_RATIO_TYPE = Object.freeze
(
    {
        ORIGIN:"원본비율",
        FULL: "꽉찬화면"
    }
);
const SETUP_SCREEN_RATIO_VALUE = ["contain","fill"];

const SETUP_PLAY_RATE_TYPE = Object.freeze
(
    {
        A:"X 0.5",
        B:"X 1.0",
        C:"X 1.25",
        D:"X 1.5",
        E:"X 2.0",
    }
);
const SETUP_PLAY_RATE_VALUE = [0.5,1.0,1.25,1.5,2.0];


const SETUP_OPTION_TYPE = Object.freeze
(
    {
        AUTO_PLAY:"VOD 연속재생",
        USER_GUIDE: "이용 가이드",
        WANT_FLASH:"FLASH player"
    }
);
const SETUP_OPTION_SWITCH = [true,false,false];
const SETUP_OPTION_VALUE = [SETUP_EVENT.AUTO_PLAY_CHANGE,SETUP_EVENT.OPEN_GUIDE,SETUP_EVENT.I_WANT_FLASH];


class SetupBox extends PlayerUIBox
{
    constructor(body,delegate) 
    {
        super(body,delegate);
        this.isView = false;
        this.box = null;
        this.point = null;
        this.lists = null;
        this.listDic = null; 
        this.subLists = null;
        this.selectedList = null;
        this.isHalfBottomMode = true;
    }
    init()
    {   
        this.createElements();
        this.setupEvent();
        this.createList();
        return super.init();
    }
    
    remove()
    {   
        super.remove();
    }

    createElements()
    {   
        let elementProvider = new SetupBoxBody(this.body);
        elementProvider.init();
        elementProvider.writeHTML();
        super.createElements(elementProvider); 
        this.box = elementProvider.getElement("box");
        this.point = elementProvider.getElement("point");
        this.lists = elementProvider.getElement("lists");
        this.subLists = elementProvider.getElement("subLists");
    }

    sendStatus(status)
    {
        switch(status.state)
        {
            case PLAYER_STATE.READY:
                this.setLists(status.value);
                break;
        }
    }

    createList()
    {
        this.listDic = new Object(); 
        let that = this;
        for (var key in SETUP_TYPE)
        {
            var list = new SetupList(this.lists,SETUP_TYPE[key]);
            list.init().subscribe
            (
                {
                    next(value)
                    {
                        that.onListEvent(value.row);
                    }
                }
            );
            this.listDic[SETUP_TYPE[key]] = list;
        }
    }

    reset()
    {
        this.listDic[SETUP_TYPE.QUALITY].setActive(false);
        this.listDic[SETUP_TYPE.PLAY_RATE].setActive(false);
        this.isHalfBottomMode = true;
    }

    setLists(playerObject)
    {
        this.listDic[SETUP_TYPE.PLAY_RATE].setActive(playerObject.isPlayRateChangeAble);
    }

    clearSubList()
    {
        if(this.selectedList != null) this.selectedList.setSelected(false);
        this.selectedList = null;
        this.subLists.innerHTML = "";
        var size= jarvis.lib.getAbsoluteBounce(this.lists);
        this.box.style.width = size.width+"px";
        jarvis.lib.removeAttribute(this.point,"point-sub");
        
    }

    createQualityList()
    {
        this.subLists.innerHTML = "";
        let that = this;
        for(var i=0;i<this.vodObject.qualities.length; ++i)
        {
            var quality = this.vodObject.qualities[i];
            var list = new SetupSubList(this.subLists,SETUP_TYPE.QUALITY);
            var iconPath =  UIManager.getInstance().getTegPath(quality.marks);
            list.init(quality.name,iconPath,false,quality.ID).subscribe
            (
                {
                    next(value)
                    {
                        that.onSubListEvent(value.row);
                    }
                }
            );
            if(this.vodObject.quality == quality.ID) list.setSelected(true);
        }

    }


    createScreenRatioList()
    {
        this.subLists.innerHTML = "";
        let that = this;
        var i = 0;
        for (var key in SETUP_SCREEN_RATIO_TYPE)
        {
            var list = new SetupSubList(this.subLists,SETUP_TYPE.SCREEN_RATIO);
            
            list.init(SETUP_SCREEN_RATIO_TYPE[key],"",false,SETUP_SCREEN_RATIO_VALUE[i]).subscribe
            (
                {
                    next(value)
                    {
                        that.onSubListEvent(value.row);
                    }
                }
            );
            if(list.value == this.delegate.getScreenRatio()) list.setSelected(true);
            i++;
        }
    }
     

    createPlayRateList()
    {
        this.subLists.innerHTML = "";
        let that = this;
        var i = 0;
        for (var key in SETUP_PLAY_RATE_TYPE)
        {
            var list = new SetupSubList(this.subLists,SETUP_TYPE.PLAY_RATE);
            list.init(SETUP_PLAY_RATE_TYPE[key],"",false,SETUP_PLAY_RATE_VALUE[i]).subscribe
            (
                {
                    next(value)
                    {
                        that.onSubListEvent(value.row);
                    }
                }
            );
            if(list.value == this.delegate.getPlayRate()) list.setSelected(true);
            i++;
        }
    }

    createOptionList()
    {
        this.subLists.innerHTML = "";
        let that = this;
        var i = 0;
        var isSafari =  jarvis.lib.isSafari(); 
        for (var key in SETUP_OPTION_TYPE)
        {
            if(isSafari == true && SETUP_OPTION_TYPE[key] == SETUP_OPTION_TYPE.AUTO_PLAY)
            {

            }else
            {
                var list = new SetupSubList(this.subLists,SETUP_TYPE.OPTION);
                list.init(SETUP_OPTION_TYPE[key],"",SETUP_OPTION_SWITCH[i],SETUP_OPTION_VALUE[i]).subscribe
                (
                    {
                        next(value)
                        {
                            that.onSubListEvent(value.row);
                        }
                    }
                );
                if(list.value == SETUP_EVENT.AUTO_PLAY_CHANGE) list.setSelected(DataManager.getInstance().getSetupValue(SHARED_KEY.AUTO_PLAY));
            }
            i++;
        }
    }

    onListEvent(value)
    {
        if(this.selectedList != null) this.selectedList.setSelected(false);
        this.selectedList = value;
        this.selectedList.setSelected(true);

        var size= jarvis.lib.getAbsoluteBounce(this.lists);
        var sizeSub= jarvis.lib.getAbsoluteBounce(this.subLists);
        this.box.style.width = (size.width+sizeSub.width)+"px";
        jarvis.lib.addAttribute(this.point,"point-sub");
        switch(this.selectedList.key)
        {
            case SETUP_TYPE.QUALITY:
                this.createQualityList();
                break;
            case SETUP_TYPE.SCREEN_RATIO:
                this.createScreenRatioList();
                break;
            case SETUP_TYPE.PLAY_RATE:
                this.createPlayRateList();
                break;
            case SETUP_TYPE.OPTION:
                this.createOptionList();
                break;
        }
    }

    onSubListEvent(value)
    {
        var evt = null;
        switch(value.key)
        {
            case SETUP_TYPE.QUALITY:
                evt = new UIEvent(UI_EVENT.QUALITY_CHANGE,value.value);
                break;
            case SETUP_TYPE.SCREEN_RATIO:
                evt = new UIEvent(PLAYER_EVENT.SCREEN_RATIO_CHANGE,value.value);
                break;
            case SETUP_TYPE.PLAY_RATE:
                evt = new UIEvent(PLAYER_EVENT.PLAY_RATE_CHANGE,value.value);
                break;
            
            default:
                this.onOptionEvent(value);
                return;
        }
        this.clearSubList();
        this.setUIView(false);
        this.delegate.next(evt);   
        
    }

    onOptionEvent(value)
    {
        var evt = null;
        switch(value.value)
        {
            case SETUP_EVENT.AUTO_PLAY_CHANGE:
                var isOn = (value.switch.isOn) ? false : true;
                evt = new UIEvent(SETUP_EVENT.AUTO_PLAY_CHANGE,isOn);
                value.setSelected(isOn);
                break;
            case SETUP_EVENT.OPEN_GUIDE:
                evt = new UIEvent(SETUP_EVENT.OPEN_GUIDE);
                break;
            case SETUP_EVENT.I_WANT_FLASH:
                jarvis.lib.setStorage(SHARED_KEY.I_WANT_FLASH,true);
                window.location.reload();
                break;
        }
        this.delegate.next(evt);
    }

    load(vodObject)
    {
        super.load(vodObject);
        this.isHalfBottomMode = (this.vodObject.previewData != null ) ? false : true;
        if(this.vodObject.qualities.length > 0) this.listDic[SETUP_TYPE.QUALITY].setActive(true);

        this.setUIView(false);
        this.clearSubList();

    }

    openSubList(key)
    {
        this.setUIView();
        var list = this.listDic[key];
        if(list == null) return;
        if(list.isActive == false) return;
        list.onSelect();
    }

    toggleUIView()
    {
        if(this.isView)
        { 
            this.setUIView(false);
            this.clearSubList();
        }
        else
        {
            this.setUIView(true);
        }
    }

    setUIView(isView = true)
    {
        if(this.isView != isView)
        {
            this.isView = isView;
            if(isView)
            {
                this.clearSubList();
                jarvis.lib.removeAttribute(this.cell ,'animate-out');
                jarvis.lib.addAttribute(this.cell ,'animate-in');
            }
            else
            {
                jarvis.lib.removeAttribute(this.cell ,'animate-in');
                jarvis.lib.addAttribute(this.cell ,'animate-out');

                
            }
            for (var key in this.listDic)
            {
                this.listDic[key].setTabIndex(isView);
            }
            var viewPos = (this.isHalfBottomMode) ? 50 : 100;
            this.cell.style.bottom = isView ? (viewPos+ "px") : "-250px";
        }


        
    }

}

class SetupList extends ComponentCore
{
    constructor(body,key) 
    {
        super(body);
        this.key = key;
        this.title = null;
        this.btn = null;
        this.isActive = true;
        
    }

    init()
    {   
        this.createElements();
        this.setupEvent();
        return super.init();
    }

    createElements()
    {   
        let elementProvider = new SetupListBody(this.body);
        elementProvider.init();
        elementProvider.writeHTML();
        super.createElements(elementProvider); 
        this.title = elementProvider.getElement("title");
        this.btn = elementProvider.getElement("btn");
        this.title.innerHTML = this.key;
        this.btn.tabIndex = "-1";
    }
    
    setTabIndex(isView)
    {
        this.btn.tabIndex = (isView == true && this.isActive == true) ? null : "-1";
    }

    setActive(isActive)
    {
        if(isActive)
        {
            this.btn.style.display = "block";
            jarvis.lib.removeAttribute(this.title,"title-passive");
           
        }
        else
        {
            this.btn.style.display = "none";
            jarvis.lib.addAttribute(this.title,"title-passive");
        }
        this.isActive = isActive;
        
    }

    setSelected(isSelect)
    {
        if(isSelect)
        {
            jarvis.lib.addAttribute(this.title,"title-selected");
        }
        else
        {
            jarvis.lib.removeAttribute(this.title,"title-selected");
        }
        
    }

    setupEvent()
    {
        super.setupEvent();
        jarvis.lib.addEventListener(this.btn,"click",this.onSelect.bind(this));
    }
    
    clearEvent()
    {
        super.clearEvent();
        jarvis.lib.removeEventListener(this.btn,"click",this.onSelect.bind(this));
    }

    onSelect()
    {
        let evt = new ComponentEvent(COMPONENT_EVENT.SELECT_ROW,this);
        this.delegate.next(evt);
    }
    
}

class SetupSubList extends AnimationComponentCore
{
    constructor(body,key) 
    {
        super(body);
        this.key = key;
        this.value = "";
        this.title = null;
        this.btn = null;
        this.icon = null;
        this.switch = null;
        this.isSwitch = false;
    }

    init(view,iconPath="",isSwitch=false,value=null)
    {   
        this.createElements();
        this.setupEvent();
        this.isSwitch = isSwitch;
        this.title.innerHTML = view;
        this.value = (value == null) ? view : value;

        if(iconPath != "")
        {
            this.icon.src = iconPath;
            this.icon.style.display = "block";
        }

        if(isSwitch)
        {
            this.switch.body.style.display = "block";
        }
        return super.init();
    }

    createElements()
    {   
        let elementProvider = new SetupSubListBody(this.body);
        elementProvider.init();
        elementProvider.writeHTML();
        super.createElements(elementProvider); 
        this.title = elementProvider.getElement("title");
        this.btn = elementProvider.getElement("btn");
        this.icon = elementProvider.getElement("icon");

        let switchBody = elementProvider.getElement("switch");
        this.switch = new Switch(switchBody);
        this.switch.init(elementProvider,false);

        this.icon.style.display = "none";
        this.switch.body.style.display = "none";

    }

    setActive(isActive)
    {
        if(isActive)
        {
            this.btn.style.display = "block";
            jarvis.lib.removeAttribute(this.title,"title-passive");
        }
        else
        {
            this.btn.style.display = "none";
            jarvis.lib.addAttribute(this.title,"title-passive");
            
        }
        
    }

    setSelected(isSelect)
    {
        if(isSelect)
        {
            jarvis.lib.addAttribute(this.title,"title-selected");
            if(this.isSwitch) this.switch.switchOn();
        }
        else
        {
            jarvis.lib.removeAttribute(this.title,"title-selected");
            if(this.isSwitch) this.switch.switchOff();
        }
        
    }

    setupEvent()
    {
        super.setupEvent();
        jarvis.lib.addEventListener(this.btn,"click",this.onSelect.bind(this));
    }
    
    clearEvent()
    {
        super.clearEvent();
        jarvis.lib.removeEventListener(this.btn,"click",this.onSelect.bind(this));
    }

    onSelect()
    {
        let evt = new ComponentEvent(COMPONENT_EVENT.SELECT_ROW,this);
        this.delegate.next(evt);
    }
    
}


class Switch extends ComponentCore
{
    constructor(body) 
    {
        super(body);
        this.isOn = false;
        this.bg = null;
        this.thumb = null;
    }

    init(elementProvider,isOn)
    {   
        this.createElements(elementProvider);
        this.setupEvent();
        this.isOn = isOn;
        if(this.isOn == true)
        {
            this.switchOn();  
        }else
        {
            this.switchOff();
        }
        return super.init();
    }

    createElements(elementProvider)
    {   
        super.createElements(elementProvider);
        this.bg = elementProvider.getElement('bg');
        this.thumb = elementProvider.getElement('thumb');
    }

    togleSwitch()
    {
        
        if(this.isOn == true)
        {
            this.switchOff();
        }else
        {
            this.switchOn();
        }
    }
    
    switchOn()
    {
        this.isOn = true;
        jarvis.lib.removeAttribute(this.bg,'bg-on');
        jarvis.lib.removeAttribute(this.thumb,'thumb-on');
        jarvis.lib.addAttribute(this.bg,'bg-on');
        jarvis.lib.addAttribute(this.thumb,'thumb-on');
        this.thumb.innerHTML = "ON";
    }

    switchOff()
    {
        this.isOn = false;
        jarvis.lib.removeAttribute(this.bg,'bg-on');
        jarvis.lib.removeAttribute(this.thumb,'thumb-on');
        this.thumb.innerHTML = "OFF";
    }
    
}



