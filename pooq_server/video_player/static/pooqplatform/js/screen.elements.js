
class InfoTipBody extends ElementProvider
{
    constructor(body) 
    {
        super(body);
    }

    writeHTML()
    {
        var cell = document.createElement("div");
        cell.id = this.id+'cell';
        jarvis.lib.addAttribute(cell,"info-tip");
        cell.innerHTML =
        `
        <button id='${this.id}btnClose' class='btn-default btn-close font-out position-right'>close</button> 
        <div id='${this.id}msg' class='msg font-middle font-image'></div>
        `; 
        this.body.appendChild(cell);
    } 
}


class MsgWindowBody extends ElementProvider
{
    constructor(body) 
    {
        super(body);
    }

    writeHTML()
    {
        var cell = document.createElement("div");
        cell.id = this.id+'cell';
        jarvis.lib.addAttribute(cell,"msg-window");
        cell.innerHTML =
        `
        <div class='dimed'></div>
        <div class='box position-center'>
            <div class='alert-body'>
                <button id='${this.id}btnClose' class='btn-default btn-close font-out position-right'>close</button> 
                <div id='${this.id}title' class='title font-ultra font-image'>[미리보기]</div>
                <div id='${this.id}msg' class='msg font-big font-image'></div>
            </div>
            <div id='${this.id}bottom' class='bottom'>  
            </div> 
        </div>
        `; 
        this.body.appendChild(cell);
    } 
}


class UserGuideBody extends ElementProvider
{
    constructor(body) 
    {
        super(body);
    }

    writeHTML()
    {
        var cell = document.createElement("div");
        cell.id = this.id+'cell';
        jarvis.lib.addAttribute(cell,"user-guide");
        cell.innerHTML =
        `
        <div class='dimed'></div>
        <div class='guide'></div>
        <button id='${this.id}btnClose' class='btn-default btn-close font-out position-right'>close</button>  
        `; 
        this.body.appendChild(cell);
    } 
}

class CompleteBoxBody extends ElementProvider
{
    constructor(body) 
    {
        super(body);
    }

    writeHTML()
    {
        var cell = document.createElement("div");
        cell.id = this.id+'cell';
        jarvis.lib.addAttribute(cell,"complete-box");
        cell.innerHTML =
        `
        <div class='dimed'></div>
        <div id='${this.id}uiArea' class='ui-area'></div>
        <button id='${this.id}btnClose' class='btn-default btn-close font-out position-right'>close</button>  

        <div id='${this.id}replaySet' class='replay-box position-center'>
            <div class='icon'></div>
            <div class='text font-big font-image'>다시보기</div>
            <button id='${this.id}btnReplay' class='btn-default font-out btn-trensparent'>다시보기</button>
        </div>
       
        `; 
        this.body.appendChild(cell);
    } 
}


class EpisodeCompleteBoxBody extends ElementProvider
{
    constructor(body) 
    {
        super(body);
    }

    writeHTML()
    {
        this.body.innerHTML =
        `
        <div class='episode-complete-box position-center'>
            <div id='${this.id}infoTitle' class='font-amazing font-image info-title'></div>
            <div class='ui-set'>
                <div id='${this.id}prevList' class='list position-left'>
                    <div class='img-box'>
                        <img id='${this.id}prevImg' alt="" class="img img-default img-default-h animate-fast"/>
                        <div class='img-border'></div>
                    </div>
                    <div id='${this.id}prevTitle' class='text font-big font-default'></div>
                    <button id='${this.id}prevBtn' class='btn-default font-out btn-trensparent'></button>
                </div>
                <button id='${this.id}btnReplay' class='btn-default btn-replay font-out position-center'>replay</button>
                <div id='${this.id}nextList' class='list position-right'>
                    <div class='img-box'>
                        <img id='${this.id}nextImg' alt="" class="img img-default img-default-h animate-fast"/>
                        <div class='img-border'></div>
                    </div>
                    <div id='${this.id}nextTitle' class='text font-big font-default'></div>
                    <button id='${this.id}nextBtn' class='btn-default font-out btn-trensparent'></button>
                </div>
            </div>
        </div>
        `; 
    } 
}

class ClipCompleteBoxBody extends ElementProvider
{
    constructor(body) 
    {
        super(body);
    }

