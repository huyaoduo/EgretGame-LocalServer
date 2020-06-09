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
const vscode = require("vscode");
const http = require("http");
const StaticServer = require('static-server');
class EgretServer {
    constructor() {
        this.port = 5275;
        this._server = null;
        this.serverRunning = false;
    }
    getPortString() {
        return this.port.toString();
    }
    IsRunning() {
        return this.serverRunning;
    }
    getAvailablePort() {
        return new Promise((resolve, reject) => {
            const server = http.createServer();
            server.listen(0);
            server.on('listening', () => {
                this.port = 5275;
                server.close();
                resolve(this.port);
            });
        });
    }
    getServer() {
        if (this._server !== null) {
            this._server.port = this.port;
            return this._server;
        }
        const _rootPath = vscode.workspace.rootPath;
        const myStaticServer = new StaticServer({
            rootPath: _rootPath,
            port: this.port,
            name: 'egret-server',
            host: '0.0.0.0',
            cors: '*',
            followSymlink: true,
            templates: {
                index: 'index.html'
            }
        });
        this._server = myStaticServer;
        return this._server;
    }
    startServer() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                if (this.serverRunning) {
                    resolve();
                    return;
                }
                yield this.getAvailablePort();
                this.getServer().start(() => {
                    console.log("服务器开始");
                    this.serverRunning = true;
                    resolve();
                });
            }));
        });
    }
    stopServer() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.getServer().stop();
                this.serverRunning = false;
                console.log("停止");
                resolve();
            });
        });
    }
}
exports.EgretServer = EgretServer;

//# sourceMappingURL=egretServer.js.map
