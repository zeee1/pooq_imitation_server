jarvis.Sort = class
{
    constructor(){}
    
    static binSearch(len,finder)
	{
	   	var upper = len-1;
	    var lower = 0;
	    while (lower <= upper) 
	    {
	        var mid = Math.floor((upper + lower) / 2);
	        var result = finder(mid);
	        if (result > 0) 
	        {
	         	lower = mid + 1;
	        }
	      	else if (result < 0)
	      	{
	         	upper = mid - 1;
	      	}
	      	else 
	      	{
	      		return mid
	      	}
	   	}
	   	return -1;
	}

	static bubble(arr,compare)
	{
	   	var len = arr.length;
	   	for (var i = len-1; i>=0; --i)
	   	{
	     	for(var j = 1; j<=i; ++j)
	     	{
	       		var result = compare(arr[j-1],arr[j]); //arr[j-1]>arr[j]
	       		if(result)
	       		{
	           		var temp = arr[j-1];
	           		arr[j-1] = arr[j];
	           		arr[j] = temp;
	        	}
	     	}
	    }
   		return arr;
	}

	static selection (arr,compare)
	{
  		var minIdx, temp, 
      	len = arr.length;
  		for(var i = 0; i < len; ++i)
  		{
    		minIdx = i;
    		for(var  j = i+1; j<len; j++)
    		{
       			var result = compare(arr[minIdx],arr[j]); //arr[minIdx]>arr[j]
       			if(result)
       			{
          			minIdx = j;
       			}
    		}
    		temp = arr[i];
    		arr[i] = arr[minIdx];
    		arr[minIdx] = temp;
  		}
  		return arr;
	}

	static insertion (arr,toInsert,compare)
	{
	  	var i, len = arr.length, el, j;
		for(i = 1; i<len; ++i)
		{
	    	el = arr[i];
	    	j = i;
	    	var result = compare(arr[j-1],toInsert); //arr[j-1]>toInsert
	    	while(j>0 && result)
	    	{
	      		arr[j] = arr[j-1];
	      		j--;
	   		}
	   		arr[j] = el;
	  	}
		return arr;
	}


	static merge (arr, compare)
	{
	   	var len = arr.length;
	   	if(len <2) return arr;
	   	var mid = Math.floor(len/2),
	    left = arr.slice(0,mid),
	    right =arr.slice(mid);
	   	return jarvis.Sort.mergeAction(jarvis.Sort.merge(left,compare),jarvis.Sort.merge(right,compare),compare);

	}

	static mergeAction (left, right, compare)
	{
		var resultA = [],
  		lLen = left.length,
  		rLen = right.length,
  		l = 0,
  		r = 0;
		while(l < lLen && r < rLen)
		{
 			var result = compare(right[r],left[l]); //left[l] < right[r]
 			if(result)
 			{
   				resultA.push(left[l++]);
 			}
 			else
 			{
   				resultA.push(right[r++]);
			}
		}  
		return resultA.concat(left.slice(l)).concat(right.slice(r));
	}

	static quick (arr, compare, left = 0, right = arr.length-1)
	{
	   	var len = arr.length, 
	   	pivot,
	   	partitionIndex;
		if(left < right){
	    	pivot = right;
	    	partitionIndex = jarvis.Sort.partition(arr, pivot, left, right , compare);
	    	jarvis.Sort.quick(arr, compare, left, partitionIndex - 1);
	   		jarvis.Sort.quick(arr, compare, partitionIndex + 1, right);
	  	}
	  	return arr;
	}

	static partition (arr, pivot, left, right, compare)
	{
	   	var pivotValue = arr[pivot],
	    partitionIndex = left;

	   	for(var i = left; i < right; ++i)
	   	{

	   		var result = compare(pivotValue,arr[i]); //arr[i] < pivotValue
	    	if(result)
	    	{
	      		jarvis.Sort.swap(arr, i, partitionIndex);
	      		partitionIndex++;
	    	}
	  	}
	  	jarvis.Sort.swap(arr, right, partitionIndex);
	  	return partitionIndex;
	}


	static heap(arr,compare)
	{
  		var len = arr.length,
      	end = len-1;
		jarvis.Sort.heapify(arr, len, compare);
  		while(end > 0)
  		{
   			jarvis.Sort.swap(arr, end--, 0);
   			jarvis.Sort.siftDown(arr, 0, end, compare);
  		}
  		return arr;
	}

	static heapify (arr, len, compare)
	{
   		var mid = Math.floor((len-2)/2);
   		while(mid >= 0)
   		{
    		jarvis.Sort.siftDown(arr, mid--, len-1, compare);    
  		}
	}

	static siftDown (arr, start, end, compare)
	{
   		var root = start,
       	child = root*2 + 1,
       	toSwap = root;
   		while(child <= end)
   		{
      		var result = compare(arr[child],arr[toSwap]); // arr[toSwap] < arr[child]
      		if(result)
      		{
        		jarvis.Sort.swap(arr, toSwap, child);
      		}

      		result = compare(arr[child+1],arr[toSwap]); // arr[toSwap] < arr[child+1]
      		if(child+1 <= end && result)
      		{
        		jarvis.Sort.swap(arr, toSwap, child+1)
      		}
      		if(toSwap != root)
      		{
         		jarvis.Sort.swap(arr, root, toSwap);
         		root = toSwap;
      		}
      		else
      		{
         		return; 
      		}
      		toSwap = root;
      		child = root*2+1
  		}
	}

	static swap (arr, i, j)
	{
   		var temp = arr[i];
   		arr[i] = arr[j];
   		arr[j] = temp;
	}
}