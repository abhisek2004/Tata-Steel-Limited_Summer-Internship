"use client"

interface SimpleMarkdownProps {
  children: string
}

export default function SimpleMarkdown({ children }: SimpleMarkdownProps) {
  // Very basic markdown parsing
  const parseMarkdown = (markdown: string) => {
    // Process headers
    let html = markdown
      .replace(/^# (.+)$/gm, '<h1>$1</h1>')
      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
      .replace(/^#### (.+)$/gm, '<h4>$1</h4>')
      .replace(/^##### (.+)$/gm, '<h5>$1</h5>')
      .replace(/^###### (.+)$/gm, '<h6>$1</h6>');

    // Process bold and italic
    html = html
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>');

    // Process lists
    html = html
      .replace(/^\d+\.\s+(.+)$/gm, '<li>$1</li>')
      .replace(/^-\s+(.+)$/gm, '<li>$1</li>');

    // Wrap lists
    html = html
      .replace(/(<li>.+<\/li>\n)+/g, (match) => {
        if (match.includes('\d+\.')) {
          return `<ol>${match}</ol>`;
        }
        return `<ul>${match}</ul>`;
      });

    // Process paragraphs (any line that's not a header or list)
    html = html
      .replace(/^(?!<h|<ul|<ol|<li)(.+)$/gm, '<p>$1</p>');

    // Process line breaks
    html = html.replace(/\n\n/g, '<br />');

    return html;
  };

  return (
    <div 
      className="prose prose-sm max-w-none" 
      dangerouslySetInnerHTML={{ __html: parseMarkdown(children) }} 
    />
  );
}