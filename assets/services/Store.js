angular.module('ba').factory('Store', Store);
Store.$inject = [];
/*
		store database in service
 */
function Store(){

	// define variable
	var 
		borrowTable, 
		readerTable, 
		borrowBookTable,
		bookTable,
		bookTypeTable,
		depositTable,
		facutlyTable,
		positionTable,
		departmentTable
	;

	function Table(){
		this.newTable = {
				$list: this.$list,
				get list(){
					var newList = Object.assign([],this.$list);
					return newList;
				},

				set list(data){
					this.$list = data; 
				},

				set create(data){
					var dataArray = [];
					var syncDataObj = {};
					var i, j, k;

					if(Array.isArray(data)){ // create with array type
						for(i in data) {
							syncDataObj[data[i].id] = data[i];
						}

					} else { // crete with object
						syncDataObj[data.id] = data;
					}

					// remove if exist data in $list
					for(j in this.$list) {
						if(syncDataObj[this.$list[j].id]) {
							syncDataObj[this.$list[j].id].remove = true;
						}
					}

					for(k in syncDataObj) {
						if(!syncDataObj[k].remove) {
							dataArray.push(syncDataObj[k]);
						}
					}

					if(dataArray.length) {
						this.$list = dataArray.concat(this.$list);
					}
				},

				set update(data){
					for(var i in this.$list){
						if(this.$list[i].id == data.id ){
							this.$list[i] = data;
						}
					}
				},

				set delete(data){
					var ids = [], i, j;
					var newData = [];
					
					if(data && Array.isArray(data)) {
						for(i in data) {
							ids.push(data[i].id);
						}
					} else {
						ids.push(data.id);
					}

					for(j in this.$list){
						if(ids.indexOf(this.$list[j].id) == -1){
							newData.push(this.$list[j]);
						}
					}

					this.$list = newData;
				},

				syncData: function(action, data) {
					this[action] = data;
				}
		};
	}

	// set new if not exist object
	if(!borrowTable) borrowTable = new Table().newTable;
	if(!borrowBookTable) borrowBookTable = new Table().newTable;
	if(!readerTable) readerTable = new Table().newTable;
	if(!bookTable) bookTable = new Table().newTable;
	if(!bookTypeTable) bookTypeTable = new Table().newTable;
	if(!depositTable) depositTable = new Table().newTable;
	if(!facutlyTable) facutlyTable = new Table().newTable;
	if(!positionTable) positionTable = new Table().newTable;
	if(!departmentTable) departmentTable = new Table().newTable;

	// special
	if(!borrowBookTable.delete_by_borrow){
		Object.defineProperty(borrowBookTable, "delete_by_borrow", {
			set: function(borrow_id){
				var newData = [], i;
				for(i in this.$list){
					if(this.$list[i].borrow_id != borrow_id){
						newData.push(this.$list[i]);
					}
				}
				this.$list = newData;
			}
		});
	}

	// return to other service
	var service = {
		borrowTable: borrowTable,
		readerTable: readerTable,
		borrowBookTable: borrowBookTable,
		bookTable: bookTable,
		bookTypeTable: bookTypeTable,
		depositTable: depositTable,
		facutlyTable: facutlyTable,
		positionTable: positionTable,
		departmentTable: departmentTable
	};

	return service;
}

