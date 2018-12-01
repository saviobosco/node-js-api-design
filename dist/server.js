require("source-map-support").install();
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/api/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__restRouter__ = __webpack_require__("./src/api/restRouter.js");
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_0__restRouter__["a"]; });


/***/ }),

/***/ "./src/api/modules/auth.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return signin; });
/* unused harmony export decodeToken */
/* unused harmony export getFreshUser */
/* unused harmony export verifyUser */
/* unused harmony export signToken */
/* unused harmony export protect */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__resources_user_user_model__ = __webpack_require__("./src/api/resources/user/user.model.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_jsonwebtoken__ = __webpack_require__("jsonwebtoken");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_jsonwebtoken___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_jsonwebtoken__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__config__ = __webpack_require__("./src/config/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_express_jwt__ = __webpack_require__("express-jwt");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_express_jwt___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_express_jwt__);





var checkToken = __WEBPACK_IMPORTED_MODULE_3_express_jwt___default()({ secret: __WEBPACK_IMPORTED_MODULE_2__config__["a" /* default */].secrets.JWT_SECRET });

var signin = function signin(req, res, next) {
  // req.user will be there from the middleware
  // verify user. Then we can just create a token
  // and send it back for the client to consume
  var token = signToken(req.user.id);
  res.json({ token: token });
};

var decodeToken = function decodeToken() {
  return function (req, res, next) {
    if (__WEBPACK_IMPORTED_MODULE_2__config__["a" /* default */].disableAuth) {
      return next();
    }
    // make it optional to place token on query string
    // if it is, place it on the headers where it should be
    // so checkToken can see it. See follow the 'Bearer 034930493' format
    // so checkToken can see it and decode it
    if (req.query && req.query.hasOwnProperty('access_token')) {
      req.headers.authorization = 'Bearer ' + req.query.access_token;
    }

    // this will call next if token is valid
    // and send error if its not. It will attached
    // the decoded token to req.user
    checkToken(req, res, next);
  };
};

var getFreshUser = function getFreshUser() {
  return function (req, res, next) {
    return __WEBPACK_IMPORTED_MODULE_0__resources_user_user_model__["a" /* User */].findById(req.user.id).then(function (user) {
      if (!user) {
        // if no user is found it was not
        // it was a valid JWT but didn't decode
        // to a real user in our DB. Either the user was deleted
        // since the client got the JWT, or
        // it was a JWT from some other source
        res.status(401).send('Unauthorized');
      } else {
        // update req.user with fresh user from
        // stale token data
        req.user = user;
        next();
      }
    }).catch(function (error) {
      return next(error);
    });
  };
};

var verifyUser = function verifyUser() {
  return function (req, res, next) {
    var username = req.body.username;
    var password = req.body.password;

    // if no username or password then send
    if (!username || !password) {
      res.status(400).send('You need a username and password');
      return;
    }

    // look user up in the DB so we can check
    // if the passwords match for the username
    __WEBPACK_IMPORTED_MODULE_0__resources_user_user_model__["a" /* User */].findOne({ username: username }).then(function (user) {
      if (!user) {
        res.status(401).send('No user with the given username');
      } else {
        // checking the passowords here
        if (!user.authenticate(password)) {
          res.status(401).send('Wrong password');
        } else {
          // if everything is good,
          // then attach to req.user
          // and call next so the controller
          // can sign a token from the req.user._id
          req.user = user;
          next();
        }
      }
    }).catch(function (error) {
      return next(err);
    });
  };
};

var signToken = function signToken(id) {
  return __WEBPACK_IMPORTED_MODULE_1_jsonwebtoken___default.a.sign({ id: id }, __WEBPACK_IMPORTED_MODULE_2__config__["a" /* default */].secrets.JWT_SECRET, { expiresIn: __WEBPACK_IMPORTED_MODULE_2__config__["a" /* default */].expireTime });
};

var protect = [decodeToken(), getFreshUser()];

/***/ }),

/***/ "./src/api/modules/errorHandler.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return apiErrorHandler; });
var apiErrorHandler = function apiErrorHandler(error, req, res, next) {
  console.error(error.stack);
  res.status(500).send(error.message || error.toString());
};

/***/ }),

