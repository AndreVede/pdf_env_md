import { PdfConfig } from 'md-to-pdf/dist/lib/config';
import CSS from '@src/styles/main.scss';
import { PdfOutput } from 'md-to-pdf/dist/lib/generate-output';
import mdToPdf from 'md-to-pdf';
import * as fs from 'fs';
import * as path from 'path';
import Header from './templates/header.html';
import Fouter from './templates/footer.html';
import TOC from './plugins_marked/TOC';
import { MarkIdHeadingInstance } from '@src/singletons';

class Doc {
    private static readonly outDirName = process.env.outputDir ?? 'output';
    private readonly options: Partial<PdfConfig>;
    public documentName: string;
    private documentRaw: any;
    private readonly generateTOC: boolean;

    constructor(
        documentName: string,
        documentRaw: any,
        forceGenerateTOC?: boolean,
    ) {
        this.documentName = documentName;
        this.documentRaw = documentRaw;

        // check if there is a comment <!-- toc -->
        this.generateTOC =
            forceGenerateTOC ??
            this.checkIfThereIsTocComment(String(this.documentRaw));

        this.options = {
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
                tagged: true,
                displayHeaderFooter: true,
                headerTemplate: Header,
                footerTemplate: Fouter,
            },
            css: CSS.toString(),
            marked_options: {
                hooks: {
                    ...MarkIdHeadingInstance.getHooks(),
                    postprocess: this.generateTOC
                        ? TOC
                        : (html: string) => html, // to prevent an undefined value
                },
            },
            marked_extensions: [
                { extensions: [...MarkIdHeadingInstance.getExtensions()] },
            ],
        };
    }

    public async toPdf(): Promise<PdfOutput> {
        const pdf = await mdToPdf({ content: this.documentRaw }, this.options);
        this.checkOutputDir();
        fs.writeFileSync(
            path.resolve(Doc.outDirName, this.documentName + '.pdf'),
            pdf.content,
        );
        return pdf;
    }

    private checkOutputDir(): void {
        if (!fs.existsSync(path.resolve(Doc.outDirName))) {
            fs.mkdirSync(path.resolve(Doc.outDirName));
        }
    }

    public static cleanOutputDir(): void {
        if (fs.existsSync(path.resolve(this.outDirName))) {
            fs.readdirSync(path.resolve(this.outDirName)).forEach((file) =>
                fs.unlinkSync(path.resolve(this.outDirName, file)),
            );
        }
    }

    private checkIfThereIsTocComment(html: string): boolean {
        return /\<!-- toc -->/i.test(html);
    }
}

export default Doc;
