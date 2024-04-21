import { PdfConfig } from 'md-to-pdf/dist/lib/config';
import CSS from '@src/styles/main.scss';
import { PdfOutput } from 'md-to-pdf/dist/lib/generate-output';
import mdToPdf from 'md-to-pdf';
import * as fs from 'fs';
import * as path from 'path';

class Doc {
    private readonly outDirName = process.env.outputDir ?? 'output';
    private readonly options: Partial<PdfConfig> = {
        highlight_style: 'monokai',
        page_media_type: 'print',
        pdf_options: {
            format: 'A4',
            printBackground: true,
            margin: {
                left: '20mm',
                right: '20mm',
                top: '20mm',
                bottom: '20mm',
            },
        },
        css: CSS.toString(),
    };
    public documentName: string;
    private documentRaw: any;

    constructor(documentName: string, documentRaw: any) {
        this.documentName = documentName;
        this.documentRaw = documentRaw;
    }

    public async toPdf(): Promise<PdfOutput> {
        const pdf = await mdToPdf({ content: this.documentRaw }, this.options);
        this.cleanOutputDir();
        fs.writeFileSync(
            path.resolve(this.outDirName, this.documentName + '.pdf'),
            pdf.content,
        );
        return pdf;
    }

    private cleanOutputDir(): void {
        if (!fs.existsSync(path.resolve(this.outDirName))) {
            fs.mkdirSync(path.resolve(this.outDirName));
        } else {
            fs.readdirSync(path.resolve(this.outDirName)).forEach((file) =>
                fs.unlinkSync(path.resolve(this.outDirName, file)),
            );
        }
    }
}

export default Doc;
