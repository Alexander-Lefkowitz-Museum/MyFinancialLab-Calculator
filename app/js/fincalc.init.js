window.byId = function (id) {return document.getElementById(id)}
window.byQuery = function (query) {return document.querySelector(query)}
if (typeof window.console !== "object") {
  window.console = {log:function(){}};
}
fincalc = window.flow || {
	
	data: null,
	assetRoot: '../app/assets/',
	dataPath: 'data/',	
	init: function()
    {
	  var self = this;

    // load XML data for package
	  self.urlVars();
	  dataPath = self.dataPath + "tutorial_" + self.currentTutorial + ".xml";
	  $.ajax({
        type: 'GET',
        dataType: 'XML',
        url: dataPath,
        success: function(data)
        {
          fincalc.data = data;
          self.cacheImages();
       	  fincalc.ui.init();
		    fincalc.events.init();
		  //console.log(fincalc.data);
      
        },
        error: function(data, status, error)
        {
          //console.log(status + ': ' + error);
        }
      });
    },
    cacheImages: function () {
      var self = this, n=1,
          imgCacheElm = byId("imgCache");

      self.stepsLength = $(self.data).find('step').length;

      while(n<=self.stepsLength) {
        imgCacheElm.innerHTML +=
          "<img src='app/assets/tutorial_" + self.currentTutorial + "/"+n+"_start.png' />\n"+
          "<img src='app/assets/tutorial_" + self.currentTutorial + "/"+n+"_end.png' />\n";
          n++;
      }
    },
    urlVars: function () {
      //This function parses out the key/value pairs and stores them in the object compTia.urlValues
      var varString = location.search.slice(1),
        splitVars = varString.split("&"),keyValuePair,key,val,n=0;
        this.urlValues={};
      while (keyValuePair = splitVars[n]) {
        this.urlValues[keyValuePair.split("=")[0]] = keyValuePair.split("=")[1] || "";
        n++;
      }
      
      this.currentTutorial = ((this.urlValues || {tut:0}).tut) || 1;

    }
}

$(function()
{
  
  fincalc.init();
  
});