    writeHTML()
    {
        this.body.innerHTML =
        `
        <div class='clip-complete-box position-center'>
            
            <div class='ui-set'>
                <div class='replay-box position-left'>
                    <div class='icon'></div>
                    <div class='text font-big'>다시보기</div>
                    <button id='${this.id}btnReplay' class='btn-default font-out btn-trensparent'>다시보기</button>
                </div>
                <div class='full-video position-right'>
                    <div class='img-box'>
                        <img id='${this.id}img'  alt="" class="img img-default img-default-h animate-fast"/>
                        <div class='img-border'></div>
                    </div>
                    <button id='${this.id}btnFull' class='btn-full btn-default btn-line font-big font-image'>VOD 본편 보러가기</button>
                </div>
            </div>
        </div>
        `; 
    } 
}

class RecommendVodBoxBody extends ElementProvider
{
    constructor(body) 
    {
        super(body);
    }

    writeHTML()
    {
        this.body.innerHTML =
        `
        <div id='${this.id}uiSet' class='recommend-vod-box position-center'>
            <div id='${this.id}infoTitle' class='font-amazing font-image info-title'></div>
            <div id='${this.id}uiSet' class='ui-set'>
                <button id='${this.id}btnPrev' class='btn-default btn-prev font-out position-left'>prev</button>
                <div id='${this.id}listArea' class='list-area position-left'></div>
                <button id='${this.id}btnNext' class='btn-default btn-next font-out position-left'>next</button>
            </div>
        </div>
        <i id='${this.id}loadingSpiner' class='loading-spiner position-center animate-long'></i>`;
    } 
}

