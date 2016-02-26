;(function(){
	var pigeonFile = 'http://s1.qhimg.com/!7bdba3a4/pigeon.js';
	//var pigeonFile = 'http://athena.qhimg.com/js/platform/pigeon.js';	

	var haoDocWrite = window.haoDocWrite ? haoDocWrite : document.write;
	function docWrite (str){
		if(haoDocWrite.apply){
			haoDocWrite.apply(document, arguments);
		}else{
			haoDocWrite(str);
		}
	};
	docWrite('<script type="text/javascript" src="' + pigeonFile + '"><\/script>');

	function pageLogic(){
		PigeonUtils.addEvent(window, 'load', function(){
			Pigeon.reportHeight();


			Pigeon.report('xxx', {});
		});
		//为防止页面先onload再加载完pigeon js
		Pigeon.reportHeight();
	}

	//等待pigeon加载完成之后执行
	var t = setInterval(function(){
		if(window.PigeonUtils){
			pageLogic();
			clearInterval(t);
		}
	}, 20);
})();


//======接受消息示例
Pigeon.receive('xxx', function(data){
	data.height 
	iframe.height = 111;
});
