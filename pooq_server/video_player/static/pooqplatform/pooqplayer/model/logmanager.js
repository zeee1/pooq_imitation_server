jarvis.logManagerInstance = null;

LogManager=function() 
{
	this.API_BOOK_MARK="https://bookmark.pooq.co.kr/v2/bookmark";
    this.API_BOOK_MARK_LOG="https://ebookmark.pooq.co.kr/v2/log"; 
    this.API_CLICK_LOG="https://clicks.pooq.co.kr/";
}

LogManager.getInstance = function()
{
	if(jarvis.logManagerInstance == null) jarvis.logManagerInstance = new LogManager().init();
	return jarvis.logManagerInstance;
}

LogManager.prototype =
{
	init:function() 
	{
		return this;
	},

	sendBookMark : function(data,isLog){
	
		if(isLog == null || isLog == undefined) isLog=false;
        var ajax=new jarvis.Ajax();
		var param=new Object();
		param.data=encodeURIComponent(data);
        if(isLog == false){

        	ajax.request(jarvis.playerInfo.API_BOOK_MARK,param, null,"GET","json");
        }else{

        	ajax.request(jarvis.playerInfo.API_BOOK_MARK_ERROR,param, null,"GET","json");
        }
	},

	sendLog:function(logPath)
  	{
      	if(logPath=="") return;
    	var ajax=new jarvis.Ajax();
    	ajax.request(logPath,null,null,"GET","json");
      	
  	},


	sendClickLog : function(cate,vodObject,name)
	{	
	    var that=this;
        var ajax=new jarvis.Ajax();
        var path = this.API_CLICK_LOG+DataManager.getInstance().userID+"/"+cate+"/"+vodObject.type.toLowerCase()+"/"+vodObject.contentID+"/"+name;
        ajax.request(path,null, null,"GET","json");   
	}

	
}



        
