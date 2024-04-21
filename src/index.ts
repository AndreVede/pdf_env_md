import * as fs from 'fs';
import { mdToPdf } from 'md-to-pdf';

import md from './discours-19_03_2024.md';

import CSS from './styles/main.scss';

mdToPdf(
    { content: md },
    {
        highlight_style: 'monokai',
        page_media_type: 'print',
        pdf_options: {
            format: 'A4',
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
        fs.writeFileSync('output/discours-19.pdf', pdf.content);
    })
    .catch((error) => {
        console.error(error);
    });
