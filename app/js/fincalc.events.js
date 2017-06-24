fincalc.events = window.fincalc.events || {
	
	init: function()
    {
		var self = this;
		self.bind();
		if(typeof(window.ontouchstart) != 'undefined'){
			$('#container #footer #controls #audio-controls a').css({'display':"none"})
		}
    },

	bind: function()
	{
		var self = this,$vidWrap;
		var adjustSizes = function () {
			document.body.style.height = window.innerHeight + "px";

		}

		//When the site resizes, all kinds of stuff need to be changes
		adjustSizes();
		window.onresize = function() {
			adjustSizes();
			if(window.navigator.userAgent.toLowerCase().indexOf("chrome") !== -1 ||
			window.navigator.userAgent.toLowerCase().indexOf("trident") !== -1) {
				fincalc.ui.adjustVideoSize();
			}
		}

		$('.next').unbind('click').click(function(e){
			e.preventDefault();
			self.nextStep();
		});
		
		$('.prev').unbind('click').click(function(e){
			e.preventDefault();
			self.previousStep();
		});

		$(document).unbind('keyup').on("keyup",function(e){
			if(e.keyCode == 37) {
				if(fincalc.ui.tog) {
					fincalc.ui.toggleSlideout()
				} else if($('.prev').is(":visible")) {
					self.previousStep();
				}
			} else if(e.keyCode == 39 && $('.next').is(":visible")) {
				self.nextStep();
			}

		}).unbind('keydown').on("keydown",function(e) {
			 if (e.keyCode == 38) {
				if(fincalc.ui.tog) {
					e.preventDefault();
					if (document.activeElement.tabIndex <= fincalc.ui.sideStartIndex) {
						fincalc.ui.$sideContent.last().focus();
						byId("smContent").scrollTop = 9999;

					} else {
						if($("[tabindex="+(document.activeElement.tabIndex-1)+"]").length) {
							$("[tabindex="+(document.activeElement.tabIndex-1)+"]").focus()
						} else if ($("[tabindex="+(document.activeElement.tabIndex-2)+"]").length) {
							$("[tabindex="+(document.activeElement.tabIndex-2)+"]").focus()
						}
					}
					
				}
			} else if (e.keyCode == 40) {
				if(fincalc.ui.tog) {
					e.preventDefault();
					if(document.activeElement.tabIndex >= fincalc.ui.sideContentLength+fincalc.ui.sideStartIndex-1) {
						fincalc.ui.$sideContent.first().focus();
						byId("smContent").scrollTop = 0;
					} else {
						if($("[tabindex="+(document.activeElement.tabIndex+1)+"]").length) {
							$("[tabindex="+(document.activeElement.tabIndex+1)+"]").focus()
						} else if ($("[tabindex="+(document.activeElement.tabIndex+2)+"]").length) {
							$("[tabindex="+(document.activeElement.tabIndex+2)+"]").focus()
						}
					}
					
				}
			} else if(document.activeElement.tabIndex === -1
		  			   || document.activeElement === document.body) {
		  			e.preventDefault();
		  			document.activeElement = $("[tabindex=1]").focus()[0];
		  		}
		});		

		var orientChang = function () {
			var orientation = window.orientation,
				landscapeMode = byId("landscapeMode");

			if (Math.abs(orientation) !== 90){
				landscapeMode.style.display = "none";
		    } else {
		    	landscapeMode.style.display = "block";
		    }
		}
		orientChang();
		window.onorientationchange = function(){
			orientChang();
		}
	},
	
	rebind: function(){
		var self = this;
		
		
	},
	
	nextStep: function()
	{
		var self = this,$next;
		if (!self.stepDelay) {
			self.clear();
			self.stepDelay = 1;
			$(".prev").show();
			setTimeout(function(){self.stepDelay = 0},500);

			if(fincalc.ui.part !== null && fincalc.ui.runningPart===0 &&
				(fincalc.ui.currentStep) == fincalc.ui.partBIndex-1)	{
				fincalc.ui.gotoPart(2);
			}else if (fincalc.ui.part !== null && fincalc.ui.runningPart===0 && fincalc.ui.currentStep === 0){
				fincalc.ui.gotoPart(1);
			} else {
				fincalc.ui.runningPart = 0;
				$next = fincalc.ui.currentStep + 1;
						
				if($next <= fincalc.ui.stepLength && $next > 0){
					fincalc.ui.currentStep = $next;	
				}else{
					$('#audio, .vidWrap').hide();
					fincalc.ui.currentStep = 0;	
				}
				
				fincalc.ui.tutorial();
			}

		}
				
	},
	
	previousStep: function()
	{
		
		var self = this,$prev;
		if (!self.stepDelay) {
			self.clear();
			self.stepDelay = 1;
			setTimeout(function(){self.stepDelay = 0},500);
			byId("audio").pause();
			byId("audio").src = "";
			byId("audio").load();
			if(fincalc.ui.part !== null && fincalc.ui.runningPart===0 && (fincalc.ui.currentStep == fincalc.ui.partBIndex))	{
				fincalc.ui.runningPart = 1;
				fincalc.ui.currentStep = fincalc.ui.partBIndex-1;
				fincalc.ui.gotoPart(2);
			}else if (fincalc.ui.part !== null && fincalc.ui.runningPart===0 && fincalc.ui.currentStep === 1){
				fincalc.ui.runningPart = 1;
				fincalc.ui.currentStep = 0;
				fincalc.ui.gotoPart(1);
			} else {
				if(fincalc.ui.runningPart) {
					$prev = fincalc.ui.currentStep;
				} else {
					$prev = fincalc.ui.currentStep - 1;
				}
				fincalc.ui.runningPart = 0;

				if($prev <= fincalc.ui.stepLength && $prev > 0){
					fincalc.ui.currentStep = $prev;	
				}else{
					fincalc.ui.currentStep = 0;	
				}
			
				fincalc.ui.tutorial();
			}
		}

	},
	
	clear:function()
	{
		$('#scenario-title,#scenario-instruction').remove();
		$('#mp4').empty();
		$('#ogv').attr('src','');
		$('#instructions').empty();
		self.paused = 0;
	}
		
}