var moment = require('moment');
module.exports = {
	connectSocket: function (req, res) {
		 if (!req.isSocket) {
        return res.json({
        	message: 'Không kết nối được socket! Vui lòng liên hệ với kỹ thuật viên'
        });
      }

      // user must be logged in to continue
      if(!req.session.user) {
        return res.json({
        	message: 'Vui lòng đăng nhập để tiếp tục.'
        });
      }

      sails.sockets.join(req, "BAManager", function(err) {
      	if(err) {
      		return Service.catch(req, res, err, "connectSocket");
      	} else {
      		console.log(moment().add(7, "hour").format("HH:mm DD/MM/YYYY") + " - " + (req.session.user.name || "Unknown") + " Online");
          return res.json({});
      	}
      });
	}
};