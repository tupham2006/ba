/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
const BCRYPT = require('bcrypt');
const CONST = require('../../const.js');
var currentYear = new Date().getFullYear();

module.exports = {
  schema: true,
  tableName: "user",
  attributes: {
    id: { type: "integer", primaryKey: true, autoIncrement: true },
    account: {type: 'string', size: 50, minLength: 6, maxLength: 50, defaultsTo: '', unique: true }, // mobile or name
    mobile : { type: "string", size:11, required: true, minLength: 10, maxLength: 11, defaultsTo: '', unique: true},
    password: {type: 'string', size: 200, minLength: 6, maxLength: 200, required: true, defaultsTo: ''},
    name : { type: "string", size: 50, maxLength: 50, required: true, defaultsTo: ''},
    role : { type: "integer", required: true, defaultsTo: 0 },
    position_id : { type: "integer", size: 11 },
    department_id : { type: "integer", size: 11 },
    nick_name: {type: 'string', size: 50, maxLength: 50, defaultsTo: '' },
    facutly_id: { type: "integer" },
    course: {type: 'integer', defaultsTo: 0 },
    image : { type: "string", maxLength: 200, defaultsTo: '' },
    status: { type: "string", maxLength: 200, defaultsTo: ''},
    gender : { type: "integer", max: 2, defaultsTo: 0}, // 0: unknown, 1: male, 2: female
    dob_date : { type: "integer", min: 1, max:31, defaultsTo: 1 },
    dob_month : { type: "integer", min: 1, max: 12, defaultsTo: 1 },
    dob_year : { type: "integer", min: 1970, max: currentYear, defaultsTo: 2000 },
    actived : { type: "integer", defaultsTo: 1 }, // user is active in club 
    deleted : { type: "integer", defaultsTo: 0 },
    note: {type: 'string', size: 10000, maxLength: 10000, defaultsTo: '' },
    createdAt: {type: "datetime", columnName: "created_at" },
    updatedAt: {type: "datetime", columnName: "updated_at" },

    toJSON: function() {
        var obj = this.toObject();
        delete obj.password;
        return obj;
    },
   },

  beforeCreate: function(user, cb) {
    BCRYPT.genSalt(15, function(err, salt) {
      BCRYPT.hash(user.password, salt, function(err, hash) {
        if (err) {
            console.log("User :: Before create :: ", err);
            cb(err);
        } else {
            user.password = hash;
            cb();
        }
      });
    });
  },

  comparePassword: function(password, user, cb){
    BCRYPT.compare(password, user.password, function(err, match){
      if(err){
        console.log('Login err', err);
       cb(err);
      } else if(match){
        cb(null, true);
      } else {
        cb(err);
      }
    });
  },
  getUserList: function(search){
    return new Promise(function(resolve, reject){
      User.find(search)
        .exec(function(err, res){
            if(err) return reject(err);
            return resolve(res);
        });
    });
  },

  updateUserInfo: function(condition, data){
      
    return new Promise(function(resolve, reject){

      // find exist user
      User.findOne({
        id: { "!": condition.id }, 
        mobile: data.mobile
       }).exec(function(findErr, findResult){
      
        if(findErr) return reject(findErr);

        if(findResult) {
          return reject({
            message: "Số điện thoại này đã đưọc đăng ký"
          });
        }

        // update
        User.update(condition, data)
          .exec(function(err, result){
              
            if(err) return reject(err);
            return resolve(result);
          });
       });

    });
  },

  countUser: function(search){

    var condition = {
      deleted : search.where.deleted
    };

    if(search.role) condition.role = search.role;
    if(search.where.or) condition.or = search.where.or;

    return new Promise(function(resolve, reject){
      User.count(condition)
        .exec(function(err, count){
          if(err) return reject(err);
          return resolve(count);
        });
    });
  }
};

