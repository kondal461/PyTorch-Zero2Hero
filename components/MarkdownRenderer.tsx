import React from 'react';
import CodeBlock from './CodeBlock';
import katex from 'katex';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  // Basic parser to split by code blocks and math blocks
  // Regex matches:
  // 1. Code blocks: ```language code ```
  // 2. Block math: $$ latex $$
  const regex = /```(\w+)?\s*([\s\S]*?)```|(\$\$[\s\S]*?\$\$)/g;
  
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(content)) !== null) {
    // Push preceding text
    if (match.index > lastIndex) {
      parts.push({
        type: 'text',
        content: content.substring(lastIndex, match.index)
      });
    }
    
    if (match[3]) {
      // Block Math
      parts.push({
        type: 'math',
        content: match[3]
      });
    } else {
      // Code Block
      parts.push({
        type: 'code',
        language: match[1] || 'text',
        content: match[2]
      });
    }
    
    lastIndex = regex.lastIndex;
  }
  
  // Push remaining text
  if (lastIndex < content.length) {
    parts.push({
      type: 'text',
      content: content.substring(lastIndex)
    });
  }

  return (
    <div className="space-y-4">
      {parts.map((part, index) => {
        if (part.type === 'code') {
          return <CodeBlock key={index} language={part.language} code={part.content} />;
        } else if (part.type === 'math') {
          const latex = part.content.slice(2, -2);
          try {
            const html = katex.renderToString(latex, { displayMode: true, throwOnError: false });
            return <div key={index} className="my-6 flex justify-center overflow-x-auto py-2" dangerouslySetInnerHTML={{ __html: html }} />;
          } catch (e) {
            return <pre key={index} className="text-red-400">{part.content}</pre>;
          }
        } else {
          // Render Text with basic Markdown formatting (Headers, Bold, Lists)
          return <FormattedText key={index} text={part.content} />;
        }
      })}
    </div>
  );
};

const FormattedText: React.FC<{ text: string }> = ({ text }) => {
  // Split by newlines to handle block elements roughly
  const lines = text.split('\n');
  
  return (
    <>
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={idx} className="h-4" />; // Spacer

        // Headers
        if (trimmed.startsWith('### ')) {
          return <h3 key={idx} className="text-xl font-bold text-torch-200 mt-6 mb-3">{parseInline(trimmed.substring(4))}</h3>;
        }
        if (trimmed.startsWith('## ')) {
          return <h2 key={idx} className="text-2xl font-bold text-torch-400 mt-8 mb-4 pb-2 border-b border-gray-700">{parseInline(trimmed.substring(3))}</h2>;
        }
        if (trimmed.startsWith('# ')) {
          return <h1 key={idx} className="text-3xl font-bold text-white mt-10 mb-6">{parseInline(trimmed.substring(2))}</h1>;
        }

        // List items
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
            const content = trimmed.substring(2);
            return (
                <div key={idx} className="flex items-start ml-4 mb-2">
                    <span className="mr-2 text-torch-500">•</span>
                    <p className="text-gray-300 leading-relaxed">{parseInline(content)}</p>
                </div>
            )
        }
        
        // Numbered lists
        const numberedMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
        if (numberedMatch) {
            return (
                <div key={idx} className="flex items-start ml-4 mb-2">
                    <span className="mr-2 text-torch-500 font-mono">{numberedMatch[1]}.</span>
                    <p className="text-gray-300 leading-relaxed">{parseInline(numberedMatch[2])}</p>
                </div>
            )
        }

        // Paragraphs
        return <p key={idx} className="text-gray-300 leading-relaxed mb-2">{parseInline(line)}</p>;
      })}
    </>
  );
};

// Helper to handle **bold**, `code` inline, and $math$
const parseInline = (text: string): React.ReactNode[] => {
  const parts: React.ReactNode[] = [];
  // Regex for:
  // 1. Inline Math: $...$ (non-greedy)
  // 2. Bold: **...**
  // 3. Inline Code: `...`
  const regex = /(\$[^$]+?\$|\*\*.*?\*\*|`.*?`)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }
    
    const content = match[0];
    if (content.startsWith('**')) {
      parts.push(<strong key={match.index} className="text-white font-semibold">{content.slice(2, -2)}</strong>);
    } else if (content.startsWith('`')) {
      parts.push(<code key={match.index} className="bg-gray-800 text-torch-300 px-1.5 py-0.5 rounded font-mono text-sm">{content.slice(1, -1)}</code>);
    } else if (content.startsWith('$')) {
      const latex = content.slice(1, -1);
      try {
        const html = katex.renderToString(latex, { displayMode: false, throwOnError: false });
        parts.push(<span key={match.index} dangerouslySetInnerHTML={{ __html: html }} />);
      } catch {
        parts.push(content);
      }
    }
    
    lastIndex = regex.lastIndex;
  }
  
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }
  
  return parts.length > 0 ? parts : [text];
};

export default MarkdownRenderer;