from django.urls import path

from . import views

urlpatterns = [
	path('video_player/index.html', views.index, name='index'),
	path('video_player/vod.html', views.vod, name='vod'),
	path('video_player/videoplayer.html', views.simple_video_player, name='simple_video_player'),
	path('video_player/test_sync_async.html', views.test_sync_async, name = 'test_sync_async')
]