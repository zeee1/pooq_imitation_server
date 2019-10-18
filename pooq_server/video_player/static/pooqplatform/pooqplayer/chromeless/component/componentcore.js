
class ComponentCore
{
    constructor(body,delegate = new Rx.Subject()) 
    {
        this.delegate = delegate;
        this.body = body;
        this.cell = null;
        this.isDown = false;
        this.attachEvents = new Array();
    }

    init()
    {   
        return this.delegate;
    }
    getBody()
    {
        return (this.cell) ? this.cell : this.body;
    }
    remove()
    {   
        if(this.delegate == null)
        {
            return;
        }        
        this.delegate.complete(this);
        this.clearEvent();
        if(this.cell == null)
        {
            this.body.innerHTML = "";
        }
        else if(this.cell.parentNode)
        {
            this.cell.parentNode.removeChild(this.cell);
        }
        this.delegate = null;
        this.cell = null;
        this.body = null;
    }
    
    createElements(elementProvider = null)
    {
        if(elementProvider == null) return;
        this.cell = elementProvider.getElement('cell'); 
    }
    createObservable(){}
    setupEvent(){}
    setupDelegate(){}
    attachEvent(element,event,handler)
    {
        let evt = new AttachEvent(element,event,handler);
        this.attachEvents.push(evt);
        jarvis.lib.addEventListener(element,event,handler);
    }

    clearEvent()
    {
        if(this.attachEvents == null) return;
        for(var i=0; i<this.attachEvents.length;++i)
        {
            var evt = this.attachEvents[i];
            jarvis.lib.removeEventListener(evt.element,evt.event,evt.handler);
        }
        this.attachEvents = null;
    }

    onResize(){}
    onComponentEvent(event){}
    
}

class ComponentInjector
{
    constructor(body, dependencies = new Array(), delegate = new Rx.Subject()) 
    {
        this.delegate = delegate;
        this.dependencies = dependencies;
        this.body = body;    
    }
    
    init(args=null)
    {   
        this.excute('init',args);
        return this.delegate;
    }

    addDependencies(dependence)
    {
        this.dependencies.push(dependence);
    }

    removeDependencies(dependence)
    {
        let idx = this.dependencies.indexOf(dependence);
        if(idx == -1) return;

        this.dependencies.splice(idx, 1);
    }
    
    remove()
    {   
        if(this.delegate == null) return;
        this.delegate.onCompleted();
        this.excute('remove');
        this.delegate = null;
        this.body = null;
    }
    
    excute(command,args=null)
    {
        for(var i=0; i<this.dependencies.length;++i)
        {
            var dep = this.dependencies[i];
            var type = typeof dep[command];
            if(type == "function")
            {
                args ? dep[command].apply(dep,args) : dep[command].apply(dep);
            }
        }
    }

    get(command,args=null)
    {
        for(var i=0; i<this.dependencies.length;++i)
        {
            var dep = this.dependencies[i];
            var  type = typeof dep[command];
            if(type == "function")
            {
                var value = args ? dep[command].apply(dep,args) : dep[command].apply(dep);
                return value;
            }
            else if("undefined" || "null"){}
            else
            {
                return dep[command];
            }
        }
        return null;
    }

    set(command,property)
    {
        for(var i=0; i<this.dependencies.length;++i)
        {
            var dep = this.dependencies[i];
            if(dep[command])
            {
                dep[command] = property;
            }
        }
    }

    createElements(args=null)
    {   
        this.excute('createElements',args);
    }

    createObservable(args=null)
    {   
        this.excute('createObservable',args);
    }

    setupEvent(args=null)
    {
        this.excute('setupEvent',args);
    }
    setupDelegate(args=null)
    {
        this.excute('setupDelegate',args);
    }
    clearEvent()
    {
        this.excute('clearEvent',args);
    }

    onResize()
    {
        this.excute('onResize',args);
    }
    
}

class AnimationComponentCore extends ComponentCore
{
    constructor(body,delegate) 
    {
        super(body,delegate);        
    }

