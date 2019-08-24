import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export default class LineCounter {

    public countCurrentFile(): Number {
        if (!this.hasCurrentFile()) {
            vscode.window.showWarningMessage('There is no active file to analyze.');
            return -1;
        }

        let editorContent = (<vscode.TextEditor>vscode.window.activeTextEditor).document.getText();

        return editorContent.split('\n').length;
    }

    public async countWorkspaceFiles(): Promise<Number> {
        if (!vscode.workspace.rootPath) {
            vscode.window.showWarningMessage('There is no open workspace!');
            return -1;
        }

        return (await vscode.workspace.findFiles(this.getInclude(), this.getExclude()))
            .map((file: vscode.Uri) => fs.readFileSync(file.fsPath, { encoding: 'UTF-8' }).split('\n').length)
            .reduce((carry, current) => carry + current, 0);
    }

    private hasCurrentFile() {
        return vscode.window.activeTextEditor !== undefined;
    }

    private getInclude(): string {
        return '{**/*.java}';
    }

    private getExclude(): string | undefined {
        return undefined;
    }

}
