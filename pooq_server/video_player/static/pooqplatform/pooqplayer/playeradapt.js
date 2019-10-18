if(typeof jarvis == "undefined") var jarvis = new Object();


function currentChromessPlayerAble() 
{ 
	//return false;
    if(typeof localStorage !== "undefined") {
		 try 
		 {
		 	//console.log(localStorage.getItem("iWantFlash"));
			if(localStorage.getItem("iWantFlash") == true || localStorage.getItem("iWantFlash") == "true") return false;
			//if(localStorage.getItem("POOQ_PLAYER_TECK_KEY_2") == "flash") return false;
		 } 
		 catch (e){}
	} 
    return chromessPlayerAble();
}

function chromessPlayerAble() 
{ 
	var browser = getBrowser();
	console.log(browser);
	var name = browser.name.toLowerCase();
	var version = Number(browser.version);
	version = (isNaN(version)==true) ? -1 : version;
	var isAble = true;
	switch(name)
    {
    	case "firefox":
    		isAble = (version >= 52) ? true : false;
            break
        case "safari":
        	isAble = (version >= 11) ? true : false;
            break
        case "chrome":
        	isAble = (version >= 52) ? true : false;
            break
        case "opera":
        	isAble = (version >= 15) ? true : false;
            break
         default :
         	isAble = (name.indexOf("ie") != -1) ? false : true;
         	break;
	}
	return isAble;
}

function getBrowser() {
    var ua=navigator.userAgent,tem,M=ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || []; 
    if(/trident/i.test(M[1])){
        tem=/\brv[ :]+(\d+)/g.exec(ua) || []; 
        return {name:'IE',version:(tem[1]||'')};
        }   
    if(M[1]==='Chrome'){
        tem=ua.match(/\bOPR|Edge\/(\d+)/)
        if(tem!=null)   {return {name:'Opera', version:tem[1]};}
        }   
    M=M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
    if((tem=ua.match(/version\/(\d+)/i))!=null) {M.splice(1,1,tem[1]);}
    return {
      name: M[0],
      version: M[1]
    };
 }


var PLAYER_VS = "1.1.7";
var UPDATE_VS = "20181023";
if(ROOT_SRC == null) var ROOT_SRC="http://127.0.0.1:8000/static/pooqplatform/pooqplayer/";
if(POPUP_SRC == null) var POPUP_SRC=ROOT_SRC;

var CHROMELESS_SRC=ROOT_SRC+"chromeless/";
var FLASH_SRC=ROOT_SRC+"flash/";

var BOOK_MARK_TYPE="GET";

console.log("POOQ PLAYER VS : " + PLAYER_VS);

document.write("<script src='"+ROOT_SRC+"lib/openapi/crypto/core.js?updateVS="+UPDATE_VS+"'></script>");
document.write("<script src='"+ROOT_SRC+"lib/openapi/crypto/enc-base64.js?updateVS="+UPDATE_VS+"'></script>");
document.write("<script src='"+ROOT_SRC+"lib/openapi/crypto/sha256.js?updateVS="+UPDATE_VS+"'></script>");
document.write("<script src='"+ROOT_SRC+"lib/openapi/crypto/hmac.js?updateVS="+UPDATE_VS+"'></script>");
document.write("<script src='"+ROOT_SRC+"lib/openapi/crypto/md5.js?updateVS="+UPDATE_VS+"'></script>");
document.write("<script src='"+ROOT_SRC+"model/datamanager.js?updateVS="+UPDATE_VS+"'></script>");
document.write("<link rel='stylesheet' href='"+ROOT_SRC+"css/playeradapt.css?updateVS="+UPDATE_VS+"'>");
document.write("<link rel='stylesheet' href='"+ROOT_SRC+"css/base.css?updateVS="+UPDATE_VS+"'>");

if(currentChromessPlayerAble()==true)
{
	document.write("<script src='"+CHROMELESS_SRC+"pooqplayer.js?updateVS="+UPDATE_VS+"'></script>");
}
else
{
	document.write("<script src='"+FLASH_SRC+"pooqplayer.js?updateVS="+UPDATE_VS+"'></script>");
}

