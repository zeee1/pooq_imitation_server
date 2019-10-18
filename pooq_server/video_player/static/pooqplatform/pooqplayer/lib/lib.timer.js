/**
 * lib v1.0: jarvis util
 * by aeddang
 */
/*
interfaces


*/

if(typeof jarvis == "undefined") var jarvis = new Object();




jarvis.Timer= function() 
{
	
	this.TAG="Timer :: ";
	
	this.timeUnit=100;
	this.loofTimer=null;
	this.timerIDA=new Array();
	this.timerA=new Array();
	


}
jarvis.TimerObject= function() 
{
	this.id="";
	this.t=0.1;
	this.isPlay=true;
	this.count=0;
	this.startTime=0;
	this.repeatCount=0;
	this.delegate=null;//excute/complete

}
jarvis.Timer.prototype =
{
	init:function()
	{
		
	},
    checkTimer:function()
	{
		if(this.timerA.length>0)
		{
			this.createTimer();
		}
	},
	createTimer:function()
	{
		if( this.loofTimer == null)
		{
			this.loofTimer=setTimeout("jarvis.timer.loof()",this.timeUnit);
		}
	},
	clearTimer:function()
	{
		if( this.loofTimer!=null)
		{
         	clearTimeout( this.loofTimer );
           	this.loofTimer=null;
		   
		}
	},
    remove:function()
	{
		this.clearTimer();
	},
	addTimer: function(delegate,tObj) 
	{
       

       if(tObj.t<0.1)
       {
       		console.log("addTimer error : "+tObj.id+" "+tObj.t);
       		return;
       }
       this.removeTimer(tObj.id);
	   if(tObj.id=="")
	   {
	   		tObj.id = "timer" + this.timerA.length;
	   }
	   tObj.t=tObj.t*1000;
       tObj.delegate=delegate;
	   tObj.startTime= Date.now();
	  
	   this.timerA.push(tObj);
	   this.timerIDA.push(tObj.id);
	   this.createTimer();
       

	   return tObj.id;
    }
	,
    resetTimer: function(id) 
	{
       	var idx = this.timerIDA.indexOf(id)
       	if(idx!=-1)
	   	{
	   		var tObj = this.timerA[idx];
       		tObj.count=0;
	   		tObj.startTime=Date.now();
   		}
       
	   
    }
	,
    resetAllTimer: function() 
	{
       var now = Date.now();
       for(var i=0;i<this.timerA.length;++i){
	      var tObj=this.timerA[i];
          tObj.count=0;
	   	  tObj.startTime=now;
	   }
    }
	,
	stopTimer: function(id) 
	{
       	var idx = this.timerIDA.indexOf(id)
       	if(idx!=-1)
	   	{
       		var tObj = this.timerA[idx];
       		tObj.isPlay=false;
   		}
	  
    }
	,
    stopAllTimer: function() 
	{
       for(var i=0;i<this.timerA.length;++i){
	      var tObj=this.timerA[i];
          tObj.isPlay=false;
		  
	   }
    }
	,
	playTimer: function(id) 
	{
      
	   	var idx = this.timerIDA.indexOf(id);
	   	if(idx!=-1)
	   	{
       		var tObj = this.timerA[idx];
       		tObj.isPlay=true;
   		}
    }
	,
    playAllTimer: function() 
	{
      
	   for(var i=0;i<this.timerA.length;++i){
	      var tObj=this.timerA[i];
          tObj.isPlay=true;
	   }
    }
	,
	removeAllTimer: function() 
	{
        this.timerA=new Array();
	    this.removeLoofTimer();
		this.loofCount=0;
    }
	,
    removeTimer: function(id) 
	{
       var idx = this.timerIDA.indexOf(id)
       
       if(idx!=-1)
	   {
	   	   this.timerIDA.splice(idx,1);
	   	   this.timerA.splice(idx,1);
	   	   //delete this.timerIDA[idx];
	       //delete this.timerA[idx];
	   }
	   
	   
	   
    }    
	,
    loof: function() 
	{
       
	   var now = Date.now();
	   
       //console.log("loof : "+this.timerA.length);
	   for(var i=0;i<this.timerA.length;++i)
	   {
	      var tObj = this.timerA[i];
	      if(tObj != null)
	      {
	      		if(tObj.isPlay == true)
		        {
		          	var diff = now - tObj.startTime;
		          	var count = Math.floor(diff/tObj.t);
		          	
		          	//console.log("diff : "+diff);
		          	//console.log("count : "+count);
		          	//console.log("tObj.count : "+tObj.id);
		          	if(count != tObj.count)
		          	{
		          		tObj.count = count;
		          		jarvis.lib.excuteDelegate(tObj.delegate,"onEvent",[jarvis.EVENT.PROGRESS,tObj.id,tObj.count]);

		          		if(tObj.repeatCount<=0 || tObj.count<tObj.repeatCount)
		          		{
					         
						}else{
					      	
							jarvis.debuger.log(this.TAG+"onComplete  : "+tObj.id,jarvis.DEBUG_TYPE.DEBUG);
							jarvis.lib.excuteDelegate(tObj.delegate,"onEvent",[jarvis.EVENT.COMPLETE,tObj.id]);
							this.removeTimer(tObj.id);
						}
		          	}	

		        }
	      }
	      
		}
		this.loofTimer = null;
		this.checkTimer();
	}
	
}
if(jarvis.timer===undefined){
	jarvis.timer=new jarvis.Timer();
}





/*

*/