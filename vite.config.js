import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import { marked } from 'marked';
import matter from 'gray-matter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function buildBlog() {
  const blogSrcDir = path.join(__dirname, 'src', 'blog');
  const blogOutputDir = path.join(__dirname, 'public', 'blog');
  const outputFile = path.join(blogOutputDir, 'index.json');

  // Ensure the blog output directory exists
  if (!fs.existsSync(blogOutputDir)) {
    fs.mkdirSync(blogOutputDir, { recursive: true });
  }

  // Function to parse frontmatter
  function parseFrontmatter(content) {
    const { data, content: markdownContent } = matter(content);
    return {
      ...data,
      content: markdownContent,
    };
  }

  // Function to ensure date is parsed correctly
  function parseDate(dateInput) {
    if (dateInput instanceof Date) {
      return dateInput;
    }
    if (typeof dateInput === 'string') {
      // Try parsing as ISO string
      let date = new Date(dateInput);
      if (!isNaN(date.getTime())) {
        return date;
      }
    }
    console.warn(`Invalid date input: ${dateInput}. Using current date.`);
    return new Date();
  }

  // Clear existing HTML files in the blog output directory
  fs.readdirSync(blogOutputDir)
    .filter((file) => file.endsWith('.html'))
    .forEach((file) => {
      fs.unlinkSync(path.join(blogOutputDir, file));
    });

  // Read all markdown files in the blog/src directory
  const blogPosts = fs
    .readdirSync(blogSrcDir)
    .filter((file) => file.endsWith('.md'))
    .map((file) => {
      const content = fs.readFileSync(path.join(blogSrcDir, file), 'utf-8');
      const {
        title,
        date,
        lastmod,
        author,
        tags,
        content: postContent,
        ...otherMetadata
      } = parseFrontmatter(content);

      // Parse the dates
      const publishDate = parseDate(date);
      const modifiedDate = lastmod ? parseDate(lastmod) : publishDate;

      // Convert Markdown to HTML
      const htmlContent = marked.parse(postContent);

      // Add metadata to the top of the HTML content
      const metadataHtml = `
            <div class="post-metadata">
                <p><strong>Title:</strong> ${title}</p>
                <p><strong>Publish Date:</strong> ${publishDate.toISOString()}</p>
                <p><strong>Last Modified:</strong> ${modifiedDate.toISOString()}</p>
                <p><strong>Author:</strong> ${author}</p>
                <p><strong>Tags:</strong> ${tags ? tags.join(', ') : ''}</p>
                ${Object.entries(otherMetadata)
                  .map(([key, value]) => `<p><strong>${key}:</strong> ${value}</p>`)
                  .join('')}
            </div>
            <hr>
        `;
      const htmlWithMetadata = metadataHtml + htmlContent;

      const htmlFileName = file.replace('.md', '.html');
      fs.writeFileSync(path.join(blogOutputDir, htmlFileName), htmlWithMetadata);

      return {
        title,
        date: publishDate.toISOString(),
        lastmod: modifiedDate.toISOString(),
        author,
        tags,
        file: htmlFileName,
        ...otherMetadata,
      };
    });

  // Sort blog posts by publish date (most recent first)
  blogPosts.sort((a, b) => new Date(b.date) - new Date(a.date));

  // Write the sorted blog post metadata to index.json
  fs.writeFileSync(outputFile, JSON.stringify(blogPosts, null, 2));

  // Convert resume.md to HTML
  const resumePath = path.join(__dirname, 'src', 'resume.md');
  const resumeContent = fs.readFileSync(resumePath, 'utf-8');
  const resumeHtml = marked.parse(resumeContent);
  fs.writeFileSync(path.join(__dirname, 'public', 'resume.html'), resumeHtml);

  console.log('Blog index and HTML files generated successfully.');
}

export default defineConfig({
  plugins: [
    vue(),
    {
      name: 'generate-html',
      buildStart() {
        buildBlog();
      },
    },
  ],
  base: '/',
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
      },
    },
  },
});