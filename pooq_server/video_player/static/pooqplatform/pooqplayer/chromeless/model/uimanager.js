
jarvis.uiManagerInstance = null;

class UIManager
{
	static getInstance()
	{
		if(jarvis.uiManagerInstance == null) return new UIManager();
		return jarvis.uiManagerInstance;

	}

	constructor() 
	{
		jarvis.uiManagerInstance = this;
		this.isCastAble = false;
	}

	init()
	{

	}
    
    getInfoIconPath(infoPath)
	{
		return CHROMELESS_SRC + IMG_PATH.RATINA + infoPath;
	}

	getTegPath(teg)
	{
		var path = "";
		switch(teg)
		{
			case "F" :
				path = CHROMELESS_SRC + IMG_PATH.RATINA + IMG_PATH.ICON_FREE;
				break;
		}
		return path;
	}

	getQualityIconPath(quality)
	{
		return CHROMELESS_SRC + IMG_PATH.RATINA + "icon_resolution_"+quality+".png";
	}

	getAgeIconPath(age)
	{
		if(age == "" || age <= 0) age = 'all';
		return CHROMELESS_SRC + IMG_PATH.RATINA + "icon_age_"+age+".png";
	}

	
}


        
const STATUS_TYPE = Object.freeze
(
	{
		PLAYER:"player",
		RECEIVER:"receiver",
		PLAYER_ERROR:"playerError"
		
	}
);
const PLAYER_ERROR = Object.freeze
(
	{
		DEFAULT: "DEFAULT",
		FORBIDDEN: "FORBIDDEN",
		DISABLE:"DISABLE",
		PLAY_BACK:"PLAY_BACK",
		BUFFER_DELAY: "BUFFER_DELAY",
		// cast
		REQUEST:"REQUEST",
		META_DATA:"META_DATA",
		HOST:"HOST",

	}
);
var PLAYER_ERROR_CODE = Object.freeze
(
	{
		DEFAULT: "400",
		FORBIDDEN: "403",
		DISABLE:"406",
		PLAY_BACK:"402",
		BUFFER_DELAY: "408",
		REQUEST:"410",
		META_DATA:"411",
		HOST:"412"
	}
);

var PLAYER_ERROR_MSG = Object.freeze
(
	{
		DEFAULT: "",
		DISABLE: "영상 정보가 없어 재생할 수 없습니다. 다시 시도해주세요.",
		PLAY_BACK: "알 수 없는 오류가 발생하였습니다. 다시 시도해주세요.",
		FORBIDDEN: "권환이 없어 재생할 수 없습니다. 다시 시도해주세요.",
		REQUEST:"알 수 없는 오류가 발생하였습니다. 다시 시도해주세요.",
		META_DATA:"알 수 없는 오류가 발생하였습니다. 다시 시도해주세요.",
		HOST:"알 수 없는 오류가 발생하였습니다. 다시 시도해주세요."
	}
);

var VIDEO_TYPE = Object.freeze
(
	{
		HLS: "m3u8",
		MPEG_DASH: "mpd", 
		SMOOTH_STREAM: "ism/",
		PROGRESSIVE: "mp4"
	}
);

const UI_EVENT = Object.freeze
(
	{
		CHANGE_VOD:"changeVod",
		UPDATE_META:"updateMeta",
		QUALITY_CHANGE:"qualityChange",
		DVR_CHANGE:"dvrChange",
		EPISODE_COMPLETE:"episodeComplete",
		NEXT_EPISODE_COMPLETE:"nextEpisodeComplete",
		LIST_BOX_OPEN_CAHNGED:"listBoxOpenChanged",
		LIST_NAVI_CAHNGED:"listNaviChanged",
		LIST_STATUS_CAHNGED:"listStatusChanged",
		SKIP_VOD:"skipVod",
		UI_OPEN_CAHNGED:"uiOpenChanged",
		SELECTED_FUNCTION:"selectedFunction",
		UI_CLICK:"uiClick",
		COMPLETE_BOX_LOADED:"completeBoxLoaded"

	}
);

