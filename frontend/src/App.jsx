import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { gfm as turndownGfm } from 'turndown-plugin-gfm';
import TurndownService from 'turndown';


function App() {
  const markdown = `
# WIKI
## Unordered

* Item 1
* Item 2
* Item 2a
* Item 2b

## Ordered

1. Item 1
2. Item 2
3. Item 3
    1. Item 3a
    2. Item 3b

| Left columns  | Right columns |
| ------------- |:-------------:|
| left foo      | \`\`\`Your code goes here\`\`\`     |
| left bar      | right bar     |
| left baz      | right baz     |

\`\`\`
Your code goes here
Add your JavaScript code or any other code here
\`\`\`

Lets see if \`\`\`Your code goes here\`\`\`
`;

  const navbarHTML = `
    <!-- Your HTML for the navbar goes here if needed -->
    <div class="circle-button"></div>
    <div class="circle-button"></div>
    <div id="navbar">
      <!-- Content for the navbar goes here if needed -->
    </div>
    <div class="circle-button"></div>
    <div class="circle-button"></div>
  `;

  const [markdownContent, setMarkdownContent] = useState(markdown);

  useEffect(() => {
    const mainContentDiv = document.getElementById('main-content');
  
    const handleContentChange = () => {
      const currentContent = mainContentDiv.innerHTML;

      //Converts html page to markdown
      var turndownService = new TurndownService();

      //Adds Rules to html to markdown conversion to use github flavor of markdown
      turndownService.addRule('heading', {
        filter: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
        replacement: function (content, node, options) {
          var hLevel = Number(node.nodeName.charAt(1));
          var hashes = Array(hLevel + 1).join('#');
          return '\n\n' + hashes + ' ' + content + '\n\n';
        },
      }); 
    
      //Adds Rules to html to markdown conversion to use github flavor of markdown
      turndownService.addRule('emphasis', {
        filter: ['em', 'i'],
        replacement: function (content, node, options) {
          return '*' + content + '*';
        },
      });
      turndownService.use(turndownGfm); //Makes html to markdown converter use github flavor of markdown
  
      const markdownResult = turndownService.turndown(currentContent);
    };
  
    mainContentDiv.addEventListener('input', handleContentChange);
  
    return () => {
      mainContentDiv.removeEventListener('input', handleContentChange);
    };
  }, []);
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: navbarHTML }} id="navbar-container" />
      <div>
        <div id="main-content" contentEditable={true}>
          <CustomMarkdown>{markdownContent}</CustomMarkdown>
        </div>
      </div>
    </>
  );
};

const CustomMarkdown = ({ children }) => {
  const renderers = {
    pre: ({ node, children}) => {
      const value = children || ''; 

      if (!node.parent || node.parent.tagName !== 'pre') {
        return (
          <>
            <pre><code>{value}</code></pre>
          </>
        );
      }
    },
    p: ({ node, children}) => {
      const value = children || '';
      if (value[value.length -1].type == "code") {
        return <p>{value}&nbsp;</p>;
      }
      else {
        return <p>{value}</p>;
      }

    },
  };


  return <Markdown remarkPlugins={[remarkGfm]} components={renderers}>{children}</Markdown>;
};


export default App;