/***/ "./src/api/modules/query.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return controllers; });
/* unused harmony export createOne */
/* unused harmony export updateOne */
/* unused harmony export deleteOne */
/* unused harmony export getOne */
/* unused harmony export getAll */
/* unused harmony export findByParam */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return generateControllers; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__ = __webpack_require__("babel-runtime/helpers/extends");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_regenerator__ = __webpack_require__("babel-runtime/regenerator");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_regenerator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_regenerator__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_asyncToGenerator__ = __webpack_require__("babel-runtime/helpers/asyncToGenerator");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_asyncToGenerator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_asyncToGenerator__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_core_js_promise__ = __webpack_require__("babel-runtime/core-js/promise");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_babel_runtime_core_js_promise___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_babel_runtime_core_js_promise__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_lodash_merge__ = __webpack_require__("lodash.merge");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_lodash_merge___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_lodash_merge__);





var _this = this;



var controllers = {
  createOne: function createOne(model, body) {
    return model.create(body);
  },
  updateOne: function updateOne(docToUpdate, update) {
    __WEBPACK_IMPORTED_MODULE_4_lodash_merge___default()(docToUpdate, update);
    return docToUpdate.save();
  },
  deleteOne: function deleteOne(docToDelete) {
    return docToDelete.remove();
  },
  getOne: function getOne(docToGet) {
    return __WEBPACK_IMPORTED_MODULE_3_babel_runtime_core_js_promise___default.a.resolve(docToGet);
  },
  getAll: function getAll(model) {
    return model.find({});
  },
  findByParam: function findByParam(model, id) {
    return model.findById(id);
  }
};

var createOne = function createOne(model) {
  return function (req, res, next) {
    console.log("main function");
    return controllers.createOne(model, req.body).then(function (doc) {
      return res.status(201).json(doc);
    }).catch(function (error) {
      return next(error);
    });
  };
};

var updateOne = function updateOne(model) {
  return function () {
    var _ref = __WEBPACK_IMPORTED_MODULE_2_babel_runtime_helpers_asyncToGenerator___default()( /*#__PURE__*/__WEBPACK_IMPORTED_MODULE_1_babel_runtime_regenerator___default.a.mark(function _callee(req, res, next) {
      var docToUpdate, update;
      return __WEBPACK_IMPORTED_MODULE_1_babel_runtime_regenerator___default.a.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              docToUpdate = req.docFromId;
              update = req.body;
              return _context.abrupt('return', controllers.updateOne(docToUpdate, update).then(function (doc) {
                return res.status(201).json(doc);
              }).catch(function (error) {
                return next(error);
              }));

            case 3:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, _this);
    }));

    return function (_x, _x2, _x3) {
      return _ref.apply(this, arguments);
    };
  }();
};

var deleteOne = function deleteOne(model) {
  return function (req, res, next) {
    return controllers.deleteOne(req.docFromId).then(function (doc) {
      return res.status(201).json(doc);
    }).catch(function (error) {
      return next(error);
    });
  };
};

var getOne = function getOne(model) {
  return function (req, res, next) {
    return controllers.getOne(req.docToUpdate).then(function (doc) {
      return res.status(200).json(doc);
    }).catch(function (error) {
      return next(error);
    });
  };
};

var getAll = function getAll(model) {
  return function (req, res, next) {
    return controllers.getAll(model).then(function (docs) {
      return res.json(docs);
    }).catch(function (error) {
      return next(error);
    });
  };
};

var findByParam = function findByParam(model) {
  return function (req, res, next, id) {
    return controllers.findByParam(model, id).then(function (doc) {
      if (!doc) {
        next(new Error('Not Found Error'));
      } else {
        req.docFromId;
        next();
      }
    }).catch(function (error) {
      next(error);
    });
  };
};

var generateControllers = function generateControllers(model) {
  var overrides = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var defaults = {
    findByParam: findByParam(model),
    getAll: getAll(model),
    getOne: getOne(model),
    deleteOne: deleteOne(model),
    updateOne: updateOne(model),
    createOne: createOne(model)
  };

  return __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, defaults, overrides);
};

/***/ }),

/***/ "./src/api/resources/student/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__student_restRouter__ = __webpack_require__("./src/api/resources/student/student.restRouter.js");
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_0__student_restRouter__["a"]; });


/***/ }),

/***/ "./src/api/resources/student/student.controller.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export createOne */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__modules_query__ = __webpack_require__("./src/api/modules/query.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__student_model__ = __webpack_require__("./src/api/resources/student/student.model.js");