    init(delay = 50)
    {
        this.doReadyAni();  
        this.rxInitAni = Rx.Observable.timer(delay).timeInterval().take(1).subscribe
        (
            this.doInitAni.bind(this)
        );
        return super.init();
    }
    doReadyAni()
    {
        var animationBody = (this.cell) ? this.cell : this.body;
        animationBody.style.opacity = 0;
        jarvis.lib.addAttribute(animationBody,"animate-in");
    }
    doInitAni()
    {
        var animationBody = (this.cell) ? this.cell : this.body;
        animationBody.style.opacity = 1;
    }

    removeAni()
    {   
        if(this.delegate == null) return;
        let that = this;
        var animationBody = (this.cell) ? this.cell : this.body;
        animationBody.style.opacity = 0;

        this.rxRemover = Rx.Observable.timer(300).timeInterval().take(1).subscribe
        (
            this.remove.bind(this)
        );
    }

    remove()
    {   
        super.remove();
        if(this.rxInitAni) this.rxInitAni.unsubscribe();
        if(this.rxRemover) this.rxRemover.unsubscribe();
    }
}

class ScrollLists extends ComponentCore
{
    constructor(body,rowSize=100) 
    {
        super(body);
        this.rowSize = rowSize;
        this.totalNum = 0;
        this.scrollLists = null;
        this.scrollBody = null;
        this.scrollBar = null;
        this.scrollThumb = null;

        this.currentIndexA = new Array();
        this.rowA = new Array();

        this.scrollTop = 0;
        this.scrollPosition = 0;
        this.realRange = -1;
        this.virtualRange = -1;
        this.wheelAmount = 0;
        this.finalDelta = 0;
        this.rxWheelController = null;
        this.isReset = false;
        this.isOnTopReady = true;
        this.isOnBottomReady = true;
        this.finalPos = -1;
        this.isClick = false;
        this.finalTarget = null;
    }

    init(className)
    {   
        this.createElements(className);
        this.setupEvent();
        return super.init();
    }
    
    remove()
    {   
        super.remove();
        if(this.rxWheelController) this.rxWheelController.unsubscribe();
        this.rxWheelController =  null;
    }
    
    createElements(className = "")
    {   
        super.createElements();
        let elementProvider = new ScrollListsBody(this.body,className);
        elementProvider.init();
        elementProvider.writeHTML();
        this.scrollLists = elementProvider.getElement('scrollLists');
        this.scrollBody = elementProvider.getElement('scrollBody');
        this.scrollBar = elementProvider.getElement('scrollBar');
        this.scrollThumb = elementProvider.getElement('scrollThumb');
    }

    setupEvent()
    {
        super.setupEvent();

        let that = this;
        var dragDelegate=function(){}; 
        dragDelegate.prototype = 
        {
                                    
            startDrag : function(point)
            {
                that.startScroll();
            },
            moveDrag : function(point)
            {
                that.moveScroll(dragElement.valueY);
            },
            endDrag : function(point)
            {
                that.endScroll(dragElement.valueY);
            }
        }
        var dragElement = new  jarvis.DragElement(this.scrollThumb,new dragDelegate());
        var wheel = new jarvis.MouseWheel(this.body,this.onWheel.bind(this));
        this.attachEvent(this.body,"resize",this.onResize.bind(this));
        jarvis.lib.addEventListener(this.body,"mouseover",this.onRollOver.bind(this));
        jarvis.lib.addEventListener(this.body,"mouseout",this.onRollOut.bind(this));

        jarvis.lib.addEventListener(this.body,"mousedown",this.onDown.bind(this));
        jarvis.lib.addEventListener(this.body,"focusin",this.onFocusIn.bind(this));
        jarvis.lib.addEventListener(this.body,"focusout",this.onFocusOut.bind(this));
    }


    onDown(e)
    {
        this.isClick = true;
    }
    onFocusIn(e)
    {
        let tg = jarvis.lib.getEventTarget(e);
        if(this.isClick == false &&  this.finalTarget != tg)
        {
            
            let bounce = jarvis.lib.getAbsoluteBounce(this.scrollBody);
            let diff = jarvis.lib.getAbsoluteBounce(tg).y - bounce.y;
            this.setScrollPosition(diff);
            this.onScroll();
    
        }
        this.finalTarget = tg;
        this.isClick = false;
        
    }
    onFocusOut(e)
    {
        //this.isClick = false;
    }

