"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var server_1 = require("./js/server");
var server = new server_1.WebServer(80);
server.start();
