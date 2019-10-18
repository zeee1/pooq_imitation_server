/**
 * lib v1.0: jarvis class
 * by aeddang
 */
/*
interfaces


*/

if(typeof jarvis == "undefined") var jarvis = new Object();
jarvis.ImageLoader= function(body,type,delegate) 
{
    if(type=== undefined){
	    type="FIT_XY";
	}
	this.delegate=delegate;
	this.body=body;
	this.type=type;
	this.img=new Image();
	this.img.style.position='absolute';
	this.orgWidth=-1;
	this.orgHeight=-1;
    jarvis.lib.addEventListener(this.img,"load",this.imageLoadComplete.bind(this));

}

jarvis.ImageLoader.FILL_XY="FILL_XY";  
jarvis.ImageLoader.FILL_CENTER="FILL_CENTER"; 
jarvis.ImageLoader.FIT_XY="FIT_XY";
jarvis.ImageLoader.FIT_CENTER="FIT_CENTER"; 


jarvis.ImageLoader.prototype =
{
	load : function(src,type){
		if(type!== undefined){
		    this.type=type;
		}
		this.orgWidth=-1;
		this.orgHeight=-1;
		this.img.src=src;
	},
	setImage: function(img){
		this.img=img;
		this.setInitImage();
	},
	imageLoadComplete : function(e){
		this.setInitImage();
		jarvis.lib.excuteDelegate(this.delegate,"complete",[this]);
	},
	setInitImage: function()
	{
		
		this.orgWidth=this.img.width;
		this.orgHeight=this.img.height;

		console.log("this.orgWidth : " + this.orgWidth);
		console.log("this.orgHeight : " + this.orgHeight);
        this.resize();
		this.body.appendChild(this.img);
		
	},
	resize : function(wid,hei)
	{
        

        if(this.body.style.display == "none") return;
        if(wid!== undefined) this.body.style.width=wid+"px";
		if(hei!== undefined) this.body.style.height=hei+"px";
		
		if(this.orgWidth==-1) return;

		console.log("resize  : " + wid + " " +hei);
	    console.log("resize orgWidth : " + this.orgWidth);
	    console.log("resize orgHeight : " + this.orgHeight);
        var bounce=jarvis.lib.getAbsoluteBounce(this.body);
		var bounceI;
		console.log(bounce);
        switch(this.type){
		     case jarvis.ImageLoader.FILL_XY:
				 bounceI=new jarvis.Rectangle();
                 bounceI.width=bounce.width;
				 bounceI.height=bounce.height;
			     break;
			 case jarvis.ImageLoader.FILL_CENTER:
                 bounceI=jarvis.lib.getEqualRatioRect(this.orgWidth,this.orgHeight,bounce.width,bounce.height);
				 break;
			 case jarvis.ImageLoader.FIT_XY:
				 bounceI=jarvis.lib.getEqualRatioRect(this.orgWidth,this.orgHeight,bounce.width,bounce.height,true);
				 break;
			 case jarvis.ImageLoader.FIT_CENTER:
				 bounceI=jarvis.lib.getEqualRatioRect(this.orgWidth,this.orgHeight,bounce.width,bounce.height,false);
				 break;
			 default:
				 bounceI=jarvis.lib.getEqualRatioRect(this.orgWidth,this.orgHeight,bounce.width,bounce.height,true);
				 break;
		
		
		}
		this.img.style.width=bounceI.width+"px";
        this.img.style.height=bounceI.height+"px";
		this.img.style.top=bounceI.y+"px";
		this.img.style.left=bounceI.x+"px";

		
	}
}


jarvis.SequenceAnimation= function(body,sequenceA,time) 
{  
	if(time=== undefined){
	    time=0.1;
	}
	
	this.id=Math.random()+"sequenceanimation";
    this.body=body;
	this.sequenceA=sequenceA;
	this.imgA=new Array();
    this.currentFrame=-1;
	this.currentImg=null;
	this.dr=0;
	this.roofType="SequenceAnimation.LOOF_TYPE_STOP";
	this.totalFrame=this.sequenceA.length;
	this.time=time;
	for(var i=0;i<this.totalFrame;++i){
        this.imgA[i]=null;
    }
	this.isPlaying=false;
    
 
}
jarvis.SequenceAnimation.LOOF_TYPE_STOP="SequenceAnimation.LOOF_TYPE_STOP";  
jarvis.SequenceAnimation.LOOF_TYPE_REVERCE="SequenceAnimation.LOOF_TYPE_STOP";  
jarvis.SequenceAnimation.LOOF_TYPE_LOOF="jarvis.SequenceAnimation.LOOF_TYPE_LOOF";  