jarvis.playerInstence = null;
jarvis.playerAdapt =null;

function callJS(command,json) 
{
    if(jarvis.playerInstence == null) return;
    jarvis.playerInstence.callJS(command,json);
}

function onPlayerError(type,value) 
{
    if(jarvis.playerInstence == null) return;
   
}

function getUserInfo() 
{
    return DataManager.getInstance().info.userInfo;
}

function openPopupPlayer(playData) 
{
	
    var popPath= POPUP_SRC  + "popupPlayer.html?type="+playData.type
		                              +"&contentID="+playData.contentID
									  +"&resolution="+ playData.resolution
									  +"&isAutoPlay="+playData.isAutoPlay
									  +"&isDVR="+playData.isDVR;
    window.open(popPath,'다시보기팝업','scrollbars=no,toolbar=no,resizable=yes,width=720,height=400,left=0,top=0'); 

}

PlayerAdapt=function() 
{
	this.parent = null;
	this.currentMode = "";
	this.playerInstence = null; 
	this.playerContainer = null;
	this.modeChangeOffset = 0.5;
	this.isCondensationModeAble = true;
	this.btnPlayerClose = null;
	this.isChromessPlayerAble = currentChromessPlayerAble();
	this.whenInitData = null;
	this.whenID = null;
	this.isPlayerReady = false;
	this.keyHandler = null;
	this.isInit = false;

}

