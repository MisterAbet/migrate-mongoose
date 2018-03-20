'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _mkdirp = require('mkdirp');

var _mkdirp2 = _interopRequireDefault(_mkdirp);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

require('colors');

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _inquirer = require('inquirer');

var _inquirer2 = _interopRequireDefault(_inquirer);

var _db = require('./db');

var _db2 = _interopRequireDefault(_db);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MigrationModel = void 0;

_bluebird2.default.config({
  warnings: false
});

var es6Template = '\n/**\n * Make any changes you need to make to the database here\n */\nexport async function up () {\n  // Write migration here\n}\n\n/**\n * Make any changes that UNDO the up function side effects here (if possible)\n */\nexport async function down () {\n  // Write migration here\n}\n';

var es5Template = '\'use strict\';\n\n/**\n * Make any changes you need to make to the database here\n */\nexports.up = function up (done) {\n  done();\n};\n\n/**\n * Make any changes that UNDO the up function side effects here (if possible)\n */\nexports.down = function down(done) {\n  done();\n};\n';

var Migrator = function () {
  function Migrator(_ref) {
    var templatePath = _ref.templatePath,
        _ref$migrationsPath = _ref.migrationsPath,
        migrationsPath = _ref$migrationsPath === undefined ? './migrations' : _ref$migrationsPath,
        dbConnectionUri = _ref.dbConnectionUri,
        _ref$es6Templates = _ref.es6Templates,
        es6Templates = _ref$es6Templates === undefined ? false : _ref$es6Templates,
        _ref$collectionName = _ref.collectionName,
        collectionName = _ref$collectionName === undefined ? 'migrations' : _ref$collectionName,
        _ref$autosync = _ref.autosync,
        autosync = _ref$autosync === undefined ? false : _ref$autosync,
        _ref$cli = _ref.cli,
        cli = _ref$cli === undefined ? false : _ref$cli,
        connection = _ref.connection;
    (0, _classCallCheck3.default)(this, Migrator);

    var defaultTemplate = es6Templates ? es6Template : es5Template;
    this.template = templatePath ? _fs2.default.readFileSync(templatePath, 'utf-8') : defaultTemplate;
    this.migrationPath = _path2.default.resolve(migrationsPath);
    this.connection = connection || _mongoose2.default.createConnection(dbConnectionUri);
    this.es6 = es6Templates;
    this.collection = collectionName;
    this.autosync = autosync;
    this.cli = cli;
    MigrationModel = (0, _db2.default)(collectionName, this.connection);
  }

  (0, _createClass3.default)(Migrator, [{
    key: 'log',
    value: function log(logString) {
      var force = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      if (force || this.cli) {
        console.log(logString);
      }
    }

    /**
     * Use your own Mongoose connection object (so you can use this('modelname')
     * @param {mongoose.connection} connection - Mongoose connection
     */

  }, {
    key: 'setMongooseConnection',
    value: function setMongooseConnection(connection) {
      MigrationModel = (0, _db2.default)(this.collection, connection);
    }

    /**
     * Close the underlying connection to mongo
     * @returns {Promise} A promise that resolves when connection is closed
     */

  }, {
    key: 'close',
    value: function close() {
      return this.connection ? this.connection.close() : _bluebird2.default.resolve();
    }

    /**
     * Create a new migration
     * @param {string} migrationName
     * @returns {Promise<Object>} A promise of the Migration created
     */

  }, {
    key: 'create',
    value: function () {
      var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(migrationName) {
        var existingMigration, now, newMigrationFile, migrationCreated;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _context.next = 3;
                return MigrationModel.findOne({ name: migrationName });

              case 3:
                existingMigration = _context.sent;

                if (!existingMigration) {
                  _context.next = 6;
                  break;
                }

                throw new Error(('There is already a migration with name \'' + migrationName + '\' in the database').red);

              case 6:
                _context.next = 8;
                return this.sync();

              case 8:
                now = Date.now();
                newMigrationFile = now + '-' + migrationName + '.js';

                _mkdirp2.default.sync(this.migrationPath);
                _fs2.default.writeFileSync(_path2.default.join(this.migrationPath, newMigrationFile), this.template);
                // create instance in db
                _context.next = 14;
                return this.connection;

              case 14:
                _context.next = 16;
                return MigrationModel.create({
                  name: migrationName,
                  createdAt: now
                });

              case 16:
                migrationCreated = _context.sent;

                this.log('Created migration ' + migrationName + ' in ' + this.migrationPath + '.');
                return _context.abrupt('return', migrationCreated);

              case 21:
                _context.prev = 21;
                _context.t0 = _context['catch'](0);

                this.log(_context.t0.stack);
                fileRequired(_context.t0);

              case 25:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[0, 21]]);
      }));

      function create(_x2) {
        return _ref2.apply(this, arguments);
      }

      return create;
    }()

    /**
     * Runs migrations up to or down to a given migration name
     *
     * @param migrationName
     * @param direction
     */

  }, {
    key: 'run',
    value: function () {
      var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
        var _this = this;

        var direction = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'up';
        var migrationName = arguments[1];

        var untilMigration, query, sortDirection, migrationsToRun, self, numMigrationsRan, migrationsRan, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _loop, _iterator, _step;

        return _regenerator2.default.wrap(function _callee2$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return this.sync();

              case 2:
                if (!migrationName) {
                  _context3.next = 8;
                  break;
                }

                _context3.next = 5;
                return MigrationModel.findOne({ name: migrationName });

              case 5:
                _context3.t0 = _context3.sent;
                _context3.next = 11;
                break;

              case 8:
                _context3.next = 10;
                return MigrationModel.findOne().sort({ createdAt: -1 });

              case 10:
                _context3.t0 = _context3.sent;

              case 11:
                untilMigration = _context3.t0;

                if (untilMigration) {
                  _context3.next = 18;
                  break;
                }

                if (!migrationName) {
                  _context3.next = 17;
                  break;
                }

                throw new ReferenceError("Could not find that migration in the database");

              case 17:
                throw new Error("There are no pending migrations.");

              case 18:
                query = {
                  createdAt: { $lte: untilMigration.createdAt },
                  state: 'down'
                };


                if (direction == 'down') {
                  query = {
                    createdAt: { $gte: untilMigration.createdAt },
                    state: 'up'
                  };
                }

                sortDirection = direction == 'up' ? 1 : -1;
                _context3.next = 23;
                return MigrationModel.find(query).sort({ createdAt: sortDirection });

              case 23:
                migrationsToRun = _context3.sent;

                if (migrationsToRun.length) {
                  _context3.next = 32;
                  break;
                }

                if (!this.cli) {
                  _context3.next = 31;
                  break;
                }

                this.log('There are no migrations to run'.yellow);
                this.log('Current Migrations\' Statuses: ');
                _context3.next = 30;
                return this.list();

              case 30:
                return _context3.abrupt('return', []);

              case 31:
                throw new Error('There are no migrations to run');

              case 32:
                self = this;
                numMigrationsRan = 0;
                migrationsRan = [];
                _iteratorNormalCompletion = true;
                _didIteratorError = false;
                _iteratorError = undefined;
                _context3.prev = 38;
                _loop = /*#__PURE__*/_regenerator2.default.mark(function _loop() {
                  var migration, migrationFilePath, migrationFunctions;
                  return _regenerator2.default.wrap(function _loop$(_context2) {
                    while (1) {
                      switch (_context2.prev = _context2.next) {
                        case 0:
                          migration = _step.value;
                          migrationFilePath = _path2.default.join(self.migrationPath, migration.filename);

                          if (_this.es6) {
                            require('babel-register')({
                              "presets": [require("babel-preset-latest")],
                              "plugins": [require("babel-plugin-transform-runtime")]
                            });

                            require('babel-polyfill');
                          }

                          migrationFunctions = void 0;
                          _context2.prev = 4;

                          migrationFunctions = require(migrationFilePath);
                          _context2.next = 12;
                          break;

                        case 8:
                          _context2.prev = 8;
                          _context2.t0 = _context2['catch'](4);

                          _context2.t0.message = _context2.t0.message && /Unexpected token/.test(_context2.t0.message) ? 'Unexpected Token when parsing migration. If you are using an ES6 migration file, use option --es6' : _context2.t0.message;
                          throw _context2.t0;

                        case 12:
                          if (migrationFunctions[direction]) {
                            _context2.next = 14;
                            break;
                          }

                          throw new Error(('The ' + direction + ' export is not defined in ' + migration.filename + '.').red);

                        case 14:
                          _context2.prev = 14;
                          _context2.next = 17;
                          return new _bluebird2.default(function (resolve, reject) {
                            var callPromise = migrationFunctions[direction].call(_this.connection.model.bind(_this.connection), function callback(err) {
                              if (err) return reject(err);
                              resolve();
                            });

                            if (callPromise && typeof callPromise.then === 'function') {
                              callPromise.then(resolve).catch(reject);
                            }
                          });

                        case 17:

                          _this.log((direction.toUpperCase() + ':   ')[direction == 'up' ? 'green' : 'red'] + (' ' + migration.filename + ' '));

                          _context2.next = 20;
                          return MigrationModel.where({ name: migration.name }).update({ $set: { state: direction } });

                        case 20:
                          migrationsRan.push(migration.toJSON());
                          numMigrationsRan++;
                          _context2.next = 29;
                          break;

                        case 24:
                          _context2.prev = 24;
                          _context2.t1 = _context2['catch'](14);

                          _this.log(('Failed to run migration ' + migration.name + ' due to an error.').red);
                          _this.log('Not continuing. Make sure your data is in consistent state'.red);
                          throw _context2.t1 instanceof Error ? _context2.t1 : new Error(_context2.t1);

                        case 29:
                        case 'end':
                          return _context2.stop();
                      }
                    }
                  }, _loop, _this, [[4, 8], [14, 24]]);
                });
                _iterator = (0, _getIterator3.default)(migrationsToRun);

              case 41:
                if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                  _context3.next = 46;
                  break;
                }

                return _context3.delegateYield(_loop(), 't1', 43);

              case 43:
                _iteratorNormalCompletion = true;
                _context3.next = 41;
                break;

              case 46:
                _context3.next = 52;
                break;

              case 48:
                _context3.prev = 48;
                _context3.t2 = _context3['catch'](38);
                _didIteratorError = true;
                _iteratorError = _context3.t2;

              case 52:
                _context3.prev = 52;
                _context3.prev = 53;

                if (!_iteratorNormalCompletion && _iterator.return) {
                  _iterator.return();
                }

              case 55:
                _context3.prev = 55;

                if (!_didIteratorError) {
                  _context3.next = 58;
                  break;
                }

                throw _iteratorError;

              case 58:
                return _context3.finish(55);

              case 59:
                return _context3.finish(52);

              case 60:

                if (migrationsToRun.length == numMigrationsRan) this.log('All migrations finished successfully.'.green);
                return _context3.abrupt('return', migrationsRan);

              case 62:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee2, this, [[38, 48, 52, 60], [53,, 55, 59]]);
      }));

      function run() {
        return _ref3.apply(this, arguments);
      }

      return run;
    }()

    /**
     * Looks at the file system migrations and imports any migrations that are
     * on the file system but missing in the database into the database
     *
     * This functionality is opposite of prune()
     */

  }, {
    key: 'sync',
    value: function () {
      var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4() {
        var _this2 = this;

        var filesInMigrationFolder, migrationsInDatabase, migrationsInFolder, filesNotInDb, migrationsToImport, answers;
        return _regenerator2.default.wrap(function _callee4$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.prev = 0;
                filesInMigrationFolder = _fs2.default.readdirSync(this.migrationPath);
                _context5.next = 4;
                return MigrationModel.find({});

              case 4:
                migrationsInDatabase = _context5.sent;

                // Go over migrations in folder and delete any files not in DB
                migrationsInFolder = _lodash2.default.filter(filesInMigrationFolder, function (file) {
                  return (/\d{13,}\-.+.js$/.test(file)
                  );
                }).map(function (filename) {
                  var fileCreatedAt = parseInt(filename.split('-')[0]);
                  var existsInDatabase = migrationsInDatabase.some(function (m) {
                    return filename == m.filename;
                  });
                  return { createdAt: fileCreatedAt, filename: filename, existsInDatabase: existsInDatabase };
                });
                filesNotInDb = _lodash2.default.filter(migrationsInFolder, { existsInDatabase: false }).map(function (f) {
                  return f.filename;
                });
                migrationsToImport = filesNotInDb;

                this.log('Synchronizing database with file system migrations...');

                if (!(!this.autosync && migrationsToImport.length)) {
                  _context5.next = 14;
                  break;
                }

                _context5.next = 12;
                return new _bluebird2.default(function (resolve) {
                  _inquirer2.default.prompt({
                    type: 'checkbox',
                    message: 'The following migrations exist in the migrations folder but not in the database. Select the ones you want to import into the database',
                    name: 'migrationsToImport',
                    choices: filesNotInDb
                  }, function (answers) {
                    resolve(answers);
                  });
                });

              case 12:
                answers = _context5.sent;


                migrationsToImport = answers.migrationsToImport;

              case 14:
                return _context5.abrupt('return', _bluebird2.default.map(migrationsToImport, function () {
                  var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(migrationToImport) {
                    var filePath, timestampSeparatorIndex, timestamp, migrationName, createdMigration;
                    return _regenerator2.default.wrap(function _callee3$(_context4) {
                      while (1) {
                        switch (_context4.prev = _context4.next) {
                          case 0:
                            filePath = _path2.default.join(_this2.migrationPath, migrationToImport), timestampSeparatorIndex = migrationToImport.indexOf('-'), timestamp = migrationToImport.slice(0, timestampSeparatorIndex), migrationName = migrationToImport.slice(timestampSeparatorIndex + 1, migrationToImport.lastIndexOf('.'));


                            _this2.log('Adding migration ' + filePath + ' into database from file system. State is ' + 'DOWN'.red);
                            _context4.next = 4;
                            return MigrationModel.create({
                              name: migrationName,
                              createdAt: timestamp
                            });

                          case 4:
                            createdMigration = _context4.sent;
                            return _context4.abrupt('return', createdMigration.toJSON());

                          case 6:
                          case 'end':
                            return _context4.stop();
                        }
                      }
                    }, _callee3, _this2);
                  }));

                  return function (_x4) {
                    return _ref5.apply(this, arguments);
                  };
                }()));

              case 17:
                _context5.prev = 17;
                _context5.t0 = _context5['catch'](0);

                this.log('Could not synchronise migrations in the migrations folder up to the database.'.red);
                throw _context5.t0;

              case 21:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee4, this, [[0, 17]]);
      }));

      function sync() {
        return _ref4.apply(this, arguments);
      }

      return sync;
    }()

    /**
     * Opposite of sync().
     * Removes files in migration directory which don't exist in database.
     */

  }, {
    key: 'prune',
    value: function () {
      var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5() {
        var filesInMigrationFolder, migrationsInDatabase, migrationsInFolder, dbMigrationsNotOnFs, migrationsToDelete, answers, migrationsToDeleteDocs;
        return _regenerator2.default.wrap(function _callee5$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.prev = 0;
                filesInMigrationFolder = _fs2.default.readdirSync(this.migrationPath);
                _context6.next = 4;
                return MigrationModel.find({});

              case 4:
                migrationsInDatabase = _context6.sent;

                // Go over migrations in folder and delete any files not in DB
                migrationsInFolder = _lodash2.default.filter(filesInMigrationFolder, function (file) {
                  return (/\d{13,}\-.+.js/.test(file)
                  );
                }).map(function (filename) {
                  var fileCreatedAt = parseInt(filename.split('-')[0]);
                  var existsInDatabase = migrationsInDatabase.some(function (m) {
                    return filename == m.filename;
                  });
                  return { createdAt: fileCreatedAt, filename: filename, existsInDatabase: existsInDatabase };
                });
                dbMigrationsNotOnFs = _lodash2.default.filter(migrationsInDatabase, function (m) {
                  return !_lodash2.default.find(migrationsInFolder, { filename: m.filename });
                });
                migrationsToDelete = dbMigrationsNotOnFs.map(function (m) {
                  return m.name;
                });

                if (!(!this.autosync && !!migrationsToDelete.length)) {
                  _context6.next = 13;
                  break;
                }

                _context6.next = 11;
                return new _bluebird2.default(function (resolve) {
                  _inquirer2.default.prompt({
                    type: 'checkbox',
                    message: 'The following migrations exist in the database but not in the migrations folder. Select the ones you want to remove from the file system.',
                    name: 'migrationsToDelete',
                    choices: migrationsToDelete
                  }, function (answers) {
                    resolve(answers);
                  });
                });

              case 11:
                answers = _context6.sent;


                migrationsToDelete = answers.migrationsToDelete;

              case 13:
                _context6.next = 15;
                return MigrationModel.find({
                  name: { $in: migrationsToDelete }
                }).lean();

              case 15:
                migrationsToDeleteDocs = _context6.sent;

                if (!migrationsToDelete.length) {
                  _context6.next = 20;
                  break;
                }

                this.log('Removing migration(s) ', ('' + migrationsToDelete.join(', ')).cyan, ' from database');
                _context6.next = 20;
                return MigrationModel.remove({
                  name: { $in: migrationsToDelete }
                });

              case 20:
                return _context6.abrupt('return', migrationsToDeleteDocs);

              case 23:
                _context6.prev = 23;
                _context6.t0 = _context6['catch'](0);

                this.log('Could not prune extraneous migrations from database.'.red);
                throw _context6.t0;

              case 27:
              case 'end':
                return _context6.stop();
            }
          }
        }, _callee5, this, [[0, 23]]);
      }));

      function prune() {
        return _ref6.apply(this, arguments);
      }

      return prune;
    }()

    /**
     * Lists the current migrations and their statuses
     * @returns {Promise<Array<Object>>}
     * @example
     *   [
     *    { name: 'my-migration', filename: '149213223424_my-migration.js', state: 'up' },
     *    { name: 'add-cows', filename: '149213223453_add-cows.js', state: 'down' }
     *   ]
     */

  }, {
    key: 'list',
    value: function () {
      var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6() {
        var _this3 = this;

        var migrations;
        return _regenerator2.default.wrap(function _callee6$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                _context7.next = 2;
                return this.sync();

              case 2:
                _context7.next = 4;
                return MigrationModel.find().sort({ createdAt: 1 });

              case 4:
                migrations = _context7.sent;

                if (!migrations.length) this.log('There are no migrations to list.'.yellow);
                return _context7.abrupt('return', migrations.map(function (m) {
                  _this3.log(('' + (m.state == 'up' ? 'UP:  \t' : 'DOWN:\t'))[m.state == 'up' ? 'green' : 'red'] + (' ' + m.filename));
                  return m.toJSON();
                }));

              case 7:
              case 'end':
                return _context7.stop();
            }
          }
        }, _callee6, this);
      }));

      function list() {
        return _ref7.apply(this, arguments);
      }

      return list;
    }()
  }]);
  return Migrator;
}();