jarvis.SequenceAnimation.prototype =
{
	init : function(startFrame){
		
		if(startFrame=== undefined){
			startFrame=0;
		}
		this.resize();		
		this.loadImage(startFrame);
	},

	play : function(dr,roofType){
		if(dr=== undefined){
			dr=1;
		}
		if(roofType=== undefined){
			roofType=jarvis.SequenceAnimation.LOOF_TYPE_STOP;
		}
		this.roofType=roofType;
		this.dr=dr;
		this.isPlaying=true;
		this.loadImage(this.currentFrame);
					
	},
	stop : function(){
		this.isPlaying=false;
		
	},
	
	loadImage : function(idx){
	    var img=this.imgA[idx];
		if(img==null){
		   var that=this;
		   img=new Image();
		   img.style.position='absolute';
		   img.style.top="0px";
		   img.style.left="0px";
		   this.body.appendChild(img);
		   jarvis.lib.addEventListener(img,"load",function (e){ that.imgLoadComplete(e,idx,img);})
		  
		   img.src=this.sequenceA[idx];
		}else{
		   jarvis.debuger.log("setFrame="+idx);
		   this.setFrame(idx);   
		   this.nextFrame();
		}
	},
	imgLoadComplete:function(e,idx,img){
		jarvis.debuger.log("imgLoadComplete="+idx);
	    this.imgA[idx]=img;
        this.setFrame(idx);
        this.nextFrame();
	},
	setFrame : function(idx)
	{
	    jarvis.debuger.trace("imgIdx="+idx);
		if(this.currentFrame==idx){
		   return;
		}
		
        if(this.currentImg!=null){
		    this.body.removeChild(this.currentImg);
		}
		this.currentFrame=idx;
		this.currentImg=this.imgA[idx];
		this.currentImg.width=this.width;
	    this.currentImg.height=this.height;
	},

    nextFrame : function()
	{
	   if(this.isPlaying==false){
	       return;
	   }
	   var nextFrm;
       if(this.currentFrame==0 && this.dr<0){
	       switch(this.roofType){
               case jarvis.SequenceAnimation.LOOF_TYPE_STOP:
				   this.isPlaying=false;
				   return;
			   case jarvis.SequenceAnimation.LOOF_TYPE_REVERCE:
				   this.dr=-this.dr;
			       nextFrm=this.currentFrame+this.dr;
				   break;
			   case jarvis.SequenceAnimation.LOOF_TYPE_LOOF:
				   nextFrm=this.totalFrame-1;
				   break;
		   }
	   }else if(this.currentFrame==this.totalFrame-1 && this.dr>0){
	       switch(this.roofType){
               case jarvis.SequenceAnimation.LOOF_TYPE_STOP:
				   this.isPlaying=false;
				   return;
			   case jarvis.SequenceAnimation.LOOF_TYPE_REVERCE:
				   this.dr=-this.dr;
			       nextFrm=this.currentFrame+this.dr;
				   break;
			   case jarvis.SequenceAnimation.LOOF_TYPE_LOOF:
				   nextFrm=0;
				   break;
		   }
	   }else{
	       nextFrm=this.currentFrame+this.dr;
	   }
       
	  
	   if(nextFrm<0){
		   nextFrm=0;
	   }else if(nextFrm>=this.totalFrame){
		   nextFrm=this.totalFrame-1;
	   }
       var that=this;
	  that.loadImage(nextFrm);
	  
	  /*
	  // jarvis.timer.removeTimer(this.id);
	   var tObj=new jarvis.TimerObject();
       tObj.id=this.id;
	   tObj.t=this.time;//sec
	   tObj.repeatCount=1;
	   var timerDelegate=function(){}; 
            timerDelegate.prototype = {
                              excute : function(id){ that.loadImage(nextFrm);}
		    }
			
	   jarvis.timer.addTimer(new timerDelegate(),tObj);

       */
	},

    resize:function()
	{
		var bounce=jarvis.lib.getAbsoluteBounce(this.body);
		this.width=bounce.width;
		this.height=bounce.height;
		if(this.currentImg!=null){
			this.currentImg.width=this.width;
			this.currentImg.height=this.height;
		}
	}
		 

}