PlayerAdapt.prototype = 
{

	whenInit:function(div,delegate,mode)
	{
		if(this.isInit) return;
		jarvis.playerAdapt = this;
		this.whenInitData = {div:div,delegate:delegate,mode:mode};
		this.when();
		return this;
	},

	when:function()
	{
		if(this.whenID!= null) clearTimeout(this.whenID);

		if(this.isChromessPlayerAble == true)
		{
			if(typeof AwsomePlayer  != "undefined")
			{
				this.rightNow();
				return;
			}
		}else
		{
			if(typeof widevine != "undefined" && typeof swfobject != "undefined")
			{
				this.rightNow();
				return;
			}
		}
		this.whenID = setTimeout("jarvis.playerAdapt.when()",1000);

		
	},

	rightNow:function()
	{
		if(this.whenInitData)
		{
			this.init(this.whenInitData.div,this.whenInitData.delegate,this.whenInitData.mode);
			this.whenInitData = null;
		}
		
	},

	init:function(div,delegate,mode)
	{
		var agent = navigator.userAgent.toLowerCase(); 
		var name = navigator.appName.toLowerCase();
		if(mode === undefined || mode == null) mode = PLAYER_MODE.DEFAULT;
		this.parent = document.getElementById(div);
		if(this.parent == null || this.parent == undefined) return;
		this.isInit = true;
		DataManager.getInstance().setMode(mode);
		this.btnPlayerClose = document.createElement("button");
		this.playerContainer = document.createElement("div");
		this.parent.appendChild(this.playerContainer);
		this.parent.appendChild(this.btnPlayerClose);
		jarvis.lib.addAttribute(this.playerContainer,'player_container');
		jarvis.lib.addAttribute(this.btnPlayerClose,'btn_player_close');
		this.playerInstence = new PooqPlayer(this.playerContainer,delegate);
		jarvis.playerInstence = this.playerInstence;
		this.playerInstence.init(mode);
		DataManager.getInstance().info.playerType = (this.isChromessPlayerAble) ? PLAYER_TEC_TYPE.HTML5 : PLAYER_TEC_TYPE.FLASH;
		this.setMode(mode);
		this.setupEvent();
		this.addKeyEvent();
		
		return this;
	},

	setUserInfo:function(userInfo)
	{
		DataManager.getInstance().setUserInfo(userInfo);
	},

	setupEvent:function()
	{
		if(this.currentMode == PLAYER_MODE.POPUP || this.currentMode == PLAYER_MODE.CUSTOM) return;
		jarvis.lib.addEventListener(window,"scroll",this.onScroll.bind(this));
		jarvis.lib.addEventListener(document,"scroll",this.onScroll.bind(this));
		jarvis.lib.addEventListener(this.btnPlayerClose,"click",this.onPlayerClosed.bind(this));
		
	},

	addKeyEvent:function()
	{
		if(this.keyUpHandler!=null) this.removeKeyEvent();
		this.keyUpHandler = this.keyUpEvent.bind(this);
		this.keyDownHandler = this.keyDownEvent.bind(this);
		jarvis.lib.addEventListener(document,"keyup",this.keyUpHandler);
		jarvis.lib.addEventListener(document,"keydown",this.keyDownHandler);
		
	},

	removeKeyEvent:function()
	{
		if(this.keyUpHandler == null) return;
		jarvis.lib.removeEventListener(document,"keyup",this.keyUpHandler);
		jarvis.lib.removeEventListener(document,"keydown",this.keyDownHandler);
		this.keyHandler = null;
	},

	keyDownEvent : function (e)
    {
        
    	if(this.playerInstence==null) return;

    	//console.log(this.playerInstence.getFocus());
    	if(this.playerInstence.getFocus() == false )return;
    	e = e || window.event;
    	var keyCode = e.keyCode || e.which;
    	
        switch(String(keyCode))
        {
    		case "75":
            case "32":
            	break;
            case "74":
            case "37":
				this.playerInstence.moveSeek(-10);
				
            	break
            case "76":
            case "39":
            	this.playerInstence.moveSeek(10);
            	
            	break
            case "77":
            case "40":
            	this.playerInstence.moveVolume(-0.1);
            	
            	break
            case "73":
            case "38":
                this.playerInstence.moveVolume(0.1);
        
            	break
            default :
            	return;
        }
        e.preventDefault();
       
	},
	keyUpEvent : function (e)
    {
        
    	if(this.playerInstence==null) return;
    	if(this.playerInstence.getFocus() == false ) return;
    	e = e || window.event;
    	var keyCode = e.keyCode || e.which;
    	
        switch(String(keyCode))
        {
            case "75":
            case "32":
            	this.playerInstence.togglePlay();
            	break;

            default :
            	return;
        }
        e.preventDefault();
       
	},

	onPlayerClosed:function(e)
    {
    	this.playerInstence.pause();
    	this.isCondensationModeAble = false;
    	this.setMode(PLAYER_MODE.DEFAULT);
    },

	onScroll:function(e)
    {
		var pageYOffset = window.pageYOffset ? window.pageYOffset : 0;
		var eleScrollTop = document.documentElement ? document.documentElement.scrollTop : 0;
		var bodyScrollTop =	document.body ? document.body.scrollTop : 0;
		var pos = pageYOffset ? pageYOffset : 0;
		if (eleScrollTop && (!pos || (pos > eleScrollTop))) pos = eleScrollTop;
		pos = bodyScrollTop && (!pos || (pos > bodyScrollTop)) ? bodyScrollTop : pos;
		var playerPos = jarvis.lib.getAbsoluteBounce(this.parent);
		
		if((playerPos.y+(playerPos.height*this.modeChangeOffset))<=pos)
		{
			this.setMode(PLAYER_MODE.CONDENSATION);
		}
		else
		{
			this.setMode(PLAYER_MODE.DEFAULT);
		}

    }, 

	login:function(id,pw)
    {
        DataManager.getInstance().login(id,pw);
    }, 
    loadCustomVod:function(type,path,cookie,isAutoPlay,drmType,drmHost,drmHeader)
	{
		if(isAutoPlay === undefined || isAutoPlay == null) isAutoPlay = DataManager.getInstance().getSetupValue(SHARED_KEY.AUTO_PLAY);
		if(drmType === undefined || drmType == null) drmType = DRM_TYPE.NONE;
		if(drmHeader === undefined || drmHeader == null) drmHeader = "";
		if(drmHost === undefined || drmHost == null) drmHost ="";
		var vodObject = new VodObject(type);
		vodObject.vodUrl = path;
        vodObject.awsCookie = cookie;
        vodObject.isAutoPlay = isAutoPlay;
        vodObject.drmType = drmType;
        vodObject.isDRM = (drmType == DRM_TYPE.NONE) ? false : true;
		vodObject.drmHeader = drmHeader;
		vodObject.drmHost = drmHost;
		this.playerInstence.loadCustomVod(vodObject,isAutoPlay);
	},
	load:function(type,contentID,resolution,isDVR,isAutoPlay)
	{
		
		if(type === undefined || type == null) type = "NONE";
		if(contentID === undefined || contentID == null) contentID = "";
		if(resolution === undefined || resolution == null) resolution = DataManager.getInstance().getSetupValue(SHARED_KEY.QUALITY);
		if(isDVR === undefined || isDVR == null) isDVR = false;
		//if(isAutoPlay === undefined || isAutoPlay == null) isAutoPlay = DataManager.getInstance().getSetupValue(SHARED_KEY.AUTO_PLAY);
		if(isAutoPlay === undefined || isAutoPlay == null) isAutoPlay = (type == "live" || type == "clip") ? true : false;
		var vodObject = new VodObject(type,contentID,resolution,isDVR,isAutoPlay);

		
		this.playerInstence.load(vodObject,true);
	},

	setMode:function(mode)
	{
		
		if(mode == this.currentMode) return;
		if(this.isCondensationModeAble == false && mode == PLAYER_MODE.CONDENSATION) return;
		if(this.playerInstence.isCondensationModeAble() == false && mode == PLAYER_MODE.CONDENSATION) return;

		jarvis.lib.removeAttribute(this.playerContainer,'player_container_'+this.currentMode);
		jarvis.lib.addAttribute(this.playerContainer,'player_container_'+mode);
		DataManager.getInstance().setMode(mode);
		this.currentMode = mode;
		if(this.playerInstence.PLAYER_TYPE == PLAYER_TYPE.HTML5) jarvis.lib.dispatchEvent(window,'resize');
		this.playerInstence.setMode(mode);

		this.btnPlayerClose.style.display = (this.currentMode == PLAYER_MODE.CONDENSATION) ? 'block' : 'none';
	},


	pause:function()
	{
		this.playerInstence.pause();
	},

	play:function()
	{
		this.playerInstence.play();
	}

}




