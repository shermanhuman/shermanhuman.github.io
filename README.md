# shermanboyd.com

A little vanity site, meant to feel a bit like a retro computing experience.

## How It Works

The site is built using Vue.js and is designed to mimic the Commodore 64 interface. It features:

1. A boot sequence that simulates the C64 startup process.
2. A main menu for navigating between the resume and blog sections.
3. A viewable resume pulled from a Markdown file.
4. A blog section with posts written in Markdown and converted to HTML.

The site is statically generated using a Node.js build script and hosted on GitHub Pages.

## Folder Structure

```
/
├── index.html
├── app.js
├── styles.css
├── resume.md
├── build.js
├── package.json
├── README.md
├── .github/
│   └── workflows/
│       └── build.yml
└── blog/
    ├── src/
    │   ├── first-post.md
    │   ├── second-post.md
    │   └── ...
    ├── first-post.html
    ├── second-post.html
    └── index.json
```

- `index.html`: The main HTML file for the site.
- `app.js`: The Vue.js application script.
- `styles.css`: CSS styles for the C64 look and feel.
- `resume.md`: The content of your resume in Markdown format.
- `build.js`: Node.js script to build the site.
- `package.json`: Node.js project file with dependencies.
- `.github/workflows/build.yml`: GitHub Actions workflow for automatic deployment.
- `blog/src/`: Directory containing source Markdown files for blog posts.
- `blog/*.html`: Generated HTML files for each blog post.
- `blog/index.json`: Generated index of all blog posts.

## Metadata Structure

Blog posts use YAML frontmatter for metadata. Each blog post should start with the following structure:

```markdown
---
title: Your Blog Post Title
date: YYYY-MM-DD
author: Your Name
tags: 
  - tag1
  - tag2
  - tag3
---

# Your Blog Post Title

Your blog post content starts here...
```

## How to Post a New Blog

To create a new blog post:

1. Create a new Markdown file in the `blog/src/` directory. Name it with a `.md` extension (e.g., `my-new-post.md`).

2. Add the YAML frontmatter at the top of the file as shown in the Metadata Structure section above.

3. Write your blog post content in Markdown format below the frontmatter.

4. Commit and push your new file to the GitHub repository.

5. The GitHub Actions workflow will automatically run the build script, which will:
   - Convert your Markdown file to HTML
   - Update the `blog/index.json` file with your new post's metadata
   - Deploy the updated site to GitHub Pages

Your new blog post will now be visible on the site!

## Development

To set up the project for local development:

1. Clone the repository
2. Run `npm install` to install dependencies
3. Make changes to the source files
4. Run `node build.js` to build the site
5. Open `index.html` in a web browser to view your changes

## Deployment

Deployment is handled automatically by GitHub Actions. Any push to the `main` branch will trigger a new build and deployment to GitHub Pages.