var createOne = function createOne(model) {
  return function (req, res, next) {
    console.log("override function");
    var student = {
      id: req.body.id,
      first_name: req.body.first_name,
      last_name: req.body.first_name,
      gender: req.body.gender,
      date_of_birth: req.body.date_of_birth,
      class_id: req.body.class_id,
      guardian: {
        name: req.body.guardian,
        occupation: req.body.occupation_of_guardian,
        relationship: req.body.relationship_to_guardian,
        phone_number: req.body.guardian_phone_number
      }
    };
    return __WEBPACK_IMPORTED_MODULE_0__modules_query__["a" /* controllers */].createOne(model, student).then(function (doc) {
      return res.status(201).json(doc);
    }).catch(function (error) {
      return next(error);
    });
  };
};

var overrides = {
  createOne: createOne(__WEBPACK_IMPORTED_MODULE_1__student_model__["a" /* Student */])

  /*function(model) {
      console.log("override function")
      console.log(this);
      return (req, res, next) => {
          var student = {
              first_name: req.body.first_name,
              last_name: req.body.first_name,
              gender: req.body.gender,
              date_of_birth: req.body.date_of_birth,
              class_id: req.body.class_id,
              guardian: {
                name: req.body.guardian,
                occupation: req.body.occupation_of_guardian,
                relationship: req.body.relationship_to_guardian,
                phone_number: req.body.guardian_phone_number
              }
            };
          console.log(req.body)
          return controllers.createOne(model, req.body)
            .then(doc => res.status(201).json(doc))
            .catch(error => next(error))
      }
  }*/
};

/* harmony default export */ __webpack_exports__["a"] = (Object(__WEBPACK_IMPORTED_MODULE_0__modules_query__["b" /* generateControllers */])(__WEBPACK_IMPORTED_MODULE_1__student_model__["a" /* Student */], overrides));

/***/ }),

/***/ "./src/api/resources/student/student.model.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Student; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_mongoose__ = __webpack_require__("mongoose");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_mongoose___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_mongoose__);


var studentSchema = new __WEBPACK_IMPORTED_MODULE_0_mongoose___default.a.Schema({
  id: {
    type: String,
    unique: true,
    required: true
  },
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  date_of_birth: {
    type: __WEBPACK_IMPORTED_MODULE_0_mongoose___default.a.Schema.Types.Date
  },
  gender: {
    type: String
  },
  state_of_origin: {
    type: String
  },
  home_residence: String,
  guardian: {
    name: String,
    occupation: String,
    relationship: String,
    phone_number: String
  },
  class_id: Number,
  status: {
    type: Number,
    default: 1
  }
}, { timestamps: true });

studentSchema.methods = {};

var Student = __WEBPACK_IMPORTED_MODULE_0_mongoose___default.a.model('students', studentSchema);

/***/ }),

/***/ "./src/api/resources/student/student.restRouter.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return studentRouter; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_express__ = __webpack_require__("express");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_express___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_express__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__student_controller__ = __webpack_require__("./src/api/resources/student/student.controller.js");



var studentRouter = __WEBPACK_IMPORTED_MODULE_0_express___default.a.Router();

studentRouter.param('id', __WEBPACK_IMPORTED_MODULE_1__student_controller__["a" /* default */].findByParam);

studentRouter.route('/').get(__WEBPACK_IMPORTED_MODULE_1__student_controller__["a" /* default */].getAll).post(__WEBPACK_IMPORTED_MODULE_1__student_controller__["a" /* default */].createOne);

studentRouter.route('/:id').get(__WEBPACK_IMPORTED_MODULE_1__student_controller__["a" /* default */].getOne).put(__WEBPACK_IMPORTED_MODULE_1__student_controller__["a" /* default */].updateOne).delete(__WEBPACK_IMPORTED_MODULE_1__student_controller__["a" /* default */].createOne);

/***/ }),

/***/ "./src/api/resources/user/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__user_restRouter__ = __webpack_require__("./src/api/resources/user/user.restRouter.js");
/* harmony namespace reexport (by used) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_0__user_restRouter__["a"]; });


/***/ }),

/***/ "./src/api/resources/user/user.controller.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__modules_query__ = __webpack_require__("./src/api/modules/query.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__user_model__ = __webpack_require__("./src/api/resources/user/user.model.js");



/* harmony default export */ __webpack_exports__["a"] = (Object(__WEBPACK_IMPORTED_MODULE_0__modules_query__["b" /* generateControllers */])(__WEBPACK_IMPORTED_MODULE_1__user_model__["a" /* User */]));

/***/ }),

/***/ "./src/api/resources/user/user.model.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return User; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_mongoose__ = __webpack_require__("mongoose");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_mongoose___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_mongoose__);


var userSchema = new __WEBPACK_IMPORTED_MODULE_0_mongoose___default.a.Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  passwordHash: {
    required: true,
    type: String
  }
}, { timestamps: true });

