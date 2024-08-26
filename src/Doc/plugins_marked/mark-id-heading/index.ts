import GithubSlugger from 'github-slugger';
import { Hooks, MarkedOptions, TokenizerAndRendererExtension } from 'marked';
import { tokenIsHeading } from '../marked-utils';

export interface Heading {
    level: number;
    text: string;
    id: string;
    raw: string;
}

interface MarkIdHeadingProps {
    prefix?: string;
    globalSlugs?: boolean;
}

export default class MarkIdHeading {
    private headings: Heading[] = [];
    private slugger: GithubSlugger = new GithubSlugger();

    private readonly unescapeRegex =
        /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/gi;

    private prefix: string = '';
    private globalSlugs: boolean = false;

    constructor({ prefix, globalSlugs }: MarkIdHeadingProps = {}) {
        this.prefix = prefix ?? this.prefix;
        this.globalSlugs = globalSlugs ?? this.globalSlugs;
    }

    /* istanbul ignore next */
    public unescape(html: string) {
        // explicitly match decimal, hex, and named HTML entities
        return html.replace(this.unescapeRegex, (_, n) => {
            n = n.toLowerCase();
            if (n === 'colon') return ':';
            if (n.charAt(0) === '#') {
                return n.charAt(1) === 'x'
                    ? String.fromCharCode(parseInt(n.substring(2), 16))
                    : String.fromCharCode(+n.substring(1));
            }
            return '';
        });
    }

    public getHooks(): Partial<Hooks> {
        const self = this;
        return {
            preprocess(markdown: string): string {
                if (!self.globalSlugs) {
                    self.resetHeadings();
                }
                return markdown;
            },
        };
    }

    public getExtensions(): TokenizerAndRendererExtension[] {
        const self = this;
        return [
            {
                name: 'heading',
                renderer(token) {
                    if (tokenIsHeading(token)) {
                        const text = this.parser.parseInline(token.tokens);
                        const raw = self
                            .unescape(
                                this.parser.parseInline(
                                    token.tokens,
                                    this.parser.textRenderer,
                                ),
                            )
                            .trim()
                            .replace(/<[!\/a-z].*?>/gi, '');
                        const level = token.depth;
                        const id = `${self.prefix}${self.slugger.slug(raw.toLowerCase())}`;
                        const heading = { level, text, id, raw };
                        self.headings.push(heading);

                        return `<h${level} id="${id}">${text}</h${level}>\n`;
                    }
                },
            },
        ];
    }

    public getHeadingList(): Heading[] {
        return this.headings;
    }

    public resetHeadings() {
        this.headings = [];
        this.slugger = new GithubSlugger();
    }
}
