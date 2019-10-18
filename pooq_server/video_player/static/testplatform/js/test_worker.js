var i = 0;


self.onmessage = function( e ) {
    getDataByContents(e.data);
};


function getDataByContents(e) {
	var recommend_content = e;
	var videoPath = recommend_content['videoPath'];
	var videoURL = recommend_content['videoURL'];
	var contentId = recommend_content['contentId'];
	var programId = recommend_content['programId'];
	var title = recommend_content['title'];

	var splitedVideoURL = videoURL.split("/");
	var m3u8fileName = splitedVideoURL[splitedVideoURL.length-1];
	var tsfileName = m3u8fileName.split(".")[0]+"0.ts";	
	

	var contentJsonPath = recommend_content['contentInfoURL'];
	var relatedContentInfoURL = recommend_content['relatedContentInfoURL'];
	var recommendContentInfoURL = recommend_content['recommendContentInfoURL'];
	var otherContentInfoURL = recommend_content['otherEpisodeInfoURL'];
	var mostwithContentInfoURL = recommend_content['mostwithContentInfoURL'];
	var bygenreContentInfoURL = recommend_content['bygenreContentInfoURL'];
	var actor1ContentInfoURL = recommend_content['actor1ContentInfoURL'];
	var actor2ContentInfoURL= recommend_content['actor2ContentInfoURL'];
	var clipContentInfoURL = recommend_content['tvclipContentInfoURL'];
	var cdnInfoURL= recommend_content['cdnInfoURL'];

	var contentJsonRequest = new XMLHttpRequest();
	contentJsonRequest.open("GET", contentJsonPath);
	contentJsonRequest.send();

	contentJsonRequest.onreadystatechange = function() 
	{
		if(contentJsonRequest.readyState == 4 && contentJsonRequest.status == 200)
		{
			var response = contentJsonRequest.response;
			var jsonResponse = JSON.parse(response);

			var imageURL = [];
			imageURL.push(jsonResponse['programposterimage'])
			imageURL.push(jsonResponse['programimage'])
			imageURL.push(jsonResponse['programcirlceimage'])

			for (var j = 0 ; j < imageURL.length; j++){
				var imageRequest = new XMLHttpRequest();
				imageRequest.open("GET", "http://"+imageURL[j]) 
				imageRequest.send();
			}
		}
	}

			
	var relatedContentInfoRequest = new XMLHttpRequest();
	relatedContentInfoRequest.open("GET", relatedContentInfoURL);
	relatedContentInfoRequest.send();

	var recommendContentInfoRequest = new XMLHttpRequest();
	recommendContentInfoRequest.open("GET", recommendContentInfoURL);
	recommendContentInfoRequest.send();

	var otherContentInfoRequest = new XMLHttpRequest();
	otherContentInfoRequest.open("GET", otherContentInfoURL);
	otherContentInfoRequest.send();

	otherContentInfoRequest.onreadystatechange = function() 
	{
		if(otherContentInfoRequest.readyState == 4 && otherContentInfoRequest.status == 200)
		{
			var response = otherContentInfoRequest.response;
			var jsonResponse = JSON.parse(response);

			var othercontentlist = jsonResponse['list'];

			for(var j = 0 ; j < 10; j++)
			{
				var imageRequest = new XMLHttpRequest();
				imageRequest.open("GET", "http://"+othercontentlist[j]['image']) 
				imageRequest.send();
			}
		}
	}


	var mostwithContentInfoRequest = new XMLHttpRequest();
	mostwithContentInfoRequest.open("GET", mostwithContentInfoURL);
	mostwithContentInfoRequest.send();

	mostwithContentInfoRequest.onreadystatechange = function()
	{
		if(mostwithContentInfoRequest.readyState == 4 && mostwithContentInfoRequest.status == 200)
		{
			var response = mostwithContentInfoRequest.response;
			var jsonResponse = JSON.parse(response);

			var top_list = jsonResponse['top_list'][0];
			var bottom_list = top_list['bottom_list'];

			for(var j = 0 ; j < 6 ; j++)
			{
				var bottom_content = bottom_list[j];
				var imageRequest = new XMLHttpRequest();
				imageRequest.open("GET", "http://"+bottom_content['bottom_img']);
				imageRequest.send();
			}
		}
	}

	var bygenreContentInfoRequest = new XMLHttpRequest();
	bygenreContentInfoRequest.open("GET", bygenreContentInfoURL);
	bygenreContentInfoRequest.send();

	bygenreContentInfoRequest.onreadystatechange = function()
	{
		if(bygenreContentInfoRequest.readyState == 4 && bygenreContentInfoRequest.status == 200)
		{
			var response = bygenreContentInfoRequest.response;
			var jsonResponse = JSON.parse(response);
			var top_list = jsonResponse['top_list'][0];
			var bottom_list = top_list['bottom_list'];

			for(var j = 0 ; j < 6 ; j++){
				var bottom_content = bottom_list[j];
				var imageRequest = new XMLHttpRequest();
				imageRequest.open("GET", "http://"+bottom_content['bottom_img']);
				imageRequest.send();
			}
		}
	}

	var actor1ContentInfoRequest = new XMLHttpRequest();
	actor1ContentInfoRequest.open("GET", actor1ContentInfoURL);
	actor1ContentInfoRequest.send();

	actor1ContentInfoRequest.onreadystatechange = function(){
		if(actor1ContentInfoRequest.readyState == 4 && actor1ContentInfoRequest.status == 200)
		{
			var response = actor1ContentInfoRequest.response;
			var jsonResponse = JSON.parse(response);
			var top_list = jsonResponse['top_list'][0];
			var bottom_list = top_list['bottom_list'];

			for(var j = 0 ; j < 4 ; j++){
				var bottom_content = bottom_list[j];
				var imageRequest = new XMLHttpRequest();
				imageRequest.open("GET", "http://"+bottom_content['bottom_img']);
				imageRequest.send();
			}
		}
	}

	var actor2ContentInfoRequest = new XMLHttpRequest();
	actor2ContentInfoRequest.open("GET", actor2ContentInfoURL);
	actor2ContentInfoRequest.send();

	actor2ContentInfoRequest.onreadystatechange = function(){
		if(actor2ContentInfoRequest.readyState == 4 && actor2ContentInfoRequest.status == 200)
		{
			var response = actor2ContentInfoRequest.response;
			var jsonResponse = JSON.parse(response);
			var top_list = jsonResponse['top_list'][0];
			var bottom_list = top_list['bottom_list'];

			for(var j = 0 ; j < 4 ; j++){
				var bottom_content = bottom_list[j];
				var imageRequest = new XMLHttpRequest();
				imageRequest.open("GET", "http://"+bottom_content['bottom_img']);
				imageRequest.send();
			}
		}
	}
			
	var clipContentInfoRequest = new XMLHttpRequest();
	clipContentInfoRequest.open("GET", clipContentInfoURL);
	clipContentInfoRequest.send();

	clipContentInfoRequest.onreadystatechange = function(){
		if(clipContentInfoRequest.readyState == 4 && clipContentInfoRequest.status == 200)
		{
			var response = clipContentInfoRequest.response;
			var jsonResponse = JSON.parse(response);
			var clipcontentList = jsonResponse['list'];

			for(var j = 0 ; j < clipcontentList.length; j++)
			{
				var imageRequest = new XMLHttpRequest();
				imageRequest.open("GET", "http://"+clipcontentList[j]['image']) 
				imageRequest.send();
			}
		}
	}

	var cdnInfoRequest = new XMLHttpRequest();
	cdnInfoRequest.open("GET", cdnInfoURL);
	cdnInfoRequest.send();

	var m3u8Request = new XMLHttpRequest();
	m3u8Request.open("GET", videoURL);
	m3u8Request.send();


	var tsRequest = new XMLHttpRequest();
	var tsPath = videoPath.concat("/");
	tsPath = tsPath.concat(tsfileName);

	tsRequest.open("GET", tsPath);
	tsRequest.send();

			//videoURL_storage.setItem(contentId, videoURL);

    /**postMessage( ++i ); 


    setTimeout( function() {
        loop();
    }, 1000 );*/

}