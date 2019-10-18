

class UiBoxBody extends ElementProvider
{
    constructor(body,id) 
    {
        super(body,id);
    }

    writeHTML()
    {
        var cell = document.createElement("div");
        cell.id = this.id+'cell';
        jarvis.lib.addAttribute(cell,"ui-box");
        cell.innerHTML =
        `
        <div id='${this.id}uiSet' class='ui-set position-center'>
            <button id='${this.id}btnBack' class='btn-back btn-default font-out position-left'>back</button>
            <div id='${this.id}btnCenter' class='btn-center position-center'>
                <button id='${this.id}btnPlay' class='btn-play btn-default font-out'>play</button>
                <button id='${this.id}btnPause' class='btn-pause btn-default font-out'>pause</button>
            </div>
            <button id='${this.id}btnFront' class='btn-front btn-default font-out position-right'>front</button>
        </div>
        <div id='${this.id}seekInfo' class='seek-info font-miracle font-image text-shadow position-center'>00:00</div>
        
        `;   
        this.body.appendChild(cell); 
    }
}



class SeekBoxBody extends ElementProvider
{
    constructor(body,id) 
    {
        super(body,id);
    }

    writeHTML()
    {
        jarvis.lib.addAttribute(this.body,'seek-box');
        this.body.innerHTML =
        `
        
        <div id='${this.id}bar' class='bar'>
            <div id='${this.id}barBg' class='bar-progress progress-range'></div>
            <div id='${this.id}barRange' class='bar-progress progress-range'></div>
            <div id='${this.id}barProgress' class='bar-progress progress-default'></div>
            <div id='${this.id}barPrev' class='bar-progress progress-prev'></div>
            <div id='${this.id}flagRange' class='progress-flag'></div>
            <div id='${this.id}seekRange' class='bar-progress seek-range'></div>
            <div id='${this.id}thumb' class='thumb'></div>
        </div>
        <div id='${this.id}preview' class='preview font-small font-image'>preview</div>

        `;   
    }
}

class FlagBody extends ElementProvider
{
    constructor(body,id) 
    {
        super(body,id);
    }

    writeHTML()
    {
        var cell = document.createElement("div");
        cell.id = this.id+'cell';
        jarvis.lib.addAttribute(cell,"flag");
        cell.innerHTML =
        `
        <div id='${this.id}text' class='text font-small font-image'></div>
        <div class='point'></div>
    
        `;  
        this.body.appendChild(cell); 
    }
}

class VolumeBoxBody extends ElementProvider
{
    constructor(body,id) 
    {
        super(body,id);
    }

    writeHTML()
    {
        var cell = document.createElement("div");
        cell.id = this.id+'cell';
        jarvis.lib.addAttribute(cell,"volume-box position-left");
        cell.innerHTML =
        `
        <div id='${this.id}btnVolume' class='btn-volume btn-default btn-ui position-left'>
            <button id='${this.id}btnVolumeOn' class='btn-volume-on btn-default btn-ui font-out'>volume on</button>
            <button id='${this.id}btnVolumeOff' class='btn-volume-off btn-default btn-ui font-out'>volume off</button>
        </div>

        <div id='${this.id}bar' class='bar position-left animate-in'>
            <div id='${this.id}barRange' class='bar-progress progress-range'></div>
            <div id='${this.id}barProgress' class='bar-progress progress-default'></div>
            <div id='${this.id}barPrev' class='bar-progress progress-prev'></div>
            <div id='${this.id}volumeRange' class='bar-progress volume-range'></div>
            <div id='${this.id}thumb' class='thumb'></div>
        </div>

        <div id='${this.id}textTime' class='text-time text font-middle font-image position-left animate-in'>00:00:00</div>
        <div id='${this.id}textDuration' class='text-duration text font-middle font-image position-left animate-in'>/ 00:00:00</div>
         `;  
        this.body.appendChild(cell); 
    }
}

class PlayBoxBody extends ElementProvider
{
    constructor(body,id) 
    {
        super(body,id);
    }

