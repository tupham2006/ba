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

CONST.ROLE = [
  "Chưa có quyền",
  "Thành viên",
  "Biên tập viên",
  "Quản trị viên"
];


CONST.PROFILE_QUESTION = [
  "Bạn cao bao nhiêu?",
  "Sở thích của bạn là gì?",
  "Con vật yêu thích của bạn là gì",
  "Tình trạng hôn nhân của bạn?",
  "Bạn nặng bao nhiêu?",
  "Thần tượng của bạn là ai?",
  "Tài lẻ mà bạn có?",
  "Bạn thân nhất của bạn là ai?",
  "Ước mơ của bạn là gì?",
  "Gia đình bạn gồm mấy người?",
  "Bạn thích nhất môn học gì?",
  "Bạn có thể kể một kỷ niệm đẹp của bạn đưọc chứ?"
];

CONST.NOTIFICATION = function(res) {

};