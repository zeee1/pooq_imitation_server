var recommendListPath = "http://168.188.129.40/recommend/test_prefetch_data.json";
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

		for(var i = 0 ; i < jsonResponse.length ; i++)
		{	
			myworker = new Worker('/static/testplatform/js/test_worker.js');
			myworker.postMessage(jsonResponse[i]);

			var recommend_content = jsonResponse[i];
			var contentId = recommend_content['contentId'];
			var programId = recommend_content['programId'];
			var title = recommend_content['title'];

			var recommendBox = document.getElementById('recommendervideo_List');
			var h3Box = document.createElement('h3');
			h3Box.innerHTML = `<a href="/video_player/video_player/videoplayer.html?contentId=`+contentId+`&programId=`+programId+`">`+title+`</a>`;
			recommendBox.appendChild(h3Box);

			myworker.onmessage = function( e ) {
          		if (e.data == "end"){
          			myworker.terminate();
          			myworker = null;
          		}
        	};
		}
	}
}