function test1(){
	console.log("function test 1 called...")
}

function test2(){
	console.log("function test 2 called...")

	var sum = 0;
	for(var i = 0 ; i < 1000000; i++){
		sum += i;
	}
	console.log(sum);
}

function test3(){
	console.log("function test 3 called...")
}

test1();
test2();
test3();