jarvis.Equalizer= function(body,color,w,h,margin,time) 
{  
	if(color=== undefined){
	    color="#ffffff";
	}
	if(w=== undefined){
	    w=4;
	}
	if(h=== undefined){
		h=4;
	}
	if(margin=== undefined){
	    margin=1;
	}
	if(time=== undefined){
	    time=0.1;
	}
	
	var cellNum=w*h;
	this.id=Math.random()+"equalizerid";
    this.body=body;
	this.color=color;
    this.time=time;
	this.wNum=w;
    this.hNum=h;
	this.margin=margin;
    this.isPlaying=false;

	//body.position='relative';
    
	this.cellA=new Array();
	this.eqA=new Array();
	this.cA=new Array();
	this.comA=new Array();
	
    for(var i=0;i<this.wNum;++i){
	   this.eqA[i]=1;
	   this.cA[i]=4;
	   this.comA[i]=true;
	}

	var cell;
	for(var i=0;i<cellNum;++i){
	   cell=document.createElement("span");
	   cell.style.position='absolute';
	   cell.style.background=color;
	   var ty=Math.floor(i/this.wNum);
	   if(ty!=(this.hNum-1)){
			cell.style.display="none";
	   }
	   this.cellA.push(cell);
	   body.appendChild(cell);
	}
	
    this.resize();
 
}
jarvis.Equalizer.prototype =
{
	setSize:function(bw,bh)
	{
		var num=this.cellA.length;
		var cell;
		
		var tw=Math.floor(bw/this.wNum);
		var th=Math.floor(bh/this.hNum);
       
		var w=Math.floor((bw-(this.margin*(this.wNum-1)))/this.wNum);
		var h=Math.floor((bh-(this.margin*(this.hNum-1)))/this.hNum);
     
         
		for(var i=0;i<num;++i){
	        cell=this.cellA[i];
            
			cell.style.left=(tw*(i%this.wNum))+'px';
			cell.style.top=(th*Math.floor(i/this.wNum))+'px';
			cell.style.width=w+'px';
			cell.style.height=h+'px';
			
			
		}
	},
	changeCell:function()
	{
		
		var com;
        for(var i=0;i<this.wNum;++i){
			if(this.isPlaying==false){
				this.eqA[i]=1;
			}else{
				com=this.comA[i];
				if(com==true){
				    this.eqA[i]=jarvis.lib.getRandomInt(this.hNum)+1;
					
				}
				
			}
			this.comA[i]=false;
					
		}
        
		var tx;
		var ty;
		var t;
		var c;
		var isChange=false;
		for(var i=0;i<this.cellA.length;++i){
	        cell=this.cellA[i];
            tx=i%this.wNum;
			ty=this.wNum-Math.floor(i/this.wNum);
			t=this.eqA[tx];
			c=this.cA[tx];
            
			if(c<ty){
				cell.style.display="none";
			}else{
			    cell.style.display="block";
			}

			if(t==c){
			   this.comA[i]=true;
			}else if(t<c){
			   c--;
			   isChange=true;
			}else{
			   c++;
			   isChange=true;
			}
			this.cA[tx]=c;
		}
        if(isChange==false && this.isPlaying==false){
		
		   jarvis.timer.removeTimer(this.id);
		}

	},
	resize:function()
	{
		var bounce=jarvis.lib.getAbsoluteBounce(this.body);
        this.setSize(bounce.width,bounce.height);
	},

	play : function(){
		
		this.isPlaying=true;
		var that=this;
		
		var tObj=new jarvis.TimerObject();
        tObj.id=this.id;
	    tObj.t=this.time;//sec
	    tObj.repeatCount=0;
	    var timerDelegate=function(){}; 
            timerDelegate.prototype = {
                              excute : function(id){ that.changeCell();}
		    }
			
		jarvis.timer.addTimer(new timerDelegate(),tObj);

		
	},
	stop : function(){
		this.isPlaying=false;
		
	}

		

}


jarvis.SliceRect= function(body,imgA,border) 
{  
	var sliceNum=imgA.length;

	if(sliceNum!=3 && sliceNum!=9){
	    return ;
	}
	this.border=border;
	this.body=body;
	body.position='relative';
    this.sliceA=new Array();
	
	var slice;
	for(var i=0;i<sliceNum;++i){
	   slice=document.createElement("div");
	   slice.style.float="left";
	   img=document.createElement("img");
	   img.src=imgA[i];
	   slice.img=img;
	   slice.appendChild(img);
	   this.sliceA.push(slice);
	   body.appendChild(slice);
	}
	
    this.resize();
 
}
jarvis.SliceRect.prototype =
{
    setSize:function(bw,bh)
	{
		
		var slice;
		var cy=0;
        var ix;
		var iy;
		var tx=0;
		var ty=0;
		
		var h;
		var w;
        var cw=bw-(this.border*2);
        var ch=bh-(this.border*2);

		var num=this.sliceA.length;
		for(var i=0;i<num;++i){
	        
			slice=this.sliceA[i];
			ix=i%3;
			iy=Math.floor(i/3)
            if(ix==0|| ix==2){
				w=this.border;
			}else{
				w=cw;
			}
            if( num==3){
				h=bh;
			}else if(iy==1){
				h=ch;
			}else{
				h=this.border;
			}
            if(iy!=cy){
				
				cy=iy;
			}
			slice.style.width=w+"px";
			slice.style.height=h+"px";
            slice.img.width=w;
			slice.img.height=h;
			
			tx=tx+w;
			
		}
	},
	resize:function()
	{
		var bounce=jarvis.lib.getAbsoluteBounce(this.body);
        this.setSize(bounce.width,bounce.height);
	}
}


