document.write("<script src='"+ROOT_SRC+"model/datamodel.js?updateVS="+UPDATE_VS+"'></script>");
document.write("<script src='"+ROOT_SRC+"model/datainfo.js?updateVS="+UPDATE_VS+"'></script>");
document.write("<script src='"+ROOT_SRC+"model/logmanager.js?updateVS="+UPDATE_VS+"'></script>");

jarvis.dataManagerInstance = null;

DataManager=function() 
{
	this.API_PATH='https://apis.pooq.co.kr/';
	this.API_BOOK_MARK="https://bookmark3.pooq.co.kr/bookmark";
    this.API_BOOK_MARK_LOG="https://applog3.pooq.co.kr/bookmark-applog";
    this.mode = "";
	this.info = null;
}

DataManager.getInstance = function()
{
	if(jarvis.dataManagerInstance == null) jarvis.dataManagerInstance = new DataManager().init();
	return jarvis.dataManagerInstance;
}

DataManager.prototype =
{
	init:function() 
	{
		this.info = new DataInfo().init();
		return this;
	},

	setMode:function(mode)
    {
        this.mode = mode;
    },

	setSetupValue : function(type,value)
	{
		this.info.setSetupValue(type,value);
	},

	getSetupValue : function(type)
	{
		return this.info.getSetupValue(type);
	},

	getQVodTime:function(vodObject,delegate)
	{
		var that = this;
		
		var param = this.info.getDefaultParam();
		param.type = 'onair';
		param.contentid = vodObject.contentID;

		var path = this.API_PATH+API_COMMAND.QVOD_CHECK;
		var that = this;
		var ajax=new jarvis.Ajax();
        var ajaxDelegate=function(){}; 
			ajaxDelegate.prototype = 
			{
				onEvent : function(e,value,xhrStatus)
				{
					switch(e)
					{
						case jarvis.EVENT.COMPLETE:

							var result = that.info.checkApiResult(value,xhrStatus);
							if(result.code != API_RESULT.SUCCESS) console.log("QVodTime err skip");
							var time = new Object();
							time.range = Number(value.duration);
							time.duration = Number(value.endtimeduration);	
							return jarvis.lib.excuteDelegate(delegate,"onEvent",[e,time]);

						case jarvis.EVENT.ERROR:
							console.log("QVodTime err skip");
							break;

					}	  
					jarvis.lib.excuteDelegate(delegate,"onEvent",[e]);	
				}
			}

		ajax.request(path,param, new ajaxDelegate() ,jarvis.AJAX_REQUEST_TYPE.GET,jarvis.AJAX_RESPONSE_TYPE.JSON);
		
	},

	getMeta:function(vodObject,delegate)
	{
		var meta = new MetaObject();
		var that=this;
        var ajax=new jarvis.Ajax();
		var param = this.info.getDefaultParam();
		var path = this.getMetaAPIPath(vodObject);
		if(path == "") return jarvis.lib.excuteDelegate(delegate,"onEvent",[jarvis.EVENT.COMPLETE,meta]);
		var ajaxDelegate=function(){}; 
			ajaxDelegate.prototype = 
			{
				onEvent : function(e,value,xhrStatus)
				{
					switch(e){
						case jarvis.EVENT.COMPLETE:
							var result = that.info.checkApiResult(value,xhrStatus);
							if(result.code != API_RESULT.SUCCESS) return jarvis.lib.excuteDelegate(delegate,"onEvent",[jarvis.EVENT.ERROR,result]);
							meta.setData(value,vodObject.type);
							//vodObject.initTime = meta.viewTime;
							return jarvis.lib.excuteDelegate(delegate,"onEvent",[e,meta]);

						case jarvis.EVENT.ERROR:
							return jarvis.lib.excuteDelegate(delegate,"onEvent",[e,new APIResultObject(API_RESULT.NETWORK_ERROR,API_RESULT_MSG.NETWORK_ERROR)]);

					}	  
					jarvis.lib.excuteDelegate(delegate,"onEvent",[e]);	  

				}
			}
       
		ajax.request(path,param, new ajaxDelegate(),"GET","json");
	},

	getHomeshoppingInfo:function(channelID,delegate)
	{
		var meta = new MetaObject();
		var that=this;
        var ajax=new jarvis.Ajax();
		var param = this.info.getDefaultParam();
		param.channelid = channelID;
		var path = this.API_PATH+API_COMMAND.HOME_SHOPPING;
		
		var ajaxDelegate=function(){}; 
			ajaxDelegate.prototype = 
			{
				onEvent : function(e,value,xhrStatus)
				{
					switch(e){
						case jarvis.EVENT.COMPLETE:
							var result = that.info.checkApiResult(value,xhrStatus);
							if(result.code != API_RESULT.SUCCESS) return jarvis.lib.excuteDelegate(delegate,"onEvent",[jarvis.EVENT.ERROR,result]);
							var data = new HomeShoppingObject();
							data.setData(value);
							return jarvis.lib.excuteDelegate(delegate,"onEvent",[e,data]);

						case jarvis.EVENT.ERROR:
							return jarvis.lib.excuteDelegate(delegate,"onEvent",[e,new APIResultObject(API_RESULT.NETWORK_ERROR,API_RESULT_MSG.NETWORK_ERROR)]);

					}	  
					jarvis.lib.excuteDelegate(delegate,"onEvent",[e]);	  

				}
			}
       
		ajax.request(path,param, new ajaxDelegate(),"GET","json");
	},

	getMetaAPIPath:function(vodObject)
	{
		var api="";
		switch(vodObject.type)
		{
			case VOD_TYPE.LIVE: 
				api=this.API_PATH+API_COMMAND.META_LIVE+vodObject.contentID;
                break;
			case VOD_TYPE.VOD:
			case VOD_TYPE.QVOD:  
				api=this.API_PATH+API_COMMAND.META_VOD+vodObject.contentID;
				break;
			case VOD_TYPE.MOVIE: 
				api=this.API_PATH+API_COMMAND.META_MOVIE+vodObject.contentID;
                break;
            case VOD_TYPE.CLIP: 
				api=this.API_PATH+API_COMMAND.META_CLIP+vodObject.contentID;
				break;


		}  
		return api;	
	},

	getPermition:function(vodObject,delegate,isChanged,metaObject)
	{
		if(isChanged == null || isChanged == undefined) isChanged=true;
		var param = this.info.getDefaultParam();
		param.contentid = vodObject.contentID;
		param.contenttype = (!vodObject.isDVR) ? vodObject.type : "timemachine";
		param.action =  STREAMING_TYPE.HLS 

		if(metaObject != null && metaObject.drms != DRM_TYPE.NONE && metaObject.drms != "")
		{
			param.action = (param.drm == DRM_TYPE.WIDEVINE_CLASIC) ? STREAMING_TYPE.PROGRESS : ((param.drm != DRM_TYPE.FAIR_PLAY) ? STREAMING_TYPE.DASH : STREAMING_TYPE.HLS);
		}
		
		param.quality = vodObject.resolution;
		param.deviceModelId = jarvis.lib.getOSInfoStr();
		param.guid = this.info.GUID;
		param.lastplayid = this.getSetupValue(SHARED_KEY.LAST_PLAY_ID);
		param.authtype = "cookie";
		param.isabr = (this.info.playerType == PLAYER_TEC_TYPE.HTML5 && vodObject.resolution != "100p") ? this.info.isABR : "y";
		//param.isabr = this.info.isABR;
		//if(playerType == PLAYER_TYPE.VIDEO_JS) param.isabr = "y";
		param.ishevc = "n";
		
		var path = this.API_PATH+API_COMMAND.STREAMING;
		var that = this;
		var ajax=new jarvis.Ajax();
        var ajaxDelegate=function(){}; 
		ajaxDelegate.prototype = 
		{
			onEvent : function(e,value,xhrStatus)
			{
				switch(e){
					case jarvis.EVENT.COMPLETE:

						var result = that.info.checkApiResult(value,xhrStatus);
							
						if(result.code != API_RESULT.SUCCESS) return jarvis.lib.excuteDelegate(delegate,"onEvent",[jarvis.EVENT.ERROR,result]);
						vodObject.setData(value);
						if(vodObject.isAllow==true) that.info.setSetupValue(SHARED_KEY.QUALITY,param.quality);
						that.info.setSetupValue(SHARED_KEY.LAST_PLAY_ID,vodObject.playID);	
						return jarvis.lib.excuteDelegate(delegate,"onEvent",[e,vodObject]);

					case jarvis.EVENT.ERROR:
						
						return jarvis.lib.excuteDelegate(delegate,"onEvent",[e,new APIResultObject(API_RESULT.NETWORK_ERROR,API_RESULT_MSG.NETWORK_ERROR)]);
						

				}	  
				jarvis.lib.excuteDelegate(delegate,"onEvent",[e]);	
			}
		}

		ajax.request(path,param, new ajaxDelegate() ,jarvis.AJAX_REQUEST_TYPE.GET,jarvis.AJAX_RESPONSE_TYPE.JSON);
	},

	getRecommendations:function(vodObject,delegate)
	{
		var param = this.info.getDefaultParam();
		param.contentid = vodObject.contentID;
		param.contenttype = vodObject.type;
		param.offset = 0;
		param.limit= 6;
		param.orderby = "new";
		
		var path = this.API_PATH+API_COMMAND.RECOMMENDATIONS;
		var that = this;
		var ajax=new jarvis.Ajax();
        var ajaxDelegate=function(){}; 
		ajaxDelegate.prototype = 
		{
			onEvent : function(e,value,xhrStatus)
			{
				switch(e){
					case jarvis.EVENT.COMPLETE:

						var result = that.info.checkApiResult(value,xhrStatus);
						if(result.code != API_RESULT.SUCCESS) return jarvis.lib.excuteDelegate(delegate,"onEvent",[jarvis.EVENT.ERROR,result]);
						var recommendationInfo = new RecommendationInfo();
						recommendationInfo.setData(value);
						return jarvis.lib.excuteDelegate(delegate,"onEvent",[e,recommendationInfo]);

					case jarvis.EVENT.ERROR:
						
						return jarvis.lib.excuteDelegate(delegate,"onEvent",[e,new APIResultObject(API_RESULT.NETWORK_ERROR,API_RESULT_MSG.NETWORK_ERROR)]);
						

				}	  
				jarvis.lib.excuteDelegate(delegate,"onEvent",[e]);	
			}
		}

		ajax.request(path,param, new ajaxDelegate() ,jarvis.AJAX_REQUEST_TYPE.GET,jarvis.AJAX_RESPONSE_TYPE.JSON);
	},

	getPostRecommendations:function(metaObject,delegate)
	{
		var param = this.info.getDefaultParam();
		param.offset = 0;
		param.limit = 300;
		param.contenttype = metaObject.contentType;
		var path = this.API_PATH + API_COMMAND.POST_RECOMMENDATIONS + metaObject.recommendID;
		var that = this;
		var ajax=new jarvis.Ajax();
        var ajaxDelegate=function(){}; 
		ajaxDelegate.prototype = 
		{
			onEvent : function(e,value,xhrStatus)
			{
				switch(e){
					case jarvis.EVENT.COMPLETE:

						var result = that.info.checkApiResult(value,xhrStatus);
						if(result.code != API_RESULT.SUCCESS) return jarvis.lib.excuteDelegate(delegate,"onEvent",[jarvis.EVENT.ERROR,result]);
						var recommendationInfo = new RecommendationInfo();
						recommendationInfo.setPostData(value);
						return jarvis.lib.excuteDelegate(delegate,"onEvent",[e,recommendationInfo]);

					case jarvis.EVENT.ERROR:
						
						return jarvis.lib.excuteDelegate(delegate,"onEvent",[e,new APIResultObject(API_RESULT.NETWORK_ERROR,API_RESULT_MSG.NETWORK_ERROR)]);
						

				}	  
				jarvis.lib.excuteDelegate(delegate,"onEvent",[e]);	
			}
		}

		ajax.request(path,param, new ajaxDelegate() ,jarvis.AJAX_REQUEST_TYPE.GET,jarvis.AJAX_RESPONSE_TYPE.JSON);
	},


	getLists:function(listInfo,delegate)
	{

		var param = this.info.getDefaultParam();
		var path = this.API_PATH+listInfo.type;
		switch(listInfo.type)
		{
			case API_COMMAND.LIST_LIVE_POPULAR:
				param.free = 'all';
				param.genre = 'all';
				param.type = 'all';
				break;
			case API_COMMAND.LIST_VOD_POPULAR:
				param.channel = 'all';
				param.genre = 'all';
				param.type = 'all';
				break;
			case API_COMMAND.LIST_VOD_NEW:
				param.free = 'all';
				param.orderby = "new";
				param.weekday = "all";
				param.genre = 'all';
				param.type = 'all';
				break;
			case API_COMMAND.LIST_VOD_PROGRAM:
				path += listInfo.key;
				param.orderby = "new";
				break;
			case API_COMMAND.LIST_MOVIE_RECOMMEND:
				param.country = "all";
				param.orderby = "update";
				param.genre = 'all';
				param.type = 'all';
				break;
			case API_COMMAND.LIST_MOVIE_NEW:
				param.country = "all";
				param.sptheme = "all";
				param.orderby = "paid";
				param.genre = 'all';
				param.type = 'all';
				break;
			case API_COMMAND.LIST_THEME:
			    path += listInfo.key;
				param.contenttype = "movie";
				param.orderby = "rank";
				param.genre = 'all';
				param.type = 'all';
				break;

		}
		
		param.offset = listInfo.getOffSet();
		param.limit = listInfo.limit;
		listInfo.loadStart();
		
		var that = this;
		var ajax=new jarvis.Ajax();
        var ajaxDelegate=function(){}; 
			ajaxDelegate.prototype = 
			{
				onEvent : function(e,value,xhrStatus)
				{
					switch(e){
						case jarvis.EVENT.COMPLETE:

							var result = that.info.checkApiResult(value,xhrStatus);
							if(result.code != API_RESULT.SUCCESS) return jarvis.lib.excuteDelegate(delegate,"onEvent",[jarvis.EVENT.ERROR,result]);
							listInfo.setData(value);
							return jarvis.lib.excuteDelegate(delegate,"onEvent",[e,listInfo]);

						case jarvis.EVENT.ERROR:
							
							return jarvis.lib.excuteDelegate(delegate,"onEvent",[e,new APIResultObject(API_RESULT.NETWORK_ERROR,API_RESULT_MSG.NETWORK_ERROR)]);
							

					}	  
					jarvis.lib.excuteDelegate(delegate,"onEvent",[e]);	
				}
			}

		ajax.request(path,param, new ajaxDelegate() ,jarvis.AJAX_REQUEST_TYPE.GET,jarvis.AJAX_RESPONSE_TYPE.JSON);
	},



	getPrerolls:function(adRequestObject,delegate,meta)
    {
    	var that = this
    	var prerolls = new Array();
        var ajax=new jarvis.Ajax();
        var playTime = (meta) ? meta.playTime : "3600";
		var param = this.info.getJWTString(this.info.getADRequestParam(adRequestObject,playTime));
		var adPath = adRequestObject.url;
		var path = (adPath.indexOf("?")==-1) ? adPath + "?appupdated=y" : adPath + "&appupdated=y";
		path = (adPath.indexOf("adproxy")==-1) ? adPath : adPath+"&adverId=none&uidCookie=" + this.getSetupValue(SHARED_KEY.UID_COOKIE);
		
		var ajaxDelegate=function(){}; 
				ajaxDelegate.prototype = 
				{
					onEvent : function(e,value,xhrStatus)
					{
						switch(e){
							case jarvis.EVENT.COMPLETE:
								if(ajax.returnData.response==null || ajax.returnData.response==undefined) break;
	   							if(ajax.returnData.response != "video") break;
	   							var uidCookie = ajax.returnData.uidCookie;
	   							if(uidCookie != null && uidCookie != undefined) that.info.setSetupValue(SHARED_KEY.UID_COOKIE,uidCookie);			
   								var dataA=ajax.returnData.ads;
	 							for (var i=0; i< dataA.length; ++i) 
	 							{
									var vodObject=new VodObject(VOD_TYPE.AD);
									vodObject.setAdData(dataA[i]);
									prerolls.push(vodObject);
	 							}
								break;

							case jarvis.EVENT.ERROR:
								break;

						}
						adRequestObject.count--;
						jarvis.lib.excuteDelegate(delegate,"onEvent",[e,prerolls]);

					}
				}
			
       	ajax.request(path,param, new ajaxDelegate(),jarvis.AJAX_REQUEST_TYPE.FORM_BODY,jarvis.AJAX_RESPONSE_TYPE.JSON);
    }, 


	getVtts:function(path,delegate)
	{
		var that = this;
		var ajax=new jarvis.Ajax();
        var ajaxDelegate=function(){}; 
			ajaxDelegate.prototype = {
							onEvent : function(e,value)
							{
								switch(e){
									case jarvis.EVENT.COMPLETE:
										return jarvis.lib.excuteDelegate(delegate,"onEvent",[e,value]);
									case jarvis.EVENT.ERROR:
										console.log("vtts err");
										break;

								}	  
								jarvis.lib.excuteDelegate(delegate,"onEvent",[e]);	
							}
			}
		ajax.request(path,null, new ajaxDelegate() ,jarvis.AJAX_REQUEST_TYPE.GET,jarvis.AJAX_RESPONSE_TYPE.VTT);
		
	},

	getContentID:function(programID,delegate)
	{
		var that = this;
		var path = this.API_PATH + API_COMMAND.GET_CONTENT_ID + programID;
		var ajax=new jarvis.Ajax();
        var ajaxDelegate=function(){}; 
			ajaxDelegate.prototype = {
							onEvent : function(e,value,xhrStatus)
							{
								switch(e){
									case jarvis.EVENT.COMPLETE:
										var contentID = value.contentid;
										if(contentID)
										{
											jarvis.lib.excuteDelegate(delegate,"onEvent",[e,contentID]);
											return;
										}
										break;
									case jarvis.EVENT.ERROR:
										console.log("getContent err");
										break;

								}	  
								jarvis.lib.excuteDelegate(delegate,"onEvent",[jarvis.EVENT.ERROR]);
							}
			}
		ajax.request(path,null, new ajaxDelegate() ,jarvis.AJAX_REQUEST_TYPE.GET,jarvis.AJAX_RESPONSE_TYPE.JSON);
		
	},

	setUserInfo:function(userInfo)
	{
		this.info.setUserInfo(userInfo);
		this.getUserInfo();
	},

	getUserInfo:function()
	{
		
		var credential = this.getSetupValue(SHARED_KEY.CREDENTIAL);
		var userNo = (credential == this.info.credentialKey) ? this.getSetupValue(SHARED_KEY.USER_NO) : "";
		if(userNo==undefined || userNo==null || userNo=="undefined") userNo="";
		if((userNo != "" && this.info.profileID != "") || this.info.credentialKey == "none")
		{
			this.info.userNo = userNo;
			return;
		}

		var that = this;
		var path = this.API_PATH + API_COMMAND.GET_USER;
		var param = this.info.getDefaultParam();
		var ajax=new jarvis.Ajax();
        var ajaxDelegate=function(){}; 
			ajaxDelegate.prototype = {
							onEvent : function(e,value,xhrStatus)
							{
								switch(e){
									case jarvis.EVENT.COMPLETE:
										that.info.userNo = String(value.uno);
										that.info.profileID = (that.info.profileID != "") ? that.info.profileID : String(value.profileid);
										that.setSetupValue(SHARED_KEY.USER_NO,that.info.userNo);
										that.setSetupValue(SHARED_KEY.CREDENTIAL,that.info.credentialKey);
										//console.log("that.info.userNo : "+that.info.userNo);
										//console.log("that.info.profileID : "+that.info.profileID);
										break;
									case jarvis.EVENT.ERROR:
										console.log("getUser err");
										break;

								}	  
		
							}
			}

		var header = new Object();
		header["Content-type"] = "application/json";
		ajax.request(path,param, new ajaxDelegate() ,jarvis.AJAX_REQUEST_TYPE.GET,jarvis.AJAX_RESPONSE_TYPE.JSON,header);
		
	},

	sendMediaLog:function(adRequestData,t)
  	{
  		this.sendMediaLogData(adRequestData,this.info.getMedialogParam(adRequestData,t));
  	},

  	sendMediaLogData:function(adRequestData,medialogData)
  	{
      	var ajax=new jarvis.Ajax();
		var param= "medialog="+this.info.getJWTString(medialogData);
		ajax.request(adRequestData.videologUrl,param, null,jarvis.AJAX_REQUEST_TYPE.FORM_BODY,jarvis.AJAX_RESPONSE_TYPE.JSON);
  	},


  	sendBookMarkTest : function(vodObject,isLog,playData,times)
    {
    	var data = this.info.getBookMarkData(vodObject,isLog,playData);
        for(var  i =0; i<times; ++i)
        {
        	this.sendBookMarkData(vodObject,data,playData,isLog,true); 
        }
    },

  	sendBookMark : function(vodObject,isLog,playData)
  	{
        var data = this.info.getBookMarkData(vodObject,isLog,playData);
		this.sendBookMarkData(vodObject,data,playData,isLog); 
         
	},

	sendBookMarkData : function(vodObject,data,playData,isLog,isTest)
  	{
	    if(isLog == null || isLog == undefined) isLog=false;
		if(isTest == null || isTest == undefined) isTest=false;
		var path = "";
        if(isLog == true)
        {
        	path = this.API_BOOK_MARK_LOG;
        	data.logType = "E";
        }
        else
        {
        	path = this.API_BOOK_MARK;
        	data.logType = "I";
        }
        data.extra  = this.info.getExtraData(vodObject,playData);
        data.isABR = (playData.isABR  == true) ? "Y" : "N";
		data.BR = String(playData.BR);
		data.mediaTime = this.info.getLogTime(playData.currentTime);
		if(isLog == false && isTest == false)
		{
			var t  = Date.now();
        	if(t - this.info.prevSendBookMarkTime < 9999 && this.info.prevSendBookMarkTime != -1) return;
			this.info.prevSendBookMarkTime = t;
		}

		data.logDate = this.info.getNowLogDate();
		data = JSON.stringify(data);
		data = BOOK_MARK_TYPE == 'GET' ? this.info.getBase64Url(CryptoJS.enc.Utf8.parse(data),true) : data;
		var ajax=new jarvis.Ajax();
        ajax.request(path,{data:data}, null,BOOK_MARK_TYPE,jarvis.AJAX_RESPONSE_TYPE.TEXT);
	},

  	login:function(id,pw,delegate)
	{
		var param = this.info.getDefaultParam();
		var pstr = "";
		for (var key in param)
		{
			pstr=(pstr == "") ? "?"+key+"="+param[key] : pstr+"&"+key+"="+param[key];
		}
		var path = this.API_PATH+API_COMMAND.LOGIN+pstr;
		var that = this;
		var ajax=new jarvis.Ajax();
        var ajaxDelegate=function(){}; 
			ajaxDelegate.prototype = {
							onEvent : function(e,value,xhrStatus)
							{
								switch(e){
									case jarvis.EVENT.COMPLETE:
										that.info.credentialKey = encodeURIComponent(value.credential);
										//that.info.userNo = String(value.uno);
										that.info.userInfo.credentialKey = that.info.credentialKey;
										//that.info.userInfo.userNo  = that.info.userNo;
										console.log("credential  : " + that.info.credentialKey);

										that.getUserInfo();
										break;

									case jarvis.EVENT.ERROR:
										console.log("login err");
										break;

								}	  
								jarvis.lib.excuteDelegate(delegate,"onEvent",[e]);	
							}
			}

		var body = new Object();	
		body.type = "general";
  		body.id = id; 
  		body.password = pw;
  		body.pushid = "1234QWER-12-QWERTTYUIOP";
  		body.profile = "1";
  		var jsonBody = JSON.stringify(body);
  		var header = new Object();
		header["Content-type"] = "application/json";
		ajax.request(path,jsonBody, new ajaxDelegate() ,jarvis.AJAX_REQUEST_TYPE.POST,jarvis.AJAX_RESPONSE_TYPE.JSON,header);
		
	}
}


