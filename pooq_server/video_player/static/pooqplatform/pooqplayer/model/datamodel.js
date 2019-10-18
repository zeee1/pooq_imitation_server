ListInfo = function(type,limit,key,uiType)
{
    this.uiType = uiType;
    this.type = type;
    this.key = key;
    this.pageCount = 0;
    this.lists = new Array();
    this.pageIdx = 0;
    this.limit = limit;
    this.isLoading = false;
    this.isReset = true;
}

ListInfo.prototype =
{
    setData:function(data)
    {
        this.pageIdx ++;
        var util = DataManager.getInstance().info;
        var vodType = "";
        switch(this.type)
        {
            case API_COMMAND.LIST_LIVE_POPULAR:
                var datas = util.getArrayValue(data);
                vodType = VOD_TYPE.LIVE;
                break;
            case API_COMMAND.LIST_VOD_POPULAR:
            case API_COMMAND.LIST_VOD_NEW:
            case API_COMMAND.LIST_VOD_PROGRAM:
                var datas = util.getArrayValue(data);
                vodType = VOD_TYPE.VOD;
                break;
            case API_COMMAND.LIST_MOVIE_NEW:
            case API_COMMAND.LIST_MOVIE_RECOMMEND:
                var datas = util.getArrayValue(data);
                vodType = VOD_TYPE.MOVIE;
                break;
            case API_COMMAND.LIST_THEME:
                var datas = util.getArrayValue(data,'themelist');
                break

        }
        for(var i = 0;i<datas.length;++i)
        {
            var list = null;
            if(this.type == API_COMMAND.LIST_THEME)
            {
                list = new ThemeObject(this.type);
                list.setData(datas[i]);
                if(list.viewMore != "") this.lists.push(list); 
            }
            else
            {
                list = new ListObject(this.type,vodType);
                list.setData(datas[i]);
                if(list.contentID != "") this.lists.push(list); 
            }   
        }
        this.pageCount = (datas.length > 0) ? (this.pageIdx+1) : this.pageIdx;
        //this.pageCount = (this.type == API_COMMAND.LIST_THEME) ? 1 : this.pageCount;  //util.getNumberValue(data.pagecount);
        this.isLoading = false;
    },



    loadStart:function()
    {
        this.isLoading = true;
    },

    isLoadAble:function()
    {
        if(this.isComplete()) return false;
        return (this.isLoading == true) ? false : true;
    },
    isComplete:function()
    {
        return (this.pageIdx>=this.pageCount) ? true : false;
    },

    getOffSet:function()
    {
        return this.pageIdx * this.limit;
    }

}


ListObject = function(apiType,type)
{
    this.contentID = "";
    this.apiType = apiType;
    this.type = type;
    this.channelID = "";
    this.channelName = "";
    this.programID = "";
    this.title = "";
    this.image = "";
    this.tvImage = "";
    this.streamType = "";
    this.price = "";
    this.startTime = "";
    this.endTime = "";
    this.playRatio = "";
    this.license = true;
    this.marks = "";
    this.targetAge = 0;
    this.viewRatio = 0;
    this.episodeNumber = "";
    this.releaseDate = "";
    this.releaseWeekDay = "";
    this.episodeTitle = "";
    this.update = false;
    this.viewTitle = "";
    this.subTitle = "";
}

ListObject.prototype =
{
    setData:function(data)
    {
        var util = DataManager.getInstance().info;
        this.channelID = util.getStringValue(data.channelid);
        this.channelName = util.getStringValue(data.channelname);
        this.programID = util.getStringValue(data.programid);
        this.image = util.getStringValue(data.image);
        this.tvImage = util.getStringValue(data.tvimage);
        this.streamType = util.getStringValue(data.type);
        this.price = util.getStringValue(data.price);
        this.playRatio = util.getStringValue(data.playratio);
        this.license = util.getBoolValue(data.license);
        this.marks = util.getStringValue(data.marks);
        this.targetAge = util.getNumberValue(data.targetage);

        switch(this.type)
        {
            case VOD_TYPE.LIVE:
                this.title = util.getStringValue(data.title);
                this.startTime = util.getStringValue(data.starttime);
                this.endTime = util.getStringValue(data.endtime);
                this.contentID = this.channelID;
                this.subTitle = this.startTime+" ~ "+this.endTime+"<br>"+this.channelName;
                this.image = util.getImagePath(this.image,"8");
                break;

            case VOD_TYPE.VOD:
                this.contentID = util.getStringValue(data.contentid);
                this.episodeNumber = util.getStringValue(data.episodenumber);
                this.title = util.getStringValue(data.programtitle);  
                this.releaseDate = util.getStringValue(data.releasedate);
                this.releaseWeekDay = util.getStringValue(data.releaseweekday);
                this.episodeTitle = util.getStringValue(data.episodetitle);
                this.update = util.getBoolValue(data.update);
                this.subTitle = this.episodeNumber+"회 "+this.releaseDate+"("+this.releaseWeekDay+")"+"<br>"+this.channelName;
                this.image = util.getImagePath(this.image,"8");
                this.viewRatio = util.getNumberValue(data.viewratio,0);
                var lType = util.getStringValue(data.type);
                this.type  =  (lType == "onair") ? VOD_TYPE.QVOD : this.type;
                break;

            case VOD_TYPE.MOVIE:
                this.contentID = util.getStringValue(data.movieid);
                this.title = util.getStringValue(data.title);  
                this.releaseDate = util.getStringValue(data.releasedate);
                this.subTitle = util.jsonEscapeBlank(util.getStringValue(data.synopsis));
                this.image = util.getImagePath(this.image,"300");
                this.rate = util.getNumberValue(data.rating,0);
                this.playTime = util.getNumberValue(data.runningtime) + "분";
                break;
        }

        this.viewTitle = (this.apiType == API_COMMAND.LIST_VOD_PROGRAM) ? this.episodeTitle : this.title; 
        this.tvImage = util.getImagePath(this.tvImage);

    }

}

ThemeObject = function(apiType)
{
    this.apiType = apiType;
    this.contentID = "";
    this.type = LIST_TYPE.THEME;
    this.themeID = "";
    this.themeTitle = "";
    this.description = "";
    this.image = "";
    this.themeCategory = "";
    this.contentType = "";
    this.viewTitle = "";
    this.viewMore = "";
    this.listNum = 0;
}

