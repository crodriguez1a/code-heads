```
<body>
	In my life, I used the following web search engines:<br/>
	<a href="//www.yahoo.com">Yahoo!</a><br/>
	<a href="//www.altavista.com">AltaVista</a><br/>
	<a href="//www.google.com">Google</a><br/>
</body>
```

```
function registerHandlers() {
  var as = document.getElementsByTagName('a');
  for (var i = 0; i < as.length; i++) {
    as[i].onclick = function() {
      alert(i);
      return false;
    }
  }
}
registerHandlers();
```
```
function registerHandlers() {
  var as = document.getElementsByTagName('a');
  for (var i = 0; i < as.length; i++) {
    as[i].onclick = (function(i) {
      return function() {
        alert(i);
      }
      return false;
    }(i))
  }
}

registerHandlers();
```