var API_COMMAND = Object.freeze
(
	{
		LOGIN: "login",
		STREAMING: "streaming",
		META_LIVE:"live/channels/",
		META_VOD:"vod/contents/",
		META_MOVIE:"movie/contents/",
		META_CLIP:"clip/contents/",
		QVOD_CHECK: "streaming/status",
		POST_RECOMMENDATIONS: "uiservice/recommend/contents/mostwith/",
		RECOMMENDATIONS: "recommendation/contents",
		LIST_LIVE_POPULAR: "live/popular-channels",
		LIST_VOD_POPULAR: "vod/popularcontents",
		LIST_VOD_NEW:"vod/newcontents",
		LIST_VOD_PROGRAM:"vod/programs-contents/",
		LIST_MOVIE_RECOMMEND:"movie/recommend/contents",
		LIST_MOVIE_NEW:"movie/contents",
		LIST_THEME: "themes-related-player/",
		HOME_SHOPPING: "homeshopping",
		GET_CONTENT_ID: "vod/programs-contentid/",
		GET_USER: "/user"
	}
);

var API_RESULT = Object.freeze
(
	{
		SUCCESS: "200",
		NETWORK_ERROR: "400",
		SERVER_ERROR: "500",
		API_ERROR: "550",
		API_RETRY: "551"
	}
);