ThemeObject.prototype =
{
    setData : function(data)
    {
        var util = DataManager.getInstance().info;
        this.listNum = util.getStringValue(data.top_list_count);
        this.themeID = util.getStringValue(data.id);
        var titles = util.getDataValue(data.title);
        var subTitles = util.getDataValue(data.subtitle);

        this.themeTitle = this.getText(titles);
        this.description = this.getText(subTitles);
        this.image = util.getStringValue(data.title_img);
        this.themeCategory = util.getStringValue(data.themecategory);
        this.contentType = util.getStringValue(data.content_type);
        
        this.viewTitle = this.themeTitle +'<br>'+this.description;
        this.image = util.getImagePath(this.image);

        var lists = util.getDataValue(data.top_list);
        if(lists == null) return;
        if(lists.length < 1) return;
        this.viewMore = util.getStringValue(lists[0].view_more);
        if(this.viewMore != "")
        {
            //this.viewMore = this.viewMore.replace("www.pooq.co.kr", "beta.pooq.co.kr");
            if(this.viewMore.indexOf("http://") == -1) this.viewMore = 'http://' + this.viewMore;
        }

    },

    getText : function(datas)
    {
        if(datas == null) return "";
        var txt = ""
        var util = DataManager.getInstance().info;
        for(var i=0;i<datas.length;++i)
        {
            if(i!=0) txt += " ";
            txt += util.getStringValue(datas[i].text);
        }
        return txt;

    }

}


PlayerInfo = function(vodObject)
{
	this.delegate = null;
	this.vodObject = vodObject;
	this.metaObject = new MetaObject();
	this.prerolls = new Array();
	this.currentIDX = -1;
	this.isInit = true;
	this.isResetPreroll = true;
}

PlayerInfo.prototype = 
{
    init : function(delegate) 
	{ 
		this.delegate = delegate;
		this.currentIDX = 0;
		this.isInit = true;
		this.isResetPreroll = true;
		this.load();
	},

    remove : function() 
    { 
        this.delegate = null;
        this.vodObject = null;
        this.metaObject = null;
        this.prerolls = null;
    },
	
	load : function()
	{
        if(this.vodObject == null) return;
		if(this.vodObject.contentID == "")
    	{
    		this.onDataLoadComplete();
    		return;
    	}
        if(this.isInit == true)
		{

			this.loadMeta();
            this.currentIDX = 0;
		}
		else
		{
			this.currentIDX = this.prerolls.length;
			this.loadVod();
		}

	},

    changeVodObject: function(vodObject)
    {
        this.currentIDX = this.prerolls.length;
        this.vodObject = vodObject;
    },

	loadMeta : function()
    {
        var that = this;
        var delegate=function(){}; 
            delegate.prototype = {
                onEvent : function(e,value)
                {
                    switch(e){
                        case jarvis.EVENT.COMPLETE:
                            that.metaObject = value;
                            that.isInit = false;
                            that.setInitTime();
                            break;

                        case jarvis.EVENT.ERROR:
                        	console.log("loadMeta err skip");
                 			that.metaObject = new MetaObject();
                            break;

                    }

                    that.loadVod(); 
                }
            }

        DataManager.getInstance().getMeta(this.vodObject,new delegate());
    },

    updateMeta : function()
    {
        var that = this;
        var delegate=function(){}; 
            delegate.prototype = {
                onEvent : function(e,value)
                {
                    switch(e){
                        case jarvis.EVENT.COMPLETE:
                            that.metaObject = value;
                            jarvis.lib.excuteDelegate(that.delegate,"onEvent",[jarvis.EVENT.UPDATE,that.metaObject]);
                            break;

                        case jarvis.EVENT.ERROR:
                            break;

                    }
                }
            }

        DataManager.getInstance().getMeta(this.vodObject,new delegate());
    },

    checkPermission: function(isAutoPlay,resolution,playTime,isDVR,isRedirect)
    {
        if(playTime == null || playTime == undefined) playTime = -1;
        if(isRedirect == null || isRedirect == undefined) isRedirect = true;
        var vod = this.vodObject.clone(new VodObject());
        vod.resolution = (resolution!=null) ? resolution : vod.resolution;
        var isDVR = (isDVR!=null) ? isDVR : vod.isDVR;
        vod.setDVR(isDVR);
        vod.isAutoPlay = (isAutoPlay!=null) ? isAutoPlay : vod.isAutoPlay;
        // alert("playTime : " + playTime);
        var that = this;
        var delegate=function(){}; 
            delegate.prototype = {
                onEvent : function(e,value)
                {
                    switch(e){
                        case jarvis.EVENT.COMPLETE:
                            if(vod.isAllow == true)
                            {
                                if(isRedirect == true)
                                {
                                    vod.initTime = (playTime!=-1) ? playTime : that.metaObject.viewTime;
                                    that.changeVodObject(vod);
                                    that.onDataLoadComplete();
                                }
                            }
                            else
                            {
                                if(isRedirect == true && vod.playUrl != "")
                                {
                                    vod.initTime = 0;
                                    that.changeVodObject(vod);
                                    that.onDataLoadComplete();
                                    return;
                                }

                                if(vod.postData!= null)
                                {
                                    jarvis.lib.excuteDelegate(that.delegate,"onEvent",[jarvis.EVENT.ALARM,vod]); 
                                }else
                                {
                                    var result = new APIResultObject("200", API_RESULT_MSG.UNDEFINE_ERROR,null) ;
                                    result.isRedirect = isRedirect;
                                    jarvis.lib.excuteDelegate(that.delegate,"onEvent",[jarvis.EVENT.ERROR,result]);
                                }

                            }
                            break;

                        case jarvis.EVENT.ERROR:
                            value.isRedirect = isRedirect;
                            value.title = API_RESULT_MSG.UNDEFINE_ERROR;
                            jarvis.lib.excuteDelegate(that.delegate,"onEvent",[e,value]);
                            break;

                    }      
                }
            }

        DataManager.getInstance().getPermition(vod,new delegate(),false,this.metaObject);
    },

    loadVod : function()
    {
        if(this.vodObject == null) return;
    	if(this.vodObject.contentID == "")
    	{
    		this.onDataLoadComplete();
    		return;
    	}

        var that = this;
        var delegate=function(){}; 
            delegate.prototype = {
                onEvent : function(e,value)
                {
                    switch(e){
                        case jarvis.EVENT.COMPLETE:
                            that.loadPrerolls();                       
                            break;

                        case jarvis.EVENT.ERROR:
                            jarvis.lib.excuteDelegate(that.delegate,"onEvent",[e,value]);
                            break;

                    }      
                }
            }

        DataManager.getInstance().getPermition(this.vodObject,new delegate(),true,this.metaObject);
    },

    hasNextContents : function()
    {
        if(this.vodObject.isPreview == true) return false;
        if(this.metaObject.nextEpisode == null) return false;
        return true;
    },

    isRechangePreroll : function()
    {
        if(this.isResetPreroll == false) return false;
        if(this.vodObject.prerollRequestObject == null) return false;
        if(this.vodObject.prerollRequestObject.count < 1)
        {
            this.isResetPreroll = false;
            return false;
        }
        return true;
    },

    loadRechargePrerolls : function()
    {
        this.loadPrerolls();
    },

    loadPrerolls : function()
    {
        if(this.vodObject == null) return;
        if(this.vodObject.hasPrerolls)
        {
        	if(this.vodObject.hasPrerolls() == false || this.isResetPreroll == false)
        	{
        		this.onDataLoadComplete();
        		return;
        	}
        }
        this.currentIDX = 0;
    	this.prerolls = new Array();
    	
        var that = this;
        var delegate=function(){}; 
            delegate.prototype = {
                onEvent : function(e,value)
                {
                    switch(e){
                        case jarvis.EVENT.COMPLETE:

                            that.prerolls = value;
                            break;

                        case jarvis.EVENT.ERROR:
                            console.log("loadPrerolls err skip");
                            break;

                    }
                    that.onDataLoadComplete();
                   
                }
            }

        DataManager.getInstance().getPrerolls(this.vodObject.prerollRequestObject,new delegate(),this.metaObject);
    },   

    setInitTime : function()
    {
        if(this.vodObject == null) return;
        if(this.vodObject.initTime == -1) this.vodObject.initTime = (this.metaObject!=null) ? this.metaObject.viewTime : -1;
    },
    onDataLoadComplete : function()
    {
    	
    	if(this.prerolls.length>0)
    	{
    		var isAutoPlay = this.vodObject.isAutoPlay;
    		this.prerolls[0].isAutoPlay = isAutoPlay;
    		for(var i=1;i<this.prerolls.length;++i)
    		{
    			this.prerolls[i].isAutoPlay = true;
    			
    		}
            this.vodObject.isAutoPlay = true;
    	}
        this.setInitTime();

        this.vodObject.programID = (this.metaObject!=null) ? this.metaObject.programID : "";
        jarvis.lib.excuteDelegate(this.delegate,"onEvent",[jarvis.EVENT.COMPLETE]);  
    },


    isComplete : function()
	{
        if(this.currentIDX > this.prerolls.length)
		{
			this.isResetPreroll = true;
			return true;
		}
       
        if(
            this.vodObject.hasPrerolls()==false
            || (this.vodObject.prerollRequestObject.count < 1 && this.prerolls.length < 1)) this.vodObject.prerollRequestObject = null;
		return false;
	},

    

	getCurrentVod : function()
	{
		var vod = null;
		if(this.currentIDX == this.prerolls.length) vod = this.vodObject;
		vod = (this.currentIDX >= this.prerolls.length) ? this.vodObject : this.prerolls[this.currentIDX];
		this.currentIDX ++;
        return vod;
	}
}

