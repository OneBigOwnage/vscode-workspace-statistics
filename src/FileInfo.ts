export default class FileInfo {

    public readonly fileContent: string;
    public readonly fileName: string;

    constructor(filename: string, fileContent: string) {
        this.fileContent = fileContent;
        this.fileName = filename;
    }

    public extension() {
        return this.fileName.split('.').pop();
    }

    public totalLines(): number {
        return this.fileContent.split('\n').length;
    }

    public codeLines(): number {
        return this.totalLines() - this.commentLines() - this.emptyLines();
    }

    public commentLines(): number {
        return 0;
    }

    public emptyLines(): number {
        return this.lines().filter(line => line.match(/^\s*$/gm)).length;
    }

    private lines(): Array<String> {
        return this.fileContent.split('\n');
    }

    /**
     * Check if this is a binary file or not.
     * More information about byte order marks: https://en.wikipedia.org/wiki/Byte_order_mark
     */
    public isBinary() {
        let byteOrderMark = [
            this.fileContent.charCodeAt(0),
            this.fileContent.charCodeAt(1),
            this.fileContent.charCodeAt(2),
            this.fileContent.charCodeAt(3)
        ];

        if (byteOrderMark[0] === 0xEF && byteOrderMark[1] === 0xBB && byteOrderMark[2] === 0xBF) {
            // It is a UTF-8 encoded file.
            return false;
        }

        if (byteOrderMark[0] === 0xFE && byteOrderMark[1] === 0xFF) {
            // It is a UTF-16 (big endian) encoded file.
            return false;
        }

        if (byteOrderMark[0] === 0xFF && byteOrderMark[1] === 0xFE) {
            // It is a UTF-16 (little endian) encoded file.
            return false;
        }

        if (byteOrderMark[0] === 0 && byteOrderMark[1] === 0 && byteOrderMark[2] === 0xFE && byteOrderMark[3] === 0xFF) {
            // It is a UTF-32 (big endian) encoded file.
            return false;
        }

        if (byteOrderMark[0] === 0xFF && byteOrderMark[1] === 0xFE && byteOrderMark[2] === 0 && byteOrderMark[3] === 0) {
            // It is a UTF-32 (little endian) encoded file.
            return false;
        }

        // We check the first 256 bytes of data inside the file.
        // If there are more than 2 bytes that would normally not be in an ASCII file, we assume the file is binary.
        let flag = 0;
        let max = Math.min(this.fileContent.length, 256);

        for (let i = 4; i < max && flag <= 2; i++) {
            let charCode = this.fileContent.charCodeAt(i);

            if ([9, 10, 13].includes(charCode)) {
                continue;
            } else if (charCode === 0 || charCode < 32 || (charCode > 127 && charCode < 160)) {
                flag++;
            }
        }


        return flag > 2;
    }
}
