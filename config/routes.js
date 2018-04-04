/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
  * etc. depending on your default view engine) your home page.              *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  '/': {
    view: 'public/homepage',
    locals: {
      layout: 'index'
    }
  },

  '/sach': {
    view: 'public/book',
    locals: {
      layout: 'index'
    }
  },

  '/clb': {
    view: 'layout'
  },

  /***************************************************************************
  *                                                                          *
  * Custom routes here...                                                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the custom routes above, it   *
  * is matched against Sails route blueprints. See `config/blueprints.js`    *
  * for configuration options and examples.                                  *
  *                                                                          *
  ***************************************************************************/
  /*==================================
  =            User Route            =
  ==================================*/

  'get /login': {
    view: 'login',
    locals: {
      layout: false
    }
  },

  'get /register': {
    view: 'register',
    locals: {
      layout: false
    }
  },

  'post /login': {
    controller: "UserController",
    action: "login",
  },

  'post /register': {
    controller: "UserController",
    action: "register",
  },

  'post /user/updateUserInfo': {
    controller: "UserController",
    action: "updateUserInfo"
  },


  /*====================================
  =            Admin Routes            =
  ====================================*/

  'post /admin/getUserList': {
    controller: "AdminController",
    action: "getUserList"
  },

  'post /admin/setUserRole': {
    controller: "AdminController",
    action: "setUserRole"
  },

  'post /department/save': {
    controller: "AdminController",
    action: "saveDepartment"
  },

  'post /position/save': {
    controller: "AdminController",
    action: "savePosition"
  },

  'post /deposit/save': {
    controller: "AdminController",
    action: "saveDeposit"
  },
  
  /*===================================
  =            Book Routes            =
  ===================================*/
  
  'post /book/getAllList': {
    controller: "BookController",
    action: "getAllBookList"
  },

  // 'post /book/getBookList': {
  //   controller: "BookController",
  //   action: "getBookList"
  // },

  'post /book/create': {
    controller: "BookController",
    action: "createBook"
  },

  'post /book/update': {
    controller: "BookController",
    action: "updateBook"
  },
  
  /*===================================
  =            Book Type            =
  ===================================*/
  
  'post /bookType/getList': {
    controller: "BookTypeController",
    action: "getBookTypeList"
  },

  'post /bookType/create': {
    controller: "BookTypeController",
    action: "createBookType"
  },

  'post /bookType/update': {
    controller: "BookTypeController",
    action: "updateBookType"
  },

  /*=====================================
  =            Borrow routes            =
  =====================================*/
  'post /borrow/getBorrowList': {
    controller: "BorrowController",
    action: "getBorrowList"
  },

  'post /borrow/create': {
    controller: "BorrowController",
    action: "createBorrow"
  },

  'post /borrow/update': {
    controller: "BorrowController",
    action: "updateBorrow"
  },

  'post /borrow/delete': {
    controller: "BorrowController",
    action: "deleteBorrow"
  },

  /*=====================================
  =            Borrow Book routes       =
  =====================================*/
  'post /borrowBook/getList': {
    controller: "BorrowBookController",
    action: "getBorrowBookList"
  },
  
  /*===================================
  =            Upload file            =
  ===================================*/
  
  'post /upload/uploadImage': {
    controller: "MediaController",
    action: "uploadImage"
  },

  /*=====================================
  =            Public routes            =
  =====================================*/
  
  'post /public/homepage': {
    controller: "PublicController",
    action: "getHomepage"
  },

  'post /public/bookPage': {
    controller: "PublicController",
    action: "getBookPage"
  },  

  'post /public/getBookList': {
    controller: "PublicController",
    action: "getBookList"
  },  

  'post /public/ratingBook': {
    controller: "PublicController",
    action: "ratingBook"
  },

  'post /public/commentBook': {
    controller: "PublicController",
    action: "commentBook"
  },  

  'post /public/register': {
    controller: "PublicUserController",
    action: "register"
  },

  'post /public/login': {
    controller: "PublicUserController",
    action: "login"
  },

  /*=====================================
  =            Position routes            =
  =====================================*/
  
  'post /position/getList': {
    controller: "PositionController",
    action: "getPositionList"
  },

  /*=====================================
  =            Department routes         =
  =====================================*/
  
  'post /department/getList': {
    controller: "DepartmentController",
    action: "getDepartmentList"
  },

  /*=====================================
  =            Deposit routes         =
  =====================================*/
  
  'post /deposit/getList': {
    controller: "DepositController",
    action: "getDepositList"
  },

  /*=====================================
  =            Facutly routes         =
  =====================================*/
  
  'post /facutly/getList': {
    controller: "FacutlyController",
    action: "getFacutlyList"
  },

  /*=====================================
  =            reader routes         =
  =====================================*/
  
  'post /reader/getList': {
    controller: "ReaderController",
    action: "getReaderList"
  },

  'post /reader/getInfo': {
    controller: "ReaderController",
    action: "getReaderInfo"
  },

  'post /reader/create': {
    controller: "ReaderController",
    action: "createReader"
  },

  'post /reader/update': {
    controller: "ReaderController",
    action: "updateReader"
  },

  'post /reader/delete': {
    controller: "ReaderController",
    action: "deleteReader"
  },

  /*=====================================
  =            Report register          =
  =====================================*/
  'post /report/borrowTime': {
    controller: "ReportController",
    action: "reportBorrowTime"
  },

  /*=============================================
  =                    Socket                   =
  =============================================*/
  'get /connectSocket': {
    controller: "SocketController",
    action: "connectSocket"
  },   

  /*=============================================
  =                    Dashboard                =
  =============================================*/
  'post /dashboard/getDashboard': {
    controller: "DashboardController",
    action: "getDashboard"
  },
};