RecommendationInfo= function() 
{
    this.recommendations = new Array();
}

RecommendationInfo.prototype = 
{
    init: function() 
    { 
       
    },

    setData : function(data)
    {
        var datas = DataManager.getInstance().info.getDataValue(data);
        if(datas == null) return;

        for(var i = 0;i < datas.length; ++i)
        {
            var recommendation = new RecommendationObject();
            recommendation.setData(datas[i]);
            this.recommendations.push(recommendation);
        }
    },

    setPostData : function(data)
    {
        var topList = DataManager.getInstance().info.getDataValue(data.top_list);
        if(topList == null) return;
        if(topList.length < 1) return;
        var datas = DataManager.getInstance().info.getDataValue(topList[0].bottom_list);
        if(datas == null) return;
        var recommendation = new RecommendationObject();
        recommendation.setDatas(datas);
        this.recommendations.push(recommendation);
        
    },

    getLists : function(vodObject)
    {
        var lists = new Array();
        for(var i = 0;i < this.recommendations.length; ++i)
        {
            lists = lists.concat(this.recommendations[i].lists);
        }
        return lists;
    }
}


RecommendationObject= function() 
{
    this.type = "";
    this.pageCount = 0;
    this.count = 0;
    this.lists = new Array();
}

RecommendationObject.prototype = 
{
    setData : function(data)
    {
        var util = DataManager.getInstance().info;
        this.type = util.getStringValue(data.type);
        this.pageCount = util.getNumberValue(data.pagecount);
        this.count = util.getNumberValue(data.count);
        var listDatas =  util.getArrayValue(data);
        for(var i = 0;i < listDatas.length; ++i)
        {
            var episode = this.getEpisode(listDatas[i],this.type);
            if(episode != null) this.lists.push(episode);
        }

    },

    setDatas : function(listDatas)
    {
    
        for(var i = 0;i < listDatas.length; ++i)
        {
            var episode = this.getEpisode(listDatas[i]);
            if(episode != null) this.lists.push(episode);
        }

    },

    getEpisode : function(data,type)
    {
        var util = DataManager.getInstance().info;
        data = util.getDataValue(data);
        if(data == null) return null;
        var episode = new EpisodeObject();
        type = (type) ? type : "none";
        switch(type)
        {
            case LIST_TYPE.VOD:
                episode.type = VOD_TYPE.VOD;
                episode.contentID = util.getStringValue(data.contentid);
                episode.episodeNumber = util.getStringValue(data.episodenumber);
                episode.channelName = util.getStringValue(data.channelname);
                episode.title = util.getStringValue(data.programtitle);
                episode.episodeTitle = util.getStringValue(data.episodetitle);
                episode.image = util.getStringValue(data.image);
                break;
            case LIST_TYPE.MOVIE:
                episode.type = VOD_TYPE.MOVIE;
                episode.contentID = util.getStringValue(data.movieid);
                episode.title = util.getStringValue(data.title);
                episode.image = util.getStringValue(data.image);
                break;
            case LIST_TYPE.CLIP:
                episode.type = VOD_TYPE.CLIP;
                episode.contentID = util.getStringValue(data.clipid);
                episode.title = util.getStringValue(data.cliptitle);
                episode.image = util.getStringValue(data.image);
                break;
            default:
                episode.type = util.getStringValue(data.content_type);
                if(episode.type == 'content') episode.type = VOD_TYPE.VOD;
                if(episode.type == 'program') episode.type = VOD_TYPE.VOD;
                episode.contentID = util.getStringValue(data.bottom_link);
                episode.title = util.getStringValue(data.bottom_text1);
                var t1 = util.getStringValue(data.bottom_text2);
                var t2 =  util.getStringValue(data.bottom_text3);
                var t3 =  util.getStringValue(data.bottom_text4);
                episode.subTitle = t1;
                if(t2 != "") episode.subTitle += ("<br>" + t2);
                if(t3 != "") episode.subTitle += ("<br>" + t3);

                episode.targetAge = util.getStringValue(data.targetage);
                episode.image = util.getStringValue(data.bottom_img);

                if(episode.contentID.indexOf("=") != -1)
                {
                    var qurry = jarvis.lib.getQurryParam(episode.contentID);
                    if(qurry.contentid) episode.contentID = qurry.contentid;
                    if(qurry.programid) episode.contentID = qurry.programid;
                    if(qurry.movieid) episode.contentID = qurry.movieid;
                }

                break;

        }

        if(episode.contentID == "") return null;
        episode.releaseDate = util.getStringValue(data.releasedate);
        episode.releaseWeekday = util.getStringValue(data.releaseweekday);
        episode.image = util.getImagePath(episode.image);
        episode.init();
        return episode;
    }
}


