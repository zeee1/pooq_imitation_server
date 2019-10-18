/**
 * lib v1.0: jQueryUtil
 * by aeddang
 */
/*
interfaces


*/

if(typeof jarvis == "undefined") var jarvis = new Object();



jarvis.DEBUG_TYPE = 
{
	ALL   : "all",
	DEBUG : "d", 
	INFO  : "i",
	ERROR : "e"
};

jarvis.Debuger= function() 
{
	this.parent=null;
	this.viewer=null;
	this.loger=null;
	this.title=null;
	this.type=jarvis.DEBUG_TYPE.INFO;
	this.logString="";
	this.used=false;
	this.init();

}

jarvis.Debuger.prototype =
{
	init: function() 
	{
       if(this.used==false){
	       return;
	   }
	   
	   this.parent=document.createElement("div");

	   this.title=document.createElement("div");
	   this.viewer=document.createElement("div");
	   this.loger=document.createElement("div");
       
       this.parent.setAttribute("style", "overflow:hidden; z-index:9999; position:absolute; left:0; bottom:0; width:50%; height:100%; background:rgba(0,0,0,0.7)");
       this.title.setAttribute("style", "overflow:hidden; margin-bottom:1%; padding:1% 10px; height:10%; color:#dddddd; font-size:18px");
	   this.viewer.setAttribute("style", "overflow:hidden; margin-bottom:1%; padding:1% 10px; height:20%; color:#ffffff; font-size:14px");
	   this.loger.setAttribute("style", "overflow:hidden; overflow-y:auto; -webkit-overflow-scrolling:touch; padding:1% 10px; color:#dddddd; height:64%; font-size:14px");
       
	   this.title.innerHTML="Jarvis "+jarvis.lib.VS;

	   this.parent.appendChild(this.title);
       this.parent.appendChild(this.viewer);
       this.parent.appendChild(this.loger);
       

	   
    }
	,
    setTitle: function(str) 
	{
       if(this.used==false){
	       return;
	   }
	   this.title.innerHTML="Jarvis "+jarvis.lib.VS+" "+str;
    }
	,
    reset: function() 
	{
       if(this.used==false){
	       return;
	   }
	   this.loger.innerHTML="";
	   this.viewer.innerHTML="";
    }
	,
    log: function(msg,type) 
	{
       if(this.used==false){
	       return;
	   }
	   if(type===undefined){
	       type=jarvis.DEBUG_TYPE.INFO;
	   }
	   
	   if(this.type=="all" || this.type==type){
	       this.loger.innerHTML=this.getString(type,msg)+this.loger.innerHTML;
	   }
	  // this.loger.scrollTop= this.loger.
    }
	,
    trace: function(msg) 
	{
       if(this.used==false){
	       return;
	   }
	   this.viewer.innerHTML=this.getString("trace",msg);
    }
	,
    getString: function(type,msg) 
	{
        if(this.used==false){
	       return;
	    }
		return type+" : <b>"+msg+"</b><br>";
    }
	,

    view: function(used) 
	{
        if(this.used==false){
	       return;
	    }
		if(used==true){
		    document.body.appendChild(this.parent);
		}else{
		    document.body.removeChild(this.parent);
		}
    }
	
	
	
}

jarvis.debuger=new jarvis.Debuger();





/*

*/