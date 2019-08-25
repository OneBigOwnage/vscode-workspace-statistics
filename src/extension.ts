// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import LineCounter from './LineCounter';
import InformationPanel from './InformationPanel';

export function activate(context: vscode.ExtensionContext) {

	const lineCounter = new LineCounter();

	let showWorkspaceStatistics = vscode.commands.registerCommand('workspace-statistics.show-workspace-statistics', async () => {
		InformationPanel.createOrShowPanel(await lineCounter.getWorkspaceFileInfos());
	});

	context.subscriptions.push(showWorkspaceStatistics);
}

// this method is called when your extension is deactivated
export function deactivate() {}