MetaObject= function() 
{

    this.updateKey = jarvis.lib.generateID("Meta");
	this.type = "";
	this.channelID = "";
    this.channelTitle = "";
    this.programID = "";
    this.programTitle = "";
    this.title = "";
    this.channelColor = "";
    this.image = "";
    this.tvImage = "";
    this.streamType = "";
    this.price = "";
    this.genreText = "";
    this.genreValue = "";
    this.startTime = "";
    this.endTime = "";
    this.playRatio = "";
    this.isTimemachine = false;
    this.isLicense = true;
    this.marks = "";
    this.targetAge = "";
    this.episodeNumber = "";
  	this.releaseDate = "";
  	this.releaseWeekDay = "";
  	this.episodeTitle = "";
    this.playTime = 0;
    this.isHomeShopping = false;
    this.liveEpgsChannelList = new Array();
    this.originTitle = "";
	this.reReleaseDate = "";
	this.isSteam = false;
	this.isAlarm = false;
	this.isDownloadAble = false;
	this.synopsis = "";
	this.cpid = "";
	this.cpname = "";
	this.viewTime = -1;
	this.viewRatio = "";
	this.rating = "";
	this.country = "";
	this.deliveRationInfo = "";

	this.events = new Array();
	this.directors = new Array();
	this.actors = new Array();
	this.tags = new Array();
	this.genres = new Array();
	this.drms = DRM_TYPE.NONE;

	this.programSynopsis = "";
	this.programImage = "";
	this.genreText = "";
	this.genreValue = "";
	this.liveChannel = "";
	this.prevEpisode = null;
	this.nextEpisode = null;

    this.viewTitle = "";
    this.initImage = "";
    this.contentID = "";

    this.playStartTime = -1;
    this.playEndTime = -1;
    this.playUpdateTime = -1;
    this.recommendID = "";
    this.contentType = "";
    this.linkType = "";
    this.isPooqZone = (DataManager.getInstance().info.pooqzoneType == "none" || DataManager.getInstance().info.pooqzoneType == "") ? false : true;
}

