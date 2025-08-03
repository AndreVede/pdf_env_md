import { PdfConfig } from 'md-to-pdf/dist/lib/config';
import CSS from '@src/styles/main.scss?inline';
import { PdfOutput } from 'md-to-pdf/dist/lib/generate-output';
import mdToPdf from 'md-to-pdf';
import * as fs from 'fs';
import * as path from 'path';
import * as pug from 'pug';
import Header from '@src/lib/Doc/templates/header.pug?raw';
import Footer from '@src/lib/Doc/templates/footer.pug?raw';
import TOC from '@src/lib/marked_plugins/TOC';
import { MarkIdHeadingInstance } from '@src/lib/singletons';

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

        const header = pug.compile(Header, { name: 'header' })();
        const footer = pug.compile(Footer, { name: 'footer' })({
            lang: this.getLanguage(String(this.documentRaw)), // check lang
            pagination: this.checkPagination(String(this.documentRaw)), // check pagination
        });

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
                headerTemplate: header,
                footerTemplate: footer,
            },
            css: CSS,
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
        return /^\<!--[\w\s]*toc?[\w\s]*--\>/i.test(html);
    }

    private checkPagination(html: string): boolean {
        return /^\<!--[\w\s]*pagination[\w\s]*--\>/i.test(html);
    }

    private getLanguage(html: string): string {
        const lang: RegExpExecArray | null =
            /\<!--[\w\s]*lang="(en|fr)"[\w\s]*--\>/.exec(html);

        return lang?.[1] ?? 'en';
    }
}

export default Doc;