userSchema.methods = {
  authenticate: function authenticate(plaintTextPassword) {
    return bcrypt.compareSync(plainTextPword, this.password);
  },
  hashPassword: function hashPassword(plaintTextPassword) {
    if (!plaintTextPassword) {
      throw new Error('Could not save user');
    }

    var salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(plaintTextPassword, salt);
  }
};

var User = __WEBPACK_IMPORTED_MODULE_0_mongoose___default.a.model('user', userSchema);

/***/ }),

/***/ "./src/api/resources/user/user.restRouter.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return userRouter; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_express__ = __webpack_require__("express");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_express___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_express__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__user_controller__ = __webpack_require__("./src/api/resources/user/user.controller.js");



var userRouter = __WEBPACK_IMPORTED_MODULE_0_express___default.a.Router();

userRouter.param('id', __WEBPACK_IMPORTED_MODULE_1__user_controller__["a" /* default */].findByParam);

userRouter.route('/').get(__WEBPACK_IMPORTED_MODULE_1__user_controller__["a" /* default */].getAll).post(__WEBPACK_IMPORTED_MODULE_1__user_controller__["a" /* default */].createOne);

userRouter.route('/:id').get(__WEBPACK_IMPORTED_MODULE_1__user_controller__["a" /* default */].getOne).put(__WEBPACK_IMPORTED_MODULE_1__user_controller__["a" /* default */].updateOne).delete(__WEBPACK_IMPORTED_MODULE_1__user_controller__["a" /* default */].createOne);

/***/ }),

/***/ "./src/api/restRouter.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return restRouter; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_express__ = __webpack_require__("express");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_express___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_express__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__resources_user__ = __webpack_require__("./src/api/resources/user/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__resources_student__ = __webpack_require__("./src/api/resources/student/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__modules_errorHandler__ = __webpack_require__("./src/api/modules/errorHandler.js");





var restRouter = __WEBPACK_IMPORTED_MODULE_0_express___default.a.Router();

restRouter.use('/user', __WEBPACK_IMPORTED_MODULE_1__resources_user__["a" /* userRouter */]);
restRouter.use('/student', __WEBPACK_IMPORTED_MODULE_2__resources_student__["a" /* studentRouter */]);
restRouter.use(__WEBPACK_IMPORTED_MODULE_3__modules_errorHandler__["a" /* apiErrorHandler */]);

/***/ }),

/***/ "./src/config/dev.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "config", function() { return config; });
var config = {
  expireTime: '30d',
  secrets: {
    JWT_SECRET: 'yeezy350boost'
  },
  disableAuth: true
};

/***/ }),

/***/ "./src/config/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash_merge__ = __webpack_require__("lodash.merge");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash_merge___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_lodash_merge__);


Object({"BUILD_TARGET":"server"}).NODE_ENV = Object({"BUILD_TARGET":"server"}).NODE_ENV || 'development';

var env = Object({"BUILD_TARGET":"server"}).NODE_ENV;

var baseConfig = {
  port: 3000,
  secrets: {},
  db: {
    //url: 'mongodb://localhost:27017/school_management_system'
    url: 'mongodb://heroku_c29m5v6j:gi360lcbseg601af65rb91n7ml@ds123434.mlab.com:23434/heroku_c29m5v6j'

  }
};

var envConfig = {};

switch (env) {
  case 'development':
  case 'dev':
    envConfig = __webpack_require__("./src/config/dev.js").config;
    break;
  case 'test':
  case 'testing':
    envConfig = __webpack_require__("./src/config/testing.js").config;
    break;
  case 'prod':
  case 'production':
    envConfig = __webpack_require__("./src/config/prod.js").config;
  default:
    envConfig = __webpack_require__("./src/config/dev.js").config;
}

/* harmony default export */ __webpack_exports__["a"] = (__WEBPACK_IMPORTED_MODULE_0_lodash_merge___default()(baseConfig, envConfig));

/***/ }),

/***/ "./src/config/prod.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "config", function() { return config; });
var config = {
    db: {
        url: Object({"BUILD_TARGET":"server"}).MONGODB_URI
    }
};

/***/ }),

/***/ "./src/config/testing.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "config", function() { return config; });
var config = {
  expireTime: '30d',
  secrets: {
    JWT_SECRET: 'yeezy350boost'
  },
  db: {
    url: 'mongodb://localhost/jams-test'
  }
};

/***/ }),

