/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
const CONST = require('../../const.js');

module.exports = {

	/**
	 * Login 
	 */
	login : function(req, res){
		var account = req.param('account');
    var password = req.param('password');
		
		var condition = {
			deleted: CONST.DELETED.NO,
	  	account: account
		};

	  User.findOne(condition)
	  .then(function(userResult) {

	  	// valid exist user
      if (!userResult) {
        return res.json({
        	message: 'Có vẻ như bạn đang nhập sai tên tài khoản',
        	error: CONST.ERROR.YES
        });
      }

      // Check password
      User.comparePassword(password, userResult, function (err, valid) {
        if (err || !valid || !userResult) {
          return res.json({
          	message: 'Sai mật khẩu đăng nhập',
        		error: CONST.ERROR.YES
          });
        }

        // delete redundant data before send to client
        delete userResult.password;
        delete userResult.deleted;
        delete userResult.updated_at;
        
        return res.json({
          token: JWT.issue({ id: userResult.id, role: userResult.role }), // create token
          user: userResult
      	});
        
      });
    })

    .catch(function(err){
			console.log("UserController :: login :: ", err);
			return res.json(CONST.CATCH);
		});
	},

	/**
	 * Register
	 */
	register : function(req, res){

		// Get data from client
		var account = req.param('account') ? req.param('account') : '';
			account = account.toString().replace(/ /g, '');
    var password = req.param('password') ? req.param('password') : '';
    	password = password.toString().replace(/ /g, '');
    var name = req.param('name') ? req.param('name') : '';
    	name = name.toString().trim();
    var mobile = req.param('mobile') ? req.param('mobile') : '';
    	mobile = mobile.toString().replace(/[^0-9]/g, "");

		if(account.length < 6 || account.length > 50 || password.length < 6 || password.length > 50 || !name || name.length > 50 || mobile.length > 11 || mobile.length < 10){
			console.log("Register :: pass? :: account: " + account + ", password: " + password + ", name: " + name + ", mobile: " + mobile );
			return res.json({
	  			error: CONST.ERROR.YES,
	  			message: "Vui lòng nhập các trường bắt buộc"
	  		});

		}
    var condition = {
    	where: {
    		or: [
	  			{ account: account },
	  			{ mobile: mobile }
    		]
    	}
		};
		
	  // check exist record
	  User.findOne(condition)
	    .then(function(result){
	      if(result){
	        throw { message: "Tên tài khoản hoặc số điện thoại đã tồn tại" };
	      }
	    })

	    // create auth
	    .then(function(){

	      User.create({
	        account: account,
	        password: password,
	        name: name,
	        mobile: mobile
	      })
	      .then(function(result){
	        if(result){
	          res.json({
	            error: CONST.ERROR.NO,
	          });
	        }
	      });
	    })
		
	  	// handle error
	  	.catch(function(err){
	  		console.log("AuthController :: register ::", err );
	  		return res.json({
	  			error: CONST.ERROR.YES,
	  			message: err.message
	  		});
	  	});
	},

	updateUserInfo: function(req, res){

		var userId = req.session.user.id;

		var data = {};
		var condition = {
			id: userId,
			deleted: CONST.DELETED.NO
		};

		// get and handle data
		var name = req.param("name") ? req.param("name") : "";
			name = name.toString().trim();
			if(name) data.name = name;

		var mobile = req.param("mobile") ? req.param("mobile") : "";
			mobile = mobile.toString().replace(/ /g, "");
			if(mobile) data.mobile = mobile;

		var facutly = req.param("facutly");
			if(facutly) data.facutly = facutly;


		var position_id = parseInt(req.param("position_id"));
		var position_name = req.param("position_name");
			if(position_name && position_id){
			 data.position_id = position_id;	
			 data.position_name = position_name;	
			}

		var department_id = parseInt(req.param("department_id"));
		var department_name = req.param("department_name");
			if(department_name && department_id){
			 data.department_id = department_id;	
			 data.department_name = department_name;	
			}

		var deposit_id = parseInt(req.param("deposit_id"));
		var deposit_name = req.param("deposit_name");
			if(deposit_name && deposit_id){
			 data.deposit_id = deposit_id;	
			 data.deposit_name = deposit_name;	
			}

		var gender = parseInt(req.param("gender"));
			if(!isNaN(gender)) data.gender = gender;

		var nickName = req.param("nick_name") ? req.param("nick_name") : "";
			nickName = nickName.toString().trim();
			if(nickName) data.nick_name = nickName;

		var dobDate = parseInt(req.param("dob_date"));
			if(dobDate) data.dob_date = dobDate;

		var dobMonth = parseInt(req.param("dob_month"));
			if(dobMonth) data.dob_month = dobMonth;

		var dobYear = parseInt(req.param("dob_year"));
			if(dobYear) data.dob_year = dobYear;

		var note = req.param("note") ? req.param("note") : "";
			note = note.toString().trim();
			if(note) data.note = note;

		if(req.param("course") > 0){
			data.course = req.param("course");
		}

		if(typeof req.param("status") == "string" && req.param("status").length <= 200) {
			data.status = req.param("status");
		}

		User.updateUserInfo(condition, data)
			.then(function(qUpdate){
				if(!qUpdate || qUpdate.length == 0){
					return res.json({
						error: CONST.ERROR.NO_RECORD_UPDATE,
						message: "Cập nhật thông tin thất bại. Vui lòng kiểm tra đưòng truyền"
					});

				} else {

					// update reader after update user
					Reader.update({is_user: qUpdate[0].id}, {
						name: qUpdate[0].name,
						facutly: qUpdate[0].facutly,
						course: qUpdate[0].course,
						gender: qUpdate[0].gender,
						mobile: qUpdate[0].mobile
					})
					.then(function(){
							req.session.user = qUpdate[0];
							return res.json({
								user: qUpdate[0]
							});
					});
				}
			})

			.catch(function(e){
				return Service.catch(req, res, e, "updateUserInfo");
			});
	}

};