exports.default = Migrator;


function fileRequired(error) {
  if (error && error.code == 'ENOENT') {
    throw new ReferenceError('Could not find any files at path \'' + error.path + '\'');
  }
}

module.exports = Migrator;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9saWIuanMiXSwibmFtZXMiOlsiTWlncmF0aW9uTW9kZWwiLCJjb25maWciLCJ3YXJuaW5ncyIsImVzNlRlbXBsYXRlIiwiZXM1VGVtcGxhdGUiLCJNaWdyYXRvciIsInRlbXBsYXRlUGF0aCIsIm1pZ3JhdGlvbnNQYXRoIiwiZGJDb25uZWN0aW9uVXJpIiwiZXM2VGVtcGxhdGVzIiwiY29sbGVjdGlvbk5hbWUiLCJhdXRvc3luYyIsImNsaSIsImNvbm5lY3Rpb24iLCJkZWZhdWx0VGVtcGxhdGUiLCJ0ZW1wbGF0ZSIsInJlYWRGaWxlU3luYyIsIm1pZ3JhdGlvblBhdGgiLCJyZXNvbHZlIiwiY3JlYXRlQ29ubmVjdGlvbiIsImVzNiIsImNvbGxlY3Rpb24iLCJsb2dTdHJpbmciLCJmb3JjZSIsImNvbnNvbGUiLCJsb2ciLCJjbG9zZSIsIm1pZ3JhdGlvbk5hbWUiLCJmaW5kT25lIiwibmFtZSIsImV4aXN0aW5nTWlncmF0aW9uIiwiRXJyb3IiLCJyZWQiLCJzeW5jIiwibm93IiwiRGF0ZSIsIm5ld01pZ3JhdGlvbkZpbGUiLCJ3cml0ZUZpbGVTeW5jIiwiam9pbiIsImNyZWF0ZSIsImNyZWF0ZWRBdCIsIm1pZ3JhdGlvbkNyZWF0ZWQiLCJzdGFjayIsImZpbGVSZXF1aXJlZCIsImRpcmVjdGlvbiIsInNvcnQiLCJ1bnRpbE1pZ3JhdGlvbiIsIlJlZmVyZW5jZUVycm9yIiwicXVlcnkiLCIkbHRlIiwic3RhdGUiLCIkZ3RlIiwic29ydERpcmVjdGlvbiIsImZpbmQiLCJtaWdyYXRpb25zVG9SdW4iLCJsZW5ndGgiLCJ5ZWxsb3ciLCJsaXN0Iiwic2VsZiIsIm51bU1pZ3JhdGlvbnNSYW4iLCJtaWdyYXRpb25zUmFuIiwibWlncmF0aW9uIiwibWlncmF0aW9uRmlsZVBhdGgiLCJmaWxlbmFtZSIsInJlcXVpcmUiLCJtaWdyYXRpb25GdW5jdGlvbnMiLCJtZXNzYWdlIiwidGVzdCIsInJlamVjdCIsImNhbGxQcm9taXNlIiwiY2FsbCIsIm1vZGVsIiwiYmluZCIsImNhbGxiYWNrIiwiZXJyIiwidGhlbiIsImNhdGNoIiwidG9VcHBlckNhc2UiLCJ3aGVyZSIsInVwZGF0ZSIsIiRzZXQiLCJwdXNoIiwidG9KU09OIiwiZ3JlZW4iLCJmaWxlc0luTWlncmF0aW9uRm9sZGVyIiwicmVhZGRpclN5bmMiLCJtaWdyYXRpb25zSW5EYXRhYmFzZSIsIm1pZ3JhdGlvbnNJbkZvbGRlciIsImZpbHRlciIsImZpbGUiLCJtYXAiLCJmaWxlQ3JlYXRlZEF0IiwicGFyc2VJbnQiLCJzcGxpdCIsImV4aXN0c0luRGF0YWJhc2UiLCJzb21lIiwibSIsImZpbGVzTm90SW5EYiIsImYiLCJtaWdyYXRpb25zVG9JbXBvcnQiLCJwcm9tcHQiLCJ0eXBlIiwiY2hvaWNlcyIsImFuc3dlcnMiLCJtaWdyYXRpb25Ub0ltcG9ydCIsImZpbGVQYXRoIiwidGltZXN0YW1wU2VwYXJhdG9ySW5kZXgiLCJpbmRleE9mIiwidGltZXN0YW1wIiwic2xpY2UiLCJsYXN0SW5kZXhPZiIsImNyZWF0ZWRNaWdyYXRpb24iLCJkYk1pZ3JhdGlvbnNOb3RPbkZzIiwibWlncmF0aW9uc1RvRGVsZXRlIiwiJGluIiwibGVhbiIsIm1pZ3JhdGlvbnNUb0RlbGV0ZURvY3MiLCJjeWFuIiwicmVtb3ZlIiwibWlncmF0aW9ucyIsImVycm9yIiwiY29kZSIsInBhdGgiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBRUE7Ozs7OztBQUNBLElBQUlBLHVCQUFKOztBQUVBLG1CQUFRQyxNQUFSLENBQWU7QUFDYkMsWUFBVTtBQURHLENBQWY7O0FBSUEsSUFBTUMsOFNBQU47O0FBaUJBLElBQU1DLDBTQUFOOztJQW1CcUJDLFE7QUFDbkIsMEJBU0c7QUFBQSxRQVJEQyxZQVFDLFFBUkRBLFlBUUM7QUFBQSxtQ0FQREMsY0FPQztBQUFB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NUM7a0RBQ2pCK0QsV0FBVzdCLEdBQVgsQ0FBZSxVQUFDTSxDQUFELEVBQU87QUFDM0IseUJBQUt2RSxHQUFMLENBQ0UsT0FBR3VFLEVBQUU5QyxLQUFGLElBQVcsSUFBWCxHQUFrQixTQUFsQixHQUE4QixTQUFqQyxHQUE2QzhDLEVBQUU5QyxLQUFGLElBQVcsSUFBWCxHQUFpQixPQUFqQixHQUEyQixLQUF4RSxXQUNJOEMsRUFBRWpDLFFBRE4sQ0FERjtBQUlBLHlCQUFPaUMsRUFBRWQsTUFBRixFQUFQO0FBQ0QsaUJBTk0sQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7a0JBbFRVN0UsUTs7O0FBOFRyQixTQUFTc0MsWUFBVCxDQUFzQjZFLEtBQXRCLEVBQTZCO0FBQzNCLE1BQUlBLFNBQVNBLE1BQU1DLElBQU4sSUFBYyxRQUEzQixFQUFxQztBQUNuQyxVQUFNLElBQUkxRSxjQUFKLHlDQUF3RHlFLE1BQU1FLElBQTlELFFBQU47QUFDRDtBQUNGOztBQUdEQyxPQUFPQyxPQUFQLEdBQWlCdkgsUUFBakIiLCJmaWxlIjoibGliLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XHJcbmltcG9ydCBmcyBmcm9tICdmcyc7XHJcbmltcG9ydCBta2RpcnAgZnJvbSAnbWtkaXJwJztcclxuaW1wb3J0IFByb21pc2UgZnJvbSAnYmx1ZWJpcmQnO1xyXG5pbXBvcnQgJ2NvbG9ycyc7XHJcbmltcG9ydCBtb25nb29zZSBmcm9tICdtb25nb29zZSc7XHJcbmltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XHJcbmltcG9ydCBhc2sgZnJvbSAnaW5xdWlyZXInO1xyXG5cclxuaW1wb3J0IE1pZ3JhdGlvbk1vZGVsRmFjdG9yeSBmcm9tICcuL2RiJztcclxubGV0IE1pZ3JhdGlvbk1vZGVsO1xyXG5cclxuUHJvbWlzZS5jb25maWcoe1xyXG4gIHdhcm5pbmdzOiBmYWxzZVxyXG59KTtcclxuXHJcbmNvbnN0IGVzNlRlbXBsYXRlID1cclxuYFxyXG4vKipcclxuICogTWFrZSBhbnkgY2hhbmdlcyB5b3UgbmVlZCB0byBtYWtlIHRvIHRoZSBkYXRhYmFzZSBoZXJlXHJcbiAqL1xyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXAgKCkge1xyXG4gIC8vIFdyaXRlIG1pZ3JhdGlvbiBoZXJlXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBNYWtlIGFueSBjaGFuZ2VzIHRoYXQgVU5ETyB0aGUgdXAgZnVuY3Rpb24gc2lkZSBlZmZlY3RzIGhlcmUgKGlmIHBvc3NpYmxlKVxyXG4gKi9cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGRvd24gKCkge1xyXG4gIC8vIFdyaXRlIG1pZ3JhdGlvbiBoZXJlXHJcbn1cclxuYDtcclxuXHJcbmNvbnN0IGVzNVRlbXBsYXRlID1cclxuYCd1c2Ugc3RyaWN0JztcclxuXHJcbi8qKlxyXG4gKiBNYWtlIGFueSBjaGFuZ2VzIHlvdSBuZWVkIHRvIG1ha2UgdG8gdGhlIGRhdGFiYXNlIGhlcmVcclxuICovXHJcbmV4cG9ydHMudXAgPSBmdW5jdGlvbiB1cCAoZG9uZSkge1xyXG4gIGRvbmUoKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBNYWtlIGFueSBjaGFuZ2VzIHRoYXQgVU5ETyB0aGUgdXAgZnVuY3Rpb24gc2lkZSBlZmZlY3RzIGhlcmUgKGlmIHBvc3NpYmxlKVxyXG4gKi9cclxuZXhwb3J0cy5kb3duID0gZnVuY3Rpb24gZG93bihkb25lKSB7XHJcbiAgZG9uZSgpO1xyXG59O1xyXG5gO1xyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1pZ3JhdG9yIHtcclxuICBjb25zdHJ1Y3Rvcih7XHJcbiAgICB0ZW1wbGF0ZVBhdGgsXHJcbiAgICBtaWdyYXRpb25zUGF0aCA9ICcuL21pZ3JhdGlvbnMnLFxyXG4gICAgZGJDb25uZWN0aW9uVXJpLFxyXG4gICAgZXM2VGVtcGxhdGVzID0gZmFsc2UsXHJcbiAgICBjb2xsZWN0aW9uTmFtZSA9ICdtaWdyYXRpb25zJyxcclxuICAgIGF1dG9zeW5jID0gZmFsc2UsXHJcbiAgICBjbGkgPSBmYWxzZSxcclxuICAgIGNvbm5lY3Rpb25cclxuICB9KSB7XHJcbiAgICBjb25zdCBkZWZhdWx0VGVtcGxhdGUgPSBlczZUZW1wbGF0ZXMgPyAgZXM2VGVtcGxhdGUgOiBlczVUZW1wbGF0ZTtcclxuICAgIHRoaXMudGVtcGxhdGUgPSB0ZW1wbGF0ZVBhdGggPyBmcy5yZWFkRmlsZVN5bmModGVtcGxhdGVQYXRoLCAndXRmLTgnKSA6IGRlZmF1bHRUZW1wbGF0ZTtcclxuICAgIHRoaXMubWlncmF0aW9uUGF0aCA9IHBhdGgucmVzb2x2ZShtaWdyYXRpb25zUGF0aCk7XHJcbiAgICB0aGlzLmNvbm5lY3Rpb24gPSBjb25uZWN0aW9uIHx8IG1vbmdvb3NlLmNyZWF0ZUNvbm5lY3Rpb24oZGJDb25uZWN0aW9uVXJpKTtcclxuICAgIHRoaXMuZXM2ID0gZXM2VGVtcGxhdGVzO1xyXG4gICAgdGhpcy5jb2xsZWN0aW9uID0gY29sbGVjdGlvbk5hbWU7XHJcbiAgICB0aGlzLmF1dG9zeW5jID0gYXV0b3N5bmM7XHJcbiAgICB0aGlzLmNsaSA9IGNsaTtcclxuICAgIE1pZ3JhdGlvbk1vZGVsID0gTWlncmF0aW9uTW9kZWxGYWN0b3J5KGNvbGxlY3Rpb25OYW1lLCB0aGlzLmNvbm5lY3Rpb24pO1xyXG4gIH1cclxuXHJcbiAgbG9nIChsb2dTdHJpbmcsIGZvcmNlID0gZmFsc2UpIHtcclxuICAgIGlmIChmb3JjZSB8fCB0aGlzLmNsaSkge1xyXG4gICAgICBjb25zb2xlLmxvZyhsb2dTdHJpbmcpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogVXNlIHlvdXIgb3duIE1vbmdvb3NlIGNvbm5lY3Rpb24gb2JqZWN0IChzbyB5b3UgY2FuIHVzZSB0aGlzKCdtb2RlbG5hbWUnKVxyXG4gICAqIEBwYXJhbSB7bW9uZ29vc2UuY29ubmVjdGlvbn0gY29ubmVjdGlvbiAtIE1vbmdvb3NlIGNvbm5lY3Rpb25cclxuICAgKi9cclxuICBzZXRNb25nb29zZUNvbm5lY3Rpb24gKGNvbm5lY3Rpb24pIHtcclxuICAgIE1pZ3JhdGlvbk1vZGVsID0gTWlncmF0aW9uTW9kZWxGYWN0b3J5KHRoaXMuY29sbGVjdGlvbiwgY29ubmVjdGlvbilcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIENsb3NlIHRoZSB1bmRlcmx5aW5nIGNvbm5lY3Rpb24gdG8gbW9uZ29cclxuICAgKiBAcmV0dXJucyB7UHJvbWlzZX0gQSBwcm9taXNlIHRoYXQgcmVzb2x2ZXMgd2hlbiBjb25uZWN0aW9uIGlzIGNsb3NlZFxyXG4gICAqL1xyXG4gIGNsb3NlKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuY29ubmVjdGlvbiA/IHRoaXMuY29ubmVjdGlvbi5jbG9zZSgpIDogUHJvbWlzZS5yZXNvbHZlKCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBDcmVhdGUgYSBuZXcgbWlncmF0aW9uXHJcbiAgICogQHBhcmFtIHtzdHJpbmd9IG1pZ3JhdGlvbk5hbWVcclxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxPYmplY3Q+fSBBIHByb21pc2Ugb2YgdGhlIE1pZ3JhdGlvbiBjcmVhdGVkXHJcbiAgICovXHJcbiAgYXN5bmMgY3JlYXRlKG1pZ3JhdGlvbk5hbWUpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGNvbnN0IGV4aXN0aW5nTWlncmF0aW9uID0gYXdhaXQgTWlncmF0aW9uTW9kZWwuZmluZE9uZSh7IG5hbWU6IG1pZ3JhdGlvbk5hbWUgfSk7XHJcbiAgICAgIGlmICghIWV4aXN0aW5nTWlncmF0aW9uKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBUaGVyZSBpcyBhbHJlYWR5IGEgbWlncmF0aW9uIHdpdGggbmFtZSAnJHttaWdyYXRpb25OYW1lfScgaW4gdGhlIGRhdGFiYXNlYC5yZWQpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBhd2FpdCB0aGlzLnN5bmMoKTtcclxuICAgICAgY29uc3Qgbm93ID0gRGF0ZS5ub3coKTtcclxuICAgICAgY29uc3QgbmV3TWlncmF0aW9uRmlsZSA9IGAke25vd30tJHttaWdyYXRpb25OYW1lfS5qc2A7XHJcbiAgICAgIG1rZGlycC5zeW5jKHRoaXMubWlncmF0aW9uUGF0aCk7XHJcbiAgICAgIGZzLndyaXRlRmlsZVN5bmMocGF0aC5qb2luKHRoaXMubWlncmF0aW9uUGF0aCwgbmV3TWlncmF0aW9uRmlsZSksIHRoaXMudGVtcGxhdGUpO1xyXG4gICAgICAvLyBjcmVhdGUgaW5zdGFuY2UgaW4gZGJcclxuICAgICAgYXdhaXQgdGhpcy5jb25uZWN0aW9uO1xyXG4gICAgICBjb25zdCBtaWdyYXRpb25DcmVhdGVkID0gYXdhaXQgTWlncmF0aW9uTW9kZWwuY3JlYXRlKHtcclxuICAgICAgICBuYW1lOiBtaWdyYXRpb25OYW1lLFxyXG4gICAgICAgIGNyZWF0ZWRBdDogbm93XHJcbiAgICAgIH0pO1xyXG4gICAgICB0aGlzLmxvZyhgQ3JlYXRlZCBtaWdyYXRpb24gJHttaWdyYXRpb25OYW1lfSBpbiAke3RoaXMubWlncmF0aW9uUGF0aH0uYCk7XHJcbiAgICAgIHJldHVybiBtaWdyYXRpb25DcmVhdGVkO1xyXG4gICAgfSBjYXRjaChlcnJvcil7XHJcbiAgICAgIHRoaXMubG9nKGVycm9yLnN0YWNrKTtcclxuICAgICAgZmlsZVJlcXVpcmVkKGVycm9yKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJ1bnMgbWlncmF0aW9ucyB1cCB0byBvciBkb3duIHRvIGEgZ2l2ZW4gbWlncmF0aW9uIG5hbWVcclxuICAgKlxyXG4gICAqIEBwYXJhbSBtaWdyYXRpb25OYW1lXHJcbiAgICogQHBhcmFtIGRpcmVjdGlvblxyXG4gICAqL1xyXG4gIGFzeW5jIHJ1bihkaXJlY3Rpb24gPSAndXAnLCBtaWdyYXRpb25OYW1lKSB7XHJcbiAgICBhd2FpdCB0aGlzLnN5bmMoKTtcclxuXHJcbiAgICBjb25zdCB1bnRpbE1pZ3JhdGlvbiA9IG1pZ3JhdGlvbk5hbWUgP1xyXG4gICAgICBhd2FpdCBNaWdyYXRpb25Nb2RlbC5maW5kT25lKHtuYW1lOiBtaWdyYXRpb25OYW1lfSkgOlxyXG4gICAgICBhd2FpdCBNaWdyYXRpb25Nb2RlbC5maW5kT25lKCkuc29ydCh7Y3JlYXRlZEF0OiAtMX0pO1xyXG5cclxuICAgIGlmICghdW50aWxNaWdyYXRpb24pIHtcclxuICAgICAgaWYgKG1pZ3JhdGlvbk5hbWUpIHRocm93IG5ldyBSZWZlcmVuY2VFcnJvcihcIkNvdWxkIG5vdCBmaW5kIHRoYXQgbWlncmF0aW9uIGluIHRoZSBkYXRhYmFzZVwiKTtcclxuICAgICAgZWxzZSB0aHJvdyBuZXcgRXJyb3IoXCJUaGVyZSBhcmUgbm8gcGVuZGluZyBtaWdyYXRpb25zLlwiKTtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgcXVlcnkgPSB7XHJcbiAgICAgIGNyZWF0ZWRBdDogeyRsdGU6IHVudGlsTWlncmF0aW9uLmNyZWF0ZWRBdH0sXHJcbiAgICAgIHN0YXRlOiAnZG93bidcclxuICAgIH07XHJcblxyXG4gICAgaWYgKGRpcmVjdGlvbiA9PSAnZG93bicpIHtcclxuICAgICAgcXVlcnkgPSB7XHJcbiAgICAgICAgY3JlYXRlZEF0OiB7JGd0ZTogdW50aWxNaWdyYXRpb24uY3JlYXRlZEF0fSxcclxuICAgICAgICBzdGF0ZTogJ3VwJ1xyXG4gICAgICB9O1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBjb25zdCBzb3J0RGlyZWN0aW9uID0gZGlyZWN0aW9uID09ICd1cCcgPyAxIDogLTE7XHJcbiAgICBjb25zdCBtaWdyYXRpb25zVG9SdW4gPSBhd2FpdCBNaWdyYXRpb25Nb2RlbC5maW5kKHF1ZXJ5KVxyXG4gICAgICAuc29ydCh7Y3JlYXRlZEF0OiBzb3J0RGlyZWN0aW9ufSk7XHJcblxyXG4gICAgaWYgKCFtaWdyYXRpb25zVG9SdW4ubGVuZ3RoKSB7XHJcbiAgICAgIGlmICh0aGlzLmNsaSkge1xyXG4gICAgICAgIHRoaXMubG9nKCdUaGVyZSBhcmUgbm8gbWlncmF0aW9ucyB0byBydW4nLnllbGxvdyk7XHJcbiAgICAgICAgdGhpcy5sb2coYEN1cnJlbnQgTWlncmF0aW9ucycgU3RhdHVzZXM6IGApO1xyXG4gICAgICAgIGF3YWl0IHRoaXMubGlzdCgpO1xyXG4gICAgICAgIHJldHVybiBbXTtcclxuICAgICAgfVxyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZXJlIGFyZSBubyBtaWdyYXRpb25zIHRvIHJ1bicpO1xyXG4gICAgfVxyXG5cclxuICAgIGxldCBzZWxmID0gdGhpcztcclxuICAgIGxldCBudW1NaWdyYXRpb25zUmFuID0gMDtcclxuICAgIGxldCBtaWdyYXRpb25zUmFuID0gW107XHJcblxyXG4gICAgZm9yIChjb25zdCBtaWdyYXRpb24gb2YgbWlncmF0aW9uc1RvUnVuKSB7XHJcbiAgICAgIGNvbnN0IG1pZ3JhdGlvbkZpbGVQYXRoID0gcGF0aC5qb2luKHNlbGYubWlncmF0aW9uUGF0aCwgbWlncmF0aW9uLmZpbGVuYW1lKTtcclxuICAgICAgaWYgKHRoaXMuZXM2KSB7XHJcbiAgICAgICAgcmVxdWlyZSgnYmFiZWwtcmVnaXN0ZXInKSh7XHJcbiAgICAgICAgICBcInByZXNldHNcIjogW3JlcXVpcmUoXCJiYWJlbC1wcmVzZXQtbGF0ZXN0XCIpXSxcclxuICAgICAgICAgIFwicGx1Z2luc1wiOiBbcmVxdWlyZShcImJhYmVsLXBsdWdpbi10cmFuc2Zvcm0tcnVudGltZVwiKV1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmVxdWlyZSgnYmFiZWwtcG9seWZpbGwnKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgbGV0IG1pZ3JhdGlvbkZ1bmN0aW9ucztcclxuXHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgbWlncmF0aW9uRnVuY3Rpb25zID0gcmVxdWlyZShtaWdyYXRpb25GaWxlUGF0aCk7XHJcbiAgICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICAgIGVyci5tZXNzYWdlID0gZXJyLm1lc3NhZ2UgJiYgL1VuZXhwZWN0ZWQgdG9rZW4vLnRlc3QoZXJyLm1lc3NhZ2UpID9cclxuICAgICAgICAgICdVbmV4cGVjdGVkIFRva2VuIHdoZW4gcGFyc2luZyBtaWdyYXRpb24uIElmIHlvdSBhcmUgdXNpbmcgYW4gRVM2IG1pZ3JhdGlvbiBmaWxlLCB1c2Ugb3B0aW9uIC0tZXM2JyA6XHJcbiAgICAgICAgICBlcnIubWVzc2FnZTtcclxuICAgICAgICB0aHJvdyBlcnI7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICghbWlncmF0aW9uRnVuY3Rpb25zW2RpcmVjdGlvbl0pIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IgKGBUaGUgJHtkaXJlY3Rpb259IGV4cG9ydCBpcyBub3QgZGVmaW5lZCBpbiAke21pZ3JhdGlvbi5maWxlbmFtZX0uYC5yZWQpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0cnkge1xyXG4gICAgICAgIGF3YWl0IG5ldyBQcm9taXNlKCAocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICBjb25zdCBjYWxsUHJvbWlzZSA9ICBtaWdyYXRpb25GdW5jdGlvbnNbZGlyZWN0aW9uXS5jYWxsKFxyXG4gICAgICAgICAgICB0aGlzLmNvbm5lY3Rpb24ubW9kZWwuYmluZCh0aGlzLmNvbm5lY3Rpb24pLFxyXG4gICAgICAgICAgICBmdW5jdGlvbiBjYWxsYmFjayhlcnIpIHtcclxuICAgICAgICAgICAgICBpZiAoZXJyKSByZXR1cm4gcmVqZWN0KGVycik7XHJcbiAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgIGlmIChjYWxsUHJvbWlzZSAmJiB0eXBlb2YgY2FsbFByb21pc2UudGhlbiA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICBjYWxsUHJvbWlzZS50aGVuKHJlc29sdmUpLmNhdGNoKHJlamVjdCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMubG9nKGAke2RpcmVjdGlvbi50b1VwcGVyQ2FzZSgpfTogICBgW2RpcmVjdGlvbiA9PSAndXAnPyAnZ3JlZW4nIDogJ3JlZCddICsgYCAke21pZ3JhdGlvbi5maWxlbmFtZX0gYCk7XHJcblxyXG4gICAgICAgIGF3YWl0IE1pZ3JhdGlvbk1vZGVsLndoZXJlKHtuYW1lOiBtaWdyYXRpb24ubmFtZX0pLnVwZGF0ZSh7JHNldDoge3N0YXRlOiBkaXJlY3Rpb259fSk7XHJcbiAgICAgICAgbWlncmF0aW9uc1Jhbi5wdXNoKG1pZ3JhdGlvbi50b0pTT04oKSk7XHJcbiAgICAgICAgbnVtTWlncmF0aW9uc1JhbisrO1xyXG4gICAgICB9IGNhdGNoKGVycikge1xyXG4gICAgICAgIHRoaXMubG9nKGBGYWlsZWQgdG8gcnVuIG1pZ3JhdGlvbiAke21pZ3JhdGlvbi5uYW1lfSBkdWUgdG8gYW4gZXJyb3IuYC5yZWQpO1xyXG4gICAgICAgIHRoaXMubG9nKGBOb3QgY29udGludWluZy4gTWFrZSBzdXJlIHlvdXIgZGF0YSBpcyBpbiBjb25zaXN0ZW50IHN0YXRlYC5yZWQpO1xyXG4gICAgICAgIHRocm93IGVyciBpbnN0YW5jZW9mKEVycm9yKSA/IGVyciA6IG5ldyBFcnJvcihlcnIpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKG1pZ3JhdGlvbnNUb1J1bi5sZW5ndGggPT0gbnVtTWlncmF0aW9uc1JhbikgdGhpcy5sb2coJ0FsbCBtaWdyYXRpb25zIGZpbmlzaGVkIHN1Y2Nlc3NmdWxseS4nLmdyZWVuKTtcclxuICAgIHJldHVybiBtaWdyYXRpb25zUmFuO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogTG9va3MgYXQgdGhlIGZpbGUgc3lzdGVtIG1pZ3JhdGlvbnMgYW5kIGltcG9ydHMgYW55IG1pZ3JhdGlvbnMgdGhhdCBhcmVcclxuICAgKiBvbiB0aGUgZmlsZSBzeXN0ZW0gYnV0IG1pc3NpbmcgaW4gdGhlIGRhdGFiYXNlIGludG8gdGhlIGRhdGFiYXNlXHJcbiAgICpcclxuICAgKiBUaGlzIGZ1bmN0aW9uYWxpdHkgaXMgb3Bwb3NpdGUgb2YgcHJ1bmUoKVxyXG4gICAqL1xyXG4gIGFzeW5jIHN5bmMoKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICBjb25zdCBmaWxlc0luTWlncmF0aW9uRm9sZGVyID0gZnMucmVhZGRpclN5bmModGhpcy5taWdyYXRpb25QYXRoKTtcclxuICAgICAgY29uc3QgbWlncmF0aW9uc0luRGF0YWJhc2UgPSBhd2FpdCBNaWdyYXRpb25Nb2RlbC5maW5kKHt9KTtcclxuICAgICAgLy8gR28gb3ZlciBtaWdyYXRpb25zIGluIGZvbGRlciBhbmQgZGVsZXRlIGFueSBmaWxlcyBub3QgaW4gREJcclxuICAgICAgY29uc3QgbWlncmF0aW9uc0luRm9sZGVyID0gXy5maWx0ZXIoZmlsZXNJbk1pZ3JhdGlvbkZvbGRlciwgZmlsZSA9PiAvXFxkezEzLH1cXC0uKy5qcyQvLnRlc3QoZmlsZSkpXHJcbiAgICAgICAgLm1hcChmaWxlbmFtZSA9PiB7XHJcbiAgICAgICAgICBjb25zdCBmaWxlQ3JlYXRlZEF0ID0gcGFyc2VJbnQoZmlsZW5hbWUuc3BsaXQoJy0nKVswXSk7XHJcbiAgICAgICAgICBjb25zdCBleGlzdHNJbkRhdGFiYXNlID0gbWlncmF0aW9uc0luRGF0YWJhc2Uuc29tZShtID0+IGZpbGVuYW1lID09IG0uZmlsZW5hbWUpO1xyXG4gICAgICAgICAgcmV0dXJuIHtjcmVhdGVkQXQ6IGZpbGVDcmVhdGVkQXQsIGZpbGVuYW1lLCBleGlzdHNJbkRhdGFiYXNlfTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgIGNvbnN0IGZpbGVzTm90SW5EYiA9IF8uZmlsdGVyKG1pZ3JhdGlvbnNJbkZvbGRlciwge2V4aXN0c0luRGF0YWJhc2U6IGZhbHNlfSkubWFwKGYgPT4gZi5maWxlbmFtZSk7XHJcbiAgICAgIGxldCBtaWdyYXRpb25zVG9JbXBvcnQgPSBmaWxlc05vdEluRGI7XHJcbiAgICAgIHRoaXMubG9nKCdTeW5jaHJvbml6aW5nIGRhdGFiYXNlIHdpdGggZmlsZSBzeXN0ZW0gbWlncmF0aW9ucy4uLicpO1xyXG4gICAgICBpZiAoIXRoaXMuYXV0b3N5bmMgJiYgbWlncmF0aW9uc1RvSW1wb3J0Lmxlbmd0aCkge1xyXG4gICAgICAgIGNvbnN0IGFuc3dlcnMgPSBhd2FpdCBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSkge1xyXG4gICAgICAgICAgYXNrLnByb21wdCh7XHJcbiAgICAgICAgICAgIHR5cGU6ICdjaGVja2JveCcsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6ICdUaGUgZm9sbG93aW5nIG1pZ3JhdGlvbnMgZXhpc3QgaW4gdGhlIG1pZ3JhdGlvbnMgZm9sZGVyIGJ1dCBub3QgaW4gdGhlIGRhdGFiYXNlLiBTZWxlY3QgdGhlIG9uZXMgeW91IHdhbnQgdG8gaW1wb3J0IGludG8gdGhlIGRhdGFiYXNlJyxcclxuICAgICAgICAgICAgbmFtZTogJ21pZ3JhdGlvbnNUb0ltcG9ydCcsXHJcbiAgICAgICAgICAgIGNob2ljZXM6IGZpbGVzTm90SW5EYlxyXG4gICAgICAgICAgfSwgKGFuc3dlcnMpID0+IHtcclxuICAgICAgICAgICAgcmVzb2x2ZShhbnN3ZXJzKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBtaWdyYXRpb25zVG9JbXBvcnQgPSBhbnN3ZXJzLm1pZ3JhdGlvbnNUb0ltcG9ydDtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIFByb21pc2UubWFwKG1pZ3JhdGlvbnNUb0ltcG9ydCwgYXN5bmMgKG1pZ3JhdGlvblRvSW1wb3J0KSA9PiB7XHJcbiAgICAgICAgY29uc3QgZmlsZVBhdGggPSBwYXRoLmpvaW4odGhpcy5taWdyYXRpb25QYXRoLCBtaWdyYXRpb25Ub0ltcG9ydCksXHJcbiAgICAgICAgICB0aW1lc3RhbXBTZXBhcmF0b3JJbmRleCA9IG1pZ3JhdGlvblRvSW1wb3J0LmluZGV4T2YoJy0nKSxcclxuICAgICAgICAgIHRpbWVzdGFtcCA9IG1pZ3JhdGlvblRvSW1wb3J0LnNsaWNlKDAsIHRpbWVzdGFtcFNlcGFyYXRvckluZGV4KSxcclxuICAgICAgICAgIG1pZ3JhdGlvbk5hbWUgPSBtaWdyYXRpb25Ub0ltcG9ydC5zbGljZSh0aW1lc3RhbXBTZXBhcmF0b3JJbmRleCArIDEsIG1pZ3JhdGlvblRvSW1wb3J0Lmxhc3RJbmRleE9mKCcuJykpO1xyXG5cclxuICAgICAgICB0aGlzLmxvZyhgQWRkaW5nIG1pZ3JhdGlvbiAke2ZpbGVQYXRofSBpbnRvIGRhdGFiYXNlIGZyb20gZmlsZSBzeXN0ZW0uIFN0YXRlIGlzIGAgKyBgRE9XTmAucmVkKTtcclxuICAgICAgICBjb25zdCBjcmVhdGVkTWlncmF0aW9uID0gYXdhaXQgTWlncmF0aW9uTW9kZWwuY3JlYXRlKHtcclxuICAgICAgICAgIG5hbWU6IG1pZ3JhdGlvbk5hbWUsXHJcbiAgICAgICAgICBjcmVhdGVkQXQ6IHRpbWVzdGFtcFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBjcmVhdGVkTWlncmF0aW9uLnRvSlNPTigpO1xyXG4gICAgICB9KTtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgIHRoaXMubG9nKGBDb3VsZCBub3Qgc3luY2hyb25pc2UgbWlncmF0aW9ucyBpbiB0aGUgbWlncmF0aW9ucyBmb2xkZXIgdXAgdG8gdGhlIGRhdGFiYXNlLmAucmVkKTtcclxuICAgICAgdGhyb3cgZXJyb3I7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBPcHBvc2l0ZSBvZiBzeW5jKCkuXHJcbiAgICogUmVtb3ZlcyBmaWxlcyBpbiBtaWdyYXRpb24gZGlyZWN0b3J5IHdoaWNoIGRvbid0IGV4aXN0IGluIGRhdGFiYXNlLlxyXG4gICAqL1xyXG4gIGFzeW5jIHBydW5lKCkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3QgZmlsZXNJbk1pZ3JhdGlvbkZvbGRlciA9IGZzLnJlYWRkaXJTeW5jKHRoaXMubWlncmF0aW9uUGF0aCk7XHJcbiAgICAgIGNvbnN0IG1pZ3JhdGlvbnNJbkRhdGFiYXNlID0gYXdhaXQgTWlncmF0aW9uTW9kZWwuZmluZCh7fSk7XHJcbiAgICAgIC8vIEdvIG92ZXIgbWlncmF0aW9ucyBpbiBmb2xkZXIgYW5kIGRlbGV0ZSBhbnkgZmlsZXMgbm90IGluIERCXHJcbiAgICAgIGNvbnN0IG1pZ3JhdGlvbnNJbkZvbGRlciA9IF8uZmlsdGVyKGZpbGVzSW5NaWdyYXRpb25Gb2xkZXIsIGZpbGUgPT4gL1xcZHsxMyx9XFwtLisuanMvLnRlc3QoZmlsZSkgKVxyXG4gICAgICAgIC5tYXAoZmlsZW5hbWUgPT4ge1xyXG4gICAgICAgICAgY29uc3QgZmlsZUNyZWF0ZWRBdCA9IHBhcnNlSW50KGZpbGVuYW1lLnNwbGl0KCctJylbMF0pO1xyXG4gICAgICAgICAgY29uc3QgZXhpc3RzSW5EYXRhYmFzZSA9IG1pZ3JhdGlvbnNJbkRhdGFiYXNlLnNvbWUobSA9PiBmaWxlbmFtZSA9PSBtLmZpbGVuYW1lKTtcclxuICAgICAgICAgIHJldHVybiB7IGNyZWF0ZWRBdDogZmlsZUNyZWF0ZWRBdCwgZmlsZW5hbWUsICBleGlzdHNJbkRhdGFiYXNlIH07XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICBjb25zdCBkYk1pZ3JhdGlvbnNOb3RPbkZzID0gXy5maWx0ZXIobWlncmF0aW9uc0luRGF0YWJhc2UsIG0gPT4ge1xyXG4gICAgICAgIHJldHVybiAhXy5maW5kKG1pZ3JhdGlvbnNJbkZvbGRlciwgeyBmaWxlbmFtZTogbS5maWxlbmFtZSB9KVxyXG4gICAgICB9KTtcclxuXHJcblxyXG4gICAgICBsZXQgbWlncmF0aW9uc1RvRGVsZXRlID0gZGJNaWdyYXRpb25zTm90T25Gcy5tYXAoIG0gPT4gbS5uYW1lICk7XHJcblxyXG4gICAgICBpZiAoIXRoaXMuYXV0b3N5bmMgJiYgISFtaWdyYXRpb25zVG9EZWxldGUubGVuZ3RoKSB7XHJcbiAgICAgICAgY29uc3QgYW5zd2VycyA9IGF3YWl0IG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlKSB7XHJcbiAgICAgICAgICBhc2sucHJvbXB0KHtcclxuICAgICAgICAgICAgdHlwZTogJ2NoZWNrYm94JyxcclxuICAgICAgICAgICAgbWVzc2FnZTogJ1RoZSBmb2xsb3dpbmcgbWlncmF0aW9ucyBleGlzdCBpbiB0aGUgZGF0YWJhc2UgYnV0IG5vdCBpbiB0aGUgbWlncmF0aW9ucyBmb2xkZXIuIFNlbGVjdCB0aGUgb25lcyB5b3Ugd2FudCB0byByZW1vdmUgZnJvbSB0aGUgZmlsZSBzeXN0ZW0uJyxcclxuICAgICAgICAgICAgbmFtZTogJ21pZ3JhdGlvbnNUb0RlbGV0ZScsXHJcbiAgICAgICAgICAgIGNob2ljZXM6IG1pZ3JhdGlvbnNUb0RlbGV0ZVxyXG4gICAgICAgICAgfSwgKGFuc3dlcnMpID0+IHtcclxuICAgICAgICAgICAgcmVzb2x2ZShhbnN3ZXJzKTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBtaWdyYXRpb25zVG9EZWxldGUgPSBhbnN3ZXJzLm1pZ3JhdGlvbnNUb0RlbGV0ZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgY29uc3QgbWlncmF0aW9uc1RvRGVsZXRlRG9jcyA9IGF3YWl0IE1pZ3JhdGlvbk1vZGVsXHJcbiAgICAgICAgLmZpbmQoe1xyXG4gICAgICAgICAgbmFtZTogeyAkaW46IG1pZ3JhdGlvbnNUb0RlbGV0ZSB9XHJcbiAgICAgICAgfSkubGVhbigpO1xyXG5cclxuICAgICAgaWYgKG1pZ3JhdGlvbnNUb0RlbGV0ZS5sZW5ndGgpIHtcclxuICAgICAgICB0aGlzLmxvZyhgUmVtb3ZpbmcgbWlncmF0aW9uKHMpIGAsIGAke21pZ3JhdGlvbnNUb0RlbGV0ZS5qb2luKCcsICcpfWAuY3lhbiwgYCBmcm9tIGRhdGFiYXNlYCk7XHJcbiAgICAgICAgYXdhaXQgTWlncmF0aW9uTW9kZWwucmVtb3ZlKHtcclxuICAgICAgICAgIG5hbWU6IHsgJGluOiBtaWdyYXRpb25zVG9EZWxldGUgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gbWlncmF0aW9uc1RvRGVsZXRlRG9jcztcclxuICAgIH0gY2F0Y2goZXJyb3IpIHtcclxuICAgICAgdGhpcy5sb2coYENvdWxkIG5vdCBwcnVuZSBleHRyYW5lb3VzIG1pZ3JhdGlvbnMgZnJvbSBkYXRhYmFzZS5gLnJlZCk7XHJcbiAgICAgIHRocm93IGVycm9yO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogTGlzdHMgdGhlIGN1cnJlbnQgbWlncmF0aW9ucyBhbmQgdGhlaXIgc3RhdHVzZXNcclxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxBcnJheTxPYmplY3Q+Pn1cclxuICAgKiBAZXhhbXBsZVxyXG4gICAqICAgW1xyXG4gICAqICAgIHsgbmFtZTogJ215LW1pZ3JhdGlvbicsIGZpbGVuYW1lOiAnMTQ5MjEzMjIzNDI0X215LW1pZ3JhdGlvbi5qcycsIHN0YXRlOiAndXAnIH0sXHJcbiAgICogICAgeyBuYW1lOiAnYWRkLWNvd3MnLCBmaWxlbmFtZTogJzE0OTIxMzIyMzQ1M19hZGQtY293cy5qcycsIHN0YXRlOiAnZG93bicgfVxyXG4gICAqICAgXVxyXG4gICAqL1xyXG4gIGFzeW5jIGxpc3QoKSB7XHJcbiAgICBhd2FpdCB0aGlzLnN5bmMoKTtcclxuICAgIGNvbnN0IG1pZ3JhdGlvbnMgPSBhd2FpdCBNaWdyYXRpb25Nb2RlbC5maW5kKCkuc29ydCh7IGNyZWF0ZWRBdDogMSB9KTtcclxuICAgIGlmICghbWlncmF0aW9ucy5sZW5ndGgpIHRoaXMubG9nKCdUaGVyZSBhcmUgbm8gbWlncmF0aW9ucyB0byBsaXN0LicueWVsbG93KTtcclxuICAgIHJldHVybiBtaWdyYXRpb25zLm1hcCgobSkgPT4ge1xyXG4gICAgICB0aGlzLmxvZyhcclxuICAgICAgICBgJHttLnN0YXRlID09ICd1cCcgPyAnVVA6ICBcXHQnIDogJ0RPV046XFx0J31gW20uc3RhdGUgPT0gJ3VwJz8gJ2dyZWVuJyA6ICdyZWQnXSArXHJcbiAgICAgICAgYCAke20uZmlsZW5hbWV9YFxyXG4gICAgICApO1xyXG4gICAgICByZXR1cm4gbS50b0pTT04oKTtcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG5cclxuXHJcblxyXG5mdW5jdGlvbiBmaWxlUmVxdWlyZWQoZXJyb3IpIHtcclxuICBpZiAoZXJyb3IgJiYgZXJyb3IuY29kZSA9PSAnRU5PRU5UJykge1xyXG4gICAgdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKGBDb3VsZCBub3QgZmluZCBhbnkgZmlsZXMgYXQgcGF0aCAnJHtlcnJvci5wYXRofSdgKTtcclxuICB9XHJcbn1cclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE1pZ3JhdG9yO1xyXG5cclxuIl19