    writeHTML()
    {
        var cell = document.createElement("div");
        cell.id = this.id+'cell';
        jarvis.lib.addAttribute(cell,"play-box position-left");
        cell.innerHTML =
        `
        <button id='${this.id}btnPlay' class='btn-play btn-ui btn-default font-out'>play</button>
        <button id='${this.id}btnPause' class='btn-pause btn-ui btn-default font-out'>pause</button>
        `;  
        this.body.appendChild(cell); 

    }
}

class FunctionBoxBody extends ElementProvider
{
    constructor(body,id) 
    {
        super(body,id);
    }

    writeHTML()
    {
        jarvis.lib.addAttribute(this.body,'function-box');
        this.body.innerHTML =
        `
        <div id='${this.id}btnFullScreen' class='btn-full-screen btn-default btn-ui position-right'>
            <button id='${this.id}btnFullScreenOn' class='btn-full-screen-on btn-ui btn-default font-out'>full screen on</button>
            <button id='${this.id}btnFullScreenOff' class='btn-full-screen-off btn-ui btn-default font-out'>full screen off</button>
        </div>
        <button id='${this.id}btnPopup' class='btn-popup btn-default font-out btn-ui position-right'>popup</button>
        <div id='${this.id}setupSet' class='setup-set position-right'>
            <button id='${this.id}btnSetup' class='btn-setup btn-default font-out btn-ui'>setup</button>
            <img id='${this.id}iconQuality' class="icon-quality"/>
        </div>
    
        `;   
    }
}

class PreviewBoxBody extends ElementProvider
{
    constructor(body,id) 
    {
        super(body,id);
    }

    writeHTML()
    {
        jarvis.lib.addAttribute(this.body,'preview-box');
        this.body.innerHTML =
        `
        <div id='${this.id}msg' class='msg position-left text-line-limit font-middle font-image'></div>
        `;   
    }
}


class InfoBoxBody extends ElementProvider
{
    constructor(body,id) 
    {
        super(body,id);
    }

    writeHTML()
    {
        jarvis.lib.addAttribute(this.body,'info-box');
        this.body.innerHTML =
        `
        <button id='${this.id}btnHomeShopping' class='btn-homeshopping btn-default btn-rect font-middle font-image position-left'>홈쇼핑 상품 구매하기</button>
        <div id='${this.id}textInfo' class='text-info text-line-limit font-big font-default position-left'>PooQ PlayeR</div>
        <img id='${this.id}icon'  alt="" class='icon position-left'/>
        `;   
    }
}

class ShareBoxBody extends ElementProvider
{
    constructor(body,id) 
    {
        super(body,id);
    }

    writeHTML()
    {
        jarvis.lib.addAttribute(this.body,'share-box');
        this.body.innerHTML =
        `
        <button id='${this.id}btnDownload' class='btn-download btn-default btn-ui font-out position-right'>volume on</button>
        <button id='${this.id}btnShare' class='btn-share btn-default btn-ui font-out position-right'>volume on</button>
        <div id='${this.id}btnCast' class='position-right'>
            <button  is="google-cast-button" class='btn-cast btn-default btn-ui'>cast</button>
        </div>
        <div id='${this.id}btnTM' class='btn-tm btn-default btn-ui position-right'>
            <button id='${this.id}btnTMOn' class='btn-tm-on btn-default btn-ui font-out'>time machine on</button>
            <button id='${this.id}btnTMOff' class='btn-tm-off btn-default btn-ui font-out'>time machine off</button>
        </div>
        <div id='${this.id}textInfo' class='text-info font-big font-image position-right'>info</div>
        
        `;   
    }
}
class BrandsBoxBody extends ElementProvider
{
    constructor(body,id) 
    {
        super(body,id);
    }

    writeHTML()
    {
        var cell = document.createElement("div");
        cell.id = this.id+'cell';
        jarvis.lib.addAttribute(cell,"brands-box");
        this.body.appendChild(cell); 
    }
}

class AdBoxBody extends ElementProvider
{
    constructor(body,id) 
    {
        super(body,id);
    }

