/* eslint-disable */
var EchoLogServer = "adlog.cresendo.net";
var EchoCookieDays = 30;
var Echotoday = new Date();
var EchoToDay = Echotoday.getYear() + "" + FN_ZoneMark(Echotoday.getMonth())	+ "" + FN_ZoneMark(Echotoday.getDate());
var EchoToDayHours = Echotoday.getHours();
var EchoID = "pooq";
var EchoGoodNm = "";
var EchoAmount = "";
var EchoTarget = "";
var EchoLogSend = "Y";
var EchoCV = "";
var EchoPN = "";
function FN_ZoneMark(_Ea) { if (_Ea < 10) { return "0" + _Ea; } else { return _Ea; }}
function FN_GetDomain(_Eb) { var _s = _Eb.split("."); if (_s.length == 3) { if (_s[1].length == 2) { return _Eb; } else { return _s[1] + "." + _s[2]; } } else if (_s.length > 3) { if (_s[_s.length - 2].length == 2) { return _s[_s.length - 3] + "." + _s[_s.length - 2] + "."					+ _s[_s.length - 1]; } else { return _s[_s.length - 2] + "." + _s[_s.length - 1]; } } else { return _Eb; }}
function FN_SetCookie(_Ec, _Ed, _Ee, _Ef, _Eg) { var _dt = new Date(); _ut = _dt.getTime(); _Ee = (!_Ee) ? "/" : _Ee; if (_Ed == null) { _Eg = 0; } if (_Eg != null) { _et = _ut + (_Eg * 1000); _dt.setTime(_et); _pt = " expires=" + _dt.toUTCString() + ";"; } else { _pt = ""; } if (_Ef != null) { _pt += " domain=" + _Ef + ";"; } document.cookie = _Ec + "=" + escape(_Ed) + "; path=" + _Ee + ";" + _pt;}
function FN_GetCookie(_Ec) { var _RT = document.cookie.match ( '(^|;) ?' + _Ec + '=([^;]*)(;|$)' ); if ( _RT) { return unescape(_RT[2]); } else { return ""; }}
function FN_StrPos(_Eh, _Ei) { for (var _i = 0; _i < _Eh.length; _i++) { if (_Eh.substring(_i, _i + 1) == _Ei) { return _i; } } return -1; }
function FN_FullDomain(_Ej) { if (FN_StrPos(_Ej, ":") > 0) { _Ej = _Ej.substring(0, FN_StrPos(_Ej, ":")); } if (FN_StrPos(_Ej, "/") > 0) { _Ej = _Ej.substring(0, FN_StrPos(_Ej, "/")); } _Ej = FN_GetDomain(_Ej);	return _Ej;}
function FN_getNavigatorInfoStr() { var name = navigator.appName, ver = navigator.appVersion, ua = navigator.userAgent, infostr; if (name == "Microsoft Internet Explorer") {		if (ver.indexOf("MSIE 3.0") != -1) { return "Internet Explorer 3.0x"; } var real_ver = parseInt(ua.substring(ua.indexOf("MSIE ") + 5)); if (real_ver >= 7) { infostr = "Windows Internet Explorer "; } else { infostr = "Microsoft Internet Explorer "; } if (ua.indexOf("MSIE 5.5") != -1) { return infostr + "5.5"; } else { if (real_ver == 7 && ua.indexOf("Trident/4.0") != -1) {	 return infostr + "8.x"; } else { return infostr + real_ver + ".x"; } } return "Internet Explorer";	} else if (name == "Netscape") {		if (ua.indexOf("Mobile") != -1) {			if (ua.indexOf("Android") != -1) {				if (ua.indexOf("Daum") != -1) { return "Android_" + ua.substring(ua.indexOf("Daum")); } else if (ua.indexOf("NAVER") != -1) { return "Android_" + ua.substring(ua.indexOf("NAVER")); } else if (ua.indexOf("Chrome") != -1) { return "Android_"	+ ua.substring(ua.indexOf("Chrome"), ua.indexOf("Mobile")); } else { return "Android_" + ua.substring(ua.indexOf("Mobile"));	}			} else if (ua.indexOf("iPhone") != -1) {				if (ua.indexOf("NAVER") != -1) { return "iPhone_" + ua.substring(ua.indexOf("NAVER")); } else if (ua.indexOf("CriOS") != -1) { return "iPhone_Chrome("+ ua.substring(ua.indexOf("CriOS") + 7, ua	.indexOf("Mobile") - 1) + ")"; } else if (ua.indexOf("Safari") == -1) { return "iPhone_Daum Apple"; } else {	 return "iPhone_Mobile "+ ua.substring(ua.indexOf("Safari")); }			} else if (ua.indexOf("iPad") != -1) {				if (ua.indexOf("NAVER") != -1) { return "iPad_" + ua.substring(ua.indexOf("NAVER")); } else if (ua.indexOf("CriOS") != -1) { return "iPad_Chrome("+ ua.substring(ua.indexOf("CriOS") + 7, ua	.indexOf("Mobile") - 1) + ")"; } else if (ua.indexOf("Safari") == -1) { return "iPad_Daum Apple"; } else {	return "iPad_Mobile " + ua.substring(ua.indexOf("Safari")); }	 }		} else if (ua.indexOf("Android") != -1) {			if (ua.indexOf("Daum") != -1) { return "Android_(note10.1) " + ua.substring(ua.indexOf("Daum")); } else if (ua.indexOf("NAVER") != -1) { return "Android_(note10.1) "+ ua.substring(ua.indexOf("NAVER")); } else if (ua.indexOf("Chrome") != -1) { return "Android_(note10.1) "+ ua.substring(ua.indexOf("Chrome")); } else { return "Android_(note10.1) "+ ua.substring(ua.indexOf("Safari")); }		} else if (ua.indexOf("Trident") != -1) { var ie_ver = ua.substring(ua.indexOf("rv:") + 3, ua.indexOf(")")); return "Internet Explorer " + ie_ver;		} else { if (ua.indexOf("Firefox") != -1) {	 return ua.substring(ua.indexOf("Firefox")); } else if (ua.indexOf("Chrome") != -1) {	 return ua.substring(ua.indexOf("Chrome"), ua.indexOf("Safari")); } else if (ua.indexOf("Opera") != -1) { return "Opera" + ua.substring(ua.lastIndexOf(" ")); } else {	 return ua.substring(ua.lastIndexOf(" ")); } }	} else { return name; }}
function FN_getOSInfoStr() { var ua = navigator.userAgent; var oss = "";	if (ua.indexOf("NT 6.3") != -1) { return "Windows 8.1"; } else if (ua.indexOf("NT 6.2") != -1) { return "Windows 8"; } else if (ua.indexOf("NT 6.1") != -1) { return "Windows 7"; } else if (ua.indexOf("Android") != -1) { oss = ua.substring(ua.indexOf("Android"), ua.indexOf("Build")); return oss.replace("; ko-kr;", ""); } else if (ua.indexOf("iPhone") != -1) { return ua.substring(ua.indexOf("CPU iPhone") + 4, ua.indexOf(")")); } else if (ua.indexOf("iPad") != -1) { return "iPad " + ua.substring(ua.indexOf("CPU") + 4, ua.indexOf(")")); } else if (ua.indexOf("NT 6.0") != -1) { return "Windows Vista/Server 2008";	} else if (ua.indexOf("NT 5.2") != -1) { return "Windows Server 2003"; } else if (ua.indexOf("NT 5.1") != -1) { return "Windows XP"; } else if (ua.indexOf("NT 5.0") != -1) { return "Windows 2000"; } else if (ua.indexOf("NT") != -1) {return "Windows NT"; } else if (ua.indexOf("9x 4.90") != -1) { return "Windows Me"; } else if (ua.indexOf("98") != -1) { return "Windows 98"; } else if (ua.indexOf("95") != -1) { return "Windows 95"; } else if (ua.indexOf("Win16") != -1) { return "Windows 3.x"; } else if (ua.indexOf("Windows") != -1) { return "Windows"; } else if (ua.indexOf("Linux") != -1) { return "Linux"; } else if (ua.indexOf("Macintosh") != -1) { return "Macintosh"; } else { return ""; } }
function FN_sendChk(msecs){ var start =new Date().getTime(); var cur=start; while(cur-start<msecs){ cur=new Date().getTime(); }}
var _LandYn = "N";
var _BookMark = "N";
var _EchoPR = location.protocol.indexOf("https");
var _EchoHostName = location.hostname;
var _EchoSearch = location.search;
var _EchoHash = location.hash;
var _EchoUL = document.URL;
var _EchoRF = document.referrer;
var _EchoDoMain = FN_FullDomain(_EchoHostName);
var _EchoAK = FN_GetCookie(EchoID + "_CTNAAKEY");
var _EchoCK = FN_GetCookie(EchoID + "_CTNACKEY");
var _EchoSK = FN_GetCookie(EchoID + "_CTNAKEY");
var _EchoSS = FN_GetCookie(EchoID + "_CTNASESSION");
var _EchoDate = FN_GetCookie(EchoID + "_CTNADATE");
var _EchoInKey ="";
var _EchoCV = "";
var _EchoPN = "";
var _EchoK = "";
var _EchoLogSend = "";
var _EchoSendCheck = "Y";
var _EchoSendParam = _EchoUL.toUpperCase().indexOf("CTNASEND=");
var _EchoULEchoKey = _EchoUL.toUpperCase().indexOf("CTNAKEY=");
var _EchoULTemp = "";
var _EchoULSubDomain = "";
var _EchoRFTemp = "";
var _EchoRFSubDomain = "";
if ( _EchoSendParam>0 ){
	var _ii = _EchoUL.indexOf("&", _EchoSendParam+9); 
	if ( _ii>0 ) { _EchoSendCheck = _EchoUL.substring(_EchoSendParam+9, _ii); }
	else { _EchoSendCheck = _EchoUL.substring(_EchoSendParam+9); }
}
_EchoSendCheck = _EchoSendCheck.toUpperCase();
if ( _EchoSendCheck != "N" ) {
	if (_EchoUL.charAt(_EchoUL.length - 1) == "/") {	_EchoUL = _EchoUL.substring(0, _EchoUL.length - 1); }
	if (!_EchoRF || _EchoRF == "") {	_EchoRFSubDomain = ""; } else { _EchoRF = _EchoRF.replace("'", ""); _EchoRFTemp = _EchoRF.replace("http://", ""); _EchoRFTemp = _EchoRFTemp.replace("https://", ""); _EchoRFSubDomain = FN_FullDomain(_EchoRFTemp);}
	_EchoUL = _EchoUL.replace("'", "");
	_EchoULTemp = _EchoUL.replace("http://", "");
	_EchoULTemp = _EchoULTemp.replace("https://", "");
	_EchoULSubDomain = FN_FullDomain(_EchoULTemp);
	if (_EchoRFSubDomain != "") {	if (_EchoULSubDomain != _EchoRFSubDomain && _EchoULEchoKey > 0) { _LandYn = "Y"; }} else { if (_EchoCK != "") { _BookMark = "Y";	 _EchoInKey = _EchoCK; }}
	if (_LandYn == "Y" || _EchoULEchoKey > 0 ) {	var _ii = _EchoUL.indexOf("&", _EchoULEchoKey + 8); if (_ii > 0) { _EchoK = _EchoUL.substring(_EchoULEchoKey + 8, _ii);} else { _EchoK = _EchoUL.substring(_EchoULEchoKey + 8); } if (_EchoK != _EchoSK) { echo_new_session = true; } FN_SetCookie(EchoID + "_CTNAKEY", _EchoK, "/", _EchoDoMain); if (!_EchoK || _EchoK == "") { _EchoK = "unknown"; } if (_EchoK != "unknown") { _EchoCK = _EchoK; _EchoDate = EchoToDay; FN_SetCookie(EchoID + "_CTNACKEY", _EchoK, "/", _EchoDoMain,	EchoCookieDays * 24 * 60 * 60); FN_SetCookie(EchoID + "_CTNADATE", EchoToDay, "/", _EchoDoMain,EchoCookieDays * 24 * 60 * 60); if (!_EchoSS || _EchoSS == "") { var _DT = new Date(); _EchoSS = ((Math.round(Math.random() * 900) % 900 + 100)) + ""+ _DT.getTime(); FN_SetCookie(EchoID + "_CTNASESSION", _EchoSS, "/", _EchoDoMain,	EchoCookieDays * 24 * 60 * 60); } else { FN_SetCookie(EchoID + "_CTNASESSION", _EchoSS, "/", _EchoDoMain,	EchoCookieDays * 24 * 60 * 60); } if (!_EchoAK || _EchoAK == "") { _EchoAK = _EchoK; FN_SetCookie(EchoID + "_CTNAAKEY", _EchoK, "/", _EchoDoMain,	1 * 24 * 60 * 60); }} if (_EchoPR > 0) { _EchoInKey = _EchoCK; } else { if (_EchoK == "unknown") { if (_EchoCK == "unknown") { _EchoInKey = _EchoAK; } else { _EchoInKey = _EchoCK; } } else { _EchoInKey = _EchoK; } } }
	if (_LandYn == "Y" || _BookMark == "Y") {
		if (_EchoInKey != "" || _EchoAK != "") {
			var _EchoLogUrl = "//" + EchoLogServer + "/?ac=" + EchoID + "&k="	+ escape(_EchoInKey) + "&ak=" + _EchoAK + "&ok=&la=" + _LandYn+ "&bm=" + _BookMark + "&gd=" + encodeURIComponent(EchoGoodNm)+ "&at=" + EchoAmount + "&ud=" + escape(_EchoULSubDomain)	+ "&ul=" + escape(_EchoUL) + "&rd=" + escape(_EchoRFSubDomain)	+ "&rl=" + escape(_EchoRF) + "&pg="	+ escape(_EchoUL.replace(_EchoSearch + _EchoHash, "")) + "&cd="	+ _EchoDate + "&ic=&br=" + escape(FN_getNavigatorInfoStr())	+ "&os=" + escape(FN_getOSInfoStr()) + "&et=" + EchoTarget	+ "&cv=&pn=&ss=" + _EchoSS + "&vr=6.0";
			var _EchoImg = new Image();	_EchoImg.src = _EchoLogUrl;	FN_sendChk(300);				
		}
	} else if ( _EchoULEchoKey > 0 ){
		var _EchoLogUrl = "//" + EchoLogServer + "/?ac=" + EchoID + "&k="	+ escape(_EchoInKey) + "&ak=" + _EchoAK + "&ok=&la=" + _LandYn+ "&bm=" + _BookMark + "&gd=" + encodeURIComponent(EchoGoodNm)+ "&at=" + EchoAmount + "&ud=" + escape(_EchoULSubDomain)	+ "&ul=" + escape(_EchoUL) + "&rd=" + escape(_EchoRFSubDomain)	+ "&rl=" + escape(_EchoRF) + "&pg="	+ escape(_EchoUL.replace(_EchoSearch + _EchoHash, "")) + "&cd="	+ _EchoDate + "&ic=&br=" + escape(FN_getNavigatorInfoStr())	+ "&os=" + escape(FN_getOSInfoStr()) + "&et=" + EchoTarget	+ "&cv=&pn=&ss=" + _EchoSS + "&vr=6.0";
		var _EchoImg = new Image();	_EchoImg.src = _EchoLogUrl;	FN_sendChk(300);
	}
}
function FN_EchoCresendo(pn, gd, am) {
	var EchoGoodNm = gd;
	var EchoAmount = am;
	var EchoCV = "Y"; 
	var EchoPN = pn;
	var _EchoInKey = _EchoCK;
	if ( _EchoSendCheck != "N" ) {
		if (typeof(EchoCV)=="undefined" || typeof(EchoCV)!="string") { _EchoCV=""; } else { _EchoCV=EchoCV; }
		if (typeof(EchoPN)=="undefined" || typeof(EchoPN)!="string") { _EchoPN=""; } else { _EchoPN=EchoPN; }
		if (typeof(EchoLogSend)=="undefined" || typeof(EchoLogSend)!="string") { _EchoLogSend=""; } else { _EchoLogSend=EchoLogSend; }
		if (_EchoLogSend=="Y") {
			if (_EchoInKey!="" || _EchoAK!="") {
				if (_EchoCV=="Y") {
					var _EchoLogUrl = "//" + EchoLogServer + "/?ac=" + EchoID + "&k=" + escape(_EchoInKey) + "&ak=" + _EchoAK + "&ok=&la=" + _LandYn + "&bm=" + _BookMark + "&gd=" + encodeURIComponent(EchoGoodNm) + "&at=" + EchoAmount + "&ud=" + escape(_EchoULSubDomain) + "&ul=" + escape(_EchoUL) + "&rd=" + escape(_EchoRFSubDomain) + "&rl=" + escape(_EchoRF) + "&pg=" + escape(_EchoUL.replace(_EchoSearch + _EchoHash,"")) + "&cd=" + _EchoDate + "&ic=&br=" + escape(FN_getNavigatorInfoStr()) + "&os=" + escape(FN_getOSInfoStr()) + "&et=" + EchoTarget + "&cv=" + _EchoCV + "&pn=" + _EchoPN + "&ss=" + _EchoSS + "&vr=6.0";
					var _EchoImg = new Image(); _EchoImg.src = _EchoLogUrl; FN_sendChk(300);
				}
			}
		} else {
			var _EchoLogUrl = "//" + EchoLogServer + "/?ac=" + EchoID + "&k=" + escape(_EchoInKey) + "&ak=" + _EchoAK + "&ok=&la=" + _LandYn + "&bm=" + _BookMark + "&gd=" + encodeURIComponent(EchoGoodNm) + "&at=" + EchoAmount + "&ud=" + escape(_EchoULSubDomain) + "&ul=" + escape(_EchoUL) + "&rd=" + escape(_EchoRFSubDomain) + "&rl=" + escape(_EchoRF) + "&pg=" + escape(_EchoUL.replace(_EchoSearch + _EchoHash,"")) + "&cd=" + _EchoDate + "&ic=&br=" + escape(FN_getNavigatorInfoStr()) + "&os=" + escape(FN_getOSInfoStr()) + "&et=" + EchoTarget + "&cv=" + _EchoCV + "&pn=" + _EchoPN + "&ss=" + _EchoSS + "&vr=6.0";
			var _EchoImg = new Image(); _EchoImg.src = _EchoLogUrl; FN_sendChk(300);
		}
	}
}