import { Subject } from './types';

export interface Resource {
  id: string;
  type: 'video' | 'doc';
  title: string;
  description: string;
  url: string;
  author: string;
}

export const learningResources: Record<Subject, Resource[]> = {
  HTML: [
    {
      id: 'html-doc-1',
      type: 'doc',
      title: 'HTML Basics',
      description: 'The ultimate guide to understanding the structure of the web.',
      url: 'https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/HTML_basics',
      author: 'MDN Web Docs'
    },
    {
      id: 'html-vid-1',
      type: 'video',
      title: 'HTML Full Course - Build a Website Tutorial',
      description: 'Learn HTML by building a cat photo app.',
      url: 'https://www.youtube.com/watch?v=kUMe1ly46mA',
      author: 'freeCodeCamp'
    },
    {
      id: 'html-doc-2',
      type: 'doc',
      title: 'HTML Elements Reference',
      description: 'A comprehensive list of all HTML elements.',
      url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element',
      author: 'MDN Web Docs'
    }
  ],
  CSS: [
    {
      id: 'css-doc-1',
      type: 'doc',
      title: 'CSS Basics',
      description: 'Learn how to style your HTML documents.',
      url: 'https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/CSS_basics',
      author: 'MDN Web Docs'
    },
    {
      id: 'css-vid-1',
      type: 'video',
      title: 'CSS Tutorial - Zero to Hero (Complete Course)',
      description: 'Master CSS from basic selectors to flexbox and grid layouts.',
      url: 'https://www.youtube.com/watch?v=1Rs2ND1ryYc',
      author: 'freeCodeCamp'
    },
    {
      id: 'css-doc-2',
      type: 'doc',
      title: 'A Complete Guide to Flexbox',
      description: 'The definitive guide to the CSS Flexbox layout model.',
      url: 'https://css-tricks.com/snippets/css/a-guide-to-flexbox/',
      author: 'CSS-Tricks'
    }
  ],
  JavaScript: [
    {
      id: 'js-doc-1',
      type: 'doc',
      title: 'JavaScript Basics',
      description: 'A practical introduction to JavaScript for beginners.',
      url: 'https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/JavaScript_basics',
      author: 'MDN Web Docs'
    },
    {
      id: 'js-vid-1',
      type: 'video',
      title: 'JavaScript Programming - Full Course',
      description: 'Learn JavaScript from scratch in this massive crash course.',
      url: 'https://www.youtube.com/watch?v=jS4aFq5-91M',
      author: 'freeCodeCamp'
    },
    {
      id: 'js-doc-2',
      type: 'doc',
      title: 'Modern JavaScript Tutorial',
      description: 'From the basics to advanced topics with simple, but detailed explanations.',
      url: 'https://javascript.info/',
      author: 'Ilya Kantor'
    }
  ]
};
