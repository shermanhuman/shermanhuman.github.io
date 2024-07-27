const fs = require('fs');
const path = require('path');
const marked = require('marked');
const yaml = require('js-yaml');

const blogSrcDir = path.join(__dirname, 'blog', 'src');
const blogOutputDir = path.join(__dirname, 'blog');
const outputFile = path.join(blogOutputDir, 'index.json');

// Ensure the blog output directory exists
if (!fs.existsSync(blogOutputDir)) {
    fs.mkdirSync(blogOutputDir, { recursive: true });
}

// Function to parse frontmatter
function parseFrontmatter(content) {
    const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n/;
    const match = content.match(frontmatterRegex);
    
    if (!match) return { content };

    const frontmatter = yaml.load(match[1]);
    const contentWithoutFrontmatter = content.replace(frontmatterRegex, '');

    return {
        ...frontmatter,
        content: contentWithoutFrontmatter
    };
}

// Read all markdown files in the blog/src directory
const blogPosts = fs.readdirSync(blogSrcDir)
    .filter(file => file.endsWith('.md'))
    .map(file => {
        const content = fs.readFileSync(path.join(blogSrcDir, file), 'utf-8');
        const { title, date, author, tags, content: postContent } = parseFrontmatter(content);

        // Convert Markdown to HTML
        const htmlContent = marked.parse(postContent);
        const htmlFileName = file.replace('.md', '.html');
        fs.writeFileSync(path.join(blogOutputDir, htmlFileName), htmlContent);

        return {
            title,
            date,
            author,
            tags,
            file: htmlFileName
        };
    });

// Write the blog post metadata to index.json
fs.writeFileSync(outputFile, JSON.stringify(blogPosts, null, 2));

// Convert resume.md to HTML
const resumePath = path.join(__dirname, 'resume.md');
const resumeContent = fs.readFileSync(resumePath, 'utf-8');
const resumeHtml = marked.parse(resumeContent);
fs.writeFileSync(path.join(__dirname, 'resume.html'), resumeHtml);

console.log('Blog index and HTML files generated successfully.');
