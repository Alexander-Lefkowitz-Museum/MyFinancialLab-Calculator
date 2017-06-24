fincalc.ui = window.fincalc.ui || {
	scenario: null,
	steps: null,
	currentStep:0,
	stepLength:null,
	menuElm:byId("slideMenu"),
	toggleElm:byId("menuToggle"),
	runningPart:0,
	tabindexes:12,
	init: function()
    {
		//self.toc();
		this.mobile();
		this.setSceneData();
		this.mediaControls.init();	
    },
	mobile: function(){
		var self = this;
		var device;
		if (navigator.userAgent.match(/tablet/i)) {
		    device = "tablet";
		} else if (navigator.userAgent.match(/ipad/i)) {
			device = "iPad";
		} else if (navigator.userAgent.match(/iphone/i) || navigator.userAgent.match(/ipod/i)){
			device = "iPhone";
		} else if (navigator.userAgent.match(/mobile/i)) {
		    device = "phone";
		} else if (navigator.userAgent.match(/android/i)) {
		    device = "tablet";
		} else {
		    device = "desktop";
		}

		self.iOS = (navigator.userAgent.match(/ipad/i) || navigator.userAgent.match(/iphone/i) || navigator.userAgent.match(/ipod/i));

		document.body.className +=" "+device;

		byId("menuToggle").style.right = "-68px";
		if (device === "iPad") {
			self.slideScrollWidth = 346;
			self.menuToggleLeft = 324;
		}
		//  else if (device === "tablet") {
		// 	byId("menuToggle").style.right = "-60px";
		// 	self.slideScrollWidth = "44.5%";
		// 	self.menuToggleLeft = "325px";
		// }
		 else if (device === "iPhone") {
			self.slideScrollWidth = 768;
			self.menuToggleLeft = 749;
		} else if (device === "phone") {
			self.slideScrollWidth = 768;
			self.menuToggleLeft = 749;
		}
		//  else {
		// 	self.slideScrollWidth = "40%";
		// 	self.menuToggleLeft = "287px";
		// }
		self.device = device;
		if(self.iOS){
			// if(window.navigator.standalone) {
			// 	byId("footer").style.height = "212px";
			// 	byId("footer").style.maxHeight = "212px";
			// }
			setTimeout(function () {
				var audioElm = document.getElementById("audio");
				audioElm.pause();
				audioElm.currentTime = 0;
				audioElm.muted = true;
				self.mediaControls.audioMuted = true;
			},250);
			
		}
	},
	toggleSlideout: function () {
		var self = this,scrollHeight = parseInt($("#smContent").css("height")),
			contentHeight = $("#smContent").height(),scrollBarHeight,
			menuElm = byId("smContent"),position,fullPosition,scrollTopMax = 0,barOffset,
			toggleElm = byId("menuToggle"),activeContent,barScroll = 0;

		var slideScrollWidth = self.slideScrollWidth || (768 - ($("#poster, video","#content").filter(":visible").width() || 300) - 80);
		var menuToggleLeft = self.menuToggleLeft || slideScrollWidth-21;
		if (!self.stepDelay) {
			self.stepDelay = 1;

		if(!self.tog) {
			self.tog = 1;
			if (self.device.toString().toLowerCase().indexOf("phone") !== -1) {
				byId("menuToggle").style.right = "-31px";
			}
			$("#smContent").show();
			$("#slideMenu").show().animate({"width":slideScrollWidth+"px"},200).css("left","0px");
			$(".slideScroll").animate({"left":menuToggleLeft+"px"},200);

			setTimeout(function() {

				byId("menuToggle").children[0].setAttribute("aria-label","Close Slide Out Menu");
				if (!menuElm.scrollTopMax) {
					scrollTopMax = menuElm.scrollHeight - parseInt($(menuElm).css("height"));
				}
				if ($("#smContent").height()<= contentHeight) {
					byId("slideScrollBar").style.display = "block";
					scrollTopMax = (scrollTopMax || menuElm.scrollTopMax);
					menuElm.onscroll = function () {
						if(!barScroll) {
							position = (menuElm.scrollTop/scrollTopMax);
							fullPosition = parseInt(position*scrollHeight-(position*100));
						if (menuElm.scrollTop < 2) { fullPosition = 0 }
							else if (fullPosition > scrollHeight) { fullPosition = scrollHeight}
							byId("slideScrollBar").style.top = 
							  fullPosition +"px";
						}
					}
					if(self.device === "desktop") {
						$(".slideScroll")
							.on("mousedown",function (e) {
								e.preventDefault();
								barScroll = 1;
								barOffset = ~~$(this).offset().top;
								scrollBarHeight = $("#smContent").height()-103;
								$("#container").on("mousemove", function (e) {
									position = (e.pageY-barOffset-44);
									if (position<0) {position = 0} else
									if (position > scrollBarHeight) {position = scrollBarHeight}
									var barPosition = position;
									byId("slideScrollBar").style.top = barPosition+"px";
									menuElm.scrollTop = (barPosition/scrollBarHeight)*scrollTopMax;
									
								})
						})
						$("#container").on("mouseup",function () {
							barScroll = 0;
							$("#container").off("mousemove");
						});
					}
				} else {
					byId("slideScrollBar").style.display = "none";
				}
			},500);
			
			byId("content").className += " shiftContent";
			setTimeout(function(){
				//$("#smContent h2").first().focus();
			}, 500);
			if(self.currentStep == 0){
				//$("video").addClass("adjustLeft");
			}
			
		} else {
			self.tog = 0;
			byId("menuToggle").children[0].setAttribute("aria-label","Open Slide Out Menu");
			$("#slideMenu").animate({"width":"0"});
			setTimeout(function(){$("#smContent").hide();},900)
			$(".slideScroll").animate({"left":"-24px"});

			//byId("content").style.textAlign = "center";
			byId("content").className = byId("content").className.replace(/ shiftContent/g,"");

		if (self.device === "iPad") {
			byId("menuToggle").style.right = "-68px";
		} else if (self.device === "tablet") {
			byId("menuToggle").style.right = "-60px";
		} else if (self.device === "iPhone") {
			byId("menuToggle").style.right = "-68px";
		} else if (self.device === "phone") {
			byId("menuToggle").style.right = "-68px";
		} else {
			byId("menuToggle").style.right = "-69px";
		}
		
		
			byId("slideMenu").onscroll = function () {};
		}
		setTimeout(function() {
			self.stepDelay = 0;
		},1200);
}
	},
	doOnlyOnce: function (func, args) {
		var self = this, funcSrc, i;

		if(typeof func === "function") {
			funcSrc = func.toString();

			if(typeof self.funcTrack !== "object") {
				self.funcTrack = [];
			}
			for (i = 0, funcTrackLength = self.funcTrack.length; i < funcTrackLength; i++) {
				if (self.funcTrack[i] === funcSrc) {
					return false;
				}
			}
			self.funcTrack.push(funcSrc);
			if (args && args.length) {
				if (typeof args === "object") {
					func.apply(self, args);
				} else {
					func(args);
				}
			} else {
				func();
			}
		}
	},
	setSidePanelText: function () {
		var self = this, n=1,
			$steps = $(self.steps),partText,
			scenario = self.scenario.text(),
			$panelElm = $("#smContent"),
			panelElm = $panelElm[0],
			sceneText = scenario.slice(0,scenario.indexOf('<div id="tapToContinue" tabindex="7">'));
			scenario = (scenario.trim)?scenario.trim() : scenario.trimLeft().trimRight();

		panelElm.innerHTML = '<h2 onclick="fincalc.ui.gotoStep(0)">Scenario</h2>\n' +sceneText;
		if (self.part !== null) {

			panelElm.innerHTML += '<br><h2 onclick="fincalc.ui.gotoPart(1)">Part 1</h2>\n' + self.part.eq(0).text().replace("<strong>Part 1.</strong> ","");
			
			$steps.each(function (n) {
				if(n>=self.partBIndex-1) {
					self.doOnlyOnce(function () {
						panelElm.innerHTML += '<h2 onclick="fincalc.ui.gotoPart(2)">Part 2</h2>\n' + self.part.eq(1).text().replace("<strong>Part 2.</strong> ","");
					})
					panelElm.innerHTML += '<h2 onclick="fincalc.ui.gotoStep('+(n+1)+')">Part 2 Step '+(n+1-self.partBIndex+1)+'</h2>\n';
				} else {
					panelElm.innerHTML += '<h2 onclick="fincalc.ui.gotoStep('+(n+1)+')">Part 1 Step '+(n+1)+'</h2>\n';
				}
				panelElm.innerHTML += $(this).text().trim()+"\n";
			})
		} else {
			$steps.each(function (n) {
				self.tabindexes++;
				panelElm.innerHTML += '<h2 title="Step '+(n+1)+'"  onclick="fincalc.ui.gotoStep('+(n+1)+')">Step '+(n+1)+'</h2>\n';
				panelElm.innerHTML += $(this).text().trim()+"\n";
			})
		}
		self.sideStartIndex = self.tabindexes;
		self.$sideContent = $("h2, p, li","#smContent").not(":empty");
		self.$sideContent.each(function(){
			this.tabIndex = self.tabindexes++;
			this.setAttribute("aria-label",this.textContent.replace("↓","down"));
		})
		self.sideContentLength = self.$sideContent.length;
	},
	setSceneData: function()
	{
		var self = this;
		data = $(fincalc.data);
		
		//Sets Scenario
		self.scenario = data.find('scenario');
		//stes parts for dual part tutorials
		self.part = data.find('part');
		if (self.part.length) {
			self.partBIndex = ~~self.part[1].getAttribute("step");
		} else {
			self.part = null;
		}

		//Sets Scene Data
		self.steps = data.find('step');

		//Sets Scene Length
		self.stepLength = self.steps.length;
		/* Add a tap to start message */
		self.setSidePanelText();
		 if(typeof(window.ontouchstart) !== 'undefined') {
			byId("content").className = "";
		 	self.tutorial();
		 } else {
			byId("content").className = "";
			$("#tapToContinue").remove();
			self.tutorial();
		 }
	},

	isTutBPart: function () {
		if (fincalc.urlValues && fincalc.urlValues.tut) {
			return fincalc.urlValues.tut.toLowerCase().indexOf("b") !== -1;
		} else {
			return false;
		}
	},
	tutorial: function()
	{
		var self = this;
		if(self.currentStep == 0){
			self.loadScenario();
			var title = { title: $(fincalc.data).find('tutorial').attr('title') };
			var context = title;
			var source   = $("#header-title").html();
			var template = Handlebars.compile(source);
			$('#calc-title').empty().append(template(context));
			$('#audio').addClass("forceHide");
			byId("poster").className = "forceHide";
		}else{
			byId("poster").className = ""
			self.loadStep();
		}
		
	},
	gotoPart: function (n) {
		var self = this;
		self.runningPart = 1;
		$('#content-container').removeClass().addClass('scenario');
		$(".prev").show();
		var content = { content: self.part.eq(n-1).text() };
		if(n>1) {
			self.currentStep = self.partBIndex-1;
		} else {
			self.currentStep = 0;
		}
		var context = content;
		var source   = $("#scenario").html();
		var template = Handlebars.compile(source);
		$('#content').html(template(context)+'<img id="poster" class="forceHide" />');
		self.audioLoad(n);
		$('#scenario-title').empty();
		$("#instructions").html("<p> </p>")
		$('#footer #navigation .step').text('PART '+n);	
	},
	loadScenario: function()
	{
		
		var self = this;
		
		self.audioLoad();
		
		$('#content-container').removeClass().addClass('scenario');
		
		var content = { content: self.scenario.text() };
		
		var context = content;
		var source   = $("#scenario").html();
		var template = Handlebars.compile(source);
		$('#content').append(template(context));
		
		self.loadFooter();
		
		return false;
		
	},
	gotoStep: function(step) {
		fincalc.events.clear();
		this.currentStep = step;
		$("#poster").removeClass("forceHide");
		fincalc.ui.tutorial();
	},
	loadStep: function()
	{
		
		var self = this;
		$("#poster").removeClass("forceHide");
		self.audioLoad();
			
		if(self.currentStep <= self.stepLength){
			$('#content-container').removeClass().addClass('step');
			self.loadFooter();
			return false;
		}else{
			self.currentStep = 0;
			self.loadScenario();
			
			return false;
		}
				
	},
	
	loadFooter:function() {
		
		var self = this;
		if(self.currentStep == 0){
			
			$('.prev').hide();
			$('.next').show();
			$('#footer #navigation .step').text('Start');
			$('#instructions').empty();
		}else{

			$('.prev').show();
			if (self.part !== null) {
				
				if(self.currentStep >= self.partBIndex){
					$('#footer #navigation .step').text('STEP '+(self.currentStep-self.partBIndex+1));
				} else {
					$('#footer #navigation .step').text('STEP '+self.currentStep);
				}
			} else {
				$('#footer #navigation .step').text('STEP '+self.currentStep);
			}
			

			if(self.currentStep < self.stepLength){
				$('.next').show();
			}else{
				$('.next').hide();
			}

			objStep = self.currentStep - 1;
			
			$step = self.steps[objStep];
			
			var content = { instruction: $($step).text() };
			var context = content;
			var source   = $("#instruction").html();
			var template = Handlebars.compile(source);
			$('#instructions').html("<div tabindex='5'>"+template(context)+"</div>");
			
		}
		fincalc.events.bind();
			
	},
	adjustVideoSize: function () {
		var $vidWrap = $("#content .vidWrap"),
			vidHeight = $vidWrap.find("video").height() || 0;
		if(vidHeight && fincalc.ui.iOS) {
			$vidWrap.find("video").css("width",vidHeight/1.62+"px");
		}

    },
	audioLoad: function(part)
	{
		var self = this,audio,audioEnd,thisCache,videoPlaying,tryAgainMs = 500,tryAgain = 0,
			contentElm = byId("content"),$vidWrap,vidStyles,
			ogv_mp4 = function () {return !!document.createElement("video").canPlayType("video/mp4")?"mp4":"ogv"},
			iPhone = (self.device === "iPhone"), vid_aud = iPhone? "audio":"video";

		
		$(".vidWrap, video").remove();
		if(typeof part == "number") {
			contentElm.innerHTML =
				'<'+vid_aud+' webkit-playsinline id="audio" src="app/assets/tutorial_'+fincalc.currentTutorial+'/part'+part+(iPhone || fincalc.ui.device == "desktop" ?'.mp3':'.mp4')+'"></'+vid_aud+'>'+ contentElm.innerHTML;
				
		}else {
			if(self.currentStep == 0){

				contentElm.innerHTML =
					(self.device !== "iPhone" ?'<video ':'<audio ')+ 'webkit-playsinline class="" id="audio" src="app/assets/tutorial_'+fincalc.currentTutorial+'/s.'+(fincalc.ui.device.toLowerCase() !== "ipad" ? 'mp3':'mp4')+'"></'+vid_aud+'>'+ contentElm.innerHTML;
					byId("poster").setAttribute('src','app/assets/tutorial_'+fincalc.currentTutorial+'/1_end.png');
			} else {
				contentElm.innerHTML =
					'<div class="vidWrap"><video webkit-playsinline id="audio" style="visibility:hidden" src="app/assets/tutorial_'+fincalc.currentTutorial+'/'+self.currentStep+'.'+ogv_mp4()+'">'+
					'</'+vid_aud+'><div class="mask1"></div><div class="mask2"></div></div>'+ contentElm.innerHTML;

				if (self.tog) {
					byId("content").className += " shiftContent";
				}

				byId("poster").setAttribute('src','app/assets/tutorial_'+fincalc.currentTutorial+'/'+self.currentStep+'_start.png');
			}
		}
		tryAgain = function () {
			//if the video is failing due to bad meta data or a server hiccup simply try the video again.
			if (videoPlaying === 0 && audio.readyState < 2) {

				audio.load();
				audio.play();
				//if the problem doesn't get fixed the first time, add half a second to the delay
				//this is due to give the video more and more time to keep trying
				tryAgainMs += 500;
				if(tryAgainMs > 3000) {
					setTimeout(tryAgain,tryAgainMs);
				}
			}
		}

		audio = byId('audio');		
		audio.load();

		setTimeout(function(){audio.play()},1) //give events time to load before playing


		$(audio)
		.one("loadedmetadata",
			function (e) {
				audioEnd = this.seekable.end(0);

			})
		.one("loadstart", function () {
			videoPlaying = 0;
			window.setTimeout(tryAgain,1250);
		})
		.one("canplay", function () {
			videoPlaying = 1;
		})
		.on('play',
			function(){
			$(this).removeClass("forceHide")
				if(self.currentStep == 0){
					
					$('#poster').addClass("forceHide")
						.attr('src','app/assets/tutorial_'+fincalc.currentTutorial+'/1_end.png');
				}
			})
		.on('timeupdate',
			function(){
				self.adjustVideoSize();
				if (this.currentTime > (audioEnd-0.3)) {

					audioEnd = 99.0;
					if(self.currentStep == 0){
						$('#poster').addClass("forceHide").attr('src','app/assets/tutorial_'+fincalc.currentTutorial+'/1_end.png');
					} else {
						$('#poster').attr('src','app/assets/tutorial_'+fincalc.currentTutorial+'/'+self.currentStep+'_end.png')
						if(typeof part != "number" || self.runningPart != 0) {
							$('#poster').removeClass("forceHide");
						}
					}
				} else if (this.currentTime < 1 && this.currentTime > 0.5) {
					this.style.visibility = "";
					$('#poster').addClass("forceHide");
						
					
				}

			})
		.on("ended", function (e) {
			if (self.currentStep){
				$('#poster').attr('src','app/assets/tutorial_'+fincalc.currentTutorial+'/'+self.currentStep+'_end.png').removeClass("forceHide");
			}
	
			audioEnd = this.seekable.end(0);
				setTimeout(function(){$(this).addClass("forceHide")},500);

			 });
		
		if(this.mediaControls.audioMuted == true){
			audio.muted = true;	
		}
		if(self.iOS && (self.currentStep == 0 || fincalc.ui.runningPart)) {
			self.playIos =1;
			$("#tapToContinue").remove();
			setTimeout(function(){

				byId("content").innerHTML +='<div id="tapToContinue" tabindex="7"><h2>Play <span> </span></h2></div>';
			$("#tapToContinue").css({'display':"block"})
				.click(function () {
					//alert(byId("audio").src);
					//byId("audio").src = "app/assets/tutorial_"+fincalc.currentTutorial+"/s."+(iPhone?"mp3":"mp4");
					byId("audio").className = byId("audio").className.replace("forceHide","");
					byId("audio").load();
					byId("audio").play();
			 		$(this).remove();
		 	})},1000)
		}
		
	},
	mediaControls: {
		muteAudio: function (elm) {
			var elm = elm || byId("audio"),
				position = elm.currentTime,
				end = elm.duration,
				movePosition = function () {
					setTimeout(function() {
						elm.currentTime += 0.30;
						if (elm.currentTime != end && self.audioMuted) {
							movePosition();
						}
					}, 250);
				}
			if(!self.muteTog) {
				$('#audio-controls a').addClass("off");
				movePosition();
				self.muteTog = 1;
				elm.pause();
				self.audioMuted = true;
			} else {
				$('#audio-controls a').removeClass("off");
				self.muteTog = 0;
				elm.play();
				self.audioMuted = false;
			}
		},
		audioPaused: false,
		audioMuted: false,
		replayFunc:function () {
			var self = this,poster,audioCache,
				audio = function(){return byId("audio")};

				audioCache = audio()
			if(fincalc.ui.currentStep != 0 && !fincalc.ui.runningPart){

				audioCache.style.display = "inline-block";
			}
			
			audioCache.load();	
			audioCache.play();
			$('#audio-controls a').removeClass("off");
			self.muteTog = 0;
			self.audioMuted = false;
		},
		muteFunc:function () {
			var self = this,
				audio = function(){
						return byId("audio")
					};
			if (fincalc.ui.iOS && fincalc.ui.currentStep === 0) {
				self.muteAudio()
			} else {
				if (self.audioMuted == false) 
				{
				  audio().muted = true;
				  self.audioMuted = true;
				  $('#audio-controls a').addClass('off');
				} else {
				  audio().muted = false;
				  self.audioMuted = false;
				  $('#audio-controls a').removeClass('off');
				}
			}
		  },
		bind: function()
		{
		  var self = this, audioCache, poster,thisCache;
		  var audio = function(){return byId("audio")};

		  $(document).on("keypress", function (e) {
		  	
		  	//console.log("tabindex: "+ document.activeElement.tabIndex+ " :: \nActive Element: ", document.activeElement);

		  		if(e.which == 109) { //key M
		  			self.muteFunc(e)
		  		} else if (e.which == 114) { //key R
		  			self.replayFunc(e)
		  		} else if (e.which == 115 || e.which == 83) { //key S
		  			//fincalc.ui.toggleSlideout()
		  		} else if (e.which == 112) { //key P
		  			if(!self.paused) {
		  				self.paused = 1;
		  				self.audioPaused = 1;
		  				audio().pause();
		  			} else {
		  				self.paused = 0;
		  				self.audioPaused = 0;
		  				audio().play();
		  			}
		  		} else if (e.which == 13 || e.which == 32) {
		  			e.preventDefault();
		  			thisCache = document.activeElement;
					if (thisCache.getAttribute("onclick")) {
						eval(thisCache.getAttribute("onclick"));
					} else if (thisCache.getAttribute("tabaction")) {
						eval(thisCache.getAttribute("tabaction"));
					}
					console.log(e.which)
		  		}
		  		
		  });

		},
		init: function()
		{
		  this.bind();
		}
	}		
}