var API_RESULT_MSG = Object.freeze
(
	{
		NETWORK_ERROR: "네트워크 환경을 확인해주세요.",
		SERVER_ERROR: "알 수 없는 오류가 발생하였습니다.<br>다시 시도해주세요.",
		UNDEFINE_ERROR: "권한없음."
	}
);

var VOD_TYPE = Object.freeze
(
	{
		NONE: "NONE",
		LIVE: "live", 
		VOD: "vod",
		AD: "ad", 
		CLIP: "clip",
		MOVIE: "movie",
		QVOD: "onairvod",
		PROGRAM:"program"
	}
);

var LIST_TYPE = Object.freeze
(
	{
		LIVE: "livelist", 
		VOD: "vodlist",
		CLIP: "cliplist",
		MOVIE: "movielist",
		THEME: "themelist"
	}
);


var STREAMING_TYPE = Object.freeze
(
	{
		HLS: "hls",
		DASH: "dash", 
		PROGRESS: "progressive",
		DOWNLOAD: "download"
	}
);

var DRM_TYPE = Object.freeze
( 
	{
		NONE: "none",
		WIDEVINE_CLASIC: "wc",
		WIDEVINE: "wm",
		PLAY_READY: "pr",
		FAIR_PLAY: "fp"
	}
)

