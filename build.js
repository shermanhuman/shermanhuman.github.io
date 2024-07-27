const fs = require('fs');
const path = require('path');
const marked = require('marked');

const blogSrcDir = path.join(__dirname, 'blog', 'src');
const blogOutputDir = path.join(__dirname, 'blog');
const outputFile = path.join(blogOutputDir, 'index.json');

// Ensure the blog output directory exists
if (!fs.existsSync(blogOutputDir)) {
    fs.mkdirSync(blogOutputDir, { recursive: true });
}

// Read all markdown files in the blog directory
const blogPosts = fs.readdirSync(blogSrcDir)
    .filter(file => file.endsWith('.md'))
    .map(file => {
        const content = fs.readFileSync(path.join(blogSrcDir, file), 'utf-8');
        const tokens = marked.lexer(content);
        const titleToken = tokens.find(token => token.type === 'heading' && token.depth === 1);
        const title = titleToken ? titleToken.text : path.basename(file, '.md');

        // Convert Markdown to HTML
        const htmlContent = marked.parse(content);
        const htmlFileName = file.replace('.md', '.html');
        fs.writeFileSync(path.join(blogDir, htmlFileName), htmlContent);

        return {
            title,
            file: htmlFileName // Now referencing the HTML file instead of Markdown
        };
    });

// Write the blog post metadata to index.json
fs.writeFileSync(path.join(blogOutputDir, htmlFileName), htmlContent);

// Convert resume.md to HTML
const resumePath = path.join(__dirname, 'resume.md');
const resumeContent = fs.readFileSync(resumePath, 'utf-8');
const resumeHtml = marked.parse(resumeContent);
fs.writeFileSync(path.join(__dirname, 'resume.html'), resumeHtml);

console.log('Blog index and HTML files generated successfully.');
