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
const egretServer_1 = require("./debug/egretServer");
const fs = require("fs");
const os = require("os");
const path = require("path");
const qr = require("qr-image");
const url = require("url");
const vscode = require("vscode");
/**
 * 该类为插件工具聚合入口
 */
class Project {
    constructor() {
        this.debug = null;
        this.egretServer = null;
        this.currentPanel = undefined;
    }

    openServerQR() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.egretServer) {
                this.egretServer = new egretServer_1.EgretServer();
            }
            if (!this.egretServer.IsRunning()) {
                yield this.egretServer.startServer();
            }
            let egretPort = this.egretServer.getPortString();
            const ip = getLocalIP();
            const myURL = url.parse(`http://${ip}:${egretPort}/index.html`);
            this.showQRcodeWebview(myURL.href);
        });
    }

    getServerPort() {
        return this.egretServer.getPortString();
    }
    restartServer() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.egretServer.stopServer();
            yield this.openServerQR();
        });
    }
    updateQRcodeWebview(myUrl) {
        let qrImg = qr.imageSync(myUrl, { type: 'png' });
        let qrStr = 'data:image/png;base64,';
        if (typeof qrImg === 'string') {
            qrStr += qrImg;
        }
        else {
            qrStr += qrImg.toString('base64');
        }
        this.currentPanel.webview.html = getWebviewContent(qrStr, myUrl);
    }
    showQRcodeWebview(myUrl) {
        if (this.currentPanel) {
            // 已经存在就直接显示
            this.currentPanel.reveal(vscode.ViewColumn.One, true);
        }
        else {
            // 创建面板
            this.currentPanel = vscode.window.createWebviewPanel('EgretServer', 'Egret Server', vscode.ViewColumn.One, {
                enableScripts: true,
            });
            this.currentPanel.webview.onDidReceiveMessage(message => {
                switch (message.command) {
                    case 'restartServer':
                        this.restartServer();
                        return;
                    default: break;
                }
            }, undefined);
            this.currentPanel.onDidDispose(() => {
                this.currentPanel = undefined;
            });
        }
        this.updateQRcodeWebview(myUrl);
    }
}
exports.Project = Project;
function getLocalIP() {
    let ip = '';
    const ifaces = os.networkInterfaces();
    for (let net in ifaces) {
        let iface = ifaces[net];
        for (const alias of iface) {
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                ip = alias.address;
                break;
            }
        }
        if (ip) {
            break;
        }
    }
    return ip;
}
function getWebviewContent(qrImgSrc, address) {
    return (`<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Egret Server</title>
    <style type="text/css">
        body {
            background-color: #26292C;
            padding-top: 20px;
        }

        body div {
            width: 100%;
            display: flex;
            flex-flow: column;
            align-content: center;
            align-items: center;
        }

        a {
            font-family: Arial, Helvetica, sans-serif;
            font-size: 16px;
            color: aliceblue;
            margin-top: 10px;
            margin-bottom: 10px;
        }

        button {
            margin-top: 10px;
            width: 140px;
            line-height: 38px;
            text-align: center;
            font-weight: bold;
            color: #fff;
            text-shadow: 1px 1px 1px #333;
            border-radius: 5px;
            margin: 0 20px 20px 0;
            position: relative;
            overflow: hidden;
            outline: none;
        }

        .button:nth-child(6n) {
            margin-right: 0;
        }

        .button.black {
            border: 1px solid #333;
            box-shadow: 0 1px 2px #8b8b8b inset, 0 -1px 0 #3d3d3d inset, 0 -2px 3px #8b8b8b inset;
            background: -webkit-linear-gradient(top, #656565, #4c4c4c);
            background: -moz-linear-gradient(top, #656565, #4a4a4a);
            background: linear-gradient(top, #656565, #4a4a4a);
        }

        .round,
        .side,
        .tags {
            padding-right: 30px;
        }

        .round:after {
            position: absolute;
            display: inline-block;
            content: #03c000;
            top: 50%;
            right: 10px;
            margin-top: -10px;
            width: 17px;
            height: 20px;
            padding-left: 3px;
            line-height: 18px;
            font-size: 10px;
            font-weight: normal;
            border-radius: 10px;
            text-shadow: -2px 0 1px #333;
            -webkit-transform: rotate(-90deg);
            -moz-transform: rotate(-90deg);
            transform: rotate(-90deg);
        }

        .black.round:after {
            box-shadow: 1px 0 1px rgba(255, 255, 255, .5) inset, 1px 0 1px rgba(0, 0, 0, .9);
            background: -webkit-linear-gradient(top, #333, #454545);
            background: -moz-linear-gradient(top, #333, #454545);
            background: linear-gradient(top, #333, #454545);
        }

        .side:after {
            position: absolute;
            display: inline-block;
            content: #0bb000;
            top: 3px;
            right: -4px;
            width: 38px;
            height: 30px;
            font-weight: normal;
            line-height: 26px;
            border-radius: 0 0 5px 5px;
            text-shadow: -2px 0 1px #333;
            -webkit-transform: rotate(-90deg);
            -moz-transform: rotate(-90deg);
            transform: rotate(-90deg);
        }

        .black.side:after {
            border-top: 1px solid #222;
            box-shadow: -2px 0 1px #606060 inset;
            background: -webkit-linear-gradient(right, #373737, #555 60%);
            background: -moz-linear-gradient(right, #373737, #555 60%);
            background: linear-gradient(right, #373737, #555 60%);
        }

        .tags:after {
            font-weight: normal;
            position: absolute;
            display: inline-block;
            content: "FREE";
            top: -3px;
            right: -33px;
            color: #fff;
            text-shadow: none;
            width: 85px;
            height: 25px;
            line-height: 28px;
            -webkit-transform: rotate(45deg) scale(.7, .7);
            -moz-transform: rotate(45deg) scale(.7, .7);
            transform: rotate(45deg) scale(.7, .7);
        }

        .black.tags:after {
            background: #333;
            border: 2px solid #777;
        }

        .button.rarrow,
        .button.larrow {
            overflow: visible;
        }

        .rarrow:after,
        .rarrow:before,
        .larrow:after,
        .larrow:before {
            position: absolute;
            content: "";
            display: block;
            width: 28px;
            height: 28px;
            -webkit-transform: rotate(45deg);
            -moz-transform: rotate(45deg);
            transform: rotate(45deg);
        }

        .rarrow:before {
            width: 27px;
            height: 27px;
            top: 6px;
            right: -13px;
            clip: rect(auto auto 26px 2px);
        }

        .rarrow:after {
            top: 6px;
            right: -12px;
            clip: rect(auto auto 26px 2px);
        }

        .black.rarrow:before {
            background: #333;
        }

        .black.rarrow:after {
            box-shadow: 0 1px 0 #8B8B8B inset, -1px 0 0 #3d3d3d inset, -2px 0 0 #8B8B8B inset;
            background: -webkit-linear-gradient(top left, #656565, #4C4C4C);
            background: -moz-linear-gradient(top left, #656565, #4C4C4C);
            background: linear-gradient(top left, #656565, #4C4C4C);
        }

        .larrow:before {
            top: 6px;
            left: -13px;
            width: 27px;
            height: 27px;
            clip: rect(2px 26px auto auto);
        }

        .larrow:after {
            top: 6px;
            left: -12px;
            clip: rect(2px 26px auto auto);
        }

        .black.larrow:before {
            background: #333;
        }

        .black.larrow:after {
            box-shadow: 0 -1px 0 #3d3d3d inset, 0 -2px 0 #8B8B8B inset, 1px 0 0 #8B8B8B inset;
            background: -webkit-linear-gradient(top left, #656565, #4C4C4C);
            background: -moz-linear-gradient(top left, #656565, #4C4C4C);
            background: linear-gradient(top left, #656565, #4C4C4C);
        }

        .black:hover {
            background: -webkit-linear-gradient(top, #818181, #575757);
            background: -moz-linear-gradient(top, #818181, #575757);
            background: linear-gradient(top, #818181, #575757);
        }

        .black:active {
            top: 1px;
            box-shadow: 0 1px 3px #111 inset, 0 3px 0 #26292C;
            background: -webkit-linear-gradient(top, #424242, #575757);
            background: -moz-linear-gradient(top, #424242, #575757);
            background: linear-gradient(top, #424242, #575757);
        }

        .black.side:hover:after {
            background: -webkit-linear-gradient(right, #555, #6f6f6f 60%);
            background: -moz-linear-gradient(right, #555, #6f6f6f 60%);
            background: linear-gradient(right, #555, #6f6f6f 60%);
        }

        .black.side:active:after {
            box-shadow: -1px 0 1px #111 inset;
            background: -webkit-linear-gradient(right, #414040, #4d4c4c 60%);
            background: -moz-linear-gradient(right, #414040, #4d4c4c 60%);
            background: linear-gradient(right, #414040, #4d4c4c 60%);
        }

        .black.rarrow:hover:after,
        .black.larrow:hover:after {
            background: -webkit-linear-gradient(top left, #818181, #575757);
            background: -moz-linear-gradient(top left, #818181, #575757);
            background: linear-gradient(top left, #818181, #575757);
        }

        .black.rarrow:active:after,
        .black.larrow:active:after {
            background: -webkit-linear-gradient(top left, #424242, #575757);
            background: -moz-linear-gradient(top left, #424242, #575757);
            background: linear-gradient(top left, #424242, #575757);
        }

        .black.rarrow:active:after {
            box-shadow: 0 1px 0 #333 inset, -1px 0 0 #333 inset;
        }

        .black.larrow:active:after {
            box-shadow: 0 -1px 0 #333 inset, 1px 0 0 #333 inset;
        }
    </style>
</head>

<body>
    <div>
        <img src="${qrImgSrc}"
            width="300" />
        <a href="${address}">${address}</a>
        <button type="button" class="button black" onclick="restart()">重启服务器</button>
    </div>
</body>

<script>
const vscode = acquireVsCodeApi();
function restart(){
    vscode.postMessage({
        command: 'restartServer',
        text: 'restartServer'
    })
}
</script>

</html>`);
}

//# sourceMappingURL=project.js.map