    writeHTML()
    {
        var cell = document.createElement("div");
        cell.id = this.id+'cell';
        jarvis.lib.addAttribute(cell,"ad-box");
        cell.innerHTML =
        `
        <button id='${this.id}btnAd' class='btn-ad btn-default font-out position-left'>adlink</button>
        <button id='${this.id}btnSkip' class='btn-skip btn-default font-big font-image position-right'>10초 후 건너뛰기</button>
    
        `;  
        this.body.appendChild(cell); 
    }
}

class ViewBoxBody extends ElementProvider
{
    constructor(body,id) 
    {
        super(body,id);
    }

    writeHTML()
    {
        var cell = document.createElement("div");
        cell.id = this.id+'cell';
        jarvis.lib.addAttribute(cell,"view-box position-center");
        cell.innerHTML =
        `
        <div id='${this.id}infoSet' class='info-set position-center'>
            <div class='bg'></div>
            <img id='${this.id}icon' class="icon"/>
            <div id='${this.id}text' class='text font-big font-image'>오디오 모드 입니다.</div>
        </div>
    
        `;  
        this.body.appendChild(cell); 
    }
}

 

class NextEpisodeBoxBody extends ElementProvider
{
    constructor(body,id) 
    {
        super(body,id);
    }

    writeHTML()
    {
        var cell = document.createElement("div");
        cell.id = this.id+'cell';
        jarvis.lib.addAttribute(cell,"next-episode-box next-episode-box-hidden");
        cell.innerHTML =
        `
        <div class='img-box position-left'>
            <img id='${this.id}img'  alt="" class="img img-default img-default-h animate-fast"/>
            <div class='img-border'></div>
        </div>
        <button id='${this.id}btnPlay' class='btn-play btn-default font-big font-image position-left'>다음회차 306회<br>자동재생 5초 후</button>
        <button id='${this.id}btnStop' alt= '닫기' class='btn-stop btn-default font-out position-left'><div class='btn-close'></div></button>
    
        `;  
        this.body.appendChild(cell); 
    }
}


class SetupBoxBody extends ElementProvider
{
    constructor(body,id) 
    {
        super(body,id);
    }

    writeHTML()
    {
        var cell = document.createElement("div");
        cell.id = this.id+'cell';
        jarvis.lib.addAttribute(cell,"setup-box");
        cell.innerHTML =
        `
        <div id='${this.id}box' class='box animate-out'>
            <div id='${this.id}lists' class='lists position-left'></div>
            <div id='${this.id}subLists' class='sub-lists position-left animate-in'></div>
        </div>
        <div id='${this.id}point' class='point position-right'></div>
        
        `;
        this.body.appendChild(cell); 
    }
}

class SetupListBody extends ElementProvider
{
    constructor(body) 
    {
        super(body);
    }

    writeHTML()
    {
        var cell = document.createElement("div");
        cell.id = this.id+'cell';
        jarvis.lib.addAttribute(cell,"list");
        cell.innerHTML =
        `
        <div id='${this.id}title' class="title font-big font-image"></div>
        <button id='${this.id}btn' class='btn-trensparent btn-default font-out'></button>
        `; 
        this.body.appendChild(cell);
    } 
}

class SetupSubListBody extends ElementProvider
{
    constructor(body) 
    {
        super(body);
    }

    writeHTML()
    {
        var cell = document.createElement("div");
        cell.id = this.id+'cell';
        jarvis.lib.addAttribute(cell,"list position-clear");
        cell.innerHTML =
        `
        <div id='${this.id}title' class="title font-middle font-image position-left"></div>
        <img id='${this.id}icon' class="icon position-left"/>
        <div id='${this.id}switch' class='switch position-left'>
            <div id='${this.id}bg' class='bg'></div>
            <div id='${this.id}thumb' class='thumb font-tiny font-image animate-fast'>OFF</div>
        </div>
        <button id='${this.id}btn' class='btn-trensparent btn-default font-out'></button>
        `; 
        this.body.appendChild(cell);
    } 
}







