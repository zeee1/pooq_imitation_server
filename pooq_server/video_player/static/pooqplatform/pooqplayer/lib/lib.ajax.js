/**
 * lib v1.0: jQueryUtil
 * by aeddang
 */
/*
interfaces
*/



if(typeof jarvis == "undefined") var jarvis = new Object();

jarvis.AJAX_ERROR = 
{
	NO_URL   : "nourl",
	NO_XHR: "noxhr", 
	NO_DATA: "nodata",
    PARSE: "parse",
    RESPONSE : "response"

};

jarvis.AJAX_REQUEST_TYPE = 
{
	POST : "POST",
	GET : "GET", 
	PUT :"PUT",
	DELETE :"DELETE",
	FORM: "FORM",
	FORM_BODY:"FORM_BODY"
};

jarvis.AJAX_RESPONSE_TYPE = 
{
	ARRAY_BUFFER: "arraybuffer",
	TEXT : "text",
	JSON : "json", 
	JSON_P : "jsonP",
	JSON_STRING : "jsonString",
    JSON_PARSE : "jsonParse",
    JSON_OBJECT : "jsonObject",
    XML : "xml",
    VTT : "vtt"
};


jarvis.Ajax= function() 
{
	this.TAG="Ajax :: ";
	this.url = "";
	this.xhr=null;
	this.responseType=null;
	this.returnData=null;
	this.jsonpLoader=null;
	this.delegate=null;
	this.isXDomain=false;
}

