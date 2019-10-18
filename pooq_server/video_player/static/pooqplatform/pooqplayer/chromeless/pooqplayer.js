
document.write("<script src='"+CHROMELESS_SRC+"rx/rx.all.min.js?updateVS="+UPDATE_VS+"'></script>");
document.write("<script src='"+CHROMELESS_SRC+"lib/sort.js?updateVS="+UPDATE_VS+"'></script>");
document.write("<script src='"+CHROMELESS_SRC+"controller/playercontroller.js?updateVS="+UPDATE_VS+"'></script>");
document.write("<script src='"+CHROMELESS_SRC+"model/uimanager.js?updateVS="+UPDATE_VS+"'></script>"); 
//document.write("<script src='"+CHROMELESS_SRC+"bitmovin/7_4/bitmovinplayer.js?updateVS="+UPDATE_VS+"'></script>");
document.write("<script src='"+CHROMELESS_SRC+"hls/0_7/hls.min.js?updateVS="+UPDATE_VS+"'></script>");
document.write("<script src='"+CHROMELESS_SRC+"videojs/6/video.min.js?updateVS="+UPDATE_VS+"'></script>");
document.write("<script src='"+CHROMELESS_SRC+"videojs/6/dash.all.min.js?updateVS="+UPDATE_VS+"'></script>");
document.write("<script src='"+CHROMELESS_SRC+"videojs/6/videojs-dash.js?updateVS="+UPDATE_VS+"'></script>");
document.write("<script src='"+CHROMELESS_SRC+"videojs/6/videojs-contrib-hls.min.js?updateVS="+UPDATE_VS+"'></script>");
document.write("<script src='"+CHROMELESS_SRC+"videojs/6/videojs-contrib-eme.min.js?updateVS="+UPDATE_VS+"'></script>");
document.write("<script src='"+CHROMELESS_SRC+"videojs/6/videojs-contrib-quality-levels.min.js?updateVS="+UPDATE_VS+"'></script>");
document.write("<link rel='stylesheet' href='"+CHROMELESS_SRC+"videojs/6/video-js.min.css?updateVS="+UPDATE_VS+"'>");

document.write("<script src='"+CHROMELESS_SRC+"setup.js?updateVS="+Math.random()+"'></script>");
document.write("<script src='"+CHROMELESS_SRC+"view/elementprovider.js?updateVS="+UPDATE_VS+"'></script>");
document.write("<script src='"+CHROMELESS_SRC+"view/screenbody.js?updateVS="+UPDATE_VS+"'></script>");
document.write("<script src='"+CHROMELESS_SRC+"view/player.elements.js?updateVS="+UPDATE_VS+"'></script>");
document.write("<script src='"+CHROMELESS_SRC+"view/screen.elements.js?updateVS="+UPDATE_VS+"'></script>");
document.write("<script src='"+CHROMELESS_SRC+"component/componentcore.js?updateVS="+UPDATE_VS+"'></script>");
document.write("<script src='"+CHROMELESS_SRC+"component/player.elements.js?updateVS="+UPDATE_VS+"'></script>");
document.write("<script src='"+CHROMELESS_SRC+"component/playerui.js?updateVS="+UPDATE_VS+"'></script>");
document.write("<script src='"+CHROMELESS_SRC+"component/playerui.elements.js?updateVS="+UPDATE_VS+"'></script>");
document.write("<script src='"+CHROMELESS_SRC+"component/playerui.setup.js?updateVS="+UPDATE_VS+"'></script>");
document.write("<script src='"+CHROMELESS_SRC+"component/listbox.js?updateVS="+UPDATE_VS+"'></script>");
document.write("<script src='"+CHROMELESS_SRC+"component/player.js?updateVS="+UPDATE_VS+"'></script>");
document.write("<script src='"+CHROMELESS_SRC+"component/bitplayer.js?updateVS="+UPDATE_VS+"'></script>");
document.write("<script src='"+CHROMELESS_SRC+"component/html5player.js?updateVS="+UPDATE_VS+"'></script>");
document.write("<script src='"+CHROMELESS_SRC+"component/hlsplayer.js?updateVS="+UPDATE_VS+"'></script>");
document.write("<script src='"+CHROMELESS_SRC+"component/videoplayer.js?updateVS="+UPDATE_VS+"'></script>");
document.write("<script src='"+CHROMELESS_SRC+"component/castplayer.js?updateVS="+UPDATE_VS+"'></script>");
if(jarvis.lib.isChrome()==true) document.write("<script type='text/javascript' src='https://www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1'></script>");
document.write("<script src='"+CHROMELESS_SRC+"component/awsomeplayer.js?updateVS="+UPDATE_VS+"'></script>");
document.write("<link rel='stylesheet' href='"+CHROMELESS_SRC+"css/chromeless.css?updateVS="+UPDATE_VS+"'>");
document.write("<link rel='stylesheet' href='"+CHROMELESS_SRC+"css/player.css?updateVS="+UPDATE_VS+"'>"); 


class PooqPlayer //Main controller
{
	constructor(body,delegate) 
	{
        this.body=body;
        this.PLAYER_TYPE = PLAYER_TYPE.HTML5;
     	this.playerController = new PlayerController(delegate);
    }

    init(mode)
    {
        this.playerController.init(this.body);
    }

    loadCustomVod(vodObject)
    {
        return this.playerController.loadCustomVod(vodObject);
    }
    load(vodObject)
    {
        return this.playerController.load(vodObject);
    }

    getFocus()
    {
        return this.playerController.isFocus;
    }

    setMode(mode)
    {
        this.playerController.setMode(mode);
    }

    isCondensationModeAble()
    {
        return this.playerController.isCondensationModeAble();
    }

    setMode(mode)
    {
        this.playerController.setMode(mode);
    }

    play()
    {
        this.playerController.player.play();
    }

    pause()
    {
        this.playerController.player.pause();
    }

    togglePlay()
    {
        this.playerController.player.togglePlay();
    }
    moveSeek(amount)
    {
        this.playerController.player.moveSeek(amount);
    }
    moveVolume(amount)
    {
        this.playerController.player.moveVolume(amount)
    }

}