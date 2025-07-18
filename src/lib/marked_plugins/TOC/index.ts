import { MarkIdHeadingInstance } from '@src/lib/singletons';

/**
 * postprocess hook function to create a TOC
 */
const TOC = (html: string) => {
    const headings = MarkIdHeadingInstance.getHeadingList();

    return `
<ul id="table-of-contents" class="page-break-after">
	${headings.map(({ id, raw, level }) => `<li><a href="#${id}" class="h${level}">${raw}</a></li>`).join('')}
</ul>
${html}`;
};

export default TOC;