    clearEvent()
    {
        super.clearEvent();
        jarvis.lib.removeEventListener(this.body,"mouseover",this.onRollOver.bind(this));
        jarvis.lib.removeEventListener(this.body,"mouseout",this.onRollOut.bind(this));

        jarvis.lib.removeEventListener(this.body,"mousedown",this.onDown.bind(this));
        jarvis.lib.removeEventListener(this.body,"focusin",this.onFocusIn.bind(this));
        jarvis.lib.removeEventListener(this.body,"focusout",this.onFocusOut.bind(this));
    }
    
    
    reloadData(totalNum,isReset=true,rowSize=-1)
    {   
        this.rowSize = rowSize!=-1 ? rowSize : this.rowSize;
        this.totalNum = totalNum;
        this.setVirtualRange();
        this.scrollBody.style.height = this.virtualRange+"px";
        this.scrollBody.innerHTML = "";
        this.currentIndexA = new Array();
        this.rowA = new Array();
        var top = isReset ? 0 : this.scrollPosition;
        this.setScrollPosition(top);
        this.onResize();
    }

    setVirtualRange()
    {   
        this.virtualRange = this.rowSize * this.totalNum;  
    }
    
    setScrollAmount(pct)
    {
        pct = pct>1 ? 1 : pct;
        pct = pct<0 ? 0 : pct;
        
        let pos = Math.round((this.virtualRange - this.realRange) * pct);
        this.setScrollPosition(pos);
    }

    setScrollPosition(pos)
    {
        let max = this.virtualRange - this.realRange;
        pos = pos > max ? max : pos;
        pos = pos<0 ? 0 : pos;
        
        this.scrollPosition = pos;
        this.scrollTop = pos;
        this.scrollBody.style.top = -pos+"px";
        this.setScrollThumb();

        if(this.finalPos == pos) return;

        if(pos == 0 && this.isOnTopReady == true)
        {
            this.isOnTopReady = false;
            let evt = new ComponentEvent(COMPONENT_EVENT.SCROLL_LIST_TOP);
            this.delegate.next(evt);
        }
        else
        {
            this.isOnTopReady = true;
        }
        if(pos == max && this.isOnBottomReady == true)
        {
            this.isOnBottomReady = false;
            let evt = new ComponentEvent(COMPONENT_EVENT.SCROLL_LIST_BOTTOM);
            this.delegate.next(evt);
        }
        else
        {
            this.isOnBottomReady = true;
        }
        this.finalPos = pos;
    }
    setScrollThumb()
    {
        if(this.realRange >= this.virtualRange)
        {
            this.scrollBar.style.display = "none";
            return;
        }else
        {
            this.scrollBar.style.display = "block";
        }
        var barHeight = Math.round(this.realRange  * this.realRange  / this.virtualRange);
        barHeight = barHeight < 50 ? 50: barHeight;
        let barRange = this.realRange - barHeight;
        let pos = Math.round(barRange * this.scrollPosition/(this.virtualRange-this.realRange));
        this.scrollThumb.style.top = pos+"px"; 
        this.scrollThumb.style.height = barHeight+"px";
    }
    onRollOver()
    {
        this.scrollBar.style.opacity = 1;
    }
    onRollOut()
    {
        this.scrollBar.style.opacity = 0;
    }
    onResize()
    {
        this.realRange = jarvis.lib.getAbsoluteBounce(this.scrollLists).height;
        this.setScrollThumb();
        this.onScroll();
    }
    onWheel(e, delta)
    {
        if(this.finalDelta>0 && delta<0) this.wheelAmount = 0;
        if(this.finalDelta<0 && delta>0) this.wheelAmount = 0;
        delta = -delta;
        this.finalDelta = delta;

        if(this.rxWheelController) this.rxWheelController.unsubscribe();
        this.rxWheelController = Rx.Observable.timer(100).timeInterval().take(1).subscribe
        (
            this.resetWheelAmount.bind(this)
        );
        this.wheelAmount += delta;
        var pos = this.scrollPosition + this.wheelAmount;
        this.setScrollPosition(pos);
        this.onScroll();
    }