MetaObject.prototype = 
{
    init: function() 
	{ 
       
	},
	getInitImage : function()
	{
		return (this.programImage != "") ? this.programImage : this.image;
	},
	getTitle : function()
	{
        var title = this.title;
        if(this.type == VOD_TYPE.LIVE)
        {
            title = (this.channelTitle == "") ? title : this.channelTitle + " " + title;
        }else
        {
            title = (this.episodeNumber == "" || this.episodeNumber == "0") ? title : title + " " + this.episodeNumber+"회";
        }
        return title;
	},

    getEpisode : function(data)
    {
        var util = DataManager.getInstance().info;
    	data = util.getDataValue(data);
		if(data == null) return null;
		var episode = new EpisodeObject();
		episode.contentID = util.getStringValue(data.contentid);
        if(episode.contentID == "") return null;
		episode.episodeNumber = util.getStringValue(data.episodenumber);
    	episode.releaseDate = util.getStringValue(data.releasedate);
    	episode.releaseWeekday = util.getStringValue(data.releaseweekday);
    	episode.image = util.getStringValue(data.image);
        episode.image = util.getImagePath(episode.image);
        episode.init();
    	return episode;
    },

    getDataLists : function(data)
	{
        var util = DataManager.getInstance().info;
		var datas = util.getArrayValue(data);
		var arr = new Array();

		for(var i=0;i<datas.length;++i)
		{
			var d = datas[i];
			var list = new DataObject();
			list.text = util.getStringValue(d.text);
			list.value = util.getStringValue(d.value);
    		list.ID = util.getStringValue(d.id);
    		this.arr.push(list);
		}
		return arr;
	},

    setEvents : function(data)
	{
        var util = DataManager.getInstance().info;
		this.events = new Array();
		var datas = util.getArrayValue(data);
		for(var i=0;i<datas.length;++i)
		{
			var d = datas[i];
			var event = new EventObject();
			event.name = util.getStringValue(d.name);
    		event.ID = util.getStringValue(d.id);
    		event.marks = util.getStringValue(d.marks);
    		event.filesize = util.getStringValue(d.filesize);
    		this.events.push(event);
		}
	},

	setLiveEpgsChannelList : function(data)
	{
        var util = DataManager.getInstance().info;
		this.liveEpgsChannelList = new Array();
		var datas = util.getArrayValue(data);

		for(var i=0;i<datas.length;++i)
		{
			var d = datas[i];
			var channel = new LiveEpgsChannelObject();
			channel.schduleID = util.getStringValue(d.schduleid);
    		channel.programID = util.getStringValue(d.programid);
    		channel.title = util.getStringValue(d.title);
    		channel.image = util.getStringValue(d.image);
    		channel.genre = util.getStringValue(d.genre);
    		channel.startTime = util.getStringValue(d.starttime);
    		channel.endTime = util.getStringValue(d.endtime);
    		channel.isTimemachine = util.getBoolValue(d.timemachine);
    		channel.isLicense = util.getBoolValue(d.license);
    		channel.marks = util.getStringValue(d.marks);
    		channel.targetAge = util.getStringValue(d.targetage);
    		channel.isSteam = util.getBoolValue(d.zzim);
    		channel.isAlarm = util.getBoolValue(d.alarm);
    		this.liveEpgsChannelList.push(channel);
		}
	},

	setData : function(data,type)
	{
        var util = DataManager.getInstance().info;
		this.type = type;
		this.title = util.getStringValue(data.title);
		this.channelID = util.getStringValue(data.channelid);
        this.programID = util.getStringValue(data.programid);
    	this.episodeTitle = util.getStringValue(data.episodetitle); 
    	this.episodeNumber = util.getStringValue(data.episodenumber); 
    	this.image = util.getStringValue(data.image);
    	this.releaseDate = util.getStringValue(data.releasedate);
    	this.releaseWeekDay = util.getStringValue(data.releaseweekday);
    	this.price = util.getStringValue(data.price);
        this.cpid = util.getStringValue(data.cpid);
    	this.targetAge = util.getStringValue(data.targetage,"0");
    	this.marks = util.getStringValue(data.marks);
    	this.playTime = util.getNumberValue(data.playTime);
    	this.playRatio = util.getStringValue(data.playratio);
    	this.viewTime = util.getNumberValue(data.viewtime);
  		this.viewRatio = util.getStringValue(data.viewratio);
    	this.streamType = util.getStringValue(data.type,"video");
    	this.isSteam = util.getBoolValue(data.zzim);
    	this.isAlarm = util.getBoolValue(data.alarm);
    	this.isDownloadAble = (DataManager.getInstance().mode == PLAYER_MODE.POPUP 
                                || DataManager.getInstance().mode == PLAYER_MODE.CUSTOM) ? false : util.getBoolValue(data.downloadable);
    	this.tags = util.getArrayValue(data.tags);
    	this.actors = util.getArrayValue(data.actors);
    	this.synopsis = util.getStringValue(data.synopsis);
        this.contentType = this.type;
    	

    	switch(this.type)
    	{
			case VOD_TYPE.LIVE : 
				this.title = util.getStringValue(data.title);
				this.channelTitle = util.getStringValue(data.channelname);
				this.channelColor = util.getStringValue(data.channelcolor);
		    	this.tvImage = util.getStringValue(data.tvimage);
		    	this.genreText = util.getStringValue(data.genretext);
		    	this.genreValue = util.getStringValue(data.genrevalue);
		   		this.startTime = util.getStringValue(data.starttime);
		    	this.endTime = util.getStringValue(data.endtime);
			    this.isTimemachine = util.getBoolValue(data.timemachine);
			    this.isLicense = util.getBoolValue(data.license);
                this.isHomeShopping= util.getBoolValue(data.homeshopping);
		 		this.setLiveEpgsChannelList(data.liveepgschannellist);
                this.findUpdateTime();
				break;

            case VOD_TYPE.MOVIE : 
                this.title = util.getStringValue(data.title);
				this.originTitle = util.getStringValue(data.origintitle);
				this.reReleaseDate = util.getStringValue(data.rereleasedate);
				
    			this.cpname = util.getStringValue(data.cpname);
  				this.rating = util.getStringValue(data.rating);
  				this.country = util.getStringValue(data.country);
  				this.deliveRationInfo = util.getStringValue(data.deliverationinfo);
  				this.setEvents(data.event);
  				this.directors = util.getArrayValue(data.directors);
  				this.genres = util.getArrayValue(data.genre);
  				this.drms = util.getStringValue(data.drms,DRM_TYPE.NONE);
                this.contentID = util.getStringValue(data.movieid);
                this.recommendID = this.contentID;
            	break;

            case VOD_TYPE.CLIP : 
                this.title = util.getStringValue(data.cliptitle);
                this.programTitle = util.getStringValue(data.programtitle);
  				this.channelTitle = util.getStringValue(data.channeltitle);
                this.contentID = util.getStringValue(data.contentid);
                this.linkType = util.getStringValue(data.linktype);
		  		break;

			default :
			    this.title = util.getStringValue(data.programtitle);
				this.channelTitle = util.getStringValue(data.channelname);
				this.releaseWeekDay = util.getStringValue(data.programreleaseweekday);
				this.startTime = util.getStringValue(data.programstarttime);
		    	this.endTime = util.getStringValue(data.programendtime);
				this.programSynopsis = util.getStringValue(data.programsynopsis);
				this.programImage = util.getStringValue(data.programimage);
				this.genreText = util.getStringValue(data.genretext);
				this.genreValue = util.getStringValue(data.genrevalue);
                this.drms = util.getStringValue(data.drms,DRM_TYPE.NONE);
				this.liveChannel = util.getStringValue(data.livechannel);
				this.prevEpisode = this.getEpisode(data.prevepisode); 
				this.nextEpisode = this.getEpisode(data.nextepisode); 
                this.contentID = util.getStringValue(data.contentid);
                if(this.genreValue == "01")
                {
                    this.recommendID = this.programID;
                    this.contentType = VOD_TYPE.PROGRAM;
                }
                else
                {
                    this.recommendID = this.contentID;
                }
                
                
				break;
		} 
        this.programImage = util.getImagePath(this.programImage);
        this.image = util.getImagePath(this.image);
        this.tvImage = util.getImagePath(this.tvImage);

        this.viewTitle = this.getTitle();
        this.initImage = this.getInitImage();


    	
	},

    findUpdateTime : function()
    {
        var now = new Date();
        var ct = now.getTime();

        var cy = now.getFullYear();
        var cm = now.getMonth();
        var cd = now.getDate();
        var chh = now.getHours();
        var cmm = now.getMinutes();

        var sdate = getTimeDate(this.startTime);
        var edate = getTimeDate(this.endTime,sdate.getHours());
        
        var st = sdate.getTime();
        var et = edate.getTime();

        if(st >= et)
        {
            edate = getNextTimeDate(edate);
            et = edate.getTime();
        }
        this.playCurrentTime = ct;
        this.playStartTime = st;
        this.playEndTime = et;
        this.playUpdateTime = et + Math.floor(Math.random()*60*5*1000);
       
        function getTimeDate(hhmm)
        {
            var tA = hhmm.split(":");
            if(tA.length!=2) return new Date();
            var h = Number(tA[0]);
            var m = Number(tA[1]);
            return new Date(cy, cm, cd, h, m, 0, 0);
        }

        function getNextTimeDate(date)
        {
            var y = date.getFullYear();
            var m = date.getMonth();
            var d = date.getDate() + 1;
            var hh = date.getHours();
            var mm = date.getMinutes();
            var dayNum = jarvis.lib.getDaysInMonth(y,m);
            if(d > dayNum)
            {
                d = d-1;
                m = m+1;
            }
            if(m > 11)
            {
                m = m-1;
                y = y+1;
            }
            return new Date(y, m, d, hh, mm, 0, 0);
        }
    }



}




