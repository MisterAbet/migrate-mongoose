'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  var collection = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'migrations';
  var dbConnection = arguments[1];


  var MigrationSchema = new _mongoose.Schema({
    name: String,
    createdAt: Date,
    state: {
      type: String,
      enum: ['down', 'up'],
      default: 'down'
    }
  }, {
    collection: collection,
    toJSON: {
      virtuals: true,
      transform: function transform(doc, ret, options) {
        delete ret._id;
        delete ret.id;
        delete ret.__v;
        return ret;
      }
    }
  });

  MigrationSchema.virtual('filename').get(function () {
    return this.createdAt.getTime() + '-' + this.name + '.js';
  });

  dbConnection.on('error', function (err) {
    console.error('MongoDB Connection Error: ' + err);
  });

  return dbConnection.model(collection, MigrationSchema);
};

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Factory function for a mongoose model
_mongoose2.default.Promise = _bluebird2.default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9kYi5qcyJdLCJuYW1lcyI6WyJjb2xsZWN0aW9uIiwiZGJDb25uZWN0aW9uIiwiTWlncmF0aW9uU2NoZW1hIiwibmFtZSIsIlN0cmluZyIsImNyZWF0ZWRBdCIsIkRhdGUiLCJzdGF0ZSIsInR5cGUiLCJlbnVtIiwiZGVmYXVsdCIsInRvSlNPTiIsInZpcnR1YWxzIiwidHJhbnNmb3JtIiwiZG9jIiwicmV0Iiwib3B0aW9ucyIsIl9pZCIsImlkIiwiX192IiwidmlydHVhbCIsImdldCIsImdldFRpbWUiLCJvbiIsImNvbnNvbGUiLCJlcnJvciIsImVyciIsIm1vZGVsIiwiUHJvbWlzZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O2tCQUtlLFlBQXFEO0FBQUEsTUFBMUNBLFVBQTBDLHVFQUE3QixZQUE2QjtBQUFBLE1BQWZDLFlBQWU7OztBQUVsRSxNQUFNQyxrQkFBa0IscUJBQVc7QUFDakNDLFVBQU1DLE1BRDJCO0FBRWpDQyxlQUFXQyxJQUZzQjtBQUdqQ0MsV0FBTztBQUNMQyxZQUFNSixNQUREO0FBRUxLLFlBQU0sQ0FBQyxNQUFELEVBQVMsSUFBVCxDQUZEO0FBR0xDLGVBQVM7QUFISjtBQUgwQixHQUFYLEVBUXJCO0FBQ0RWLGdCQUFZQSxVQURYO0FBRURXLFlBQVE7QUFDTkMsZ0JBQVUsSUFESjtBQUVOQyxpQkFBVyxtQkFBU0MsR0FBVCxFQUFjQyxHQUFkLEVBQW1CQyxPQUFuQixFQUE0QjtBQUNyQyxlQUFPRCxJQUFJRSxHQUFYO0FBQ0EsZUFBT0YsSUFBSUcsRUFBWDtBQUNBLGVBQU9ILElBQUlJLEdBQVg7QUFDQSxlQUFPSixHQUFQO0FBQ0Q7QUFQSztBQUZQLEdBUnFCLENBQXhCOztBQXFCQWIsa0JBQWdCa0IsT0FBaEIsQ0FBd0IsVUFBeEIsRUFBb0NDLEdBQXBDLENBQXdDLFlBQVc7QUFDakQsV0FBVSxLQUFLaEIsU0FBTCxDQUFlaUIsT0FBZixFQUFWLFNBQXNDLEtBQUtuQixJQUEzQztBQUNELEdBRkQ7O0FBSUFGLGVBQWFzQixFQUFiLENBQWdCLE9BQWhCLEVBQXlCLGVBQU87QUFDOUJDLFlBQVFDLEtBQVIsZ0NBQTJDQyxHQUEzQztBQUNELEdBRkQ7O0FBSUEsU0FBT3pCLGFBQWEwQixLQUFiLENBQW9CM0IsVUFBcEIsRUFBZ0NFLGVBQWhDLENBQVA7QUFDRCxDOztBQXJDRDs7OztBQUNBOzs7Ozs7QUFDQTtBQUNBLG1CQUFTMEIsT0FBVCIsImZpbGUiOiJkYi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBtb25nb29zZSwgeyBTY2hlbWEgfSAgZnJvbSAnbW9uZ29vc2UnO1xyXG5pbXBvcnQgUHJvbWlzZSBmcm9tICdibHVlYmlyZCc7XHJcbi8vIEZhY3RvcnkgZnVuY3Rpb24gZm9yIGEgbW9uZ29vc2UgbW9kZWxcclxubW9uZ29vc2UuUHJvbWlzZSA9IFByb21pc2U7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAoIGNvbGxlY3Rpb24gPSAnbWlncmF0aW9ucycsIGRiQ29ubmVjdGlvbiApIHtcclxuXHJcbiAgY29uc3QgTWlncmF0aW9uU2NoZW1hID0gbmV3IFNjaGVtYSh7XHJcbiAgICBuYW1lOiBTdHJpbmcsXHJcbiAgICBjcmVhdGVkQXQ6IERhdGUsXHJcbiAgICBzdGF0ZToge1xyXG4gICAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICAgIGVudW06IFsnZG93bicsICd1cCddLFxyXG4gICAgICBkZWZhdWx0OiAnZG93bidcclxuICAgIH1cclxuICB9LCB7XHJcbiAgICBjb2xsZWN0aW9uOiBjb2xsZWN0aW9uLFxyXG4gICAgdG9KU09OOiB7XHJcbiAgICAgIHZpcnR1YWxzOiB0cnVlLFxyXG4gICAgICB0cmFuc2Zvcm06IGZ1bmN0aW9uKGRvYywgcmV0LCBvcHRpb25zKSB7XHJcbiAgICAgICAgZGVsZXRlIHJldC5faWQ7XHJcbiAgICAgICAgZGVsZXRlIHJldC5pZDtcclxuICAgICAgICBkZWxldGUgcmV0Ll9fdjtcclxuICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG4gIE1pZ3JhdGlvblNjaGVtYS52aXJ0dWFsKCdmaWxlbmFtZScpLmdldChmdW5jdGlvbigpIHtcclxuICAgIHJldHVybiBgJHt0aGlzLmNyZWF0ZWRBdC5nZXRUaW1lKCl9LSR7dGhpcy5uYW1lfS5qc2A7XHJcbiAgfSk7XHJcblxyXG4gIGRiQ29ubmVjdGlvbi5vbignZXJyb3InLCBlcnIgPT4ge1xyXG4gICAgY29uc29sZS5lcnJvcihgTW9uZ29EQiBDb25uZWN0aW9uIEVycm9yOiAke2Vycn1gKTtcclxuICB9KTtcclxuXHJcbiAgcmV0dXJuIGRiQ29ubmVjdGlvbi5tb2RlbCggY29sbGVjdGlvbiwgTWlncmF0aW9uU2NoZW1hICk7XHJcbn1cclxuXHJcbiJdfQ==