const SETUP_EVENT = Object.freeze
(
	{
		OPEN_SETUP: "openSetup",
		AUTO_PLAY_CHANGE:"autoPlayChange",
		OPEN_GUIDE:"openQuide",
		OPEN_POPUP:"openPopup",
		I_WANT_FLASH:"iWantFlash"
	}
);

const RECEIVER_EVENT = Object.freeze
(
	{
		MESSAGE:"message",
		CONNECTED_INIT:"connectedInit",
		ADDED_SENDER:"addedSender",
		CHANGED_SENDER:"changedSender",
		CONNECTED_EMPTY:"connectedEmpty"
	}
);

const PLAYER_EVENT = Object.freeze
(
	{

		VOLUME_CHANGE:"volumeChange",
		PLAY: "play",
		PAUSE: "pause",
		STOP: "stop",
		MOVE:"move",
		SEEK_CHANGE:"seekChange",
		SEEK_MOVE: "seekMove",
		SEEK_MOVING: "seekMoving",
		SEEK_MOVED:"seekMoved",
		POINT_CHANGED:"pointChanged",
		FULLSCREEN_ENTER:"fullScreenEnter",
		FULLSCREEN_EXIT:"fullScreenExit",
		GET_THUMB:"getThumb",
		SCREEN_RATIO_CHANGE:"screenRatioChange",
		PLAY_RATE_CHANGE:"playRateChange"

	}
);

const PLAYER_STATE = Object.freeze
(
	{
		INITED:"inited",
		CAST_INITED:"castInited",
		CAST_CONNECTED:"castConnected",
		CAST_DISCONNECTED:"castDisconnected",
		CAST_DISABLE:"castDisable",
		PERMISSION_COMPLETE:"permissionComplete",
		PERMISSION_INVALID:"permissionInvalid",
		PERMISSION_CHECK:"permissionCheck",
		DATA_LOAD:"dataLoad",
		DATA_LOADED:"dataLoaded",
		LOAD: "load",
		LOADED: "loaded",
		AUTO_PLAY_START: "autoPlayStart",
		AUTO_PLAY_STOP: "autoPlayStop",
		UNLOADED: "unloaded",
		READY:"ready", 
		VTT_LOADED:"vttLoaded",
		REMOTE_CHANGED:"remoteChanged",
		VOLUME_CHANGED:"volumeChanged",
		DURATION_CHANGE:"durationChange",
		PREVIEW_DURATION_CHANGE:"previewDurationChange",
		PLAY_RANGE_CHANGE:"playRangeChange",
		QUALITY_CHANGED:"qualityChanged",
		TIME_CHANGE:"timeChange",
		PREVIEW_TIME_CHANGE:"previewTimeChange",
		PLAY: "play",
		PLAY_START: "playStart",
		PAUSED: "paused",
		STOP: "stop",
		FINISHED: "finished",
		SEEK:"seek",
		SEEK_DISABLE:"seekDisable",
		SEEKED:"seeked",
		STALL:"stall",
		STALLED:"stalled",
		RESIZE:"resize",
		FULLSCREEN_ENTER:"fullScreenEnter",
		FULLSCREEN_EXIT:"fullScreenExit",
		SCREEN_RATIO_CHANGED:"screenRatioChanged",
		PLAY_RATE_CHANGED:"playRateChanged"

	}
);

const UI_STATE = Object.freeze
(
	{
		RESIZE:"uiresize"
	}
);

const STREAM_TYPE = Object.freeze
(
	{
		VIDEO: "video", 
		AUDIO: "audio",
		REMOTE: "remote"
	}
);
const PLAY_TYPE = Object.freeze
(
	{
		LIVE: "LIVE", 
		VOD: "VOD",
		DVR: "DVR",
		LIVE_TM: "LIVE_TM",
		QVOD: "QVOD"
	}
);


