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
const cp = require("child_process");
const opn = require("opn");
const egret_1 = require("../egret");
var EgretCommand;
(function (EgretCommand) {
})(EgretCommand || (EgretCommand = {}));
/**
 * 调用引擎的命令行工具: egret [command]
 *
 * egret 这个命令行工具并非引擎提供, 而是 launcher 提供
 *
 * - 首先判断 launcher 是否安装, 如果已经安装就可以尝试调用
 * - 如果 launcher 安装但是引擎没有安装, egret 命令会正确的返回引擎没有安装的输出信息
 *
 */
class Command {
    static runCommand(command) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const installed = yield this.checkLauncherInstalled();
                if (!installed) {
                    return;
                }
                const workspaceRoot = vscode.workspace.rootPath;
                let status = cp.exec(`${this.EGRET_COMMAND} ${command}`, { cwd: workspaceRoot });
                status.stdout.on('data', (data) => {
                    this.showOutput(data);
                });
                status.stderr.on('data', (data) => {
                    this.showOutput(data);
                });
            }
            catch (error) {
                this.showOutput(error);
            }
        });
    }
    static showOutput(data) {
        const out = this.getOutputChannel();
        out.show(true);
        out.append(data);
    }
    static checkLauncherInstalled() {
        return __awaiter(this, void 0, void 0, function* () {
            const curVersion = yield launcher_1.default.getEgretLauncherVersionAsync();
            if (!curVersion) {
                this.promptNoLauncher();
                return false;
            }
            return true;
        });
    }
    static getOutputChannel() {
        this._channel = this._channel || vscode.window.createOutputChannel(egret_1.EgretConst.Tag);
        return this._channel;
    }
    static promptNoLauncher() {
        const msgGoto = i18n_1.tr('Engine', 'Go to download at official website：{0}', launcherDefines_1.EgretWebsite);
        vscode.window.showInformationMessage(i18n_1.tr('Engine', i18n_1.tr('Engine', 'Please install Egret Launcher')), msgGoto)
            .then(t => {
            if (t === msgGoto) {
                opn(launcherDefines_1.EgretWebsite);
            }
        });
    }
}
Command.EGRET_COMMAND = 'egret';
exports.Command = Command;
