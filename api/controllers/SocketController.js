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

      sails.sockets.join(req, "BAM", function(err) {
      	if(err) {
      		return Service.catch(req, res, err, "connectSocket");
      	} else {

          // join admin room
          if(req.session.user.role > 1) {
            sails.sockets.addRoomMembersToRooms('BAM', 'MOD', function(err) {
              if (err) {return res.serverError(err);}
              if(req.session.user.role == 2) {
          		  console.log(moment().add(7, "hour").format("HH:mm DD/MM/YYYY") + " - [" + req.session.user.role + "] " + (req.session.user.name || "Unknown") + " Online");
              }
            });

            if(req.session.user.role > 2) {
              sails.sockets.addRoomMembersToRooms('BAM', 'ADMIN', function(err) {
                if (err) {return res.serverError(err);}
                console.log(moment().add(7, "hour").format("HH:mm DD/MM/YYYY") + " - [" + req.session.user.role + "] " + (req.session.user.name || "Unknown") + " Online");
              });
            } 

          } else {
            console.log(moment().add(7, "hour").format("HH:mm DD/MM/YYYY") + " - " + (req.session.user.name || "Unknown") + " Online");
          }
      	}
      });
	}
};