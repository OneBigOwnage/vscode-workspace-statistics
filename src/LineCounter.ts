import * as vscode from 'vscode';
import * as fs from 'fs';
import FileInfo from './FileInfo';

export default class LineCounter {

    private vsCodeConfig: vscode.WorkspaceConfiguration;

    constructor() {
        this.vsCodeConfig = vscode.workspace.getConfiguration('workspace-statistics');
    }

    public async getWorkspaceFileInfos(): Promise<Array<FileInfo>> {
        if (!vscode.workspace.rootPath) {
            vscode.window.showWarningMessage('There is no open workspace!');
            return [];
        }

        const sortDesc = (a: FileInfo, b: FileInfo) => {
            if (a.totalLines() < b.totalLines()) {
                return 1;
            }

            if (a.totalLines() > b.totalLines()) {
                return -1;
            }

            return 0;
        };

        return (await vscode.workspace.findFiles(this.getIncludes(), this.getExcludes()))
            .map((file: vscode.Uri) => {
                const fileContent: string = fs.readFileSync(file.fsPath, { encoding: 'UTF-8' });

                return new FileInfo(file.fsPath, fileContent);
            }).filter(fileInfo => !fileInfo.isBinary()).sort(sortDesc);
    }

    private getIncludes(): string {
        const defaultIncludes: Array<string> = ['**/*.*'];

        return ['{', this.vsCodeConfig.get('includes', defaultIncludes).toString(), '}'].join('');
    }

    private getExcludes(): string {
        const defaultExcludes: Array<string> = ['**/.vscode/**', '**/node_modules/**', '**/.git/**', '**/vendor/**'];

        return ['{', this.vsCodeConfig.get('excludes', defaultExcludes).toString(), '}'].join('');
    }

}
