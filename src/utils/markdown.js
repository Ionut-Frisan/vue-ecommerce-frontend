import { marked } from "marked";
import DOMPurify from 'dompurify';

export const markdownToHtml = (markdown) => {
    console.log(DOMPurify)
    return DOMPurify.sanitize(marked(markdown));
};