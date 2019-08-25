import FileInfo from "./FileInfo";

export default class WorkspaceInfo {

    public readonly fileInfos: Array<FileInfo>;

    constructor(fileInfos: Array<FileInfo>) {
        this.fileInfos = fileInfos;
    }

    public totalLines(): number {
        return this.fileInfos.reduce((carry, current) => carry += current.totalLines(), 0);
    }

    public codeLines(): number {
        return this.fileInfos.reduce((carry, current) => carry += current.codeLines(), 0);
    }

    public commentLines(): number {
        return this.fileInfos.reduce((carry, current) => carry += current.commentLines(), 0);
    }

    public emptyLines(): number {
        return this.fileInfos.reduce((carry, current) => carry += current.emptyLines(), 0);
    }
}
