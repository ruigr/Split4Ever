/*
 * spa.js
 * Root namespace module
*/

/*jslint           browser : true,   continue : true,
  devel  : true,    indent : 2,       maxerr  : 50,
  newcap : true,     nomen : true,   plusplus : true,
  regexp : true,    sloppy : true,       vars : false,
  white  : true
*/
/*global $, spa */

var vwp = (function () {

	//load modules
	var modulesMap = {

		'utils': new Utils.module("utils") 
		,'constants': new Constants.module("constants")
		,'pubsub': new PubSub.module("pubsub")
		,'uishell': new UiShell.module("uishell")
		,'header': new Header.module("header") 
		,'footer': new Footer.module("footer")
		,'api': new Api.module("api")
		,'browser': new Browser.module('browser')
		,'itemctrl': new ItemCtrl.module('itemctrl')
		,'itemmodel': new ItemModel.module("itemmodel")
		,'itemview': new ItemView.module("itemview"),
		'itemformwidget': new ItemFormWidget.module("itemformwidget"),
		'itemformevents': new ItemFormEvents.module("itemformevents"),
		'itemformloader': new ItemFormLoader.module("itemformloader"),
		/*
		
		,'wait4me': new Wait4Me.module("wait4me")
		'itemrender': new ItemRender.module("itemrender"),
		'imagerender': new ImageRender.module("imagerender"),
		'itemuievents': new ItemUiEvents.module("itemuievents")
		*/
	};

	//set up modules dependencies
	for(modName in modulesMap){

		if(modulesMap.hasOwnProperty(modName)){

			//for every module
			var module = modulesMap[modName];
			for(depName in modulesMap){
				if(depName != modName && modulesMap.hasOwnProperty(depName) && 
					-1 < module.configMap.requires.indexOf(depName)){
					//if module named depName is required by module named modName
					//add a depName pointer to modules map in modName
					var dependency = modulesMap[depName];
					module.configMap.modules[depName]=dependency;
					console.log('added module dependency ' + depName + ' to module ' + module.name);
				}
			}

			module.initModule();
			console.log('called initModule on module ' + module.name);
		}
	}

	var init = function ( $container ) {
		// init uishell
		var context = { container: $container };
		modulesMap['uishell'].setContext( context );
		modulesMap['uishell'].show();
	};


  return { init: init };

}());