jarvis.PageDataInfo= function(size) 
{
	 this.listA=new Array(); //Array<Object>
     this.loadAble=true;
	 this.loadComplete=false;
	 this.total=0;
     this.page=0;
	 this.size=size;

    
	 this.isReflashCheck="";
     this.isReflashCheckIndex=0;

}
jarvis.PageDataInfo.prototype =
{

	reset:function()
	{
		
		if(this.isReflashCheck!="" && this.listA.length>this.isReflashCheckIndex){
		   this.preListA=this.listA;
	       this.preTotal=this.total;
           this.prePage=this.page;
		   this.preLoadComplete=this.loadComplete;

		}
		this.listA=new Array();
		this.total=0;
        this.page=0;
		this.loadAble=true;
	    this.loadComplete=false;
	},
    
	loadStart:function(){
	   if(this.loadAble==false){
	        return false;
	   }else{
	        this.loadAble=false;
            return true;
	   }
    },
    loadComplete:function(){
	    this.loadAble=true;
    },
    insertDatas:function(datas){       
	  
	   if(datas.length==0){
		   this.loadComplete=true;
		    return true;
	   }else if(datas.length<this.size){
		   this.loadComplete=true;
	   }
	   if(this.isReflashCheck!=""){
		   
	       if(this.page==0 &&  this.prePage!=null && datas.length>this.isReflashCheckIndex){
		       var data=datas[this.isReflashCheckIndex];
			   var preData=this.preListA[this.isReflashCheckIndex];
			   
			   if( data[this.isReflashCheck]!=null && preData[this.isReflashCheck]!=null){
					if( data[this.isReflashCheck]==preData[this.isReflashCheck]){
						this.listA=this.preListA;
						this.total=this.preTotal;
						this.page=this.prePage;
						this.loadComplete=this.preLoadComplete;

						this.preListA=null;
	                    this.preTotal=null;
                        this.prePage=null;
		                this.preLoadComplete=null;
						return false;
					}
			   }
		   
		   }
	   }
       this.page++;
       this.listA=this.listA.concat(datas);
	   return true;
    },
    
	getDatas:function(page){
	    if(page=== undefined){
	        page=this.page-1;
	    }
		var start=page*this.size;
		if(start>=this.listA.length){
		    return new Array();
		}
        var end=start+this.size;
		if(end>=this.listA.length){
		   return this.listA.slice(start);
		}else{
		   return this.listA.slice(start,end);
	    }
	}

}


jarvis.PageDictionaryInfo= function(size) 
{
	 this.listA=new Dictionary(); //Dictionary<num,object>
     this.loadAble=true;
	 this.total=0;
	 this.size=size;
     this.page=0;
	 
	 this.totalPage=0;
	
   

}
jarvis.PageDictionaryInfo.prototype =
{

	reset:function()
	{
		this.listA.reset();
		this.total=0;
        this.page=0;
		this.totalPage=0;
		this.loadAble=true;
	    
	},
    
	loadStart:function(){
	   if(this.loadAble==false){
	        return false;
	   }else{
	        this.loadAble=false;
            return true;
	   }
    },
    setTotal:function(total){
    	if(total===undefined || total==null){
    		total=0;
    	}
	    this.total=total;
        this.totalPage=Math.ceil(total/this.size);
       
	},
    insertDatas:function(datas,page){       
	   
       this.page=page;
       this.listA.setValue(page,datas);
	  
    },
    loadComplete:function(){
	    this.loadAble=true;
    },
	getDatas:function(page){
	   return this.listA.getValue(page);  
	}

}

jarvis.Dictionary= function() 
{
	this.keys=new Array();
    this.values=new Array();

}

jarvis.Dictionary.prototype =
{

	reset:function()
	{
		this.keys=new Array();
        this.values=new Array();
	},
    
	setValue:function(key,value){
	    this.removeValue(key);
		this.keys.push(key);
	    this.values.push(value);
	},
    removeValue:function(key){
	    var idx=this.keys.indexOf(key);
		if(idx!=-1){
			delete this.keys[idx];
			delete this.values[idx];
		}
		
    },
    getValue:function(key){
	    var idx=this.keys.indexOf(key);
        
	    if(idx==-1){
		    return null;
		}else{
		    return this.values[idx];
		}

	}
}



/*
jarvis.delegate=function(){}
jarvis.delegate.prototype = 
{
    stateChange : function(e,point){},
	rotateChange : function(rotate){},
	gestureChange : function(e,point){},
	gestureComplete: function(e){}
	
}
*/

jarvis.GestureElement= function(view,delegate,isVertical,isHorizontal) 
{
	if(isVertical===undefined){
	   isVertical=true;
	}
	if(isHorizontal===undefined){
	   isHorizontal=true;
	}
	this.isHorizontal=isHorizontal;
	this.isVertical=isVertical;
	this.moveType=-1;
	this.view=view;
	this.delegate=delegate;
    this.startPosA=new Array();
	this.changePosA=new Array();
	this.movePosA=new Array();
	this.endedPosA=new Array();
    this.startTime=0;
	this.startRotate=null;
    this.endTime=0;
	
	this.changeRotate=30;
	this.longTime=1000;
    this.changeMin=3;
	this.changeMax=15;
    this.isAndroid=jarvis.lib.isAndroid();
	
    this.addEvent();
   

}

jarvis.GestureElement.START="GestureElement.START";  
jarvis.GestureElement.MOVE="GestureElement.MOVE";
jarvis.GestureElement.MOVE_V="GestureElement.MOVE_V";
jarvis.GestureElement.MOVE_H="GestureElement.MOVE_H";
jarvis.GestureElement.END="GestureElement.END";
jarvis.GestureElement.CANCLE="GestureElement.CANCLE";