VodObject = function(type,contentID,resolution,isDVR,isAutoPlay)
{

    if(contentID === undefined || contentID == null) contentID = "";
   	if(resolution === undefined || resolution == null) resolution = DataManager.getInstance().getSetupValue(SHARED_KEY.QUALITY);
   	if(isDVR === undefined || isDVR == null) isDVR = false;
   	if(isAutoPlay === undefined || isAutoPlay == null) isAutoPlay = false;
   	this.programID = "";
   	this.contentID = contentID;
   	this.resolution = resolution; 
   	this.qualities = new Array();
   	this.quality = "";
    this.isRadio = false;
    this.isRadioChannel = false;
    this.type = type;
	this.isAutoPlay = isAutoPlay;
	this.initTime = -1;
	this.play = "";
	this.authType = "";
	this.playUrl = "";
	this.etcUrl = "";
	this.awsCookie = "";
	this.issue = "";
	this.playID = "";
	this.chargedType = "";
	this.priceType = "";
	this.concurrencyGroup = "";
	this.playTime = 0;
	this.onAirVod = "";
	this.previewTime = 0;	
  	this.prerollRequestObject = null;
    this.prerollRequestLogs = null;
    this.postScreen = "";
  	this.adObject = null;
	this.isVTT = false;
	this.vttPath = "";
	this.isDVR = isDVR;
	this.isSignedCookie = false;	
	this.isDRM = false;
	this.drmType = DRM_TYPE.NONE;
	this.drmHeader = null;
	this.drmHost = "";
    this.flags = null;
    this.qurry = "";
    this.isPreview = false;
    this.postData = null;
    this.previewData = null;
    this.nextTriggerSeconds = 60;
    this.autoNextTrigger = true;
    this.isAllow = true;
    this.isSeekAble= true;
    this.isShareAble= (
                        this.type == VOD_TYPE.AD || 
                        //this.type == VOD_TYPE.CLIP || 
                        this.type == VOD_TYPE.QVOD ||
                        DataManager.getInstance().mode == PLAYER_MODE.CUSTOM ||
                        DataManager.getInstance().mode == PLAYER_MODE.POPUP) ? false : true;

    this.setDVR(isDVR);

    
    
}

VodObject.prototype =
{
    setDVR:function(_isDVR)
    {
        if(_isDVR==undefined || _isDVR==null) _isDVR = false;
        this.isDVR = _isDVR;
        if(this.isDVR == true)
        {
            this.flags = [{t:0,v:"-60"},{t:600,v:"-50"},{t:1200,v:"-40"},{t:1800,v:"-30"},{t:2400,v:"-20"},{t:3000,v:"-10"}];
        }else
        {
            this.flags = null;
        }
    },


    clone : function(minime)
    {
        for (var key in this)
        {
            minime[key] = this[key];
        }
        return minime;
    },

	update:function(overrideData)
    {
    	if(!overrideData) return;
    	for (var key in overrideData)
		{
            if(overrideData[key] != null && overrideData[key] != undefined)
            {
                this[key] = overrideData[key];
               // console.log("set key : " + key+ " : " +  this[key]);
            }
		}
		return this;
    },

    hasPrerolls:function()
    {
    	if(this.prerollRequestObject == null) return false;
    	if(this.prerollRequestObject.url == "") return false;
    	return true;
    },

    setAdData: function(data) 
	{  
		this.vodUrl=data.content_url;
		this.vodUrl = this.vodUrl.replace(/https:/g, "http:");
        this.adObject = new AdObject();
        this.adObject.setData(data);
        this.isSeekAble = false;
	},

	setData:function(data)
	{
        var util = DataManager.getInstance().info;
        this.qurry = "";
        this.qualities = this.getQualities(data.qualities);
		this.play = util.getStringValue(data.play);
		this.authType = util.getStringValue(data.authtype);
  		this.playUrl = (!this.isDVR) ? util.getStringValue(data.playurl) : util.getStringValue(data.liveurl);
       
 		this.etcUrl = util.getStringValue(data.etcurl);
  		this.awsCookie = util.getStringValue(data.awscookie);
  		this.issue = util.getStringValue(data.issue);
  		this.playID = util.getStringValue(data.playid,'none');
  		this.quality = util.getStringValue(data.quality);
  		
  		this.chargedType = util.getStringValue(data.chargedtype);
  		this.priceType = util.getStringValue(data.pricetype);
  		this.concurrencyGroup = util.getStringValue(data.concurrencygroup);
  		this.playTime = util.getNumberValue(data.playtime);
  		this.onAirVod = util.getStringValue(data.onairvod);
  		this.drmType = util.getStringValue(data.drmtype);
        this.postScreen = util.getStringValue(data.postscreen);
  		this.drm = util.getStringValue(data.drm);
  		this.previewTime = util.getNumberValue(data.previewtime,60);
  		this.nextTriggerSeconds = util.getNumberValue(data.nexttriggerseconds,60);

  		var prerollAD = util.getDataValue(data.prerollad);
        
  		if(prerollAD!=null)
  		{
  			this.prerollRequestObject = new AdRequestObject();
            this.prerollRequestObject.count  = util.getNumberValue(prerollAD.playcount,1);
  			this.prerollRequestObject.adapiversion = util.getStringValue(prerollAD.adapiversion);
			this.prerollRequestObject.url = util.getStringValue(prerollAD.url);
			this.prerollRequestObject.logapiversion= util.getStringValue(prerollAD.logapiversion);
			this.prerollRequestObject.videologUrl= util.getStringValue(prerollAD.videologUrl);
            this.prerollRequestObject.optionnalData = prerollAD;
            this.prerollRequestObject.url = this.prerollRequestObject.url.replace(/http:/g, "https:");
			this.prerollRequestObject.videologUrl = this.prerollRequestObject.videologUrl.replace(/http:/g, "https:");	
            this.prerollRequestLogs = new AdRequestLogs();

            //this.prerollRequestObject.count  = 3;
           
  		}
        console.log("this.drmType "+ this.drmType )
  		this.isVTT = (this.etcUrl == "") ? false : true;
        //if (util.playerType == PLAYER_TEC_TYPE.FLASH)  this.isVTT = false;
  		this.vttPath= this.etcUrl + "thumbnail.vtt";
  		this.isDRM = (this.drmType == "") ? false : true;
  		console.log("isDRM "+ this.isDRM )
	    var drm = util.getDataValue(data.drm);
	    if(drm!=null)
  		{
  			this.drmHeader = util.getStringValue(drm.customdata);
  			this.drmHost = util.getStringValue(drm.drmhost);
  		}
	    this.vodUrl = this.playUrl;
        if(this.awsCookie != "") 
        {
            var cookies=this.awsCookie.split(";");
            for(var i=0;i<cookies.length;++i)
            {  
                var cookie = cookies[i];
                cookie = cookie.replace(/CloudFront-Policy=/g, "Policy=");
                cookie = cookie.replace(/CloudFront-Signature=/g, "Signature=");
                cookie = cookie.replace(/CloudFront-Key-Pair-Id=/g, "Key-Pair-Id=");
                this.qurry += (i==0) ? cookie : ("&"+cookie);
            }
        }

        this.isRadio = (this.quality == "100p") ? true : false;
        var play = util.getStringValue(data.play);
        this.isPreview = (play == "p") ? true : false;
        this.isAllow = (play == "y") ? true : false;
        
        if(data.preview)
        {
            this.postData = new UserInfoObject();
            this.previewData = new UserInfoObject();
            this.postData.setData(data.preview,"exit",true);
            this.previewData.setData(data.preview,"preview",false);

            if(this.postData.msg == "") this.postData = null;
            if(this.previewData.msg == "") this.previewData = null;
        }
        
        this.autoNextTrigger = (this.postData == null) ? true : false;
        this.isSeekAble = (this.type == VOD_TYPE.LIVE && this.isDVR == false) ? false : true;
	},

	getQualities : function(data)
	{
        var util = DataManager.getInstance().info;
		var qualities = new Array();
		var datas = util.getArrayValue(data);
        this.isRadioChannel = true;
		for(var i=0;i<datas.length;++i)
		{
			var d = datas[i];
			var quality = new QualityObject();
			quality.name = util.getStringValue(d.name);
    		quality.ID = util.getStringValue(d.id);
    		quality.marks = util.getStringValue(d.marks);
    		quality.filesize = util.getStringValue(d.filesize);
    		qualities[i]=quality;

            if(quality.ID != "100p") this.isRadioChannel = false;
		}
        return qualities;
	},

    getChannelType :function()
    {
        var chType = "";
        switch(this.type)
        {
            case VOD_TYPE.LIVE:
                chType="L";
                break;
            case VOD_TYPE.CLIP:
                chType="C";
                break;
            case VOD_TYPE.MOVIE:
                chType="M";
                break;   
            default:
                chType="V";
                break;   
        }
        return chType;
    },

    getItemType :function()
    {
        var id="";
        switch(this.resolution)
        {
            case "500":
            case "360p":
                id="1";
                break;
            case "700":
                id="2";
                break;
            case "1000":
            case "480p":
                id="3";
                break;
            case "2000":
            case "720p":
                id="4";
                break;
            case "5000":
            case "1080p":
                id="9";
                break;
            case "2160p":
                id="21";
                break;
        }
        return id;  
            
    }

}


