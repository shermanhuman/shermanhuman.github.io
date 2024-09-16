# Commodore 64-Inspired Digital Resume and Blog Platform

## Project Summary

This project is a nostalgic, Commodore 64-inspired digital resume and blog platform. It emulates the look, feel, and behavior of a Commodore 64 computer, providing an authentic retro computing experience while showcasing modern web development techniques. The site features a boot sequence, a main menu, a viewable resume, and a blog section, all presented in the iconic Commodore 64 style.

## Code Flow

1. **Boot Sequence**: The application starts with a simulated C64 boot sequence.
2. **Main Menu**: After booting, the main menu is displayed with options to view the resume or blog.
3. **Resume**: When selected, the resume content is loaded from a Markdown file and displayed.
4. **Blog List**: The blog option shows a list of available blog posts.
5. **Blog Post**: Selecting a blog post loads and displays its content.

The application uses React Router for navigation and simulates C64-style loading between sections.

## Developer Setup and Instructions

1. Clone the repository:
   ```
   git clone https://github.com/shermanhuman/shermanhuman.github.io.git
   cd shermanhuman.github.io
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Run the development server:
   ```
   npm run dev
   ```

4. Build for production:
   ```
   npm run build
   ```

5. Preview the production build:
   ```
   npm run preview
   ```

## Directory Tree

```
shermanhuman.github.io/
├── public/
│   ├── resume.md
│   ├── blog/
│   │   └── (blog post .md files)
│   └── index.html
├── src/
│   ├── components/
│   │   ├── BlogList.tsx
│   │   ├── BlogPost.tsx
│   │   ├── BootSequence.tsx
│   │   ├── C64Startup.tsx
│   │   ├── LoadingIndicator.tsx
│   │   ├── MainMenu.tsx
│   │   ├── Resume.tsx
│   │   └── TypeWriter.tsx
│   ├── App.tsx
│   ├── index.tsx
│   └── styles.css
├── .github/
│   └── workflows/
│       └── build.yml
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
└── README.md
```

## File Purposes

- **public/resume.md**: Contains the resume content in Markdown format.
- **public/blog/**: Directory containing individual blog post files in Markdown format.
- **public/index.html**: The main HTML file that serves as the entry point for the application.

- **src/components/BlogList.tsx**: Renders the list of available blog posts.
- **src/components/BlogPost.tsx**: Displays individual blog post content.
- **src/components/BootSequence.tsx**: Simulates the C64 boot sequence.
- **src/components/C64Startup.tsx**: Renders the initial C64 startup screen.
- **src/components/LoadingIndicator.tsx**: Displays a loading indicator between page transitions.
- **src/components/MainMenu.tsx**: Renders the main menu of the application.
- **src/components/Resume.tsx**: Displays the resume content.
- **src/components/TypeWriter.tsx**: Provides a typewriter effect for text display.

- **src/App.tsx**: The main React component that handles routing and overall app structure.
- **src/index.tsx**: The entry point for the React application.
- **src/styles.css**: Contains all the CSS styles for the application, including C64-specific styles.

- **.github/workflows/build.yml**: GitHub Actions workflow for building and deploying the site.

- **package.json**: Defines the project dependencies and scripts.
- **tsconfig.json**: TypeScript configuration file.
- **tsconfig.node.json**: TypeScript configuration for Node.js environment.
- **vite.config.ts**: Configuration file for Vite (build tool).
- **README.md**: This file, containing project documentation.

## Deployment

The project is set up to be hosted on GitHub Pages. The GitHub Actions workflow in `.github/workflows/build.yml` handles the build and deployment process automatically when changes are pushed to the main branch.

## Accessibility and Responsiveness

The application is designed to be keyboard accessible and responsive across different screen sizes while maintaining the C64 aesthetic. It uses semantic HTML and ARIA attributes to ensure compatibility with screen readers.

## Performance

The application is optimized for quick loading and smooth transitions between sections, leveraging modern web technologies while maintaining a retro look and feel.