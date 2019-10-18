var recommendListPath = "http://168.188.129.40/recommend/prefetch_contents.json";
var request = new XMLHttpRequest();
request.open("GET", recommendListPath)
request.send()

request.onreadystatechange = function() 
{
	if(request.readyState == 4 && request.status == 200)
	{
		var response = request.response;
		var jsonResponse = JSON.parse(response);

		for(var i = 0 ; i < jsonResponse.length ; i++)
		{
			var recommend_content = jsonResponse[i];
			console.log(recommend_content);

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

			var relatedContentInfoRequest = new XMLHttpRequest();
			relatedContentInfoRequest.open("GET", relatedContentInfoURL);
			relatedContentInfoRequest.send();

			var recommendContentInfoRequest = new XMLHttpRequest();
			recommendContentInfoRequest.open("GET", recommendContentInfoURL);
			recommendContentInfoRequest.send();

			var otherContentInfoRequest = new XMLHttpRequest();
			otherContentInfoRequest.open("GET", otherContentInfoURL);
			otherContentInfoRequest.send();

			var mostwithContentInfoRequest = new XMLHttpRequest();
			mostwithContentInfoRequest.open("GET", mostwithContentInfoURL);
			mostwithContentInfoRequest.send();

			var bygenreContentInfoRequest = new XMLHttpRequest();
			bygenreContentInfoRequest.open("GET", bygenreContentInfoURL);
			bygenreContentInfoRequest.send();

			var actor1ContentInfoRequest = new XMLHttpRequest();
			actor1ContentInfoRequest.open("GET", actor1ContentInfoURL);
			actor1ContentInfoRequest.send();

			var actor2ContentInfoRequest = new XMLHttpRequest();
			actor2ContentInfoRequest.open("GET", actor2ContentInfoURL);
			actor2ContentInfoRequest.send();

			var clipContentInfoRequest = new XMLHttpRequest();
			clipContentInfoRequest.open("GET", clipContentInfoURL);
			clipContentInfoRequest.send();

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

			var thumbnailURL = recommend_content['thumbnailURL'];

			var contentsInfoTN = thumbnailURL['contentsInfo_thumbnail']
			var actor1TN = thumbnailURL['actor1_thumbnail'];
			var actor2TN = thumbnailURL['actor2_thumbnail'];

			var mostwithTN = thumbnailURL['mostwith_thumbnail'];
			var bygenreTN = thumbnailURL['bygenre_thumbnail'];
			var clipTN = thumbnailURL['clipcontents_thumbnail'];
			var otherContentTN = thumbnailURL['othercontents_thumbnail'];

			for(var j = 0; j < contentsInfoTN.length; j++){
				var imageRequest = new XMLHttpRequest();
				imageRequest.open("GET", "http://"+contentsInfoTN[j]);
				imageRequest.send();
			}

			for(var j = 0 ; j < 4; i++){
				var imageRequest = new XMLHttpRequest();
				imageRequest.open("GET", "http://"+actor1TN[j]);
				imageRequest.send();

				var imageRequest2 = new XMLHttpRequest();
				imageRequest2.open("GET", "http://"+actor2TN[j]);
				imageRequest2.send();
			}

			for(var j = 0; j < 6; i++){
				var imageRequest = new XMLHttpRequest();
				imageRequest.open("GET", "http://"+mostwithTN[j]);
				imageRequest.send();

				var imageRequest2 = new XMLHttpRequest();
				imageRequest2.open("GET", "http://"+bygenreTN[j]);
				imageRequest2.send();

				var imageRequest3 = new XMLHttpRequest();
				imageRequest3.open("GET", "http://"+clipTN[j]);
				imageRequest3.send();
			}

			for(var j = 0; j < 10 ; i++){
				var imageRequest = new XMLHttpRequest();
				imageRequest.open("GET", "http://"+otherContentTN[j]);
				imageRequest.send();
			}

			break;
		}
	}
}	