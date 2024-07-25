const fs = require('fs');
const path = require('path');

const blogDir = path.join(__dirname, 'blog');
const outputFile = path.join(blogDir, 'index.json');

console.log(`Current working directory: ${process.cwd()}`);
console.log(`Scanning directory: ${blogDir}`);

try {
  if (!fs.existsSync(blogDir)) {
    console.error(`Blog directory does not exist: ${blogDir}`);
    process.exit(1);
  }

  const files = fs.readdirSync(blogDir);
  console.log(`Files in blog directory: ${files.join(', ')}`);

  const blogPosts = files
    .filter(file => file.endsWith('.md'))
    .map(file => {
      console.log(`Processing file: ${file}`);
      const content = fs.readFileSync(path.join(blogDir, file), 'utf-8');
      const titleMatch = content.match(/^#\s+(.+)$/m);
      const title = titleMatch ? titleMatch[1] : 'Untitled';
      console.log(`- Title: ${title}`);
      return {
        filename: file,
        title: title
      };
    });

  console.log(`Writing output to: ${outputFile}`);
  fs.writeFileSync(outputFile, JSON.stringify(blogPosts, null, 2));
  console.log('Blog index generated successfully.');
  console.log(`Total blog posts processed: ${blogPosts.length}`);
} catch (error) {
  console.error('Error generating blog index:', error);
  process.exit(1);
}
