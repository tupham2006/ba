const CONST = require('../../const.js');
module.exports = {
	getDepartmentList: function (req, res) {
		Department.find()
			.then(function(departments){
				return res.json({
					departments: departments
				});
			})

			.catch(function(err){
				console.log("DepartmentController :: getDepartmentList :: ", err);
				return res.json(CONST.CATCH);
			});
	},
	
};