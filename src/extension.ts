// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import LineCounter from './LineCounter';


export function activate(context: vscode.ExtensionContext) {

	const lineCounter = new LineCounter();

	let showWorkspaceStatistics = vscode.commands.registerCommand('workspace-statistics.show-workspace-statistics', async () => {
		let message = `The current workspace has ${await lineCounter.countWorkspaceFiles()} lines total.`;

		vscode.window.showInformationMessage(message);
	});

	let showCurrentFileStatistics = vscode.commands.registerCommand('workspace-statistics.show-file-statistics', async () => {
		let message = `The current file has ${await lineCounter.countCurrentFile()} lines total.`;

		vscode.window.showInformationMessage(message);
	});

	context.subscriptions.push(showWorkspaceStatistics);
	context.subscriptions.push(showCurrentFileStatistics);
}

// this method is called when your extension is deactivated
export function deactivate() {}
