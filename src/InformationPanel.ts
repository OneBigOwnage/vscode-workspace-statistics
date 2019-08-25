import * as vscode from 'vscode';

class InformationPanel {

    public static currentPanel: vscode.WebviewPanel | undefined;


    private readonly panel: vscode.WebviewPanel;

    constructor(panel: vscode.WebviewPanel) {
        this.panel = panel;


        this.updateContent();
    }

    private createPanel() {
        let column = vscode.ViewColumn.One;

        if (vscode.window.activeTextEditor !== undefined
            && vscode.window.activeTextEditor.viewColumn !== undefined) {
            column = vscode.window.activeTextEditor.viewColumn;
        }

        const panel = vscode.window.createWebviewPanel('abc123', 'Workspace statistics', column);

        return InformationPanel.currentPanel = panel;
    }

    public updateContent() {
        this.panel.webview.html = `
            <html>

            <body>

            <h1>Hello world</h1>

            </body>

            </html>
        `;
    }

}