jarvis.Ajax.prototype =
{
	getXMLHttpRequest: function() 
	{
        
		this.isXDomain=false;

		var ievs=jarvis.lib.getIEDocVersion();
		if(ievs==-1 || ievs>9){
			if (window.XMLHttpRequest) {
				jarvis.debuger.log(this.TAG+"create XMLHttpRequest latest",jarvis.DEBUG_TYPE.DEBUG);
				return new XMLHttpRequest();
			}
		}


        if (window.XDomainRequest) {
			this.isXDomain=true;
			jarvis.debuger.log(this.TAG+"create XDomainRequest",jarvis.DEBUG_TYPE.DEBUG);
            return new XDomainRequest();


        }else if (window.XMLHttpRequest) {
			jarvis.debuger.log(this.TAG+"create XMLHttpRequest",jarvis.DEBUG_TYPE.DEBUG);
            return new XMLHttpRequest();


        }else if (window.ActiveXObject) {
           
			try {
				jarvis.debuger.log(this.TAG+"create Msxml2.XMLHTTP",jarvis.DEBUG_TYPE.DEBUG);
				return new ActiveXObject("Msxml2.XMLHTTP");//IE 상위 버젼
			}
			catch (e1) 
			{
				try {
					jarvis.debuger.log(this.TAG+"create Microsoft.XMLHTTP",jarvis.DEBUG_TYPE.DEBUG);
					return new ActiveXObject("Microsoft.XMLHTTP");//IE 하위 버젼
				} catch (e3) {
					return null;
				}
			}
			
		} else {
            return null;
        }
    }
	,
	
	
    request: function(url,param,delegate,requestType,responseType,header) 
	{
        if(url=="" || url==null)
        {
         	jarvis.debuger.log(this.TAG+"no URL",jarvis.DEBUG_TYPE.ERROR);
		    jarvis.lib.excuteDelegate(this.delegate,"onEvent",[jarvis.EVENT.ERROR,jarvis.AJAX_ERROR.NO_URL]);
			return;
		}
		this.url = url;
		this.delegate = delegate;
		this.responseType=responseType;
		if ( responseType === undefined ) responseType="json";
        if ( requestType === undefined ) requestType=jarvis.AJAX_REQUEST_TYPE.POST;
         
		var that=this;
		if(responseType==jarvis.AJAX_RESPONSE_TYPE.JSON_P)
		{
			requestType=jarvis.AJAX_REQUEST_TYPE.GET;
		    if(param==null) param=new Object();
			param.callback=this.sel;
		}
         
        var pstr="";
		var data=null;
        if (param != null)
		{
			if(requestType==jarvis.AJAX_REQUEST_TYPE.FORM)
			{
				data = new FormData();
				for (var key in param)
				{
					data.append(key, param[key]);
				}
				requestType=jarvis.AJAX_REQUEST_TYPE.POST;
			}
			else if(requestType==jarvis.AJAX_REQUEST_TYPE.FORM_BODY)
			{
				pstr = param;
				requestType=jarvis.AJAX_REQUEST_TYPE.POST;
			}
			else
			{
				var type = typeof param;
	            if(type.toLowerCase() == "string")
	            {
	                pstr = param;
	            }else
	            {
	            	for (var key in param)
					{
						pstr=pstr+"&"+key+"="+param[key];
					}
					if(pstr!="")
					{
						pstr=pstr.slice(1);
						if(requestType==jarvis.AJAX_REQUEST_TYPE.GET)
						{
							if(url.indexOf("?")==-1){
								url=url+"?"+pstr;
							}else{
								url=url+"&"+pstr;
							}
							pstr="";
						}
					}
	            }
				
				
			
			}
			
		}
		jarvis.debuger.log(this.TAG+"url->"+url,jarvis.DEBUG_TYPE.DEBUG);
		jarvis.debuger.log(this.TAG+"pstr-> " +pstr,jarvis.DEBUG_TYPE.DEBUG);
		

        if(responseType==jarvis.AJAX_RESPONSE_TYPE.JSON_P)
        {
            var head= document.getElementsByTagName('head')[0];
			if(this.jsonpLoader==null)
			{
			    this.jsonpLoader=document.createElement('script');
				this.jsonpLoader.type= 'text/javascript';
			}
			head.appendChild(this.jsonpLoader);
            this.jsonpLoader.src=url;

		}
		else
		{
			this.xhr = this.getXMLHttpRequest();
			if(this.xhr==null){
				jarvis.debuger.log(this.TAG+"no XHR",jarvis.DEBUG_TYPE.ERROR);
		     	jarvis.lib.excuteDelegate(this.delegate,"onEvent",[jarvis.EVENT.ERROR,jarvis.AJAX_ERROR.NO_XHR]);
				return;
			}

			this.xhr.open(requestType, url, true);//연결

            if(this.responseType == jarvis.AJAX_RESPONSE_TYPE.ARRAY_BUFFER)
            {
                this.xhr.responseType = this.responseType;
			}


			try 
			{
				if(header!=undefined){
					for (var h in header)
					{
						this.xhr.setRequestHeader(h,header[h]);
					}
					if(header["Content-Type"] != null && header["Content-Type"] != undefined) this.xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
				}
				else
				{
					this.xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
				}
			}
			catch (e)
			{
				jarvis.debuger.log(this.TAG+"Headers don't RequestHeader",jarvis.DEBUG_TYPE.ERROR);
                
			}
             
            if(this.isXDomain==true){
				 this.xhr.onload=function(){that.responseComplete();};
				 this.xhr.onerror =function(){that.responseError("onload error");};
				 this.xhr.ontimeout  =function(){that.responseError("timeout error");};
			}else{
			
			     this.xhr.onreadystatechange = function(){that.response();};
			}
			
            if( pstr=="" && data==null){
		      this.xhr.send(null);//GET전송
		    }else{
				if(data!=null){
					
					this.xhr.send(data);//mutipart전송
				}else{
					this.xhr.send(pstr);//POST전송
				}
		      
		    }
			
		 }
    },

	createXMLFromString: function(string) 
	{
        var xmlDocument=null;
        var xmlParser;
		
        if(window.ActiveXObject)
        {   
        	//IE일 경우
			xmlDocument = new ActiveXObject('Microsoft.XMLDOM');
			xmlDocument.async = false;
			try {
				xmlDocument.loadXML(string);
			}catch (e)//parseError 
			{    
                jarvis.debuger.log(this.TAG+e.errorCode+" : "+e.reason,jarvis.DEBUG_TYPE.ERROR);
			}
        }else if (window.XMLHttpRequest) 
        {   
        	//Firefox, Netscape일 경우
			xmlParser = new DOMParser();
			try 
			{
				xmlDocument = xmlParser.parseFromString(string, 'text/xml');
			}
			catch (e)//parseError 
			{
                jarvis.debuger.log(this.TAG+e.errorCode+" : "+e.reason,jarvis.DEBUG_TYPE.ERROR);   
			}
        } 
        else 
        {
        	jarvis.debuger.log(this.TAG+e.errorCode+" : "+e.reason,jarvis.DEBUG_TYPE.ERROR);    
        }
        return new jarvis.XmlDocument(xmlDocument);
    },

	responseComplete: function(xhrStatus) 
	{
		var str = "";
		if(this.responseType == jarvis.AJAX_RESPONSE_TYPE.ARRAY_BUFFER)
		{
            this.returnData = this.xhr.response;
            
            if(this.returnData)
            {
                jarvis.lib.excuteDelegate(this.delegate,"onEvent",[jarvis.EVENT.COMPLETE,this.returnData]);
            }
            else
            {
                jarvis.lib.excuteDelegate(this.delegate,"onEvent",[jarvis.EVENT.ERROR,jarvis.AJAX_ERROR.PARSE]);
            }
			return;
		}

		try {
            str = this.xhr.responseText;
		} catch (e) {
            jarvis.debuger.log(this.TAG+"return data null!!",jarvis.DEBUG_TYPE.ERROR);
      		jarvis.lib.excuteDelegate(this.delegate,"onEvent",[jarvis.EVENT.ERROR,jarvis.AJAX_ERROR.NO_DATA]);
			
			return;
		}
		if(str==""){
            jarvis.debuger.log(this.TAG+"return data empty!!",jarvis.DEBUG_TYPE.ERROR);
      		jarvis.lib.excuteDelegate(this.delegate,"onEvent",[jarvis.EVENT.ERROR,jarvis.AJAX_ERROR.NO_DATA]);
	
			return;
		
		}
		var enable=true;
		switch(this.responseType){
			 
		    case jarvis.AJAX_RESPONSE_TYPE.JSON:
				try 
				{
				    this.returnData= eval(str);
					break;
				} 
				catch (e) 
				{
                    enable=false;
                    jarvis.debuger.log(this.TAG+"json error!!",jarvis.DEBUG_TYPE.ERROR);
				}
			case jarvis.AJAX_RESPONSE_TYPE.JSON_PARSE:
				try 
				{
					enable=true;
				    this.returnData= JSON.parse(eval(str));
					break;
				} 
				catch (e) 
				{
                    enable=false;
                    jarvis.debuger.log(this.TAG+"json_parse error!!",jarvis.DEBUG_TYPE.ERROR);	
				}
			case jarvis.AJAX_RESPONSE_TYPE.JSON_STRING:
				try 
				{
					enable=true;
				    this.returnData= JSON.parse(str);
					break;
				} 
				catch (e) 
				{
                    enable=false;
                    jarvis.debuger.log(this.TAG+"json_string error!!",jarvis.DEBUG_TYPE.ERROR);	
				}
				 
				 
            case jarvis.AJAX_RESPONSE_TYPE.JSON_OBJECT:
				try 
				{
					enable=true;
				    this.returnData= eval("("+str+")");
				} 
				catch (e) 
				{
                    enable=false;
                    jarvis.debuger.log(this.TAG+"json_object error!!",jarvis.DEBUG_TYPE.ERROR);
				}
				break;
			case jarvis.AJAX_RESPONSE_TYPE.XML:
				this.returnData=this.createXMLFromString(str);
			    if(this.returnData==null)
			    {
				    enable=false;
				    jarvis.debuger.log(this.TAG+"xml error!!",jarvis.DEBUG_TYPE.ERROR);
				}
				break;
			case jarvis.AJAX_RESPONSE_TYPE.VTT:
				this.returnData = new jarvis.VttParser(this.url);
				this.returnData.parse(str);

			    if(this.returnData==null)
			    {
				    enable=false;
				    jarvis.debuger.log(this.TAG+"vtt error!!",jarvis.DEBUG_TYPE.ERROR);
				}
				break;
			case jarvis.AJAX_RESPONSE_TYPE.TEXT:
				this.returnData=str;
				break;
		    
		
		}
		if(enable==true)
		{
			jarvis.lib.excuteDelegate(this.delegate,"onEvent",[jarvis.EVENT.COMPLETE,this.returnData,xhrStatus]);
		}
		else
		{
			jarvis.lib.excuteDelegate(this.delegate,"onEvent",[jarvis.EVENT.ERROR,jarvis.AJAX_ERROR.PARSE]);
		}
           

	},

    responseError: function(status) 
	{
		
		jarvis.debuger.log(this.TAG+"responseError "+status,jarvis.DEBUG_TYPE.ERROR);
		jarvis.lib.excuteDelegate(this.delegate,"onEvent",[jarvis.EVENT.ERROR,jarvis.AJAX_ERROR.RESPONSE]);

	},
	response: function() 
	{
        if (this.xhr.readyState == 4) {//완료
            if (this.xhr.status == 200 || this.xhr.status == 550 || this.xhr.status == 551) {//오류없이 OK
                this.responseComplete(this.xhr.status);
				
            } else {
            	this.responseError(this.xhr.status);
            }
        }

	   
    }
   
	
}



