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
		departmentTable,
		notificationTable
	;

	function Table(){
		this.newTable = {
			$syncId: 0,
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
				if(Array.isArray(data)) {
					dataArray = data;
				} else {
					dataArray.push(data);
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

			syncData: function(action, data, syncId) {
				if(syncId && (this.$syncId >= syncId)) return;
				this.$syncId = syncId;
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
	if(!notificationTable) notificationTable = new Table().newTable;

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
		departmentTable: departmentTable,
		notificationTable: notificationTable
	};

	window.Store = service;
	return service;
}