UserInfoObject= function() 
{
    this.isView = false;
    this.title = "";
    this.msg = "";
    this.btns = new Array();

}

UserInfoObject.prototype = 
{

    setData: function(data,key,isPost) 
    { 
        if(isPost==undefined || isPost==null) isPost = false;
        var util = DataManager.getInstance().info;
        var mode = DataManager.getInstance().mode;
        this.msg = util.jsonEscape(util.getStringValue(data[key+"msg"]));
        this.title = util.getStringValue(data[key+"title"]);
        var btnStr = util.getStringValue(data[key+"btn"]);
        var btnKeys = btnStr.split(",");
        for(var i=0;i<btnKeys.length;++i)
        {
            var code = FUNCTION_BTN_CODE[btnKeys[i]];
            if(mode == PLAYER_MODE.POPUP)
            {
                if(code == FUNCTION_BTN_CODE.verify) code = null;
                if(code == FUNCTION_BTN_CODE.eventpurchase) code = null;
                if(code == FUNCTION_BTN_CODE.login) code = null;
                if(code == FUNCTION_BTN_CODE.join) code = null;
                if(code == FUNCTION_BTN_CODE.purchase) code = null;
            }
            if(code != null && code != undefined) this.btns.push(code);
            
        }
        if(isPost == false) return;
        if(this.btns.length < 1) this.btns.push(FUNCTION_BTN_CODE.confirm);
    }
}

AdRequestLogs= function() 
{
    this.continue=true;
    this.start=false;
    this.firstQuartile=false;
    this.midPoint=false;
    this.thirdQuartile=false;
    this.thirtySeconds=false;
    this.complete=false;
}

AdRequestObject= function() 
{
    
    this.url="";
    this.count = 1;
    this.tid = String(CryptoJS.MD5(jarvis.lib.generateID("POOQ")));
    this.logapiversion="2.0";
    this.adapiversion="1.6";
    this.videologUrl="";
    this.isActive=false;
    this.optionnalData = null;
}

HomeShoppingObject = function()
{
    this.orderUrl = ""; 
    this.orderNumber = ""; 
    this.assistantNumber = ""; 
}

HomeShoppingObject.prototype = 
{
    setData: function(data) 
    { 
        var util = DataManager.getInstance().info;
        this.orderUrl = util.getStringValue(data.orderurl);
        this.orderUrl = util.getLinkPath(this.orderUrl);
        this.orderNumber = util.getStringValue(data.ordernumber);
        this.assistantNumber = util.getStringValue(data.assistantnumber);
    }
}

AdObject= function() 
{
     this.link="";
     this.linkTracking="";
	 this.linkTarget="_blank";
	 this.skipTime=5;
	 this.start="";
	 this.firstQuartile="";
	 this.midPoint="";
	 this.thirdQuartile="";
     this.thirtySeconds="";
	 this.complete="";
	 this.skip="";
	 this.impression = "";
	 this.progressOffset = "";
	 this.progressUrl = "";
	 this.isSmr = true;
	 this.brands = new Array();

}