    resetWheelAmount()
    {
        var currentIndex = 0;
        if(this.wheelAmount>0)
        {
            currentIndex = Math.ceil(Math.abs(this.scrollTop) / this.rowSize);
        }
        else if(this.wheelAmount == 0)
        {
            currentIndex = Math.round(Math.abs(this.scrollTop) / this.rowSize);
        }
        else
        {
            currentIndex = Math.floor(Math.abs(this.scrollTop) / this.rowSize);
        }
        this.wheelAmount = 0;
        //let modifyPos = currentIndex * this.rowSize;
        //jarvis.lib.addAttribute(this.scrollBody,"animate-fast");
        //this.setScrollPosition(modifyPos);
    }

    getCurrentIndex(offset)
    {   
        return Math.floor(Math.abs(this.scrollTop) / this.rowSize) - offset;
    }

    getNeedRownum(currentIndex,offset)
    {
        return  Math.ceil(this.realRange / this.rowSize) + (offset*2); 
    }

    onScroll()
    {
        jarvis.lib.removeAttribute(this.scrollBody,"animate-fast");
        var addA = new Array();
        var removeA = new Array();

        var needIndexA = new Array();
        let offset = 2;
        let currentIndex = this.getCurrentIndex(offset);
        let needRownum = this.getNeedRownum(currentIndex,offset);

        for(var i=0;i<needRownum;++i)
        {
            var idx = i+currentIndex;
            if(idx >= 0 && idx < this.totalNum)
            {
                needIndexA.push(idx);
                if(this.currentIndexA.indexOf(idx)==-1)
                {
                    var row = this.createRow(idx);
                    this.rowA.push(row);
                    this.scrollBody.appendChild(row);
                    addA.push(row); 
                }
            }
        }

        this.currentIndexA = needIndexA;
        var remainRowA = new Array();
        for(var i=0;i<this.rowA.length;++i)
        {
            var row = this.rowA[i];
            if(this.currentIndexA.indexOf(row.idx)==-1)
            {
                this.scrollBody.removeChild(row);
                removeA.push(row);
            }else
            {
                remainRowA.push(row);
            }
        }
        this.rowA = remainRowA;
        for(var i=0;i<addA.length;++i)
        {
            var row = addA[i];
            let evt = new ComponentEvent(COMPONENT_EVENT.ADD_ROW,row,row.idx);
            this.delegate.next(evt);
        }

        for(var i=0;i<removeA.length;++i)
        {
            var row = removeA[i];
            let evt = new ComponentEvent(COMPONENT_EVENT.REMOVE_ROW,row,row.idx);
            this.delegate.next(evt);
        }
        
    }
    createRow(idx)
    {
        var row = document.createElement("li");
        row.idx = idx;
        jarvis.lib.addAttribute(row,"scroll-cell");
        row.style.position = "absolute";
        row.style.top = (this.rowSize*idx)+"px"; 
        row.style.width = "100%"; 
        row.style.height = this.rowSize + "px";        
        //row.style.color = "#fff";
        return row; 
    }

    startScroll(){}
    
    moveScroll(pct)
    {
        this.setScrollAmount(pct);
        this.onScroll();
    }

    endScroll(pct)
    {
        this.setScrollAmount(pct);
        this.onScroll();
        this.resetWheelAmount();
    }
      
}


class DynimicScrollLists extends ScrollLists
{
    constructor(body,rowSize=100,rowSizes=null) 
    {
        super(body,rowSize);
        
        this.rowSizes = rowSizes;
        this.rowPositions = null;
    }

    init(className)
    {   
        return super.init();
    }
    
    remove()
    {   
        this.rowSizes = null;
        this.rowPositions = null;
        super.remove();
    }
    
    reloadData(totalNum,isReset=true,rowSize=-1,rowSizes=null)
    {   
        if(isReset) this.rowSizes = null;
        this.rowSizes = (rowSizes != null) ? rowSizes : this.rowSizes;
        super.reloadData(totalNum,isReset,rowSize);
    }

