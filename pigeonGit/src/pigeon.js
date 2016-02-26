;(function(){
    var onI= 1,recI= 1;
    var callI=0;
    var winI=0;
    var xpcOn=0;
    var hasBinded={};
    var VERSION = '1.0.0';
	var PigeonUtils = PigeonUtils || {};

	var JSON;JSON||(JSON={}),function(){function f(a){return a<10?"0"+a:a}function quote(a){return escapable.lastIndex=0,escapable.test(a)?'"'+a.replace(escapable,function(a){var b=meta[a];return typeof b=="string"?b:"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+a+'"'}function str(a,b){var c,d,e,f,g=gap,h,i=b[a];i&&typeof i=="object"&&typeof i.toJSON=="function"&&(i=i.toJSON(a)),typeof rep=="function"&&(i=rep.call(b,a,i));switch(typeof i){case"string":return quote(i);case"number":return isFinite(i)?String(i):"null";case"boolean":case"null":return String(i);case"object":if(!i)return"null";gap+=indent,h=[];if(Object.prototype.toString.apply(i)==="[object Array]"){f=i.length;for(c=0;c<f;c+=1)h[c]=str(c,i)||"null";return e=h.length===0?"[]":gap?"[\n"+gap+h.join(",\n"+gap)+"\n"+g+"]":"["+h.join(",")+"]",gap=g,e}if(rep&&typeof rep=="object"){f=rep.length;for(c=0;c<f;c+=1)typeof rep[c]=="string"&&(d=rep[c],e=str(d,i),e&&h.push(quote(d)+(gap?": ":":")+e))}else for(d in i)Object.prototype.hasOwnProperty.call(i,d)&&(e=str(d,i),e&&h.push(quote(d)+(gap?": ":":")+e));return e=h.length===0?"{}":gap?"{\n"+gap+h.join(",\n"+gap)+"\n"+g+"}":"{"+h.join(",")+"}",gap=g,e}}"use strict",typeof Date.prototype.toJSON!="function"&&(Date.prototype.toJSON=function(a){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z":null},String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(a){return this.valueOf()});var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},rep;typeof JSON.stringify!="function"&&(JSON.stringify=function(a,b,c){var d;gap="",indent="";if(typeof c=="number")for(d=0;d<c;d+=1)indent+=" ";else typeof c=="string"&&(indent=c);rep=b;if(!b||typeof b=="function"||typeof b=="object"&&typeof b.length=="number")return str("",{"":a});throw new Error("JSON.stringify")}),typeof JSON.parse!="function"&&(JSON.parse=function(text,reviver){function walk(a,b){var c,d,e=a[b];if(e&&typeof e=="object")for(c in e)Object.prototype.hasOwnProperty.call(e,c)&&(d=walk(e,c),d!==undefined?e[c]=d:delete e[c]);return reviver.call(a,b,e)}var j;text=String(text),cx.lastIndex=0,cx.test(text)&&(text=text.replace(cx,function(a){return"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)}));if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,"")))return j=eval("("+text+")"),typeof reviver=="function"?walk({"":j},""):j;throw new SyntaxError("JSON.parse")})}();
	var mix = function(des, src, map){
		//map==true 相同键下，优先返回src的值
		//map==fase 仙童的键下，优先返回des的值
		map = map || function(d, s, i){
			//这里要加一个des[i]，是因为要照顾一些不可枚举的属性
			if(!(des[i] || (i in des))){
				return s;
			}
			return d;
		}
		if(map === true){	//override
			map = function(d,s){
				return s;
			}
		}
		//遍历src，对每一个key，如果返回的键对应的值为undefine，则删除这个key
		for (var i in src) {
			des[i] = map(des[i], src[i], i, des, src);
			if(des[i] === undefined) delete des[i];	//如果返回undefined，尝试删掉这个属性
		}
		return des;
	};
    //给对象增加绑定事件的属性，on增加，fire执行，
    //返回：对象
	var createEvents = function(obj){
		var events = {};

		mix(obj, {
            /*绑定事件和事件句柄*/
			on: function(evtType, handler){
				events[evtType] = events[evtType] || [];
				events[evtType].push(handler);
			},
            /*触发事件，
            参数1：事件类型，
            参数2：事件处理函数的参数，此参数为自动添加，连同调用时添加的参数一起塞给句柄
            返回：是否returnValue!==false,也就是这个是不是标准DOM浏览器。
            */
			fire: function(evtType, args){
				args = args || {};
				mix(args, {
					type: evtType,
					target: obj,
					preventDefault: function(){
						args.returnValue = false;//IE中取消事件的默认行为,mix为false如果已经存在preventDefault()即标准DOM中，则不定义这个属性
					}
				});
				var handlers = events[evtType] || [];//如果存在事件handlers了，就返回这个handlers数组，否则返回一个空数组
				for(var i = 0; i < handlers.length; i++){
					handlers[i](args);
				}
               // console.log(evtType+"句柄数量"+"  "+handlers.length);
				return args.returnValue !== false
			}
		});

		return obj;
	};
    /*函数：就是个兼容了IE和标准DOM的事件绑定函数
    *参数1：要绑定事件的对象
    * 参数2：绑定的事件类型
    * 参数3：事件的处理函数*/
	var addEvent = function(obj, type, fn) {
		if (obj.addEventListener)
			obj.addEventListener( type, fn, false );
		else if (obj.attachEvent) {
			obj["e"+type+fn] = fn;
			obj.attachEvent( "on"+type, function() {				
				obj["e"+type+fn].call(obj, window.event);
			} );
		}
	};
    /*获取文档高度
    * 参数：文档对象，若为空，则取当前文档
    * */
	function getHeight (doc){
		doc = doc || document;

		var win = doc.defaultView || doc.parentWindow,/*DOM2级视图添加defaultView属性，在IE中是parentWindow(Opera也支持)，
		                                                保存一个指针，指向拥有给定文档的窗口（或框架）*/
			mode = doc.compatMode,/*IE6开始添加的区分渲染页面的模式是标准的还是混杂的，检测浏览器的兼容模式，通过compatMode属性，判断浏览器采用了
			                        哪种渲染模式，在标准模式下document.compatMode=='CSS1Compat'，在混杂模式下document.compatMode=='BackCompat'*/
			root = doc.documentElement,//传入的文档对象的root层
			h = win.innerHeight || 0,//父级窗口视口的高度
			scrollH = root.scrollHeight,//传入的文档对象高度
			offsetH;
        /*如果是在混杂模式下
        * 传入文档root层为文档的body对象，重新赋值文档对象的高度
        * */
		if (mode != 'CSS1Compat') { // Quirks
			root = doc.body;
			scrollH = root.scrollHeight;
		}
        /*兼容opera浏览器
        *
        * */
		if (mode && window.navigator.userAgent.toLowerCase().indexOf('opera') < 0) {
			h = root.clientHeight;
		}
        /*父级的高度取文档高度和视口高度中大的那个*/
		scrollH = Math.max(scrollH, h);
        //当前js所在文档的offsetHeight
		offsetH = ((document.body == null) ? 0 : document.body.offsetHeight) || document.documentElement.offsetHeight;		
        /*传入的文档对象高度等于父级高度时返回本文档的offsetHeight,否则返回本文档对象的文档高度*/
		return scrollH == h ? offsetH : scrollH;
	};

	/*XPC*/
	var usePM = (typeof window.postMessage !== 'undefined');//是否可以使用PostMessage
	function XPC(options) {
		var defaultOpts = {
			isParent : parent == window,/*如果window.parent的值为window则自己为最顶级的document
			                              否则如果返回的是一个document对象，则是作为一个子级iframe。、
			                               故此字段用于判断是子frame还是父级窗口*/
			iframeName : 'XPC_IFRAME'
		};
		this.options = mix(options || {}, defaultOpts, false);
		this._initialize();
	};

	mix(XPC.prototype, {
        /*XPC对象原型中增加的初始化函数*/
		_initialize : function() {
			var me = this;
			createEvents(this);
            /*初始化中定义了回调函数
            * 参数：message句柄的参数，msg
            * 结果：执行message函数
            * */
			function callback(msg) {
				var data = {};
				try {
					data = JSON.parse(msg);
				} catch(e) {}

				me.fire('message', data);

                //console.log('callback message '+callI++);
			};
            /*如果使用postMessage函数
            * 给window对象加message事件
            * 事件处理：执行message处理函数，window的message事件是传入e.用e.data作为参数，调用XPC的message句柄
            * */
			if(usePM){
                /*message事件是特么的系统自带的事件，收到postMessage的时候触发，妈的老子想了那么久原来是自带的，简直    66666
                * 事件对象包含，
                * data:作为postMessage()第一个参数传入的字符串数据
                * origin:发送消息的文档所在的域
                * source:发送消息的文档的window代理对象，这个代理对象主要用于在发送上一条消息的窗口中调用postMessage()方法
                * 如果发送消息的窗口来自同一个域，那这个对象就是window.
                * */
				addEvent(window, 'message', function(e){

                    //console.log('window add message '+winI++);
                   //    console.log(e);
					callback(e.data);
				});
			}else{
                /*如果不使用PostMessage使用IE6 7的window.name进行值传递 */
				var lastName = window.name;
				setInterval(function(){
					if(window.name != lastName && window.name != ''){
						lastName = window.name;
						callback(lastName);
					}
				},50);
			}
		},
        /*XPC对象原型中的send函数
        *参数，要发送的数据
        * 如果接收数据的对象是父级则发给自己，否则发给option.iframeName中规定的子窗口
        *
        */
		send : function(data) {
            /*win接收消息的窗口*/
			var opts = this.options,
				win = opts.win || (opts.isParent ? window.frames[opts.iframeName] : parent);

			if(!win) throw new Error('XPC', "can not find window!");

			var newData = {
				data : data,
				ts : (+(new Date)).toString(36)
			}

			newData = JSON.stringify(newData);

			if(usePM){
				win.postMessage(newData, '*');//不限制消息接收范围
			} else {
				win.name = newData;
			}
		}
	}, true);

	/*Pigeon 信使*/
	var frameHeight = 0;		
	function Pigeon(options){
		var opts = {
			iframeName : 'pigeon-iframe',
			autoReport : false,
			validVersion : false			
		}
		this.options = mix(opts, options, true);
		this.xpc = new XPC(this.options);
		this._t = 0;
		this._init();
	}
	mix(Pigeon.prototype, {
        /*Pigeon原型初始化*/
		_init : function(){
			var self = this,
				options = this.options;
			createEvents(this);
            /*给xpc增加自定义事件message的触发函数
            *事件处理函数：
            *如果e没有data，或data.pigeon为false，不做任何处理
            * 如果版本合法，则触发d.type事件的函数，参数为d.data
            * 也就是说message是一个总的入口，具体触发了什么事件还要在参数中确定
            * */
			this.xpc.on('message', function(e){
				var d = e.data;
                /*检测是否执行，*/
				if(!d || !d.pigeon){
					return;
				}
				if(!options.validVersion || d.v == VERSION){
                    /*console.log("xpc.on   message "+xpcOn++);
                    console.log(e);*/
                    /*这里自执行接收到消息后的处理函数*/
					self.fire(d.type, {
						data : d.data
	 				});
				}
			});

			if(options.autoReport){
				this.reportHeightChange();
			}

			this.receive = this.on;
		},
        /*报告函数
        * 参数1：报告事件类型
        * 参数2：报告的数据
        * 调用send，发送版本，报告类型，数据，pigeon布尔值
        * */
		report : function(type, data){
			var xpc = this.xpc;
			try{
				xpc.send({
					v : VERSION,
					type : type || 'message',
					data : data || null,
					pigeon : true
				});
			}catch(e){}		
		},
        /*
        * 参数1：发送事件类型
        * 参数2：触发事件的对象
        * 参数3：通信类型
        * */
        reportEvent:function(eventType,eventTarget,type){
            var xpc=this.xpc;
            var j=0;
            var opts = this.options,
                win = opts.isParent ? "father" : opts.iframeName;
            /*防止重复绑定*/
            if(typeof hasBinded=='undefined')var hasBinded={};
            if(!hasBinded[eventType]){
                addEvent(eventTarget,eventType,function(){
                    var i=0;
                    if(!eventType){
                        throw new Error('in the function reportEvent', "you should add an event type as second argument in the function reportEvent()");
                    }
                    setTimeout(function(){
                        try{
                            xpc.send({
                                v:VERSION,
                                type:type || 'triggerEvent',
                                data: {
                                    eventOrigin:eventTarget.toString(),
                                    eventType: eventType,
                                    from:win
                                } || null,
                                pigeon:true
                            });
                        }catch(e){console.log(e)}
                    },300);
                })
            }

        },
        /*
        * 参数1：接收事件方要触发的事件类型(str)
        * 参数2：接收事件方触发事件的目标节点(dom)
        * 参数3：事件处理函数(function)
        * 参数4：事件发送方触发的事件类型,默认与接收方要触发的事件类型一致(str)
        * 参数5：通信消息类型，默认为triggerEvent(str)
        * */
         receiveEvent:function(eventType,eventTarget,handler,OriginType,type){
            var type=type||'triggerEvent';
             var options = this.options;
            var originType=OriginType||eventType;
            this.receive(type,function(data){
                var eventObj=data.data;
                //console.log(eventObj);
                if(originType==eventObj.eventType){
                    /*防止重复绑定*/
                    if(!hasBinded[eventType]){
                        /*本原生绑定*/
                        createEvents(eventTarget);
                        if(!options.isParent){addEvent(eventTarget,eventType,handler)}
                        /*消息传递机制中绑定*/
                        eventTarget.on(eventType, handler);
                        hasBinded[eventType]=true;
                      //  console.log('接收绑定次数'+'  '+recI++ +typeof hasBinded)

                    }
                    eventTarget.fire(eventType,data);
                }
            })
        }
        ,
        /*定义高度变化函数
        *参数：高度
        * 功能：如果不传入高度，则自动获取，如果与之前高度不同，则取新值
        * */
		reportHeight : function(height){
			var options = this.options;
			if(!height){
				height = getHeight();
			}			
			if(height != frameHeight){
                var heightData={
                    height:height,
                    iframeName:options.iframeName
                };
				this.report('heightChange',heightData);
				frameHeight = height;
			}
		},
        /*自动报告高度变化
        * 参数：是否报告，如果不传入参数活传入true类型，则报告，频率50ms报告一次
        * */
		reportHeightChange : function(onoff){
			onoff = typeof onoff == 'undefined' ? true : onoff;
			var self = this,
				t = this._t;
			if(onoff){
				t = setInterval(function(){					
						self.reportHeight();					
				}, 50);
			} else {
				clearInterval(t);
			}
		}
	});
	mix(Pigeon, new Pigeon());
    /*创建Pigeon对象*/
	window.Pigeon = Pigeon;
	window.PigeonUtils = {
		addEvent : addEvent
	}
})();