jarvis.GestureElement.LONG_TOUCH="GestureElement.LONG_TOUCH";
jarvis.GestureElement.TOUCH="GestureElement.TOUCH";

jarvis.GestureElement.PAN="GestureElement.PAN";
jarvis.GestureElement.PAN_RIGHT="GestureElement.PAN_RIGHT";
jarvis.GestureElement.PAN_LEFT="GestureElement.PAN_LEFT";
jarvis.GestureElement.PAN_UP="GestureElement.PAN_UP";
jarvis.GestureElement.PAN_DOWN="GestureElement.PAN_DOWN";



jarvis.GestureElement.PINCH_MOVE="GestureElement.PINCH_MOVE";
jarvis.GestureElement.PINCH_RIGHT="GestureElement.PINCH_RIGHT";
jarvis.GestureElement.PINCH_LEFT="GestureElement.PINCH_LEFT";
jarvis.GestureElement.PINCH_UP="GestureElement.PINCH_UP";
jarvis.GestureElement.PINCH_DOWN="GestureElement.PINCH_DOWN";

jarvis.GestureElement.PINCH_GESTURE="GestureElement.PINCH_GESTURE";
jarvis.GestureElement.PINCH_IN="GestureElement.PINCH_IN";
jarvis.GestureElement.PINCH_OUT="GestureElement.PINCH_OUT";
jarvis.GestureElement.PINCH_ROTATE="GestureElement.PINCH_ROTATE";



