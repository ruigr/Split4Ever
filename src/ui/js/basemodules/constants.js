
var Constants = (function() {

	var module = function(name){
		common.Mod.call(this,name);
		this.configMap.events = []; 
		this.configMap.requires = [];
	};

	module.prototype = Object.create(common.Mod.prototype);
	module.prototype.constructor = module;

	module.prototype.constant = {
			nameMaxLength: 128,
			amountMax: 999999,
			notesMaxLength: 1024,
			newCategoryToken: '*** new category ***',
			newSubCategoryToken: '*** new sub category ***',
			noCategoryToken: '',
			noSubCategoryToken: '',
			notAvailableToken: 'not available',
			allClauseToken: '*',
			newSubCategoryPrompt: 'please provide a new sub category: '
			, newCategoryPrompt: 'please provide a new category: '
			, delFilesPrompt: 'You are sure you want to delete files?'
	};

	return { module: module};

}());