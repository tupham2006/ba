const CONST = require('../../const.js');
module.exports = {
	getReaderList: function (req, res) {
		Reader.getReaderList()
			.then(function(qReader){

				Reader.countReader({deleted: 0})
					.then(function(qCount){
						return res.json({
							reader: qReader,
							count: qCount
						});
					});
			})

			.catch(function(e){
				return Service.catch(req, res, e, "getReaderList");
			});
	},

	getReaderInfo: function(req, res){
		var mobile = (parseInt(req.param("mobile")) ? req.param("mobile") : "").toString().replace(/^0-9/g, "");
		if(mobile.length != 10 && mobile.length != 11){
			return;
		}
		
		Reader.getReaderInfo({ mobile : mobile, deleted: 0 })
			.then(function(result){
				return res.json({
					reader: result
				});
			})

			.catch(function(e){
				return Service.catch(req, res, e, "getReaderInfo");
			});
	},

	createReader: function(req, res){

		// Get data from client
		var facutly_id = parseInt(req.param("facutly_id"));
		var course = parseInt(req.param("course"));
		var gender = parseInt(req.param("gender"));
		var note = (req.param("note") ? req.param("note") : "").toString().trim();
		var mobile = (req.param("mobile") ? req.param("mobile") : "").toString().replace(/ /g, "");
		var name = (req.param("name") ? req.param("name") : "").toString().trim();
		var actived = parseInt(req.param("actived")) ? parseInt(req.param("actived")) : 0;
		if(/[^0-9]/g.test(mobile) || mobile.length < 10 || mobile.length > 11){
			return Service.catch(req, res, { message: "Vui lòng nhập số điện thoại bạn đọc" }, "createReader");
		}

		// data to create
		var data = {
			mobile: mobile,
			name: name,
			actived: actived
		};

		// if has param, add to data object to create new
		if(facutly_id) data.facutly_id = facutly_id;
		if(course) data.course = course;
		if([0,1,2].includes(gender)) data.gender  = gender;
		if(note) data.note = note;
		
		Reader.createReader(data)
			.then(function(reader){
				return res.json(reader);
			})

			.catch(function(e){
				return Service.catch(req, res, e, "createReader");
			});
	},

	updateReader: function(req, res){

		// Get data from client
		var id = parseInt(req.param("id"));
		var facutly_id = parseInt(req.param("facutly_id"));
		var course = parseInt(req.param("course"));
		var gender = parseInt(req.param("gender"));
		var note = (req.param("note") ? req.param("note") : "").toString().trim();
		var mobile = (req.param("mobile") ? req.param("mobile") : "").toString().trim();
		var name = (req.param("name") ? req.param("name") : "").toString().trim();
		var actived = parseInt(req.param("actived")) ? parseInt(req.param("actived")) : 0;

		if(!id){
			return Service.catch(req, res, {message: "Vui lòng nhập ID bạn đọc"}, "updateReader");
		}

		// data to create
		var data = {
			mobile: mobile,
			name: name,
			actived: actived
		};

		// if has param, add to data object to create new
		if(facutly_id) data.facutly_id = facutly_id;
		if(course) data.course = course;
		if([0,1,2].includes(gender)) data.gender  = gender;
		if(note) data.note = note;
		if(req.param("actived")) data.actived = req.param("actived");

		Reader.updateReader(id, data)
			.then(function(reader){
				return res.json(reader);
			})

			.catch(function(e){
				return Service.catch(req, res, e, "updateReader");
			});
	},

	deleteReader: function (req, res) {
		// Get data from client
		var id = parseInt(req.param("id"));

		if(!id){
			return Service.catch(req, res, {message: "Vui lòng nhập ID bạn đọc"}, "updateReader");
		}

		Reader.deleteReader(id)
			.then(function(reader){ 
				return res.json(reader);
			})

			.catch(function(e){
				return Service.catch(req, res, e, "deleteReader");
			});
	}
};