jarvis.GestureElement.prototype =
{
	addEvent:function()
	{
		var that=this;
		jarvis.lib.addEventListener(this.view,"touchstart",function (e){ that.touchStart(e);});
		jarvis.lib.addEventListener(this.view,"touchmove",function (e){  that.touchMove(e);});
		jarvis.lib.addEventListener(this.view,"touchend",function (e){ that.touchEnd(e);});
        
		jarvis.lib.addEventListener(this.view,"touchcancel",function (e){ that.touchEnd(e);});
		jarvis.lib.addEventListener(this.view,"webkitTransitionEnd",function (e){ that.touchEnd(e);});
		jarvis.lib.addEventListener(this.view,"msTransitionEnd",function (e){ that.touchEnd(e);});
		jarvis.lib.addEventListener(this.view,"oTransitionEnd",function (e){ that.touchEnd(e);});
		jarvis.lib.addEventListener(this.view,"transitionend",function (e){ that.touchEnd(e);});
    },
	
	touchStart:function(e)
	{
	    this.moveType=-1
		this.startPosA=new Array();
		this.changePosA=new Array();
		var touch;
       
	    for(var i=0;i<e.touches.length;++i){
		   touch = e.touches[i]; 
		   this.startPosA[i]=new jarvis.Point(touch.pageX,touch.pageY);
		   this.movePosA[i]=new jarvis.Point(touch.pageX,touch.pageY);
           this.changePosA[i]=new jarvis.Point(0,0);
		}

		var now=new Date();
	    this.startTime=now.getTime();
		
        this.startRotate=null;
		jarvis.lib.excuteDelegate(this.delegate,"stateChange",[jarvis.GestureElement.START,this.startPosA[0]]);
		
                   

    },
    touchMove:function(e)
	{
	    
		this.movePosA=new Array();
		
		var touch;
		var start;
		var change;

		var len=e.touches.length;
		
      
        this.checkEvent(false);
		
		if(len == this.startPosA.length){
			for(var i=0;i<len;++i){
				touch = e.touches[i]; 
				this.movePosA[i]=new jarvis.Point(touch.pageX,touch.pageY);
				start = this.startPosA[i];
				change = this.changePosA[i];
				change.x=touch.pageX-start.x;
				change.y=touch.pageY-start.y;

			}
            change = this.changePosA[0];
			
			if(Math.abs(change.x)>Math.abs(change.y)){
			     if(this.isHorizontal==true){
				    e.preventDefault();
				 }
                 if(this.moveType==-1){
					this.moveType=1;
				 }
				 
				
				 if(this.isHorizontal==true && this.moveType==1){
					jarvis.lib.excuteDelegate(this.delegate,"stateChange",[jarvis.GestureElement.MOVE_H,this.changePosA[0]]);
		         }
				 
				 
				 
			}else if(Math.abs(change.y)>Math.abs(change.x)){
				 if(this.isVertical==true){
				    e.preventDefault();
				 }
                 if(this.moveType==-1){
					this.moveType=0;
				 }
				
				 if(this.isVertical==true && this.moveType==0){
		            jarvis.lib.excuteDelegate(this.delegate,"stateChange",[jarvis.GestureElement.MOVE_V,this.changePosA[0]]);
		         }
				 
			     
			}
			jarvis.lib.excuteDelegate(this.delegate,"stateChange",[jarvis.GestureElement.MOVE,this.changePosA[0]]);
		}
       
        

	},
    touchEnd:function(e)
	{
	   

        var now=new Date();
	    this.endTime=now.getTime(); 
		this.checkEvent(true);
	    jarvis.lib.excuteDelegate(this.delegate,"stateChange",[jarvis.GestureElement.END,this.changePosA[0]]);
         
	},
	
	checkEvent:function(isComplete)
	{
	   
	   
	   if(this.startPosA.length!=this.movePosA.length && isComplete==false){
	        jarvis.lib.excuteDelegate(this.delegate,"stateChange",[jarvis.GestureElement.CANCLE]);
			return;
	   }
       
       
	   var spdMD=200;
       var moveMD=0;

	   var start;
	   var move;
	   var change;
      
	   var gestureTime=0;
       if(isComplete==true){
		   gestureTime=this.endTime-this.startTime;
	   } 
	   
       if(this.startPosA.length==1){
	       if(isComplete==true){
			   change=this.changePosA[0];
		       if(gestureTime>=this.longTime){
					if(Math.abs(change.x)< this.changeMin && Math.abs(change.y)< this.changeMin)
					{
						jarvis.lib.excuteDelegate(this.delegate,"gestureComplete",[jarvis.GestureElement.LONG_TOUCH]);
					}
				}
				
                

			    if(this.moveType==1){
					moveMD=change.x/(gestureTime/spdMD);
					if(moveMD>this.changeMax){
						jarvis.lib.excuteDelegate(this.delegate,"gestureComplete",[jarvis.GestureElement.PAN_RIGHT]);
					}else if(moveMD<-this.changeMax){
						jarvis.lib.excuteDelegate(this.delegate,"gestureComplete",[jarvis.GestureElement.PAN_LEFT]);
					}
                }

				if(this.moveType==0){
					moveMD=change.y/(gestureTime/spdMD);
				
					if(moveMD>this.changeMax){
						jarvis.lib.excuteDelegate(this.delegate,"gestureComplete",[jarvis.GestureElement.PAN_DOWN]);
					}else if(moveMD<-this.changeMax){
						jarvis.lib.excuteDelegate(this.delegate,"gestureComplete",[jarvis.GestureElement.PAN_UP]);
					}
				}
		        if(Math.abs(change.x)< this.changeMin && Math.abs(change.y)< this.changeMin)
				{
					start=this.startPosA[0];
					jarvis.lib.excuteDelegate(this.delegate,"gestureComplete",[jarvis.GestureElement.TOUCH,start]);
				}
					
				
		   }else{
				if(Math.abs(change.x)>this.changeMin || Math.abs(change.y)>this.changeMin){
					jarvis.lib.excuteDelegate(this.delegate,"gestureChange",[jarvis.GestureElement.PAN,change]);
				}
		   }
       }else if(this.startPosA.length==2){
		   change=this.changePosA[0];
		   start=this.startPosA[0];
	       move=this.movePosA[0];
		   var change2=this.changePosA[1];
           var start2=this.startPosA[1];
	       var move2=this.movePosA[1];
                
           
		   var startDist=Math.sqrt((Math.abs(start.x-start2.x)^2) + (Math.abs(start.y-start2.y)^2));
		   var moveDist=Math.sqrt((Math.abs(move.x-move2.x)^2) + (Math.abs(move.y-move2.y)^2));
		   var dist = moveDist-startDist;

		   
           var rotate = 0;
		   
           if(this.delegate.rotateChange!== undefined){
		       var w=0;
			   var h=0;
			   if(this.startRotate==null){
                  w=start.x-start2.x;
                  h=start.y-start2.y;
                  this.startRotate=Math.atan2(h,w)/Math.PI*360;

				   
			   }
			    w=move.x-move2.x;
                h=move.y-move2.y;
                rotate=Math.atan2(h,w)/Math.PI*360;
		       
				jarvis.lib.excuteDelegate(this.delegate,"rotateChange",[rotate]);
				if(isComplete==true && (this.startRotate-rotate)>this.changeRotate){
				    jarvis.lib.excuteDelegate(this.delegate,"gestureComplete",[jarvis.GestureElement.PINCH_ROTATE]);  
				}
		   }

         
	       if(isComplete==true){
				
				
				if(Math.abs(dist)>this.changeMin)
				{
					if(dist>0){
					    jarvis.lib.excuteDelegate(this.delegate,"gestureComplete",[jarvis.GestureElement.PINCH_OUT]);
					}else{
					    jarvis.lib.excuteDelegate(this.delegate,"gestureComplete",[jarvis.GestureElement.PINCH_IN]);
					}
				
				}else 
				{
					
					if(this.moveType==1){
						moveMD=change.x/(gestureTime/spdMD);
						if(moveMD>this.changeMax){
							jarvis.lib.excuteDelegate(this.delegate,"gestureComplete",[jarvis.GestureElement.PINCH_RIGHT]);
						}else if(moveMD<-this.changeMax){
							jarvis.lib.excuteDelegate(this.delegate,"gestureComplete",[jarvis.GestureElement.PINCH_LEFT]);
						}
					}
					if(this.moveType==0){
						moveMD=change.y/(gestureTime/spdMD);
						if(moveMD>this.changeMax){
							jarvis.lib.excuteDelegate(this.delegate,"gestureComplete",[jarvis.GestureElement.PINCH_DOWN]);
						}else if(moveMD<-this.changeMax){
							jarvis.lib.excuteDelegate(this.delegate,"gestureComplete",[jarvis.GestureElement.PINCH_UP]);
						}
					}
				}

				
		   
		   }else{
				if(Math.abs(dist)>this.changeMin)
				{
					jarvis.lib.excuteDelegate(this.delegate,"gestureChange",[jarvis.GestureElement.PINCH_GESTURE]);  
				
				}else 
				{
					jarvis.lib.excuteDelegate(this.delegate,"gestureChange",[jarvis.GestureElement.PINCH_MOVE]);
				}
		   }
	   
	   }
       
		
	}
}

