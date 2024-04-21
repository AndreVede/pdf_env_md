import md from './text.md';
import Doc from './Doc/doc';

const test = new Doc('test', md);

test.toPdf().then(() => console.log('done'));