    updateRowSize(size,idx)
    {
        idx = (idx < 0)? 0 : idx;
        idx = (idx >= this.totalNum)? this.totalNum-1 : idx;
        this.rowSizes[idx] = size;
        this.setVirtualRange();
        for(var i = 0; i<this.rowA.length;++i)
        {
            var row = this.rowA[i];
            this.updateRow(row,row.idx);   
        }
        this.onScroll();
    }

    setVirtualRange()
    {   
        if(this.rowSizes == null)
        {
            this.rowSizes = new Array();
        }
        if(this.rowSizes.length < this.totalNum)
        {
            for(var i = this.rowSizes.length; i<this.totalNum;++i)
            {
                this.rowSizes.push(this.rowSize);
            }
        }
        let top = Math.abs(this.scrollTop);
        var pos =0;
        this.rowPositions = new Array;
        for(var i = 0; i<this.rowSizes.length;++i)
        {
            this.rowPositions.push(pos);
            pos += this.rowSizes[i];
        }
        this.virtualRange = pos; 
    }

    getNeedRownum(currentIndex,offset)
    {
        if(this.rowSizes<=0) return 0;
        var idx = currentIndex - offset;
        var len = 0;
        idx = (idx < 0)? 0 : idx;
        var range = 0;
        while(range<this.realRange)
        {
            range += this.rowSizes[idx];
            idx ++;
            len ++;
        }
        return len+(offset*2);
    }

    getCurrentIndex(offset)
    {   
        let top = Math.abs(this.scrollTop);
        let that = this;
        function finder(idx)
        {
            if(idx>=that.totalNum-1)
            {
                if(top >= that.rowPositions[that.totalNum-1]) return 0;
            }
            else
            {
                if(top >= that.rowPositions[idx] && top < that.rowPositions[idx+1]) return 0;
            }
            if(top < that.rowPositions[idx]) return -1;
            if(top >= that.rowPositions[idx+1]) return 1;
        }
        var find = jarvis.Sort.binSearch(this.totalNum,finder);
        return find-offset;
    }
    
    createRow(idx)
    {
        var row = super.createRow(idx);
        return this.updateRow(row,idx); 
    }
    updateRow(row,idx)
    {
        row.style.top = this.rowPositions[idx] + "px";
        row.style.height = this.rowSizes[idx] + "px";
        return row; 
    }
      
}


class ScrollListCore extends ComponentCore
{
    constructor(body) 
    {
        super(body);
    }
    init()
    {   
        this.rxInitTimer = Rx.Observable.timer(100).timeInterval().take(1).subscribe
        (
            this.delayInit.bind(this)
        );
        return super.init();
    }

    delayInit()
    { 

    }

    remove()
    {   
        super.remove();
        if(this.rxInitTimer) this.rxInitTimer.unsubscribe();
    }

    onFocus()
    {
       let evt = new ComponentEvent(COMPONENT_EVENT.FOCUS_ROW,this);
       this.delegate.next(evt);
    }
    onSelected()
    {
       let evt = new ComponentEvent(COMPONENT_EVENT.SELECT_ROW,this,this.listObject);
       this.delegate.next(evt);
    }

}



class FrameAnimation extends ComponentCore
{  

    constructor(body,resorce,frameRect,isLoof,totalFrame,time = 30) 
    {
        super(body);
        if(totalFrame === undefined) totalFrame = frameRect.x*frameRect.y;    
        this.isLoof = isLoof;
        this.body=body;
        this.resorce=resorce;
        this.frameRect = frameRect; 
        this.currentFrame = 0;
        this.totalFrame = totalFrame;
        this.time=time;
        this.isPlaying=false;
        this.stream = null;

    }
    init(startFrame=0)
    {   
        return super.init();
        this.setFrame(startFrame);
    }

    remove()
    {   
        this.stop();
        super.remove();   
    }

