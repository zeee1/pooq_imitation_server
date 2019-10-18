self.onmessage = function( e ) {
    sum(e.data);
};

function sum(e){
	var sum = 0;
	var startNumber = e[0];
	var endNumber = e[1];

	for(var i =  startNumber; i < endNumber; i++){
		sum += i;
	}

	console.log(sum);
}