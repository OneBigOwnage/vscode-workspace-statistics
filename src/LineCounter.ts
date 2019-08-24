import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

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

    public async countWorkspaceFiles(): Promise<number> {
        if (!vscode.workspace.rootPath) {
            vscode.window.showWarningMessage('There is no open workspace!');
            return -1;
        }

        return (await vscode.workspace.findFiles(this.getIncludes(), this.getExcludes()))
            .map((file: vscode.Uri) => fs.readFileSync(file.fsPath, { encoding: 'UTF-8' }).split('\n').length)
            .reduce((carry, current) => carry + current, 0);
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