    setFrame(frm)
    {    
        this.currentFrame = frm;
        var tx = (frm % this.frameRect.x) * this.frameRect.width;
        var ty = Math.floor(frm / this.frameRect.x) * this.frameRect.height;
        this.body.style.backgroundRepeat = 'no-repeat';
        this.body.style.backgroundImage = 'url("' + this.resorce + '")';
        this.body.style.backgroundPosition = '-' + tx + 'px -' + ty + 'px';
        this.body.style.height = this.frameRect.height + 'px';
        this.body.style.width = this.frameRect.width + 'px';
    }


    move(target,delay = 0)
    {
        if(target<0) target = 0;
        if(target>=this.totalFrame) target = this.totalFrame-1;
        this.stop();
        
        var dr = 0;
        if(this.currentFrame>target)
        {
            dr = -1;    
        }
        else if(this.currentFrame<target)
        {
            dr = 1;
        }
        this.isPlaying=true;
        var that = this;
        var frm = this.currentFrame;
        this.stream = Rx.Observable.interval(this.time).timeInterval().subscribe
        (
            {
                next(value)
                {
                    delay -= that.time;
                    if(delay>=0) return;
                    frm += dr;
                    if(frm == target)
                    {
                        that.setFrame(frm);
                        that.stop();
                        that.delegate.complete();
                    }
                    else
                    {
                        that.setFrame(frm);
                        that.delegate.next();
                    }
                    
                } 

            }   
        );

    }

    play ()
    {        
        this.stop();
        this.isPlaying=true;
        var that = this;
        var frm = this.currentFrame;
        this.stream = Rx.Observable.interval(this.time).timeInterval().subscribe
        (
            {
                next(value)
                {
                    frm ++;
                    that.setFrame(frm);
                    if(frm == (that.totalFrame-1))
                    {
                        if(that.isLoof == true)
                        {
                            frm = 0;
                        }
                        else
                        {
                            that.stop();
                            that.delegate.complete();
                        }
                    }
                    else
                    {
                        that.delegate.next();
                    }
                    
                }
            }   
        );
                    
    }

    
    stop()
    {
        this.isPlaying=false;
        if(this.stream) this.stream.unsubscribe();
    }
 
}

class Paint extends ComponentCore //cotroller
{
    constructor(body) 
    {
        super(body);
        this.opacity = 0;
        this.stream = null;
        this.canvas = null;
        this.context = null;
       
        this.frm = 0;
        this.isDrawing = false;
        this.init();
    }

    init()
    {   
        this.createElements();
        return super.init();
    }
    
    remove()
    {   
        this.stop();
        super.remove();   
    }
    
    createElements()
    {   
        super.createElements();
        this.canvas = document.createElement("canvas");
        this.body.appendChild(this.canvas);
        var bounce =  jarvis.lib.getAbsoluteBounce(this.body); 
        this.canvas.width = bounce.width;
        this.canvas.height = bounce.height;
    }

    play()
    {
        this.body.style.opacity = 1;
        if(this.stream != null) window.cancelAnimationFrame(this.stream);
        this.isDrawing = true;
        this.stream = window.requestAnimationFrame(this.draw.bind(this));
    }

    stop()
    {
        this.body.style.opacity = 0;
        this.isDrawing = false;
        if(this.stream != null) window.cancelAnimationFrame(this.stream);
        this.stream = null;
    }

    draw() 
    {
        if(this.context == null) 
        {
            this.context = this.canvas.getContext('2d');
            this.doInitDraw();
        }
        this.doDraw();
        this.frm ++;
        this.context.restore();
        if(this.isDrawing == true) this.stream = window.requestAnimationFrame(this.draw.bind(this));
        
    }

    doInitDraw(){}
    doDraw(){}


    
}

