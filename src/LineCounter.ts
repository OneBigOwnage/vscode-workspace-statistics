import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import FileInfo from './FileInfo';

export default class LineCounter {

    private vsCodeConfig: vscode.WorkspaceConfiguration;

    constructor() {
        this.vsCodeConfig = vscode.workspace.getConfiguration('workspace-statistics');
    }

    public countCurrentFile(): number {
        if (!this.hasCurrentFile()) {
            vscode.window.showWarningMessage('There is no active file to analyze.');
            return -1;
        }

        let editorContent = (<vscode.TextEditor>vscode.window.activeTextEditor).document.getText();


        return editorContent.split('\n').length;
    }

    public async countWorkspaceFiles(): Promise<Array<FileInfo> | undefined> {
        if (!vscode.workspace.rootPath) {
            vscode.window.showWarningMessage('There is no open workspace!');
            return;
        }

        return (await vscode.workspace.findFiles(this.getIncludes(), this.getExcludes()))
            .map((file: vscode.Uri) => {
                const fileContent: string = fs.readFileSync(file.fsPath, { encoding: 'UTF-8' });

                return new FileInfo(file.fsPath, fileContent);
            }).filter(fileInfo => !fileInfo.isBinary());
    }

    private hasCurrentFile() {
        return vscode.window.activeTextEditor !== undefined;
    }

    private getIncludes(): string {
        const defaultIncludes: Array<string> = ['*.*'];

        return ['{', this.vsCodeConfig.get('includes', defaultIncludes).toString(), '}'].join('');
    }

    private getExcludes(): string {
        const defaultExcludes: Array<string> = ['**/.vscode/**', '**/node_modules/**', '**/.git/**', '**/vendor/**'];

        return ['{', this.vsCodeConfig.get('excludes', defaultExcludes).toString(), '}'].join('');
    }

}
