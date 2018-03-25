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
				$syncIds: [],
				get list(){
					var newList = Object.assign([],this.$list);
					return newList;
				},

				set list(data){
					this.$list = data; 
				},

				set create(data){
					console.log("data", data);
					var dataArray = [];

					if(Array.isArray(data)){// create with array type
						for(var i in data) {
							if(this.$syncIds.indexOf(data[i].id) == -1) {
								this.$syncIds.push(data[i].id);
								dataArray.push(data[i]);
							}
						}

					} else { // crete with object
						if(this.$syncIds.indexOf(data.id) == -1) {
							this.$syncIds.push(data.id);
							dataArray.push(data);
						}

					}
					this.$list = dataArray.concat(this.$list);
				},

				set update(data){
					for(var i in this.$list){
						if(this.$list[i].id == data.id ){
							this.$list[i] = data;
						}
					}
				},

				set delete(id){
					var newData = [];
					for(var i in this.$list){
						if(this.$list[i].id != id){
							newData.push(this.$list[i]);
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
				var newData = [];
				for(var i in this.$list){
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

	// export store to debug
	window.Store = service;
	
	return service;
}

