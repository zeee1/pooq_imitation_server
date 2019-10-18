from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.
def index(request):
	return render(request, 'video_player/index.html')

def vod(request):
	contentId = request.GET['contentId']
	return render(request, 'video_player/vod.html', {'contentId':contentId})

def simple_video_player(request):
	contentId = request.GET['contentId']
	programId = request.GET['programId']
	tiny_dict = [
	{"contentId":"M_1002831100332100000.1","programId":"M_1002831100000100000" ,"url":"http://168.188.129.40/vod/liveAlone/media.m3u8"},
	{"contentId":"K02_LS-20190224105217-01-000.2", "programId":"K02_T2005-0230_2", "url":"http://168.188.129.40/vod/returnOfSuperman/media.m3u8"}, 
	{"contentId":"S01_22000093809.1", "programId": "S01_V0000330171", "url":"http://168.188.129.40/vod/runningman/media.m3u8"},
	{"contentId":"S01_22000100576.1", "programId":"S01_V0000010171", "url":"http://168.188.129.40/vod/animalfarm/media.m3u8"},
	{"contentId":"C2301_EP20049880.1", "programId":"C2301_PR10010392", "url":"http://168.188.129.40/vod/brothers/media.m3u8"},
	{"contentId":"K02_PS-2019064432-01-000.1", "programId":"K02_T2001-0932", "url":"http://168.188.129.40/vod/happytogether/media.m3u8"},
	{"contentId":"C2501_WPG2170115DA00090.1","programId":"C2501_WPG2170115D","url":"http://168.188.129.40/vod/cityfisherman/media.m3u8"},
	{"contentId":"M_1004422100024100000.1","programId":"M_1004422100000100000","url":"http://168.188.129.40/vod/mylittletelevision/media.m3u8"},
	{"contentId":"S01_22000102340.1", "programId":"S01_V2000010698", "url":"http://168.188.129.40/vod/alleyDiningRoom/media.m3u8"},
	{"contentId":"K02_PS-2019064355-01-000.1", "programId":"K02_T2010-1328", "url":"http://168.188.129.40/vod/hello/media.m3u8"}]

	for i in tiny_dict:
		if contentId == i['contentId'] and programId == i['programId']:
			videoURL = i['url']
			break
	
	params = {'contentId':contentId, 'programId':programId,'video_url':videoURL}

	return render(request, 'video_player/videoplayer.html', params)

def test_sync_async(request):
	return render(request, 'video_player/test_sync_async.html')