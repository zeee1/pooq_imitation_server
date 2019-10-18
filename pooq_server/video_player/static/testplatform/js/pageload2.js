//
// pageload2.js 
//  -> fetch all necessary objects from local server 168.188.129.40
//
var url_string = window.location.href;
var url = new URL(url_string);
var contentId = url.searchParams.get("contentId");
var programId = url.searchParams.get("programId");

var request = new XMLHttpRequest();

var apikey = "E5F3E0D30947AA5440556471321BB6D9";
var device = "pc";
var partner = "pooq";
var region = "kor"
var targetage = "auto"
var credential= "fElh75sUiNSBMmhdFX9DJuBnc%2F07gj0bQxeGaklcrxk87%2FX6Sun8JvuaAJmreGCI3h9ok%2FeeWQzNoYnaG%2FEhlMqzqtDVfaanlzVFI4Ho7INXCCihvNgw0lotflJal%2FJfHME4jiJbRzN57i57%2FmptmlYDY0PV9bb%2FnuV0oNjhvd%2BOPXtUBjl%2BMsH6pbT1tNb5i8PE6CVYfTVpcibFJH%2Bn3QGI%2BfQ%2FPz2xQBCUr66NyWXYTLwNckDiHsoOXc7GwICP";
var pooqzone="none";
var drm = "wm";

var contentdatainfoURL = "http://168.188.129.40/crawled_objects/"+programId+"/"+contentId+"_contentsInfo.json";

request.open("GET", contentdatainfoURL)
var global_actorList = [];
var contentInfoProcessTimeStart = (new Date).getTime();
request.send()


var contentInfoProcessTimeEnd = 0;
var relatedContentInfoProcessTimeStart = 0;
var relatedContentInfoProcessTimeEnd = 0;
var cdnSearchProcessTimeStart = 0;
var cdnSearchProcessTimeEnd = 0;
var startTime = performance.timing.navigationStart;

