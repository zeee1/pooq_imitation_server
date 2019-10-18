function getData(){
	var indexResponse;
	var indexURL = "http://168.188.129.40:8080/video_player/video_player/index.html"
	var request = new XMLHttpRequest();
	request.open("GET", indexURL)
	request.send()

	request.onreadystatechange = function(){
		if(request.readyState == 4 && request.status == 200){
			var response = request.response;
			indexResponse = response;
		}
	}

	return indexResponse;
}

console.log(getData());