/*
jarvis.delegate=function(){}
jarvis.delegate.prototype = 
{
    startDrag : function(point){},
	moveDrag : function(point){},
    endDrag : function(point){}
	
	
}
*/

jarvis.DragElement= function(view,delegate,range) 
{
	this.parent=view.parentNode;
	
	this.orginRange = range;
	
	this.view=view;
	this.delegate=delegate;
    this.startPos=new Point();
	this.movePos=new Point();
	this.changePos=new Point();
	this.movePos=new Point();
    this.maxPos=new Point();
    this.valueX=0;
    this.valueY=0;
	var viewBounce=jarvis.lib.getAbsoluteBounce(this.view);
    
	this.viewW=Math.ceil(viewBounce.width);
	this.viewH=Math.ceil(viewBounce.height);
    this.setRange();
    this.isDrag=false;
	this.addEvent();

}




jarvis.DragElement.prototype =
{
	
    addEvent:function()
	{
		
		var that=this;
    	jarvis.lib.addEventListener(this.view,"mousedown",function(e) { that.dragStart(e);});	
        
       
		jarvis.lib.addEventListener(window,"mousemove",function(e) { that.dragMove(e);});
		jarvis.lib.addEventListener(window,"mouseup",function(e) { that.dragEnd(e);});
		jarvis.lib.addEventListener(window,"mouseleave",function(e) { that.dragEnd(e);});
    },
	
	setRange:function()
	{
		
		if(this.orginRange == undefined){
	   		this.range=jarvis.lib.getAbsoluteBounce(this.parent);
	   		
		}else{

			this.range = this.orginRange;
		}
		this.maxPos.x=this.range.width;
		this.maxPos.y=this.range.height;
       
	},

	getPoint:function(e)
	{
		var posX= jarvis.lib.getMouseX(e);
		var posY= jarvis.lib.getMouseY(e);
 
        posX = posX - this.range.x;
        posY = posY - this.range.y;
       	var maxX=this.maxPos.x;
		var maxY=this.maxPos.y;
        var minX=0;
		var minY=0;
        
        if(posX>maxX){
		    posX=maxX;
		}
		if(posX<minX){
		    posX=minX;
		}

		if(posY>maxY){
		    posY=maxY;
		}
        if(posY<minY){
		    posY=minY;
		}
        

		return new Point(posX,posY);
	},
	
	dragStart:function(e)
	{
		if(this.isDrag==true){
		    return;
		}
		this.setRange();
		this.isDrag=true;
	    this.startPos=null;
	
        this.movePos=new Point();
		this.changePos=new Point();
		
	},
	dragMove:function(e)
	{
		
		if(this.isDrag==false){
		    return;
		}
        if(this.startPos==null){

        	this.startPos=this.getPoint(e);
        	jarvis.lib.excuteDelegate(this.delegate,"startDrag",[this.startPos]);
        }

		this.movePos=this.getPoint(e);
        this.changePos=new Point(this.movePos.x-this.startPos.x,this.movePos.y-this.startPos.y);

        this.valueX=this.movePos.x/this.maxPos.x;
        this.valueY=this.movePos.y/this.maxPos.y;

       //this.view.style.left=(this.valueX*100)+"%";
		//this.view.style.top=(this.valueY*100)+"%";
		
        jarvis.lib.excuteDelegate(this.delegate,"moveDrag",[this.changePos]);
		
	},
	
	dragEnd:function(e)
	{
		if(this.isDrag==false){
		   return;
		}
        this.isDrag=false;
        jarvis.lib.excuteDelegate(this.delegate,"endDrag",[this.changePos]);
	}
}

jarvis.MoveElement= function(view,delegate,range) 
{
	this.view=view;
	this.delegate=delegate;
    
    
	this.addEvent();

}




