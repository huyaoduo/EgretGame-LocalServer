"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const egret_1 = require("./egret");
const project_1 = require("./project/project");
const project = new project_1.Project();
// Entry point
function activate(context) {
    installEventListeners(context);
    installButtons(context);
    installCommands(context);
}
exports.activate = activate;
let autoOpenEgretTool = false;
function installEventListeners(context) {
    // this feature is closed temporarily
    if (autoOpenEgretTool) {
        vscode.workspace.onDidOpenTextDocument(e => {
            const setting = vscode.workspace.getConfiguration().get('egret.autoOpenEgretTool');
            if (setting) {
                project.open(e.fileName);
            }
        });
    }
}
function installCommands(context) {
    const handlerMap = {
        [egret_1.EgretExtensionCommand.Server]: () => project.openServerQR(),
    };
    for (const cmd in handlerMap) {
        context.subscriptions.push(vscode.commands.registerCommand(cmd, handlerMap[cmd]));
    }
}

function installButtons(context) {
    [
        {
            priority: 1,
            command: egret_1.EgretExtensionCommand.Server,
            tooltip: 'Egret server',
            text: `$(server)`,
        },
    ].map(btn => createStatusBarButton(btn));
}
function createStatusBarButton(btnSetting) {
    let button = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, btnSetting.priority);
    button.command = btnSetting.command;
    button.tooltip = btnSetting.tooltip;
    button.text = btnSetting.text;
    button.show();
}

