"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const typeorm_1 = require("typeorm");
var socket = require('socket.io');
/**
 * Create Connection to the Database
 */
let server;
const connection = typeorm_1.createConnection().then((connection) => __awaiter(this, void 0, void 0, function* () {
    console.log(`Connection to ${connection.options.database} established`);
    server = app_1.default.listen(app_1.default.get('port'), function () {
        console.log('App is running on port', app_1.default.get('port'), app_1.default.get('env'));
    });
    exports.io = require('socket.io').listen(server);
})).catch(e => console.log(e));
exports.default = server;
//# sourceMappingURL=server.js.map