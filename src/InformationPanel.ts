import * as vscode from 'vscode';
import FileInfo from './FileInfo';
import * as fs from 'fs';
import * as path from 'path';
import WorkspaceInfo from './WorkspaceInfo';

export default class InformationPanel {

    public static currentPanel: InformationPanel | undefined;

    public static readonly viewType = 'WorkspaceStatisticsInformationPanel';

    private readonly panel: vscode.WebviewPanel;
    private disposables: Array<vscode.Disposable> = [];

    private readonly fileInfos: Array<FileInfo>;
    private readonly workspaceInfo: WorkspaceInfo;


    constructor(panel: vscode.WebviewPanel, fileInfos: Array<FileInfo>) {
        this.panel = panel;
        this.fileInfos = fileInfos;
        this.workspaceInfo = new WorkspaceInfo(this.fileInfos);;

        this.updateContent();

        this.panel.webview.onDidReceiveMessage(message => {
            if (message.command === 'alert') {
                vscode.window.showErrorMessage(message.text);
            }
        }, null, this.disposables);

        this.panel.onDidDispose(() => this.dispose(), null, this.disposables);
    }

    public static createOrShowPanel(fileInfos: Array<FileInfo>) {
        if (InformationPanel.currentPanel !== undefined) {
            InformationPanel.currentPanel.panel.reveal(InformationPanel.getColumn());
        } else {
            InformationPanel.currentPanel = new InformationPanel(InformationPanel.createPanel(), fileInfos);
        }
    }

    private showPanel() {
        if (InformationPanel.currentPanel === undefined) {
            throw new Error("Cannot show panel, as currentPanel is undefined!");
        }

        InformationPanel.currentPanel.panel.reveal(InformationPanel.getColumn());
    }

    private static createPanel() {
        const column = InformationPanel.getColumn() || vscode.ViewColumn.One;

        return vscode.window.createWebviewPanel(
            InformationPanel.viewType, 'Workspace statistics', column, { enableScripts: true }
        );
    }

    private static getColumn(): vscode.ViewColumn | undefined {
        if (vscode.window.activeTextEditor !== undefined) {
            return vscode.window.activeTextEditor.viewColumn;
        }
    }

    public updateContent() {

        const workspaceDetailsContent: string = `
            <tr>
                <td>
                    <strong>Complete workspace</strong>
                </td>
                <td>${this.workspaceInfo.codeLines()}</td>
                <td>${this.workspaceInfo.commentLines()}</td>
                <td>${this.workspaceInfo.emptyLines()}</td>
                <td>${this.workspaceInfo.totalLines()}</td>
            </tr>
        `;

        const root: string = vscode.workspace.rootPath || '';

        const individualFilesDetailsContent: string = this.fileInfos.map(fileInfo => {
            return `
                <tr>
                    <td>${fileInfo.fileName.replace(root + path.sep, '')}</td>
                    <td>${fileInfo.codeLines()}</td>
                    <td>${fileInfo.commentLines()}</td>
                    <td>${fileInfo.emptyLines()}</td>
                    <td>${fileInfo.totalLines()}</td>
                </tr>
            `;
        }).reduce((carry, current) => carry.concat(current), '');

        this.panel.webview.html = `
            <html>

            <head>
            <style>
                .container {
                    padding-left: 50px;
                    padding-right: 50px;
                }


                table {
                    border-collapse: collapse;
                    width: 100%;
                }

                td, th {
                    border: 1px solid #dddddd;
                    text-align: left;
                    padding: 8px;
                }

                tr:nth-child(even) {
                    background-color: #252525;
                }

                .spacer {
                    margin-bottom: 45px;
                }
            </style>
            </head>

            <body class="container">

            <h2>Workspace statistics</h2>

            <table>

                <tr>
                    <th>File</th>
                    <th>Code lines</th>
                    <th>Comment lines</th>
                    <th>Empty lines</th>
                    <th>Total lines</th>
                </tr>

                ${workspaceDetailsContent}

                <tr>
                    <th>-</th>
                    <th>-</th>
                    <th>-</th>
                    <th>-</th>
                    <th>-</th>
                </tr>

                ${individualFilesDetailsContent}

            </table>

            <div class="spacer"></div>

            </body>

            </html>
        `;
    }

    public dispose() {
        InformationPanel.currentPanel = undefined;

        this.panel.dispose();

        this.disposables.forEach(disposable => disposable.dispose());

        this.disposables = [];
    }
}
