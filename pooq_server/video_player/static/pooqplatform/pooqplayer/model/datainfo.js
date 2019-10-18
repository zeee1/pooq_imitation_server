jarvis.dataManagerInstance = null;

DataInfo=function() 
{
	this.API_CREDENTIAL_KEY="E5F3E0D30947AA5440556471321BB6D9";
	this.SMR_ENC_KEY = "1d9b87e47123f4b4";
	this.SHARE_KEY="SHARE_KEY";
	this.credentialKey = "none";
	this.userInfo = null;
	this.GUID = "";
	this.clientIP = '127.0.0.1';
	this.userID = "";
	this.userNo = "";
	this.profileID = "";
	this.shared = null;
	this.lastPlayID = "";
	this.pooqzoneType = "none";
	this.osVer = jarvis.lib.getOSInfoStr();
	this.device = "pc";
	this.playerType= PLAYER_TEC_TYPE.HTML5;
	this.htmlPlayerType = (typeof HTML_PLAYER_TYPE == "undefined") ? PLAYER_TYPE.BIT_MOVIN : HTML_PLAYER_TYPE;
	this.isABR = (typeof IS_ABR == "undefined") ? "y" : IS_ABR;
	this.browser = jarvis.lib.getBrowser();
    this.deviceName = this.browser.name + this.browser.version;
    this.drmType = this.getDRMType();
    this.prevSendBookMarkTime = -1;

    console.log("PLAYER_TYPE : " + this.htmlPlayerType + " ABR : " + this.isABR);
}

