declare module '*.md';
declare module '*.scss';
declare module '*.html' {
    const content: string;
    export default content;
}