var PLAYER_MODE = 
{
	DEFAULT: "default",
	CUSTOM: "custom",
	CONDENSATION: "condensation",
	POPUP:"popup"
}

if(typeof window.initPlayer != "undefined") window.initPlayer();

if(typeof gotoAuthorization == "undefined")
{
	function gotoAuthorization()
	{
		window.location.href = "https://member.pooq.co.kr/me";
	}
}
else
{
	console.log("gotoAuthorization exist !!");
}

if(typeof showEventVoucherPopup == "undefined")
{
	function showEventVoucherPopup()
	{
		alert("showEventVoucherPopup");
	}
}
else
{
	console.log("showEventVoucherPopup exist !!");
}

if(typeof showLoginLayout == "undefined")
{
	function showLoginLayout()
	{
		var me = encodeURIComponent(window.location);
		window.location.href = "https://www.pooq.co.kr/member/login.html?referer=" + me;
	}
}
else
{
	console.log("showLoginLayout exist !!");
}

if(typeof gotoSignup == "undefined")
{
	function gotoSignup()
	{
		var me = encodeURIComponent(window.location);
		window.location.href = "https://member.pooq.co.kr/account?returnurl="+me+"&device=pc"; 
	}
}
else
{
	console.log("gotoSignup exist !!");
}

if(typeof showVoucherPopup == "undefined")
{
	function showVoucherPopup(type,contentid,programid,channelid,cpid)
	{
		
		window.location.href = "https://www.pooq.co.kr/voucher/recommend.html";
	}
}
else
{
	console.log("showVoucherPopup exist !!");
}