class RecommendVodListBody extends ElementProvider
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
        <div id='${this.id}aniBody' class="ani-body animate-in">
            <div class='img-box'>
                <img id='${this.id}img'  alt="" class="img img-default img-default-h animate-fast"/>
                <div class='img-border'></div>
            </div>
            <div id='${this.id}title' class='font-big font-default title text-line-limit'></div>
            <div id='${this.id}subTitle' class='font-middle font-default sub-title'></div>
            <button id='${this.id}btn' class='btn-default font-out btn-trensparent'></button>
        </div>
        `; 
        this.body.appendChild(cell);
    } 
}
class RecommendProgramListBody extends ElementProvider
{
    constructor(body) 
    {
        super(body);
    }

    writeHTML()
    {
        var cell = document.createElement("div");
        cell.id = this.id+'cell';
        jarvis.lib.addAttribute(cell,"list-program");
        cell.innerHTML =
        `
        <div id='${this.id}aniBody' class="ani-body animate-in">
            <div class='img-box'>
                <img id='${this.id}img'  alt="" class="img img-default img-default-v animate-fast"/>
                <div class='img-border'></div>
            </div>
            <div id='${this.id}subTitle' class='font-middle font-default sub-title'></div>
            <button id='${this.id}btn' class='btn-default font-out btn-trensparent'></button>
        </div>
        `; 
        this.body.appendChild(cell);
    } 
}

class RecommendMovieListBody extends ElementProvider
{
    constructor(body) 
    {
        super(body);
    }

    writeHTML()
    {
        var cell = document.createElement("div");
        cell.id = this.id+'cell';
        jarvis.lib.addAttribute(cell,"list-movie");
        cell.innerHTML =
        `
        <div id='${this.id}aniBody' class="ani-body animate-in">
            <div class='img-box'>
                <img id='${this.id}img' alt="" class="img img-default img-default-v animate-fast"/>
                <div class='img-border'></div>
            </div>
            <img id='${this.id}icon' alt="" class="icon"/>
            <button id='${this.id}btn' class='btn-default font-out btn-trensparent'></button>
        </div>
        `; 
        this.body.appendChild(cell);
    } 
}


class TopNaviBody extends ElementProvider
{
    constructor(body) 
    {
        super(body);
    }

    writeHTML()
    {
        this.body.innerHTML =
        `
        <button id='${this.id}btnNavi0' class='btn-default btn-navi font-great font-image position-left btn-navi-margin'></button>
        <button id='${this.id}btnNavi1' class='btn-default btn-navi font-great font-image position-left btn-navi-margin'></button>
        <button id='${this.id}btnNavi2' class='btn-default btn-navi font-great font-image position-left'></button>
        <div id='${this.id}pointer' class='pointer animate-in'></div>
        `; 
    } 
}


class VodListBody extends ElementProvider
{
    constructor(body) 
    {
        super(body);
    }

    writeHTML()
    {
        var cell = document.createElement("div");
        cell.id = this.id+'cell';
        jarvis.lib.addAttribute(cell,"list vod-list");
        cell.innerHTML =
        `
        <div class='img-box position-left'>
            <img id='${this.id}img'  alt="" class="img img-default img-default-h position-left animate-fast"/>
            <div class='img-border'></div>
            <img id='${this.id}icon'  alt="" class="icon"/>
            <div id='${this.id}progress' class='progress'></div>

        </div>
        <div class='text-box position-left'>
            <div id='${this.id}title' class='font-ultra font-default title text-line-limit'></div>
            <div id='${this.id}subTitle' class='font-big font-default sub-title'></div>
        </div>
        <button id='${this.id}btn' class='btn-default font-out btn-trensparent'></button>
        `; 
        this.body.appendChild(cell);
    } 
}

class MovieListBody extends ElementProvider
{
    constructor(body) 
    {
        super(body);
    }

    writeHTML()
    {
        var cell = document.createElement("div");
        cell.id = this.id+'cell';
        jarvis.lib.addAttribute(cell,"list movie-list");
        cell.innerHTML =
        `
        <div class='img-box position-left'>
            <img id='${this.id}img'  alt="" class="img img-default img-default-v animate-fast"/>
            <div class='img-border'></div>
            <img id='${this.id}iconAge' class="icon-age"/>
        </div>
        <div class='text-box position-left'>
            <div id='${this.id}title' class='font-ultra font-default title text-line-limit'></div>
            <div class='star-box'>
                <div class='rate-box position-left'>
                    <div class='star-rate'>
                        <div class="star-off" style='left:0'></div>
                        <div class="star-off" style='left:20px'></div>
                        <div class="star-off" style='left:40px'></div>
                        <div class="star-off" style='left:60px'></div>
                        <div class="star-off" style='left:80px'></div>
                    </div>
                    <div id='${this.id}starRate' class='star-rate'>
                        <div class="star-on" style='left:0'/></div>
                        <div class="star-on" style='left:20px'></div>
                        <div class="star-on" style='left:40px'></div>
                        <div class="star-on" style='left:60px'></div>
                        <div class="star-on" style='left:80px'></div>
                    </div>
                </div>
                <div id='${this.id}textDuration' class='font-ultra font-default text-duration position-left'></div>
            </div>
            <div id='${this.id}subTitle' class='font-big font-default sub-title'></div>
        </div>
        <button id='${this.id}btn' class='btn-default font-out btn-trensparent'></button>
        `; 
        this.body.appendChild(cell);
    } 
}


class ThemeListBody extends ElementProvider
{
    constructor(body) 
    {
        super(body);
    }

    writeHTML()
    {
        var cell = document.createElement("div");
        cell.id = this.id+'cell';
        jarvis.lib.addAttribute(cell,"list theme-list");
        cell.innerHTML =
        `
        <div class='img-box'>
            <img id='${this.id}img' alt="" class="img img-default img-default-h animate-fast"/>
            <div class='img-border'></div>
        </div>
        <div class="icon-list-num"></div>
        <div id='${this.id}textListNum' class='font-ultra font-default text-list-num'></div>
        <div id='${this.id}title' class='font-big font-default title'></div>
        <button id='${this.id}btn' class='btn-default font-out btn-trensparent'></button>
        `; 
        this.body.appendChild(cell);
    } 
}


class ScrollListsBody extends ElementProvider
{
    constructor(body,className="") 
    {
        super(body);
        this.className = className;
    }
    writeHTML()
    {
        this.body.innerHTML =
        `
        <div id='${this.id}scrollLists' class='scroll-lists ${this.className}'>
            <div id='${this.id}scrollBody' class='scroll-body'>
            </div>
            <div id='${this.id}scrollBar' class='scroll-bar animate-fast'> 
                <div id='${this.id}scrollThumb' class='scroll-thumb'> </div>
            </div>
        </div>
        `;
    }
}