class LoadingSpiner extends Paint
{
    constructor(body) 
    {
        super(body);   
        this.WIDTH = 80;
        this.HEIGHT = 40;
        this.DEPTH = 7;
        var margin = this.DEPTH/2;
        var frame = 30;
        var div = 2;
        var radius = this.HEIGHT / 2;
        var start = 45;
        var diff = 360 / frame;
        this.points = new Array();   
        for (var i=0; i<= (frame * div); ++i) 
        {  
            var r = (i%frame)*diff;
            r = r*Math.PI/180;
            var x = (radius*2) + margin+(Math.cos(r) *radius);
            var y = radius + margin + (Math.sin(r) *radius);
            var point = new jarvis.Point(x,y);
            this.points.push(point);

        }
        /*
        for (var i=0; i<= (frame * div); ++i) 
        {
            var pos = radius;
            var r = (i%frame)*diff;
            if(i>=frame)
            {
                r = 180 - r;
                pos = radius  * 3;
            }
            r = r*Math.PI/180;
            var x = pos + margin+(Math.cos(r) *radius);
            var y = radius + margin + (Math.sin(r) *radius);
            var point = new jarvis.Point(x,y);
            this.points.push(point);

            
        }*/
        
    }

    play()
    {
        super.play();
        
    }

    stop()
    {
        super.stop();
       
    }
    doInitDraw()
    {
        this.context.lineCap = 'round';
        this.context.lineWidth = this.DEPTH;
    }
    doDraw()
    {

       
        
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.beginPath();
        var frame = this.points.length; 
        var len = 26;
        
        for (var i=0; i < len; ++i) 
        {
            var a = Math.sin((len-i)/len);
            var gradient=this.context.createLinearGradient(0,0,this.WIDTH,this.HEIGHT);
            gradient.addColorStop(0,'rgba(128,69,221,'+a+')');
            gradient.addColorStop(0.5,'rgba(128,69,221,'+a+')');
            gradient.addColorStop(1,'rgba(128,69,221,'+a+')');
           
            this.context.strokeStyle = gradient;
            
            var idx  = ((this.frm + i) % frame);
            var point = this.points[idx]  
            if(i==0)
            {
                this.context.moveTo(point.x, point.y);
            }else
            {
                this.context.lineTo(point.x, point.y);
            }
            //
            this.context.stroke();
            
        }
        this.context.closePath();
        this.context.save();
    }
    
}

/*
class LoadingSpiner extends FrameAnimation
{
    constructor(body) 
    {
        super(body,CHROMELESS_SRC + IMG_PATH.DEFAULT + "loading.png",new jarvis.Rectangle(12,2,60,34),true);
        this.body.style.opacity = 1;
        this.init();
        
    }

    play()
    {
        
        super.play();
        this.body.style.opacity = 1;
    }

    stop()
    {
        
        super.stop();
        this.body.style.opacity = 0;
    }
    
}

*/

class AttachEvent 
{
    constructor(element,event,handler) 
    {
        this.element = element;
        this.event = event;
        this.handler = handler;
    }
}

class ComponentEvent 
{
    constructor(type,row=null,value=null) 
    {
        this.type = type;
        this.row = row;
        this.value = value;
    }

    toString()
    {
        console.log("ComponentEvent  : "+this.type+" | "+this.value);
    }
}

const COMPONENT_EVENT = Object.freeze
(
    {
        ADD_ROW:"addRow",
        REMOVE_ROW:"removeRow",
        SELECT_ROW:"selectRow",
        FOCUS_ROW:"focusRow",
        SCROLL_LIST_TOP:"scrollListTop",
        SCROLL_LIST_BOTTOM:"scrollListBottom"
    }
);


class ObservableMecro extends Rx.Subject 
{

    constructor(observables,isRepeat=false) 
    {
        super();
        this.idx  = 0;
        this.observables = observables;
        this.setSubject(isRepeat);
    }

    unsubscribe()
    {
        super.unsubscribe();
        if(this.observables == null) return;
        for(var i=0; i<this.observables.length; ++ i)
        {
            this.observables[i].unsubscribe();
        }
        this.observables = null;
    }

    setSubject(isRepeat)
    {
        let that = this;
        let source = this.observables[this.idx];
        source.subscribe
        (
            function (value)
            {
                that.next(value); 
            },
            function (err)
            {
                that.error(err);
            },
            function () 
            {
                that.idx++;
                if(that.idx >= that.observables.length)
                {
                    if(isRepeat)
                    {
                      that.idx = 0;
                    }
                    else
                    {
                      that.complete();
                      return;
                    }
                }
                that.setSubject(isRepeat);      
            }
       );   
    }
}





