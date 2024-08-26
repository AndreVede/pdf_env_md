import { getHeadingList } from 'marked-gfm-heading-id';

/**
 * postprocess hook function to create a TOC
 */
const TOC = (html: string) => {
    const headings = getHeadingList();

    return `
<ul id="table-of-contents">
	${headings.map(({ id, raw, level }) => `<li><a href="#${id}" class="h${level}">${raw}</a></li>`)}
</ul>
${html}`;
};

export default TOC;