request.onreadystatechange = function() {
	if(request.readyState == 4 && request.status == 200)
	{
		var response  = request.response;
		var json_response = JSON.parse(response);

		var vodplayer = document.createElement('div');
		vodplayer.setAttribute('class', 'vod-player');

		var infobar = document.createElement('div');
		infobar.setAttribute('class', 'info-bar gradation-purple');

		var videowrap = document.createElement('div');
		videowrap.setAttribute('class', 'video-wrap');

		vodplayer.appendChild(infobar);
		vodplayer.appendChild(videowrap);
		var gContents = document.getElementById('g-contents');
		gContents.insertBefore(vodplayer, gContents.children[0]);
		
		var programtitle = json_response['programtitle'];
		var programimage = json_response['programimage'];
		var programcircleimage = json_response['programcirlceimage'];
		var programposterimage = json_response['programposterimage'];
		var programstartime = json_response['programstartime'];
		var programendtime = json_response['programendtime'];
		var episodetitle = json_response['episodetitle'];
		var releasedate = json_response['releasedate'];
		var releaseweekday = json_response['releaseweekday'];
		var content_targetage = json_response['targetage'];
		var actors = json_response['actors']['list'];
		var synopsis = json_response['synopsis'];
		var channelname = json_response['channelname'];
		var genretext = json_response['genretext'];

		infobar.innerHTML=
		`<h2>
			<img src = "http://`+programcircleimage+`" alt>`+programtitle+`
		</h2>
		<ul class = "info-type01">
			<li>`+channelname+`</li>
			<li>`+releaseweekday+`</li>
			<li>`+programstartime+` ~ `+programendtime+`</li>
		</ul>
		<ul class = "info-type02">
		</ul>
		</ul>
		`

		videowrap.innerHTML=
		`<div class='left-contents'>
			<video id = 'video' width = "880" height = "495" controls>
			</video>
		</div>
		<div class= 'right-contents'>
			<ul class = 'tag'></ul>
			<h3>
				`+episodetitle+`
				<span>`+releasedate+` (`+releaseweekday+`)</span>
			</h3>
			<strong>`+episodetitle+`</strong>
			<div class='player-scroll' id='player-scroll'>
				<ul class='hash-tag' id='hash-tag'>
				</ul>
				<p class='txt-type01'>
					<span>`+genretext+`</span>
					<em>dotted</em>
				</p>
				<p class='txt-type01' id='actors'>
				</p>
				<p class = 'txt-type02'>
					<span>synopsis</span>
					<span class = 'synopsis'>`+synopsis+`</span>
				</p>
			</div>
		</div>
		`

		actorsP = document.getElementById('actors');

		for(var i = 0 ; i < actors.length; i++)
		{
			var actorName = actors[i].value;
			actorLink = document.createElement('u');
			actorLink.innerHTML = 
			`<a href = "https://pooq.co.kr/search/search.html?searchWord=`+encodeURI(actorName)+`"></a>`;

			actorsP.appendChild(actorLink);
		}

		contentInfoProcessTimeEnd = (new Date).getTime();

//------------------------------------------------------------------------------------------------------------------------
		relatedContentInfoProcessTimeStart = (new Date).getTime();
		var relatedContentURL = "http://168.188.129.40/crawled_objects/"+programId+"/"+contentId+"_relatedContentInfo.json";

		var relatedContentRequest = new XMLHttpRequest();

		relatedContentRequest.open("GET", relatedContentURL);
		relatedContentRequest.send();

		relatedContentRequest.onreadystatechange = function()
		{
			if(relatedContentRequest.readyState == 4 && relatedContentRequest.status == 200)
			{
				var response = relatedContentRequest.response;
				var json_response = JSON.parse(response);
			}
		}

//------------------------------------------------------------------------------------------------------------------------
		var recommendDiv = document.createElement('div');
		recommendDiv.setAttribute('id', 'recommend');

		recommendDiv.innerHTML = 
		`<div class="multi multi-vod" data="[object Object]">
			<div class="title">
				<h2>
					<span style="color: rgb(35,17,42);">Most with contents</span>
				</h2>
			</div>
			<div id = "template-default1" class= "swiper-container swiper-container-horizontal">
			</div>
		</div>
		<div class="multi multi-program" data="[object Object]">
			<div class="title">
				<h2>
					<span style="color: rgb(35,33 ,42);">Recently Popular vod on same genre</span>
				</h2>
			</div>
			<div id = "template-default2" class= "swiper-container swiper-container-horizontal">
			</div>
		</div>`

		var gContents = document.getElementById('g-contents');
		gContents.insertBefore(recommendDiv, gContents.children[2]);

		var recommendURL = "http://168.188.129.40/crawled_objects/"+programId+"/"+contentId+"_recommendContentInfo.json";

		var urlRequest = new XMLHttpRequest();
		urlRequest.open("GET", recommendURL)
		
		var recommendURLlist;

		urlRequest.onreadystatechange = function() {
			if(urlRequest.readyState == 4 && urlRequest.status == 200){
				var urlData = urlRequest.response;
				var json_urlData = JSON.parse(urlData);
				recommendURLlist = json_urlData["list"];
			}
		}

		urlRequest.send()

//------------------------------------------------------------------------------------------------------------------------
		var mostwithURL = "http://168.188.129.40/crawled_objects/"+programId+"/"+contentId+"_mostwithContent.json"

		var mostwithRequest = new XMLHttpRequest();

		mostwithRequest.open("GET", mostwithURL);
		mostwithRequest.send();

		mostwithRequest.onreadystatechange = function(){
			if(mostwithRequest.readyState == 4 && mostwithRequest.status==200){
				var response = mostwithRequest.response;
				var json_response = JSON.parse(response);

				var top_list = json_response['top_list'][0];
				var bottom_list = top_list['bottom_list'];

				

				var template_default1 = document.getElementById('template-default1');
				template_default1.innerHTML = 
				`<div class ='swiper-wrapper'>
					<div class="swiper-slide swiper-slide-active" style="margin-right: 8px;" id="mostwith1">
					</div>
					<div class= "swiper-slide swiper-slide-next" style="margin-right: 8px;" id="mostwith2">
					</div>
					<div class= "swiper-slide" style = "margin-right: 8px;" id="mostwith3">
					</div>
					<div class= "swiper-slide" style = "margin-right: 8px;" id="mostwith4">
					</div>
				</div>
				<div class="swiper-pagination swiper-pagination-clickable swiper-pagination-bullets">
					<span class="swiper-pagination-bullet"></span>
					<span class="swiper-pagination-bullet"></span>
					<span class="swiper-pagination-bullet"></span>
					<span class="swiper-pagination-bullet"></span>
				</div>
				<div class='swiper-button-prev'></div>
				<div class='swiper-button-next swiper-button-disabled'></div>`

				var mostwith = "mostwith";
				var index = 1
				var mostwithIndex = mostwith.concat(String(index));
				for(var i = 1; i <= 6; i++)
				{
					mostwithIndex = mostwith.concat(String(index));
					var mostwithBox = document.getElementById(mostwithIndex);

					var bottom_content = bottom_list[i];

					var bottom_img = bottom_content['bottom_img'];
					var bottom_text1 = bottom_content['bottom_text1'];
					var bottom_text2 = bottom_content['bottom_text2'];
					var bottom_text3 = bottom_content['bottom_text3'];
					var bottom_link = bottom_content['bottom_link'];

					var thumb_vod_div = document.createElement('div');
					thumb_vod_div.setAttribute('class', 'thumb thumb-vod');

					thumb_vod_div.innerHTML = 
					`<a href = "https://pooq.co.kr/player/vod.html?`+bottom_link+`">
						<div class = "thumb-image">
							<img src = "http://`+bottom_img+`" alt class="thumb-img">
							<div>
								<div class = "thumb-top-left"></div>
								<div class = "thumb-bottom-left"></div>
							</div>
						</div>
						<div class = "sub-title">
							<div class = "sub-right">
								<div class = "sigle-line">`+bottom_text1+`</div>
								<span>`+bottom_text2+`</span>
								<span>`+bottom_text3+`</span>
							</div>
						</div>
					</a>`

					mostwithBox.appendChild(thumb_vod_div);

					if(i%5 == 0)
					{
						index+=1;
					}
				}

				console.log("mostwith setting complete : "+String((new Date).getTime()-startTime));
			}
		}

//------------------------------------------------------------------------------------------------------------------------

		var bygenreURL = "http://168.188.129.40/crawled_objects/"+programId+"/"+contentId+"_bygenreContentInfo.json";

		var bygenreRequest = new XMLHttpRequest();

		bygenreRequest.open("GET", bygenreURL);
		bygenreRequest.send();

		bygenreRequest.onreadystatechange = function()
		{
			if(bygenreRequest.readyState == 4 && bygenreRequest.status==200)
			{
				var response = bygenreRequest.response;
				var json_response = JSON.parse(response);

				var top_list = json_response['top_list'][0];
				var bottom_list = top_list['bottom_list'];

				var template_default2 = document.getElementById('template-default2');
				template_default2.innerHTML = 
				`<div class ='swiper-wrapper'>
					<div class="swiper-slide swiper-slide-active" style="margin-right: 8px;" id="bygenre1">
					</div>
					<div class= "swiper-slide swiper-slide-next" style="margin-right: 8px;" id="bygenre2">
					</div>
					<div class= "swiper-slide" style = "margin-right: 8px;" id="bygenre3">
					</div>
					<div class= "swiper-slide" style = "margin-right: 8px;" id="bygenre4">
					</div>
				</div>
				<div class="swiper-pagination swiper-pagination-clickable swiper-pagination-bullets">
					<span class="swiper-pagination-bullet"></span>
					<span class="swiper-pagination-bullet"></span>
					<span class="swiper-pagination-bullet"></span>
					<span class="swiper-pagination-bullet"></span>
				</div>
				<div class='swiper-button-prev'></div>
				<div class='swiper-button-next swiper-button-disabled'></div>`

				var bygenre = "bygenre";
				var index = 1
				var bygenreIndex = bygenre.concat(String(index));
				for(var i = 1; i <= 6; i++)
				{
					bygenreIndex = bygenre.concat(String(index));
					var bygenreBox = document.getElementById(bygenreIndex);

					var bottom_content = bottom_list[i];

					var bottom_img = bottom_content['bottom_img'];
					var bottom_text1 = bottom_content['bottom_text1'];
					var bottom_text2 = bottom_content['bottom_text2'];
					var bottom_text3 = bottom_content['bottom_text3'];
					var bottom_link = bottom_content['bottom_link'];

					var thumb_program_div = document.createElement('div');
					thumb_program_div.setAttribute('class', 'thumb thumb-program');

					thumb_program_div.innerHTML = 
					`<a href = "https://pooq.co.kr/player/vod.html?`+bottom_link+`">
						<div class = "thumb-image">
							<img src = "http://`+bottom_img+`" alt class="thumb-img">
							<div>
								<div class = "thumb-top-left"></div>
								<div class = "thumb-bottom-left"></div>
							</div>
						</div>
						<div class = "sub-title">
							<div class = "sub-right">
								<div class = "sigle-line">`+bottom_text1+`</div>
								<span>`+bottom_text2+`</span>
								<span>`+bottom_text3+`</span>
							</div>
						</div>
					</a>`

					bygenreBox.appendChild(thumb_program_div);

					if(i%5 == 0)
					{
						index+=1;
					}
				}

				console.log("bygenre setting complete : "+String((new Date).getTime()-startTime));
			}
		}
	
//------------------------------------------------------------------------------------------------------------------------
		var actorProgram = document.createElement('div');
		actorProgram.setAttribute('class', 'background-color');
		actorProgram.setAttribute('template-type', 'actorprogram35');
		actorProgram.setAttribute('style', 'background-color: rgb(250, 248, 255)');

		actorProgram.innerHTML = 
		`<div class = 'player-component03' id = "player-component03">
			<div class='left-contents' id = 'left-contents'></div>
			<div class='right-contents' id = 'right-contents'></div>
		</div>
		`
		recommendDiv.appendChild(actorProgram);

		var actorName = actors[0].value;
		var actorscontentURL = "http://168.188.129.40/crawled_objects/"+programId+"/"+contentId+"_actor1ContentInfo.json"

		var actor0ContentRequest = new XMLHttpRequest();
		actor0ContentRequest.open("GET",actorscontentURL);
		actor0ContentRequest.send();

		var listComponent = document.createElement('ul');

		actor0ContentRequest.onreadystatechange = function() 
		{

			if(actor0ContentRequest.readyState == 4 && actor0ContentRequest.status == 200)
			{
				var contentsBox = document.getElementById('left-contents');
				contentsBox.innerHTML = 
				`<div class = 'title'>
					<h2 style = "color: rgb(35,33,42);">
						<span style = "color: rgb(35,33,42);">'for fan of `+actorName+`'</span>
					</h2>
				</div>`;
				//parse response data
				var response = actor0ContentRequest.response;
				var json_response = JSON.parse(response);
				var top_list = json_response['top_list'][0];
				var bottom_list = top_list['bottom_list'];

				for(var j = 0 ; j < 3; j++)
				{
					var liComponent = document.createElement('li');

					var bottom_content = bottom_list[j];
					var bottom_img = bottom_content['bottom_img'];
					var bottom_text1 = bottom_content['bottom_text1'];
					var bottom_text2 = bottom_content['bottom_text2'];
					var bottom_link = bottom_content['bottom_link'];

					liComponent.innerHTML = 
					`<a href = 'https://pooq.co.kr/player/vod.html?`+bottom_link+`'>
						<div class = "vod-img">
							<img src = "http://`+bottom_img+`" alt class= 'thumb'>
						</div>
						<strong>`+bottom_text1+`</strong>
						<span>`+bottom_text2+`</span>
					</a>`;

					listComponent.appendChild(liComponent);
				}
					//create html component

				contentsBox.appendChild(listComponent);
				var playerComponent03 = document.getElementById('player-component03');
				playerComponent03.appendChild(contentsBox);
				console.log("actor0Info setting complete : "+String((new Date).getTime()-startTime));
			}
		}

		var actor1Name = actors[1].value;
		actorscontentURL = "http://168.188.129.40/crawled_objects/"+programId+"/"+contentId+"_actor2ContentInfo.json";

		actor1ContentRequest = new XMLHttpRequest();
		actor1ContentRequest.open("GET",actorscontentURL);
		actor1ContentRequest.send();

		var listComponent = document.createElement('ul');

		actor1ContentRequest.onreadystatechange = function() 
		{
			if(actor1ContentRequest.readyState == 4 && actor1ContentRequest.status == 200)
			{
				var contentsBox = document.getElementById('right-contents');
				contentsBox.innerHTML = 
				`<div class = 'title'>
					<h2 style = "color: rgb(35,33,42);">
						<span style = "color: rgb(35,33,42);">'for fan of `+actor1Name+`'</span>
					</h2>
				</div>`;
				//parse response data
				var response = actor1ContentRequest.response;
				var json_response = JSON.parse(response);
				var top_list = json_response['top_list'][0];
				var bottom_list = top_list['bottom_list'];

				for(var j = 0 ; j < 3; j++)
				{
					var liComponent = document.createElement('li');

					var bottom_content = bottom_list[j];
					var bottom_img = bottom_content['bottom_img'];
					var bottom_text1 = bottom_content['bottom_text1'];
					var bottom_text2 = bottom_content['bottom_text2'];
					var bottom_link = bottom_content['bottom_link'];

					liComponent.innerHTML = 
					`<a href = 'https://pooq.co.kr/player/vod.html?`+bottom_link+`'>
						<div class = "vod-img">
							<img src = "http://`+bottom_img+`" alt class= 'thumb'>
						</div>
						<strong>`+bottom_text1+`</strong>
						<span>`+bottom_text2+`</span>
					</a>`;

					listComponent.appendChild(liComponent);
				}
					//create html component

				contentsBox.appendChild(listComponent);
				var playerComponent03 = document.getElementById('player-component03');
				playerComponent03.appendChild(contentsBox);

			}
		}


		var contentsInfoURL = "http://168.188.129.40/crawled_objects/"+programId+"/"+contentId+"_otherContentInfo.json"

		var otherContentsRequest = new XMLHttpRequest();

		otherContentsRequest.open("GET", contentsInfoURL);
		otherContentsRequest.send();

		otherContentsRequest.onreadystatechange = function()
		{
			if(otherContentsRequest.readyState == 4 && otherContentsRequest.status == 200)
			{
				var playerComponent01 = document.createElement('div');
				playerComponent01.setAttribute('class', 'player-component01');
				playerComponent01.innerHTML = 
				`<div id='all' class='player-list'>
					<h2>All contents</h2>
				</div>`
				var gContents = document.getElementById('g-contents');
				gContents.insertBefore(playerComponent01, gContents.children[1]);

				var playerList = otherContentsRequest.response;
				var json_playerList = JSON.parse(playerList);
				var contentsList = json_playerList['list'];

				var allDiv = document.getElementById('all');

				for(var i= 0 ; i < 10; i++)
				{
					var contentInfo = contentsList[i];

					var episodetitle = contentInfo['episodetitle'];
					var image = contentInfo['image'];
					var episodenumber = contentInfo['episodenumber'];
					var synopsis = contentInfo['synopsis'];
					var episodeactors = contentInfo['episodeactors'];
					var releasedate = contentInfo['releasedate'];
					var content_id = contentInfo['contentid'];
					var program_id = contentInfo['programid'];

					var dlElement = document.createElement('dl');
					dlElement.innerHTML = `
					<dt>
						<a href = "https://pooq.co.kr/player/vod.html?programid=`+program_id+`&contentid=`+content_id+`">
							<div>
								<img src = "http://`+image+`" alt class="thumb">
							</div>
							<div>
							</div>
						</a>
					</dt>
					<dd>
						<a href = "https://pooq.co.kr/player/vod.html?programid=`+program_id+`&contentid=`+content_id+`">
							<strong>`+episodenumber+`-`+episodetitle+`</strong>
							<span>`+releasedate+`</span>
							<em>`+synopsis+`</em>
							<span>`+episodeactors+`</span>
						</a>
					</dd>
					`;

					allDiv.appendChild(dlElement);	
				}

				relatedContentInfoProcessTimeEnd = (new Date).getTime();
			}
		}


		contentsInfoURL = "http://168.188.129.40/crawled_objects/"+programId+"/"+contentId+"_contentsInfo.json";

		var secondContentInfoRequest = new XMLHttpRequest();
		secondContentInfoRequest.open('GET', contentsInfoURL);
		secondContentInfoRequest.send();

		secondContentInfoRequest.onreadystatechange = function()
		{
			if(secondContentInfoRequest.readyState==4 && secondContentInfoRequest.status==200)
			{
				var response = secondContentInfoRequest.response;
				var json_response = JSON.parse(response);

				var posterPath = json_response['programimage'];

				var video = document.getElementById('video');
				video.setAttribute('poster', "http://"+posterPath);
			}
		}

		var prefetched_videoURL = localStorage[contentId]

		if(prefetched_videoURL==undefined)
		{
			var cdnRequestURL ="http://168.188.129.40/crawled_objects/"+programId+"/"+contentId+"_cdnInfo.json"

			var cdnRequest = new XMLHttpRequest();
			cdnRequest.open('GET', cdnRequestURL);
			cdnSearchProcessTimeStart = (new Date).getTime();
			cdnRequest.send();
			cdnRequest.onreadystatechange = function()
			{
				if(cdnRequest.readyState == 4 && cdnRequest.status == 200)
				{
					var response = cdnRequest.response;
					var json_response = JSON.parse(response);
					var cdnURL = json_response['playurl'];

					if(Hls.isSupported()) 
					{
						var video = document.getElementById('video');
						var hls = new Hls();
				
						hls.loadSource(videoURL);
						hls.attachMedia(video);
						hls.on(Hls.Events.MANIFEST_PARSED,function() {
								//video.play();
							cdnSearchProcessTimeEnd = (new Date).getTime();
						});
					}
				}
			}
		}
		else
		{
			cdnSearchProcessTimeStart = (new Date).getTime();
			if(Hls.isSupported()) 
			{
				var video = document.getElementById('video');
				var hls = new Hls();
				
				hls.loadSource(prefetched_videoURL);
				hls.attachMedia(video);
				hls.on(Hls.Events.MANIFEST_PARSED,function() {
							//video.play();
					cdnSearchProcessTimeEnd = (new Date).getTime();
				});
			}
		}			
	}
}



