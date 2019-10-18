
class HLSPlayer extends HTML5Player
{
	constructor(body,delegate = new Rx.Subject(),info = new PlayerObject()) 
    {
        super(body,delegate,info);
        this.hls = null;
    }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//PROTECTED          
//
//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    doRemovePlayer()
    { 
        super.doRemovePlayer();
    }
    
    doCreatePlayer(source)
    {   
        super.doCreatePlayer(source);
    }

    doSetupEvent()
    {
        super.doSetupEvent();
    }

    doClearEvent()
    {
        super.doClearEvent();
    }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//PUBLIC          
//
//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    doUnLoadStream()
    { 
        super.doUnLoadStream();
        if(this.hls)
        {
            this.hls.destroy();
        }
    }

    doLoadStream(source)
    {
        let that = this;
        let config = {
            xhrSetup: function(xhr, url)
            {
                xhr.withCredentials = true; // do send cookies
            }
        }
        let hls = new Hls(config);
        hls.attachMedia(this.player);
        hls.on(Hls.Events.MEDIA_ATTACHED, function () {
            hls.loadSource(source.src);
            hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
                console.log("manifest loaded, found " + data.levels.length + " quality level");
                that.doOnAutoPlay();

            });
        });
        this.hls = hls;
    }

   

}

    