DataInfo.prototype =
{
	init:function() 
	{
		this.shared = this.getSetupData();
		this.lastPlayID = this.getSetupValue(SHARED_KEY.LAST_PLAY_ID);
		this.GUID = this.getSetupValue(SHARED_KEY.LAST_GUID);
		//alert(this.GUID);
		return this;
	},

	setSenderUserInfo:function(userInfo)
	{
		this.lastPlayID = userInfo.lastPlayID;
		this.setUserInfo(userInfo);
	},

	setUserInfo:function(userInfo)
	{
		this.userInfo = userInfo;
		if(this.userInfo == null) return;
		this.credentialKey = (userInfo.credentialKey) ? userInfo.credentialKey : this.credentialKey;
		this.GUID = (userInfo.GUID) ? userInfo.GUID : this.GUID;
		this.clientIP = (userInfo.clientIP) ? userInfo.clientIP : this.clientIP;
		this.userID = (userInfo.userID) ? userInfo.userID : this.userID;
		this.profileID = (userInfo.profileID) ? userInfo.profileID : this.profileID;
		this.pooqzoneType = (userInfo.pooqzoneType) ? userInfo.pooqzoneType: this.pooqzoneType;

	},

	isLogin : function()
	{
		return (this.credentialKey == "none") ? false : true;
	},

	getSetupData : function(){
		var json = null;
        var jsonStr = jarvis.lib.getStorage(this.SHARE_KEY);
	    if(jsonStr == null || jsonStr == undefined || jsonStr == "")
	    {
	    	json = new Object();
	    	json[SHARED_KEY.QUALITY] = "480p";
	    	json[SHARED_KEY.LAST_PLAY_ID] = "none";
	    	json[SHARED_KEY.AUTO_PLAY] = "Y";
	    	json[SHARED_KEY.PLAY_RATE] = "1";
	    	json[SHARED_KEY.SCREEN_RATIO] = "contain";
	    	json[SHARED_KEY.INIT_USER] = "Y";
	    	json[SHARED_KEY.TM_INFO] = "Y";
	    	json[SHARED_KEY.AUTO_PLAY_INFO] = "N";
	    	json[SHARED_KEY.LAST_GUID] = this.getGUID();
	    	
		}
		else
		{
			json = JSON.parse(jsonStr);
		}
		console.log(json);
		return json;
	},

	jsonEscape:function(str) 
	{
		var rstr = String(str).replace(/\n/g, "<br>").replace(/＼n/g, "<br>").replace(/\\n/g, "<br>").replace(/\r/g, "").replace(/\t/g, "\\\\t");    	 
    	return rstr
	},

	jsonEscapeBlank:function(str) 
	{
		var rstr = String(str).replace(/\n/g, " ").replace(/＼n/g, " ").replace(/\\n/g, " ").replace(/\r/g, "").replace(/\t/g, "\\\\t");    	 
    	return rstr
	},
	
	setSetupValue : function(type,value)
	{
		
		if(value != "")
		{
			if(value == true) value = "Y";
			if(value == false) value = "N";
		}
		this.shared[type] = value;
		if(type == SHARED_KEY.LAST_PLAY_ID)
		{
			this.lastPlayID = value;
		}
		//console.log("setSetupValue : " + type + "   value : " + value);
		if(type == SHARED_KEY.AUTO_PLAY && (value == "N" || value == false)) DataManager.getInstance().setSetupValue(SHARED_KEY.AUTO_PLAY_INFO,true);
		this.updateSharedData();
	},

	getSetupValue : function(type)
	{
		var value = this.shared[type];
		if(value == "Y") value = true;
		if(value == "N") value = false;
		return value;
	},

	updateSharedData : function ()
    { 
		var jsonStr = JSON.stringify(this.shared);
		jarvis.lib.setStorage(this.SHARE_KEY,jsonStr);
		
	},

	getDefaultParam:function()
	{
		var param = new Object();
		param.device = this.device;
		param.partner = "pooq";
		param.pooqzone = this.pooqzoneType;
		param.region = "kor";
		param.drm = this.drmType;
		param.targetage = "auto";
		param.apikey = this.API_CREDENTIAL_KEY;
		param.credential = this.credentialKey;
		return param;
	},

	getDRMType:function()
	{
		var drmType = DRM_TYPE.NONE;

		var name = this.browser.name.toLowerCase();
		var version = Number(this.browser.version);
		version = (isNaN(version)==true) ? -1 : version;
		
		switch(name)
		{
			case "firefox":
    			drmType = (version >= 52) ? DRM_TYPE.WIDEVINE : drmType;
            	break
        	case "safari":
        		drmType = (version >= 11) ? DRM_TYPE.FAIR_PLAY : drmType;
           		break
        	case "chrome":
        		drmType = (version >= 52) ? DRM_TYPE.WIDEVINE : drmType;
            	break
        	case "opera":
        		drmType = (version >= 15) ? DRM_TYPE.PLAY_READY : drmType;
            	break
         	default :
         		drmType = (name.indexOf("ie") != -1) ? DRM_TYPE.WIDEVINE_CLASIC : drmType;
         		break;
		}
		return drmType;
	},

	getGUID:function()
	{
        var guid = String(CryptoJS.MD5(jarvis.lib.generateID("POOQ")));
        return guid;

	},

  	getADParam:function(vs,tid)
	{
		var param=new FormData();
		param.version = vs;
		param.media = "SMR_MEMBER";
		param.site = "POOQ_LIVE";;
		param.tid = tid;// String(CryptoJS.MD5(jarvis.lib.generateID("POOQ")));
		param.uuid =  String(CryptoJS.MD5(this.GUID)); 
        param.ip =  this.clientIP;
        param.gender = "3";
        param.age ="99";
        param.platform = "PCWEB";
        param.playertype = this.playerType;
        param.os = jarvis.lib.getOSInfoStr();
        param.devicemodel = "PC";
        param.telco = ""; 
        param.cpid = "";
        param.vodtype = "O";
        param.channelid = "";
        param.category = "";
        param.section = "";
        param.programid = "";
        param.clipid = "";
        param.referrer = document.referrer;
        param.adlink = "";

        return param;
	},

	getADRequestParam:function(adRequestData,playTime)
	{
		if(playTime=="" || playTime==undefined || playTime==null || playTime=="undefined") playTime=3600;
		var param=this.getADParam(adRequestData.adapiversion,adRequestData.tid);
		param.requesttime = "";
        param.contentnumber = "";
        param.targetnation = "KR";
        param.isonair = "Y";
        param.ispay = "N"; 
        param.broaddate = "";
        param.playtime = String(playTime);
        param.starttime = "";
        param.endtime = "";
        param.adtype = "PRE";
        param.customkeyword = "";
        param = this.overrideParam(param,adRequestData);
        param.broaddate = param.broaddate.slice(0,8);
        
		return param;
	},

	getMedialogParam:function(adRequestData,t)
	{
		var param=this.getADParam(adRequestData.logapiversion,adRequestData.tid);
		param.playdate = jarvis.lib.getYMDHIS();
		param.trackpoint=t;
        param.like="";
        param.firstplay = "Y";
		return this.overrideParam(param,adRequestData);;

	},

    getBase64Url:function (source, isBookMark)
	{
        var encodedSource = CryptoJS.enc.Base64.stringify(source);
        if(isBookMark != true) encodedSource = encodedSource.replace(/=+$/, '');
		encodedSource = encodedSource.replace(/\+/g, '-');
		encodedSource = encodedSource.replace(/\//g, '_');
		return encodedSource;
	},

	getJWTString:function(param)
	{
        var header = {
  						"alg": "HS256",
  						"typ": "JWT"
		};
		var stringifiedHeader = CryptoJS.enc.Utf8.parse(JSON.stringify(header));
		var encodedHeader = this.getBase64Url(stringifiedHeader);
		var stringifiedData = CryptoJS.enc.Utf8.parse(JSON.stringify(param));
		var encodedData = this.getBase64Url(stringifiedData);
		var token = encodedHeader + "." + encodedData;
		var secret = this.SMR_ENC_KEY;
		var signature = CryptoJS.HmacSHA256(token, secret);
		signature = this.getBase64Url(signature);
		var signedToken = token + "." + signature;
		return signedToken;
	},

	overrideParam:function(param,adData)
	{
		for (var key in param)
		{
			if(!adData[key])
			{
				var ovStr = String(adData.optionnalData[key]);
				if(ovStr != "undefined") param[key] = adData.optionnalData[key];
			}
		}
		return param;
	},

	setBookMarkContentID: function(vodObject,param) 
	{
		var channelType = vodObject.getChannelType();
		param.cornerId="";
		param.channelType = channelType;
		switch(channelType)
		{
		    case "L":
				param.contentId="";
				param.programId=vodObject.contentID;
				break;
			case "C":
				param.programId="CLIP"
				param.contentId=vodObject.contentID;
				break;
			case "M":
				param.contentId=vodObject.contentID;
				param.programId="MOVIE"
				break;
			default:
				param.contentId=vodObject.contentID;
				param.programId=vodObject.programID;
				break;
		}
	},

	getBookMarkData: function(vodObject) 
	{
		
		var param = new Object();
		param.itemType = vodObject.getItemType();
		param.userNo = this.userNo;
		param.profileId = this.profileID;
		param.playId = this.lastPlayID;
		param.guid =  this.GUID;
		if(param.userNo=="" || param.userNo==undefined || param.userNo==null || param.userNo=="undefined") param.userNo="NOLOGIN";
		
		this.setBookMarkContentID(vodObject,param);
		param.deviceType = "1";	
		param.ipAddress=this.clientIP;
		if(param.ipAddress=="" || param.ipAddress==undefined || param.ipAddress==null) param.ipAddress="127.0.0.0";
		param.concurrencyGroup = vodObject.concurrencyGroup;
		param.issue = vodObject.issue;
        param.isCharged = vodObject.chargedType;
        param.priceType = vodObject.priceType;
        param.pooqzoneType = (this.pooqzoneType != "none") ? "P01" : "";
        return param;

	},

	getLogTime : function(time)
	{
		var ta = String(time).split(".");
		return jarvis.lib.getTimeStr(ta[0],":",true);
	},

	getNowLogDate : function()
	{
		var now=new Date();
        var tzoneOffSet  = Number(now.getTimezoneOffset());
        var tzoneT = Math.floor(tzoneOffSet/60);
        var tzoneM = tzoneOffSet%60;
		var tzoneStr = jarvis.lib.intToText (Math.abs(tzoneT),2) + jarvis.lib.intToText (tzoneM,2);
        tzoneStr = (tzoneOffSet < 0) ? "+" + tzoneStr : tzoneStr = "-" + tzoneStr;
        
        var d = now.getFullYear()+"-"
			    +jarvis.lib.intToText(now.getMonth()+1,2)+"-"
				+jarvis.lib.intToText(now.getDate(),2)+" "
				+jarvis.lib.intToText (now.getHours(),2)+":"
				+jarvis.lib.intToText (now.getMinutes(),2)+":"
				+jarvis.lib.intToText (now.getSeconds(),2)
				+tzoneStr;
		return d;

	},

	getExtraData: function(vodObject,playData) 
	{	
		var extra = new Object();
		if(playData.errorCode == "")
		{
			extra.osV = this.osVer;
			extra.appV = PLAYER_VS;
			extra.apiV = "3";
		}
		else
		{
			extra.errorCode = playData.errorCode;
	        extra.osVer = this.osVer;
	        extra.appVer = PLAYER_VS;
	       	extra.drmType = vodObject.drmType;
			extra.deviceName = this.deviceName;
			extra.deviceTypeId = "1";
	     	extra.networkType = "0";
	     	extra.playerType = playData.playerType;
			extra.isAllow = (vodObject.isAllow  == true) ? "Y" : "N";
		}
		return extra;
	},

	checkApiResult:function(returnData,xhrStatus)
	{
		if(returnData==null || returnData==undefined) return new APIResultObject(API_RESULT.API_ERROR,API_RESULT_MSG.SERVER_ERROR);
		if(returnData.resultcode ==null || returnData.resultcode ==undefined ) return new APIResultObject(API_RESULT.SUCCESS);
		var result = new APIResultObject(returnData.resultcode, this.jsonEscape(returnData.resultmessage), returnData.resultoptional);
		if(xhrStatus == API_RESULT.API_RETRY) return this.retryApiResult(result);
		return result;
    },

    retryApiResult:function(result)
	{
		switch(result.code)
		{
			case "303":
				if(window.reLoginProc) window.reLoginProc();
				return new APIResultObject(API_RESULT.API_ERROR,API_RESULT_MSG.SERVER_ERROR);
		}
		return result;
    },

    getLinkPath:function(path)
    {
    	if(path == "") return path;
		if(path.indexOf("http") == -1 && path.indexOf("https") == -1) path = "http://" + path;
    	return path;
    },
    getImagePath:function(path,size)
    {
    	if(path == "") return path;

    	if(path.indexOf("http") == -1 && path.indexOf("https") == -1) path = "https://" + path;
    	if(size==null || size === undefined) return path;

    	var ext = jarvis.lib.getExtension(path);
    	if(ext == "") return path;
    	ext = "."+ext;
    	path = path.replace(ext,"_"+ size + ext);
    	return path;
    },
    getDataValue:function(value)
    {
        if(value==null || value === undefined || value == "undefined" || value == "null") return null;
        return value;
    },
    getBoolValue:function(value) 
    { 
        if(value==null || value === undefined || value == "undefined" || value == "null") return false;
        if(value.toLowerCase()=="y") return true;
        return false;
    },
    getStringValue:function(value,defaultValue)
    {
    	if(defaultValue==null || defaultValue === undefined || defaultValue == "undefined" || defaultValue == "null") defaultValue = "";
        if(value==null || value === undefined || value == "undefined" || value == "null") return defaultValue;

        return String(value).replace('$O$', " ");
    },

    getNumberValue:function(value,defaultValue)
    {
    	if(defaultValue==null || defaultValue === undefined || defaultValue == "undefined" || defaultValue == "null") defaultValue = -1;
        if(value==null || value === undefined || value == "undefined" || value == "null") return defaultValue;
        return Number(value);
    },
    
    getArrayValue : function(data,key)
    {
        data = this.getDataValue(data);
        if(data == null) return new Array();
        if(key==null || key === undefined || key == "undefined" || key == "null") key = "list";
        var datas = this.getDataValue(data[key]);
        if(datas == null) return new Array();
        return datas;
    }
	
}

