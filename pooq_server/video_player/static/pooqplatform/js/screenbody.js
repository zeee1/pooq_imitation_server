class ScreenBody extends ElementProvider
{
    constructor(body,id) 
    {
        super(body,id);
    }

    writeHTML()
    {
        this.body.innerHTML =
        `
        <img id='${this.id}bgImage' class='bg-image blur'>
        <div id='${this.id}player' class='player'></div>
        <div id='${this.id}btnOpenArea' class='btn-open-area btn-open-area-hidden position-right animate-in'>
            <button id='${this.id}btnListOpen' class='btn-default btn-list-open animate-flip font-out position-center animate-short'>openlist</button>
        </div>   
        <div id='${this.id}listBox' class='list-box list-box-hidden'></div>
        `;
    }
    
}


class PlayerBody extends ElementProvider
{
	constructor(body,id) 
	{
        super(body,id);
    }

    writeHTML()
    {
        this.body.innerHTML =
        `<img id='${this.id}initImage' class='init-image img-default img-default-h'>
         <div id='${this.id}uis' class='uis'>
            <div id='${this.id}topBar' class='top-bar'></div> 
            <div id='${this.id}bottomBar' class='bottom-bar'></div> 
            <div id='${this.id}viewArea' class='view-area'></div> 
            <div id='${this.id}uiArea' class='ui-area'></div> 
           
            <div id='${this.id}bottomArea' class='bottom-area position-bottom bottom-area-half'>
                <div id='${this.id}addOnArea' class='add-on-area bottom-area-up'></div>
                <div id='${this.id}seekArea' class='position-bottom bottom-area-up'></div>
                <div id='${this.id}functionArea' class='position-bottom bottom-area-up'></div>
                <div id='${this.id}playArea' class='position-bottom bottom-area-up'></div>
                <div id='${this.id}previewArea' class='position-bottom'></div>
            </div>
            <div id='${this.id}topArea' class='top-area position-top'>
                <div id='${this.id}infoArea' class='position-left'></div>
                <div id='${this.id}shareArea' class='position-right'></div>
            </div> 
            <div id='${this.id}setupArea' class='setup-area position-bottom'></div> 
        </div>
        <i id='${this.id}loadingSpiner' class='loading-spiner position-center animate-long'></i>`;
        
    }
}

class ListBoxBody extends ElementProvider
{
    constructor(body,id) 
    {
        super(body,id);
    }

    writeHTML()
    {
        this.body.innerHTML =
        `
        <div id='${this.id}box' class='box position-right'>
            <div id='${this.id}topArea' class='top-navi'></div> 
            <div id='${this.id}listsArea' class='lists'></div> 

            <i id='${this.id}nodata' class='position-center nodata'>
                <div class='icon-nodata'></div>
                <div id='${this.id}textNodata' class='font-big font-image text-nodata'>콘텐츠가 없어요.</div>
            </i>
            <i id='${this.id}loadingSpiner' class='loading-spiner animate-long'></i>
        </div>    
        `; 
        
    }
}

class ContextMenuBody extends ElementProvider
{
    constructor(body,id) 
    {
        super(body,id);
    }

    writeHTML()
    {
        var cell = document.createElement("div");
        cell.id = this.id+'cell';
        jarvis.lib.addAttribute(cell,"context-menu");
        cell.innerHTML =
        `
        <div id='${this.id}title' class='title menu'></div> 
        <div id='${this.id}desc' class='desc menu'></div>   
        <button id='${this.id}btnClose' class='btn-default menu'>close</button>    
        
        `; 
        this.body.appendChild(cell);
        
    }
}