var SHARED_KEY = Object.freeze
( 
	{
		QUALITY : "quality",
		LAST_PLAY_ID: "lastPlayID",
		LAST_GUID: "lastGUID",
		AUTO_PLAY: "autoPlay",
		PLAY_RATE: "playRate",
		SCREEN_RATIO: "screenRatio",
		UID_COOKIE: "uidCookie",
		INIT_USER:"initUser",
		TM_INFO:"tmInfo",
		AUTO_PLAY_INFO:"autoPlayInfo",
		I_WANT_FLASH: "iWantFlash",
		PLAYER_TYPE: "playerType",
		USER_NO: "userNo",
		CREDENTIAL: "credential"
	}
)


var PLAYER_TEC_TYPE = Object.freeze
(
	{
		FLASH: "FLASH", 
		HTML5: "HTML5"
	}
);

var PLAYER_TYPE = Object.freeze
(
	{
		BIT_MOVIN: "10",
		FLASH: "11", 
		HTML5: "12",
        VIDEO_JS: "15",
		CAST: "16"
	}
);


var LIST_TOP_TYPE = Object.freeze
(
	{
		RECOMMEND_MOVIE: "추천 영화",
		POPULAR_MOVIE: "인기 영화",
		THEME: "연관 Pick",
		PROGRAM_VOD: "전체회차",
		POPULAR_VOD: "인기 VOD",
		NEW_VOD : "최신 VOD",
		POPULAR_LIVE: "인기 LIVE"		
	}
);

var FUNCTION_BTN_CODE = Object.freeze
(
	{
		verify: "실명인증",
		eventpurchase: "이벤트 구매하기",
		login: "로그인",
		join: "회원가입",
		quality: "화질변경",
		purchase : "구매하기",
		cancel: "취소",
		retry: "재시도",	
		confirm:"확인"
	}
);



        
