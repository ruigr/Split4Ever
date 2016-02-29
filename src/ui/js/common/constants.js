
var Constants = function(name){
		Module.call(this, name);
};

Constants.prototype = Object.create(Module.prototype);
Constants.prototype.constructor = Constants;

Constants.prototype.constant = {
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
