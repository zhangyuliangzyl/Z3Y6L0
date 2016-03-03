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
		for (var i in src) {
			des[i] = map(des[i], src[i], i, des, src);
			if(des[i] === undefined) delete des[i];	//如果返回undefined，尝试删掉这个属性
		}
		return des;
	};
	var createEvents = function(obj){
		var events = {};

		mix(obj, {
			on: function(evtType, handler){
				events[evtType] = events[evtType] || [];
				events[evtType].push(handler);
			},
			fire: function(evtType, args){
				args = args || {};
				mix(args, {
					type: evtType,
					target: obj,
					preventDefault: function(){
						args.returnValue = false;//IE中取消事件的默认行为,mix为false如果已经存在preventDefault()即标准DOM中，则不定义这个属性
					}
				});
				var handlers = events[evtType] || [];
				for(var i = 0; i < handlers.length; i++){
					handlers[i](args);
				}
				return args.returnValue !== false
			}
		});

		return obj;
	};
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
	function getHeight (doc){
		doc = doc || document;

		var win = doc.defaultView || doc.parentWindow,
			mode = doc.compatMode,
			root = doc.documentElement,
			h = win.innerHeight || 0,
			scrollH = root.scrollHeight,
			offsetH;
       
		if (mode != 'CSS1Compat') { // Quirks
			root = doc.body;
			scrollH = root.scrollHeight;
		}
     
		if (mode && window.navigator.userAgent.toLowerCase().indexOf('opera') < 0) {
			h = root.clientHeight;
		}
		scrollH = Math.max(scrollH, h);
		offsetH = ((document.body == null) ? 0 : document.body.offsetHeight) || document.documentElement.offsetHeight;		
		return scrollH == h ? offsetH : scrollH;
	};

	/*XPC*/
	var usePM = (typeof window.postMessage !== 'undefined');
	function XPC(options) {
		var defaultOpts = {
			isParent : parent == window,
			iframeName : 'XPC_IFRAME'
		};
		this.options = mix(options || {}, defaultOpts, false);
		this._initialize();
	};

	mix(XPC.prototype, {
		_initialize : function() {
			var me = this;
			createEvents(this);

			function callback(msg) {
				var data = {};
				try {
					data = JSON.parse(msg);
				} catch(e) {}
				me.fire('message', data);
			};
          
			if(usePM){         
				addEvent(window, 'message', function(e){
					callback(e.data);
				});
			}else{

				var lastName = window.name;
				setInterval(function(){
					if(window.name != lastName && window.name != ''){
						lastName = window.name;
						callback(lastName);
					}
				},50);
			}
		},
        
		send : function(data) {
			var opts = this.options,
				win = opts.win || (opts.isParent ? window.frames[opts.iframeName] : parent);
			if(!win) throw new Error('XPC', "can not find window!");
			var newData = {
				data : data,
				ts : (+(new Date)).toString(36)
			}
			newData = JSON.stringify(newData);
			if(usePM){
				win.postMessage(newData, '*');
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
		_init : function(){
			var self = this,
				options = this.options;
			createEvents(this);
            
			this.xpc.on('message', function(e){
				var d = e.data;
                /*检测是否执行，*/
				if(!d || !d.pigeon){
					return;
				}
				if(!options.validVersion || d.v == VERSION){
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
                        //在子iframe环境中原生绑定句柄(待定)
                        if(!options.isParent){
                        	addEvent(eventTarget,eventType,handler)}
                        /*消息传递机制中绑定*/
                        eventTarget.on(eventType, handler);
                        hasBinded[eventType]=true;
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