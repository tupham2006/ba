window.CONST = {};
window.CONST.removeVI = function (str) {

	if(typeof str != 'string') str = '';
  str = str.trim().toLowerCase();
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g,"i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y");
  str = str.replace(/đ/g,"d");
  str = str.replace(/[^a-z0-9]/g, "");

  return str;
};

CONST.removeVN = function(str){

  if(typeof str != 'string') str = '';
  str = str.trim().toLowerCase();
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g,"i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y");
  str = str.replace(/đ/g,"d");
  
  str = str.replace(/[^a-z0-9]/g, "");
  // console.log("str", str);

  return str;

};

CONST.borrowStatus = ["Đã trả", "Đang mượn", "Gia hạn 1", "Gia hạn 2"];

CONST.borrowDeposit = ["Thẻ sinh viên", "Chứng minh thư", "Bằng lái xe", "Tiền mặt", "Thẻ thư viện", "Loại khác"  ];

CONST.getCookie = function(cookieType){
  var data = "";
  if(document.cookie){
    var cookie = document.cookie.split(';');
    if(cookie && cookie.length > 0){
      for(var i in cookie){
        var childOfCookie = null;
        childOfCookie = cookie[i].split('=');
        if(childOfCookie && childOfCookie.length > 0 && childOfCookie[0] && childOfCookie[0].trim() == cookieType){
          data = childOfCookie[1];
        }
      }
    } 
  }

  return data;
};

CONST.clearCookie = function(){
  document.cookie = "token=";
  document.cookie = "user=";
  window.location.href = "/login";
};

CONST.FACUTLY = {
  "CHUA_PHAN_KHOA": 'Chưa phân khoa',
  "CO_DIEN": 'Cơ - Điện',
  "CNTT": 'Công nghệ thông tin',
  "DAU_KHI": 'Dầu khí',
  "TRAC_DIA": 'Trắc địa',
  "KINH_TE": 'Kinh tế',
  "XAY_DUNG": 'Xây dựng',
  "MOI_TRUONG": 'Môi trường',
  "MO": 'Mỏ',
  "DIA_CHAT": 'Địa chất'
};

CONST.ROLE = [
  "Chưa có quyền",
  "Thành viên",
  "Biên tập viên",
  "Quản trị viên"
];

/**
 * Troll function :v
 * @param  {[type]} a [description]
 * @param  {[type]} b [description]
 * @return {[type]}   [description]
 */
CONST.c = function(a, b){
  b.unshift(a);
  return b;
};

CONST.cs = function(a, b){
  return a.concat(b);
};

CONST.u = function(a, b){
  for(var i in b){
    if(b[i].id == a.id){
      b[i] = a;
      break;
    }
  }

  return b;
};