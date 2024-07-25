const fs = require('fs');
const path = require('path');

const blogDir = path.join(__dirname, 'blog');
const outputFile = path.join(blogDir, 'index.json');

const blogPosts = fs.readdirSync(blogDir)
  .filter(file => file.endsWith('.md'))
  .map(file => {
    const content = fs.readFileSync(path.join(blogDir, file), 'utf-8');
    const titleMatch = content.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1] : 'Untitled';
    return {
      filename: file,
      title: title
    };
  });

fs.writeFileSync(outputFile, JSON.stringify(blogPosts, null, 2));
console.log('Blog index generated successfully.');
