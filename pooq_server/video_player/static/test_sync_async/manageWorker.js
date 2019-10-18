for(var i = 0 ; i < 5; i++)
{
	myworker = new Worker('/static/test_sync_async/workerjob.js');
	myworker.postMessage([100*i, 100*(i+1)]);
}