/***/ "./src/db.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return connect; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_mongoose__ = __webpack_require__("mongoose");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_mongoose___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_mongoose__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__config__ = __webpack_require__("./src/config/index.js");


__WEBPACK_IMPORTED_MODULE_0_mongoose___default.a.Promise = global.Promise;

var connect = function connect() {
  var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : __WEBPACK_IMPORTED_MODULE_1__config__["a" /* default */];

  return __WEBPACK_IMPORTED_MODULE_0_mongoose___default.a.connect(config.db.url, {
    useMongoClient: true
  });
};

/***/ }),

/***/ "./src/index.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_http__ = __webpack_require__("http");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_http___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_http__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__server__ = __webpack_require__("./src/server.js");

// import { execute, subscribe } from 'graphql'



// import schema from './schema'

var server = __WEBPACK_IMPORTED_MODULE_0_http___default.a.createServer(__WEBPACK_IMPORTED_MODULE_1__server__["a" /* default */]);
var currentApp = __WEBPACK_IMPORTED_MODULE_1__server__["a" /* default */];
console.log(Object({"BUILD_TARGET":"server"}).PORT);

var port = Object({"BUILD_TARGET":"server"}).PORT || 3000;

server.listen(port, function () {
	console.log('Server listening on port ' + port);
});

/*if (module.hot) {
	module.hot.accept(['./server'], () => {
		server.removeListener('request', currentApp)
		server.on('request', app)
		currentApp = app
	})
}*/

/***/ }),

/***/ "./src/middleware.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_body_parser__ = __webpack_require__("body-parser");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_body_parser___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_body_parser__);


var setGlobalMiddleware = function setGlobalMiddleware(app) {
  app.use(__WEBPACK_IMPORTED_MODULE_0_body_parser___default.a.urlencoded({ extended: true }));
  app.use(__WEBPACK_IMPORTED_MODULE_0_body_parser___default.a.json());
};

/* harmony default export */ __webpack_exports__["a"] = (setGlobalMiddleware);

/***/ }),

/***/ "./src/server.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_express__ = __webpack_require__("express");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_express___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_express__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__middleware__ = __webpack_require__("./src/middleware.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__api__ = __webpack_require__("./src/api/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__db__ = __webpack_require__("./src/db.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__api_modules_auth__ = __webpack_require__("./src/api/modules/auth.js");





// Declare an app from express
var app = __WEBPACK_IMPORTED_MODULE_0_express___default()();

Object(__WEBPACK_IMPORTED_MODULE_1__middleware__["a" /* default */])(app);
Object(__WEBPACK_IMPORTED_MODULE_3__db__["a" /* connect */])();
// setup basic routing for index route

app.use('/signin', __WEBPACK_IMPORTED_MODULE_4__api_modules_auth__["a" /* signin */]);
app.use('/api', /*protect,*/__WEBPACK_IMPORTED_MODULE_2__api__["a" /* restRouter */]);

// catch all
app.all('*', function (req, res) {
  res.json({ ok: true });
});

/* harmony default export */ __webpack_exports__["a"] = (app);

/***/ }),

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("./src/index.js");


/***/ }),

/***/ "babel-runtime/core-js/promise":
/***/ (function(module, exports) {

module.exports = require("babel-runtime/core-js/promise");

/***/ }),

/***/ "babel-runtime/helpers/asyncToGenerator":
/***/ (function(module, exports) {

module.exports = require("babel-runtime/helpers/asyncToGenerator");

/***/ }),

/***/ "babel-runtime/helpers/extends":
/***/ (function(module, exports) {

module.exports = require("babel-runtime/helpers/extends");

/***/ }),

/***/ "babel-runtime/regenerator":
/***/ (function(module, exports) {

module.exports = require("babel-runtime/regenerator");

/***/ }),

/***/ "body-parser":
/***/ (function(module, exports) {

module.exports = require("body-parser");

/***/ }),

/***/ "express":
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),

/***/ "express-jwt":
/***/ (function(module, exports) {

module.exports = require("express-jwt");

/***/ }),

/***/ "http":
/***/ (function(module, exports) {

module.exports = require("http");

/***/ }),

/***/ "jsonwebtoken":
/***/ (function(module, exports) {

module.exports = require("jsonwebtoken");

/***/ }),

/***/ "lodash.merge":
/***/ (function(module, exports) {

module.exports = require("lodash.merge");

/***/ }),

/***/ "mongoose":
/***/ (function(module, exports) {

module.exports = require("mongoose");

/***/ })

/******/ });
//# sourceMappingURL=server.js.map