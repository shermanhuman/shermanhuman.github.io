const fs = require('fs');
const path = require('path');
const marked = require('marked');

const blogDir = path.join(__dirname, 'blog');
const outputFile = path.join(blogDir, 'index.json');

// Read all markdown files in the blog directory
const blogPosts = fs.readdirSync(blogDir)
    .filter(file => file.endsWith('.md'))
    .map(file => {
        const content = fs.readFileSync(path.join(blogDir, file), 'utf-8');
        const tokens = marked.lexer(content);
        const titleToken = tokens.find(token => token.type === 'heading' && token.depth === 1);
        const title = titleToken ? titleToken.text : path.basename(file, '.md');

        return {
            title,
            file
        };
    });

// Write the blog post metadata to index.json
fs.writeFileSync(outputFile, JSON.stringify(blogPosts, null, 2));

console.log('Blog index generated successfully.');
