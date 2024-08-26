import * as fs from 'fs';
import * as path from 'path';

import Doc from './Doc/doc';

const markdownsDir: string = path.resolve(
    process.env.markdownsDir ?? 'markdowns',
);

// create markdowns directory if not exist
if (!fs.existsSync(markdownsDir)) {
    fs.mkdirSync(markdownsDir);
}

let mdList: Doc[] = [];

// Get all markdowns in markdowns folder in src
try {
    const dir = fs.readdirSync(markdownsDir);
    dir.forEach((file: string) => {
        const markdown: Buffer = fs.readFileSync(path.join(markdownsDir, file));
        mdList.push(new Doc(file.split('.')[0], markdown));
    });

    Doc.cleanOutputDir();

    mdList.forEach((md) => {
        console.log('Work on ' + md.documentName);
        md.toPdf().then(() => {
            console.log(md.documentName, 'done');
        });
    });
} catch (e) {
    console.error(e);
}