AdObject.prototype = 
{
    setData: function(data) 
	{ 
		var tracking=data.tracking_url;
		if(tracking!=undefined && tracking!=null)
		{
			this.link= tracking.click;
			this.linkTracking = getLogData(tracking.clickLog);
			this.start= getLogData(tracking.start);
			this.firstQuartile= getLogData(tracking.firstQuartile);
			this.midPoint= getLogData(tracking.mid_point);
			this.thirdQuartile= getLogData(tracking.thirdQuartile);
			this.complete= getLogData(tracking.complete);
            this.thirtySeconds= getLogData(tracking.thirtySeconds);
			this.skip= getLogData(tracking.skip);
			
            this.start = getLogPath(this.start);
			this.firstQuartile = getLogPath(this.firstQuartile);
			this.midPoint = getLogPath(this.midPoint);
			this.thirdQuartile = getLogPath(this.thirdQuartile);
			this.complete = getLogPath(this.complete);
			this.skip = getLogPath(this.skip);
			this.linkTracking = getLogPath(this.linkTracking);
            this.thirtySeconds= getLogPath(this.thirtySeconds);
		}

		this.impression = getLogData(data.impression);
	 	this.progressOffset = getOffsetData(data.progress_offset);
	 	this.progressUrl = getLogData(data.progress_url);
		this.skipTime = getOffsetData(data.skip.offset);
        //this.skipTime = 5;
		this.impression = getLogPath(this.impression);
		this.progressUrl = getLogPath(this.progressUrl);

		this.isSmr = (this.impression != "") ? false : true;

		if(data.brand_ad == null || data.brand_ad == undefined) return;
		if(!data.brand_ad.length) return;
		var brands = data.brand_ad;

		for(var i = 0; i< brands.length; ++i)
		{
			var brand = new BrandObject();
			brand.setData(brands[i]);
			this.brands.push(brand);
		}

		function getLogPath (path) 
		{  
			return path.replace(/http:/g, "https:");
	    }

		function getOffsetData (offset) 
		{  
			if(offset!=undefined && offset!=null) return (offset=="" || offset=="0") ? -1 : Number(offset);
			return offset;
	    }
		function getLogData (log) 
		{  
			if(log===undefined || log==null) return "";
	        return String(log);
	    }

	}

	

	
}

BrandObject= function() 
{
    
    this.imageUrl = "";
    this.viewstart = -1;
    this.viewend = -1;
    this.topPos = -1;
    this.bottomPos = -1;
    this.leftPos = -1;
    this.rightPos = -1;
    this.imageWidth = -1;
    this.imageHeight = -1;
    this.clickTracking = "";
    this.clickThrough = "";

}

BrandObject.prototype = 
{

    setData: function(data) 
	{ 
		this.imageUrl = data.imageUrl;
        var util = DataManager.getInstance().info;

		this.clickTracking = util.getStringValue(data.clickTracking);
	 	this.clickThrough = util.getStringValue(data.clickThrough);
	 	
	 	this.viewstart = util.getNumberValue(data.viewstart);
	 	this.viewend = util.getNumberValue(data.viewend);

	 	this.topPos = getPosition(data.topPos);
    	this.bottomPos = getPosition(data.bottomPos);
    	this.leftPos = getPosition(data.leftPos);
    	this.rightPos = getPosition(data.rightPos);
    	this.imageWidth = getPosition(data.imageWidth);
    	this.imageHeight = getPosition(data.imageHeight);

		function getPosition(p) 
		{  
			if(p == "none" || p == "" || p == null || p == undefined) return -1;
			if(String(p).indexOf('%') != -1) return p;
			if(String(p).indexOf('px') != -1) return p;
			return p+'px';
	    }

	},

    setDummy: function(t) 
    {
        this.imageUrl = 'http://wchimg.pooq.co.kr/pooqlive/thumbnail/M10.jpg';
        this.viewstart = t+0;
        this.viewend = t+3;
        this.topPos = "30%";
        this.bottomPos = -1;
        this.leftPos = "30%";
        this.rightPos = -1;
        this.imageWidth = "70%";
        this.imageHeight = "70%";

        this.clickTracking = "testclickTracking.json";
        this.clickThrough = "testclickThrough.html";
    },

    setDummy2: function(t) 
    {
        this.imageUrl = 'http://wchimg.pooq.co.kr/pooqlive/thumbnail/K09.jpg';
        this.viewstart = t+0;
        this.viewend = t+3;
        this.topPos = -1;
        this.bottomPos = "30%";
        this.leftPos = -1;
        this.rightPos = "20px";
        this.imageWidth = "70%";
        this.imageHeight = "70%";

        this.clickTracking = "testclickTracking.json";
        this.clickThrough = "testclickThrough.html";
    }

	
}

DataObject = function()
{
	this.text = "";
    this.ID = "";
    this.value = "";
}

QualityObject = function()
{
	this.name = "";
    this.ID = "";
    this.marks = "";
    this.filesize = "";
}

LiveEpgsChannelObject = function()
{
	this.schduleID = "";
    this.programID = "";
    this.title = "";
    this.image = "";
    this.genre = "";
    this.startTime = "";
    this.endTime = "";
    this.isTimemachine = false;
    this.isLicense = "";
    this.marks = "";
    this.targetAge = "";
    this.isSteam = "";
    this.isAlarm = "";
}

EventObject = function()
{
    this.name = "";
    this.ID = "";
    this.marks = "";
    this.filesize = "";
}

EpisodeObject = function()
{
    this.type = "";
    this.title = "";
	this.contentID = "";
    this.price = "";
    this.targetAge = "";
    this.episodeNumber = "";
    this.releaseDate = "";
    this.releaseWeekday = "";
    this.image = "";
    this.channelName = "";
    this.episodeTitle = "";

    this.subTitle = "";
}
EpisodeObject.prototype = 
{
    init: function() 
    {
        if(this.subTitle != "") return;
        var sub = (this.episodeNumber != "")? this.episodeNumber+"회 " : "";
        sub += (this.releaseDate  != "")? this.releaseDate  : "";
        sub += (this.releaseWeekday  != "")? ("("+this.releaseWeekday + "요일)")  : "";
        sub += (this.channelName  != "")? ("<br>"+this.channelName) : ""; 
        this.subTitle = sub;
    }
}

APIResultObject= function(code,msg,option) 
{
    if(msg == null || msg == undefined) msg="";
    if(option == undefined) option = null;
	this.code = code;
    this.msg = msg;
    this.option = option;
    this.isRedirect = true;
    this.title = "[ERROR]";
}