jarvis.MoveElement.prototype =
{
	
    addEvent:function()
	{
		
		var that=this;
    	
        jarvis.lib.addEventListener(this.view,"mouseover",function(e) { that.moveStart(e);});	
        jarvis.lib.addEventListener(this.view,"mousemove",function(e) { that.move(e);});	
        jarvis.lib.addEventListener(this.view,"mouseout",function(e) { that.moveEnd(e);});

		
    },
	
	getPoint:function(e)
	{
		var posX= jarvis.lib.getMouseX(e);
		var posY= jarvis.lib.getMouseY(e);

		return new Point(posX-this.mdPoint.x,posY-this.mdPoint.y);
	},
	moveStart:function(e)
	{
       this.mdPoint=jarvis.lib.getAbsoluteBounce(this.view);
       jarvis.lib.excuteDelegate(this.delegate,"startMove",[this.getPoint(e)]); 
	},
    move:function(e)
	{
       jarvis.lib.excuteDelegate(this.delegate,"move",[this.getPoint(e)]);
	},
	moveEnd:function(e)
	{
       jarvis.lib.excuteDelegate(this.delegate,"endMove",[this.getPoint(e)]);
	}
	
}

jarvis.Twitter=function () {
        
      this.loginAPI="http://twitter.com/intent/session";
	  this.shareAPI= "http://twitter.com/intent/tweet";
        
}
jarvis.Twitter.prototype =
{
	login:function()
	{
        if(w===undefined){
		   w="550";
		}
		if(h===undefined){
		   h="330";
		}
		var win = window.open( this.loginAPI , 'twitter', "width="+w+",height="+h+",scrollbars=no");
        if (win) {
               win.focus();
        }

	},
	shareCurrentPage:function(w,h)
	{
       var url = document.location.href;
       var msg = document.title;
	   this.share(url,msg,w,h)
	},
	share:function(msg,url,w,h)
	{
        if(w===undefined){
		   w="550";
		}
		if(h===undefined){
		   h="330";
		}
		var path=this.shareAPI+"?status=" + encodeURIComponent(msg) + " " + encodeURIComponent(url);
		var win = window.open(path, 'twitter', "width="+w+",height="+h+",scrollbars=no");
        if (win) {
               win.focus();
        }

	}
}


jarvis.FaceBook=function () {
        
	this.loginAPI="https://www.facebook.com/login.php";
	this.shareAPI="http://www.facebook.com/sharer.php";
		
}
jarvis.FaceBook.prototype =
{
	login:function()
	{
        if(w===undefined){
		   w="550";
		}
		if(h===undefined){
		   h="330";
		}
		var win = window.open( this.loginAPI , 'twitter', "width="+w+",height="+h+",scrollbars=no");
        if (win) {
               win.focus();
        }

	},
	shareCurrentPage:function(w,h)
	{
       var url = document.location.href;
       var msg = document.title;
	   this.share(url,msg,w,h)
	},
	share:function(msg,url,w,h)
	{
         if(w===undefined){
		   w="550";
		}
		if(h===undefined){
		   h="330";
		}
		
		var path=this.shareAPI+"?s=100&p[url]=" + encodeURIComponent(url) + '&p[title]=' + encodeURIComponent(msg);
		var win = window.open(path, 'facebook',"width="+w+",height="+h+",scrollbars=no");
        if (win) {
               win.focus();
        }

	}
}


jarvis.MouseWheel= function(element,fn) 
{
	this.element=element;
    this.fn=fn;
    var that = this;
	jarvis.lib.addEventListener(element,"mouseover",function (e){ that.giveFocus();})
    jarvis.lib.addEventListener(element,"mouseout",function (e){ that.removeFocus();})
}


jarvis.MouseWheel.prototype =
{
	
	giveFocus: function() 
	{
		var that = this;
		if (jarvis.lib.isFF()==true)
		{
			this.element.fn = this.fn;
			this.element.addEventListener('DOMMouseScroll', this.handleMousewheel , false);
		    
		}else
		{
			window.onmousewheel = document.onmousewheel = function (e){that.handleMousewheel(e);};	
		}	
	},

	removeFocus: function(el) 
	{
		
		if (jarvis.lib.isFF()==true)
		{
			this.element.fn = null;
			this.element.addEventListener('DOMMouseScroll', null , false);
		}else
		{
			window.onmousewheel = document.onmousewheel = null;
		}
	},

	handleMousewheel : function(e) 
	{
	     
	    e = e || window.event;
		(e.preventDefault) ? e.preventDefault() : e.returnValue = false; 
        var delta = 0;
		if (e.wheelDelta) 
		{
			delta = e.wheelDelta/10;
		    if (window.opera) delta = -delta;
		} 
		else if (e.detail) 
		{ 
			delta =  e.detail;
		}
		if (jarvis.lib.isFF()==true) delta = -delta;
		this.fn.apply(this.element, [e, delta]);
	}

}

var Equalizer = jarvis.Equalizer;
var SliceRect = jarvis.SliceRect;
var PageDataInfo = jarvis.PageDataInfo;
var PageDictionaryInfo = jarvis.PageDictionaryInfo;
var Dictionary = jarvis.Dictionary;
var GestureElement = jarvis.GestureElement;
var DragElement = jarvis.DragElement;
var FaceBook = jarvis.FaceBook;
var Twitter = jarvis.Twitter;
var MouseWheel =jarvis.MouseWheel;
/*

*/