var clipVideoInfoURL = "http://168.188.129.40/crawled_objects/"+programId+"/"+contentId+"_clipContentInfo.json"

clipDataRequest = new XMLHttpRequest();
clipDataRequest.open("GET", clipVideoInfoURL);
clipDataRequest.send();
clipDataRequest.onreadystatechange = function()
{
	if(clipDataRequest.readyState == 4 && clipDataRequest.status == 200)
	{
		var clipVideoInfo = clipDataRequest.response;
		var json_clipVideoInfo = JSON.parse(clipVideoInfo);

		var tvcutDiv = document.createElement('div');
		tvcutDiv.setAttribute('class', 'player-component05 vod-form');
		tvcutDiv.innerHTML = 
		`<div class="title">
			<h2>tv cut</h2>
		</div>`
		var tvcutContainer = document.createElement('div'); 
		tvcutContainer.setAttribute('id', 'tvcut-container')
		tvcutContainer.setAttribute('class', 'swiper-container swiper-container-horizontal')
		tvcutContainer.innerHTML = 
		`<div class ='swiper-wrapper'>
			<div class = "swiper-slide" id="tvcut1"></div>
			<div class = "swiper-slide" id="tvcut2"></div>
			<div class = "swiper-slide" id="tvcut3"></div>
			<div class = "swiper-slide" id="tvcut4"></div>
		</div>
		<div class="swiper-pagination swiper-pagination-clickable swiper-pagination-bullets">
			<span class="swiper-pagination-bullet"></span>
			<span class="swiper-pagination-bullet"></span>
			<span class="swiper-pagination-bullet"></span>
			<span class="swiper-pagination-bullet"></span>
		</div>
		<div class='swiper-button-prev'></div>
		<div class='swiper-button-next swiper-button-disabled'></div>`

		tvcutDiv.appendChild(tvcutContainer);

		var gContents = document.getElementById('g-contents');
		gContents.insertBefore(tvcutDiv, gContents.children[4]);

		var clipVideoInfoList = json_clipVideoInfo['list'];
		var tvcut = "tvcut";
		var index = 1;

		for(var i = 1 ; i <= 5; i++)
		{
			var clipVideoInfo_i = clipVideoInfoList[i];
			var clipid = clipVideoInfo_i['clipid'];
			var cliptitle=  clipVideoInfo_i['cliptitle'];
			var programtitle = clipVideoInfo_i['programtitle'];
			var playtimetext = clipVideoInfo_i['playtimetext'];
			var image = clipVideoInfo_i['image'];

			var thumbclip = document.createElement('div');
			thumbclip.setAttribute('class', 'thumb thumb-clip');
			thumbclip.innerHTML = 
			`<a href = 'https://pooq.co.kr/clip.html?clipid="`+clipid+`"'>
				<div class = 'thumb-image'>
					<img src = 'http://`+image+`' alt class= 'thumb-img'>
					<div class='thumb-bottom-right time'>
					`+playtimetext+`	
					</div>
				</div>
				<div class='sub-title'>
					<div class='sub-right'>
						<strong class='multi-line'>"`+cliptitle+`"</strong>
						<span>`+programtitle+`</span>
					</div>
				</div>
			</a>`;

			var tvcutBox = document.getElementById(tvcut.concat(String(index)));
			tvcutBox.appendChild(thumbclip);

			if(i%5 == 0){
				index +=1;
			}

		}

	}
}

