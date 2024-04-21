import * as fs from 'fs';
import { mdToPdf } from 'md-to-pdf';

import md from './text.md';

import CSS from './styles/main.scss';

mdToPdf(
    { content: md },
    {
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
    },
)
    .then((pdf) => {
        fs.writeFileSync('output/test.pdf', pdf.content);
    })
    .catch((error) => {
        console.error(error);
    });