const COMPLETE_TYPE = Object.freeze
(
	{
		EPISODE: "EPISODE",
		RECOMMEND: "RECOMMEND",
		CLIP: "CLIP"
	}
);


const DYNAMIC_SIZE = Object.freeze
(
	{
		UI_MARGIN : 5, 
		AREA_MARGIN : 12,
		LIST_PLAYER_MIN_WIDTH : 480,
		LIST_WIDTH : 542,
		LIST_PLAYER_MARGIN : 45

	}
);


const IMG_PATH = Object.freeze
(
	{
		DEFAULT:"images/",
		RATINA:"images/2X/",
		ICON_QVOD: "tag_quickvod.png",
		ICON_FREE: "teg_free.png",
		ICON_AUDIO: "icon_audio.png",
		ICON_STAR_ON: "icon_star_on.png",
		ICON_STAR_OFF: "icon_star_off.png" 
	}
);

const INFO_MSG = Object.freeze
(
	{
		TM: "타임머신 - 한 시간 전 영상까지 볼 수 있어요!",
		AD: "광고중입니다",
		AUDIO: "오디오 모드 입니다.",
		PREVIEW_COMPLETE_TITLE: "미리보기 종료",
		PREVIEW_COMPLETE_LOGIN: "미리보기가 종료되었습니다.<br>로그인 하시겠습니까?",
		PREVIEW_COMPLETE_PURCHASE: "미리보기가 종료되었습니다.<br>구매하시겠습니까?",
		VOD_COMPLETE_TITLE: "영상종료",
		COMPLETE_DEFAULT : "영상재생이 종료되었습니다.",
		COMPLETE_CAST : "영상재생이 종료되었습니다.<br>휴대전화, 태블릿 또는 PC에서<br>영상을 재생해주세요.",
		COMPLETE_EPISODE : "재생이 종료되었습니다.",
		COMPLETE_RECOMMEND : "즐거운 관람되셨나요?<br><span class='sub-title font-ultra'>이 영상을 본 분들이 즐겨보는 다른 영상을 이어서 즐겨보세요!</span>",
		COMPLETE_RECOMMEND_MOVIE : "즐거운 관람되셨나요?<br><span class='sub-title font-ultra'>추천 영화를 이어서 즐겨보세요!</span>",
		AUTO_PLAY : '자동재생 설정이 꺼져 있습니다.<br>자동재생을 원하시면 설정 > 기타옵션 ><br>자동재생 설정을 ON으로 변경해주세요.',

		CAST_DISABLE_AUDIO : "Chromecast 연결중에는<br>오디오 모드가 지원되지 않아요.<br>Chromecast 재생을 원하시면<br>다른 화질로 변경해주세요.",
		CAST_DISABLE_RADIO : "Chromecast 미지원 채널입니다.<br>Chromecast 재생을 원하시면<br>다른 채널로 변경해주세요.",
		CAST_DISABLE_AD : "광고 재생 후 Chromecast에서<br>자동 재생됩니다.",
		
	}
);

const RECEIVER_COMMAND = Object.freeze
(
    {
        SEND_QVOD_RANGE: "sendQVodRange",
        REQUEST_QVOD_RANGE: "requestQVodRange",
        STOP_CASTING:"stopCasting",
        COMPLETE_PREV_VIEW:"completePreview",

        START_AI_CAST:"startAICast",
        LOAD:"load" 
    }
);


class UIEvent 
{
	constructor(type,value=null) 
	{
        this.type = type;
        this.value = value;
    }

    toString()
    {
    	console.log("UIEvent  : "+this.type+" | "+this.value);

    }
}

class UIStatus 
{
	constructor(type,state="",value=null) 
	{
        this.type = type;
        this.state = state;
        this.value = value;
    }

    toString()
    {
    	console.log("UIStatus : "+this.type+" | "+this.state+" | "+this.value);

    }
}





