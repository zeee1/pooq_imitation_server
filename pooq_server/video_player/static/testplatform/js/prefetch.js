var apikey = "E5F3E0D30947AA5440556471321BB6D9";
var device = "pc";
var partner = "pooq";
var region = "kor"
var targetage = "auto"
var credential= "fElh75sUiNSBMmhdFX9DJuBnc%2F07gj0bQxeGaklcrxk87%2FX6Sun8JvuaAJmreGCI3h9ok%2FeeWQzNoYnaG%2FEhlMqzqtDVfaanlzVFI4Ho7INXCCihvNgw0lotflJal%2FJfHME4jiJbRzN57i57%2FmptmlYDY0PV9bb%2FnuV0oNjhvd%2BOPXtUBjl%2BMsH6pbT1tNb5i8PE6CVYfTVpcibFJH%2Bn3QGI%2BfQ%2FPz2xQBCUr66NyWXYTLwNckDiHsoOXc7GwICP";
var pooqzone="none";
var drm = "wm";

var recommendListPath = "http://168.188.129.40/recommend/test_vod_info.json";
var request = new XMLHttpRequest();
request.open("GET", recommendListPath)
request.send()

videoURL_storage = localStorage;

request.onreadystatechange = function() 
{
	if(request.readyState == 4 && request.status == 200)
	{
		var response = request.response;
		var jsonResponse = JSON.parse(response);

		for(var i = 0 ; i < jsonResponse.length; i++)
		{
			var videoPath = jsonResponse[i]['videoPath'];
			var videoURL = jsonResponse[i]['videoURL'];
			var contentId = jsonResponse[i]['contentId'];
			var programId = jsonResponse[i]['programId'];
			var title = jsonResponse[i]['title'];

			var splitedVideoURL = videoURL.split("/");
			var m3u8fileName = splitedVideoURL[splitedVideoURL.length-1];
			var tsfileName = m3u8fileName.split(".")[0]+"0.ts";

			var m3u8Request = new XMLHttpRequest();
			m3u8Request.open("GET", videoURL);
			m3u8Request.send();


			var tsRequest = new XMLHttpRequest();
			var tsPath = videoPath.concat("/");
			tsPath = tsPath.concat(tsfileName);

			tsRequest.open("GET", tsPath);
			tsRequest.send();

		
			var recommendBox = document.getElementById('recommendervideo_List');
			var h3Box = document.createElement('h3');
			h3Box.innerHTML = `<a href="/video_player/video_player/videoplayer.html?contentId=`+contentId+`&programId=`+programId+`">`+title+`</a>`;
			recommendBox.appendChild(h3Box);

			videoURL_storage.setItem(contentId, videoURL);
		}
	}
}