jarvis.XmlDocument= function(dom) 
{
	
	this.dom=dom;
}
jarvis.XmlDocument.prototype =
{
    getElementsByTagName: function(tag)  ///XmlDocument
	{
		if(this.dom==null){
		    return new Array();
		}
		var elements=this.dom.getElementsByTagName(tag);
		if(elements.length>0){
		    return elements;
		}else{
		    return new Array();
		}
	},
	getElementByTagName: function(tag) ///jarvis.XmlDocument
	{
		if(this.dom==null){
		    return new jarvis.XmlDocument(null);
		}
		var elements=this.dom.getElementsByTagName(tag);
		if(elements.length>0){
		    return new jarvis.XmlDocument(elements[0]);
		}else{
		    return new jarvis.XmlDocument(null);
		}
	},
	nodeValue: function() 
	{
	    if(this.dom==null){
		    return "";
		}
		if(this.dom.childNodes.length>0){
		    return String(this.dom.childNodes[0].nodeValue);
		}else{
		    return "";
		}
		
	},
	getElementById: function(idName)
	{
	    if(this.dom==null){
		    return "";
		}
		return String(this.dom.getElementById(idName));
    }

}

jarvis.VttObject= function(path) 
{
	this.idx = -1;
	this.startTime = -1;
	this.endTime = -1;
	this.path = path;
	this.thumb = null;
}
jarvis.VttObject.prototype =
{
    parse : function(data)
	{
		var datas = data.split(/\n/);
		var size = 	datas.length;
			
		if(size < 2) return false;
		if(!this.paserTime(datas[0])) return false;
		if(!this.paserResource(datas[1])) return false;
		return true
	},

	paserTime : function(data)
	{
		var datas = data.split("-->");
		var size = 	datas.length;
		if(size != 2) return false;
		this.startTime = this.getTime(datas[0]);
		this.endTime = this.getTime(datas[1]);
		return true;
	},
	
	getTime : function(data)
	{
		data = data.replace(".",":");
		var datas = data.split(":");
		var size = 	datas.length;
		if(size != 4) return 0;
		var h = Number(datas[0]);
		var m = Number(datas[1]);	
		var s = Number(datas[2]);
		return (h*3600)+(m*60)+s;
	},

	paserResource : function(data)
	{
		
		var datas = data.split("#");
		var size = 	datas.length;
		if(size != 2) return false;
		this.thumb = this.getThumb(datas[1]);
		this.thumb.url = this.path+datas[0];
		return true;
	},
		
	getThumb : function(data)
	{
		var datas = data.split("=");
		var size = 	datas.length;
		if(size != 2) return null;
		
		var pozs = datas[1].split(",");
		size = pozs.length;
		if(size != 4) return null;
		
		var thumb = new Object();
		thumb.x = Number(pozs[0]);
		thumb.y = Number(pozs[1]);
		thumb.w = Number(pozs[2]);
		thumb.h = Number(pozs[3]);
		
		return thumb;
		
		
	}

}
jarvis.VttParser= function(path) 
{
	this.startTimeA = new Array();
	this.vtts = new Array();
	this.path = jarvis.lib.getDirectory(path);

	this.thumbWidth = 0;
	this.thumbHeight = 0; 
	
}

jarvis.VttParser.prototype =
{
    parse: function(data)  ///XmlDocument
	{
		var datas = data.split(/\n/);
		var cell = "";	
		var idx  = 0;
		for(var i = 0; i < datas.length; ++i)
		{
			var str = datas[i];
			str = str.replace(/\s/g,"");
			if(str.indexOf("-->") != -1) cell = str+"\n";
			
			if(str.indexOf("=") != -1)
			{
				cell = cell + str; 
				var obj = new jarvis.VttObject(this.path);
				
				if(obj.parse(cell)==true)
				{
					obj.idx = idx;
					idx++;
					this.vtts.push(obj);
					this.startTimeA.push(obj.startTime);
				}
				if(obj.thumb)
				{
					var w = obj.thumb.x + obj.thumb.w;
					var h = obj.thumb.y + obj.thumb.h;
					this.thumbWidth = (this.thumbWidth<w) ? w : this.thumbWidth;
					this.thumbHeight = (this.thumbHeight<h) ? h : this.thumbHeight;
				}
				cell = "";
			}
			
		}
		
		return this.vtts;
	}

}



 