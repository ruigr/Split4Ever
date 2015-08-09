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
		'utils': new Utils.module("utils"), 
		'pubsub': new PubSub.module("pubsub"),
		'uishell': new UiShell.module("uishell"),
		'header': new Header.module("header"), 
		'footer': new Footer.module("footer"),
		'item': new Item.module("item"), 
		'api': new Api.module("api"), 
		'browse': new Browse.module('browse'),
		'itemui': new ItemUI.module("itemui") , 
		'browseui': new BrowseUI.module("browseui")
	};

	//sort out dependencies
	for(modName in modulesMap){
		if(modulesMap.hasOwnProperty(modName)){
			var module = modulesMap[modName];
			for(depName in modulesMap){
				if(depName != modName && modulesMap.hasOwnProperty(depName) && 
					-1 < module.configMap.requires.indexOf(depName)){
					var dependency = modulesMap[depName];
					module.configMap.modules[depName]=dependency;
					console.log('added module dependency ' + depName + ' to module ' + module.name);
				}
			}
		}
	}

	var initModule = function ( $container ) {
		modulesMap['uishell'].initModule( $container );
	};


  return { initModule: initModule };

}());
