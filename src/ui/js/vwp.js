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
	var modules = [ 
	new Header.module("header"), new Footer.module("footer")
	, new Item.module("item"), new Api.module("api"), new Browse.module('browse')
	//, new browse.module("browse"), 
	//, new Data.module("data")  
	];

	var initModule = function ( $container ) {
		uishell.initModule( $container , modules );
	};


  return { initModule: initModule };

}());
