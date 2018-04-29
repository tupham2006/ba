var CONST = require('../../const.js');
var moment = require('moment');

module.exports = {
  schema: true,
  tableName: "reader",
  attributes: {
    id: { type: "integer", primaryKey: true, autoIncrement: true },
    mobile : { type: "string", size:11, required: true, unique: true, minLength: 10, maxLength: 11, defaultsTo: ''},
    name : { type: "string", size: 50, required: true, maxLength: 50, defaultsTo: ''},
    facutly_id: {type: 'integer', defaultsTo: 1 },
    is_user: { type: 'integer', defaultsTo: 0 },
    borrow_time: {type: 'integer', defaultsTo: 0 },
    course: {type: 'integer', defaultsTo: 0 },
    gender : { type: "integer", max: 2, defaultsTo: 0}, // 0: unknown, 1: male, 2: female
    actived : { type: "integer", defaultsTo: 1 },
    deleted : { type: "integer", defaultsTo: 0 }, 
    note: {type: 'string', size: 10000, maxLength: 10000, defaultsTo: '' },
    createdAt: {type: "datetime", columnName: "created_at" },
    updatedAt: {type: "datetime", columnName: "updated_at" }
  },

  getReaderList: function () {
    return new Promise(function(resolve, reject){
      Reader.find({
        deleted: 0
      })
        .exec(function(err, result){
          if(err) return reject(err);
          return resolve(result);
        });
    });
  },

  getReaderListIsUser: function () {
    return new Promise(function(resolve, reject){
      Reader.find({
        deleted: 0,
        actived: 1,
        is_user: {
          ">": 0
        }
      })
        .exec(function(err, result){
          if(err) return reject(err);
          return resolve(result);
        });
    });
  },

  countReader: function(condition){
    if(condition && condition.limit) delete condition.limit;
    if(condition && condition.skip) delete condition.skip;

    return new Promise(function(resolve, reject){
      Reader.count(condition)
        .exec(function(err, count){
          if(err) return reject(err);
          return resolve(count);
        });
    });
  },

  getReaderInfo: function (condition) {
    return new Promise(function(resolve, reject){
      Reader.findOne(condition)
        .exec(function(err, result){
          if(err) return reject(err);
          return resolve(result);
        });
    });
  },

  createReader: function(data){
    return new Promise(function(resolve, reject){
    
      // FInd exist mobile
      Reader.findOne({ mobile: data.mobile, deleted: 0 })
        .exec(function(err, reader){
          if(err) return reject(err);

          // exist mobile. reject
          if(reader && Object.getOwnPropertyNames(reader).length){
            return reject({ message: "Số điện thoại này đã được đăng ký"});
          
          } else { // Create new
            Reader.create(data)
              .exec(function(err, result){
                if(err) return reject(err);
                var syncData = {
                  reader: result,
                  syncId: new Date().getTime()
                };
                Service.sync("reader", "create", syncData);

                return resolve(syncData);
              });
          }          
        });
    });
  },

  /**
  
    TODO:
    - Find id exist
    - Check exist mobile
    - update
   */
  
  updateReader: function(id, data, updateAfterFind){

    var condition = {
      id: id,
      deleted: 0
    };

    return new Promise(function(resolve, reject){

      // FInd exist id
      Reader.findOne(condition)
        .exec(function(err, reader){
          
          if(err) return reject(err);

          // Not exist id. reject
          if(!reader || !Object.getOwnPropertyNames(reader).length){
            return reject({ message: " Thông tin bạn đọc không tồn tại "});
          }
            
          Reader.getExistMobile(id, data.mobile)
            .then(function(readerCheck){
              if(readerCheck) throw new Error("Số điện thoại đã được đăng ký");
              return;

            })
            .then(function(){
    
              if(updateAfterFind) {
                var i;
                for(i in updateAfterFind) {
                  switch(updateAfterFind[i]) {
                    case "increase_borrow_time": data.borrow_time = reader.borrow_time + 1;
                      break;
                    case "reduce_borrow_time": data.borrow_time = reader.borrow_time - 1;
                      break;
                  }
                }
              }

              Reader.update(condition, data)
                .exec(function(err, result){
                  if(err) return reject(err);

                  if(!result.length){
                    return reject({ message:"Cập nhật thất bại" });
                  }

                  var syncData = {
                    reader: result[0],
                    syncId: new Date().getTime()
                  };
                  Service.sync("reader", "update", syncData);

                  return resolve(syncData);
                  
                });
            })

            .catch(function(err){
              return reject(err);
            });
        });
    });
  },

  getExistMobile: function(id, mobile) {
    return new Promise(function(resolve, reject){
      if(!mobile) return resolve();
      Reader.findOne({
        id: { "!": id }, 
        mobile: mobile,
        deleted: 0
       })
        .exec(function(err, readerFindExist){
          return resolve(readerFindExist);
        });
    });
  },

  reportReaderFacutly: function(condition) {
    return new Promise(function(resolve, reject){

      var sql = ["SELECT "];

      // value select
      sql.push("COUNT(*) AS times, facutly_id ");

      // table select
      sql.push("FROM reader ");

      // where
      sql.push("WHERE actived = 1 AND deleted = 0 ");

      // group
      sql.push("GROUP BY facutly_id ");

      var queryStatement = sql.join("");

      Borrow.query(queryStatement, function(err, result){
        if(err) return reject(err);
        return resolve(result);       
      });   
    });
  },

  deleteReader: function (id) {
    return new Promise(function (resolve, reject) {
      Reader.update({id: id}, {deleted: 1})
        .exec(function (err, result) {
          if(err ) return reject(err);
          if(result && result.length) {

          } else {
            return reject({
              message: "Xóa không thành công!"
            }) ;
          }
          var syncData = {
            reader: result[0],
            syncId: new Date().getTime()
          };

          Service.sync("reader", "delete", syncData);

          return resolve(syncData);
        });
    });
  },

  findOrCreateReader: function(condition, data) {
    return new Promise(function( resolve, reject){
      Reader.findOne(condition)
        .exec(function(err, findData){
          if(err) return reject(err);
          if(findData){
            return resolve({ reader: findData });

          } else {
            Reader.create(data)
              .exec(function(err, result){
                if(err) return reject(err);
                var syncData = {
                  reader: result,
                  syncId: new Date().getTime()
                };
                Service.sync("reader", "create", syncData);

                return resolve(syncData);
              });
          }
        });
    });
  },

  findToUpdateOrCreate: function (condition, updateData, createData) {
    return new Promise(function(resolve, reject){
      Reader.findOne(condition)
        .exec(function(err, findData){
          if(err) return reject(err);
          if(findData){
            Reader.update({ id: findData.id }, updateData)
              .exec(function(err, updateResult){
                if(err) return reject(err);

                var syncData = {
                  reader: updateResult[0],
                  syncId: new Date().getTime()
                };

                Service.sync("reader", "update", syncData);
                return resolve(syncData);
              });

          } else {
            Reader.create(createData)
              .exec(function(err, result){
                if(err) return reject(err);
                var syncData = {
                  reader: result,
                  syncId: new Date().getTime()
                };
                Service.sync("reader", "create", syncData);

                return resolve(syncData);
              });
          }
        });
    });
  }
};