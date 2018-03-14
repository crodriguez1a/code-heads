1. Write a function called double which takes in an array of numbers and returns a new array after doubling every item in that array. double([1,2,3]) -> [2,4,6]

	```es6
	function double(arr=[1,2,3]) {
	  return arr.map((i) => i*2);
	}
	```
2. Write a function called add which takes in an array and returns the result of adding up every item in the array. add([1,2,3]) -> 6

	```es6
	function add(arr=[1,2,3]) {
	  return arr.reduce((a,b) => a+b);
	}
	```

[Credit: Tyler Mcginnis](https://tylermcginnis.com/imperative-vs-declarative-programming/)