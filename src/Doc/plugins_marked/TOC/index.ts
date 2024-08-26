import { MarkIdHeadingInstance } from '@src/singletons';
import CSS from '@src/styles/main.scss';

/**
 * postprocess hook function to create a TOC
 */
const TOC = (html: string) => {
    const headings = MarkIdHeadingInstance.getHeadingList();

    return `
<ul id="table-of-contents">
	${headings.map(({ id, raw, level }) => `<li><a href="#${id}" class="h${level}">${raw}</a></li>`).join('')}
</ul>
${html}`;
};

export default TOC;
