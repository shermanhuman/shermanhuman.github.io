const fs = require('fs').promises;
const path = require('path');

async function generateBlogIndex() {
  const blogDir = path.join(__dirname, 'blog');
  const files = await fs.readdir(blogDir);
  
  const posts = await Promise.all(
    files
      .filter(file => file.endsWith('.md'))
      .map(async file => {
        const content = await fs.readFile(path.join(blogDir, file), 'utf-8');
        const title = content.split('\n')[0].replace('# ', '');
        return {
          title,
          file
        };
      })
  );

  const indexContent = JSON.stringify({ posts }, null, 2);
  await fs.writeFile(path.join(blogDir, 'index.json'), indexContent);

  console.log('Blog index generated successfully.');
}

generateBlogIndex().catch(console.error);
