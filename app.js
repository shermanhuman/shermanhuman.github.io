// app.js
const { createApp, ref, onMounted, watch } = Vue;

const app = createApp({
    setup() {
        const currentView = ref('boot');
        const bootSequence = ref('');
        const menuItems = ref(['VIEW RESUME', 'VIEW BLOG', 'INTERNET HYPERLINKS']);
        const selectedMenuItem = ref(0);
        const resumeContent = ref('');
        const blogPosts = ref([]);
        const selectedBlogPost = ref(0);
        const currentBlogPostContent = ref('');
        const hyperlinkItems = ref([
            { name: 'GITHUB', url: 'https://github.com/shermanhuman' },
            { name: 'LINKEDIN', url: 'https://www.linkedin.com/in/twocell/' }
        ]);
        const selectedHyperlinkItem = ref(0);

        const hyperlinksAsciiArt = ref([
            "░█░█░█░█░█▀█░█▀▀░█▀▄░█░░░▀█▀░█▀█░█░█░█▀▀",
            "░█▀█░░█░░█▀▀░█▀▀░█▀▄░█░░░░█░░█░█░█▀▄░▀▀█",
            "░▀░▀░░▀░░▀░░░▀▀▀░▀░▀░▀▀▀░▀▀▀░▀░▀░▀░▀░▀▀▀"
        ]);

        const colorClasses = ['color-1', 'color-2', 'color-3', 'color-4', 'color-5', 'color-6'];
        const positionClass = ref('position-center');
        const colorIndex = ref(0);
        const position = ref(0);

        const bootLines = [
            '**** COMMODORE 64 BASIC V2 ****',
            '64K RAM SYSTEM  38911 BASIC BYTES FREE',
            'READY.',
            'LOAD "MENU",8,1',
            'SEARCHING FOR MENU',
            'LOADING',
            'READY.'
        ];

        const typeBootSequence = async () => {
            for (let i = 0; i < 3; i++) {
                bootSequence.value += bootLines[i] + '\n';
            }
            await new Promise(resolve => setTimeout(resolve, 1000));

            for (let char of bootLines[3]) {
                bootSequence.value += char;
                await new Promise(resolve => setTimeout(resolve, 50));
            }
            bootSequence.value += '\n';

            for (let i = 4; i < bootLines.length; i++) {
                bootSequence.value += bootLines[i] + '\n';
                await new Promise(resolve => setTimeout(resolve, 500));
            }

            await new Promise(resolve => setTimeout(resolve, 1000));
            currentView.value = 'menu';
        };

        const formatDate = (dateString) => {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: '2-digit', 
                day: '2-digit',
                timeZone: 'UTC'
            });
        };

        const loadResume = async () => {
            currentView.value = 'boot';
            bootSequence.value = 'LOAD "RESUME",8,1\nSEARCHING FOR RESUME\nLOADING\n';
            await new Promise(resolve => setTimeout(resolve, 1500));
            const response = await fetch('resume.html');
            resumeContent.value = await response.text();
            currentView.value = 'resume';
        };

        const loadBlogList = async () => {
            currentView.value = 'boot';
            bootSequence.value = 'LOAD "BLOG",8,1\nSEARCHING FOR BLOG\nLOADING\n';
            await new Promise(resolve => setTimeout(resolve, 1500));
            try {
                const response = await fetch('blog/index.json');
                if (!response.ok) {
                    throw new Error(`Failed to fetch blog/index.json: ${response.statusText}`);
                }
                blogPosts.value = await response.json();
                blogPosts.value.forEach(post => {
                    post.formattedDate = formatDate(post.date);
                    post.formattedLastMod = formatDate(post.lastmod);
                });
                currentView.value = 'blogList';
            } catch (error) {
                console.error('Error loading blog list:', error);
                bootSequence.value += `\nERROR: FAILED TO LOAD BLOG LIST\n`;
                await new Promise(resolve => setTimeout(resolve, 1500));
                currentView.value = 'menu';
            }
        };

        const loadBlogPost = async (index) => {
            currentView.value = 'boot';
            bootSequence.value = `LOAD "BLOG/${blogPosts.value[index].file}",8,1\nSEARCHING FOR ${blogPosts.value[index].file}\nLOADING\n`;
            await new Promise(resolve => setTimeout(resolve, 1500));
            try {
                const response = await fetch(`blog/${blogPosts.value[index].file}`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch blog post: ${response.statusText}`);
                }
                currentBlogPostContent.value = await response.text();
                currentView.value = 'blogPost';
            } catch (error) {
                console.error('Error loading blog post:', error);
                bootSequence.value += `\nERROR: FAILED TO LOAD BLOG POST\n`;
                await new Promise(resolve => setTimeout(resolve, 1500));
                currentView.value = 'blogList';
            }
        };

        const animateHyperlinks = () => {
            colorIndex.value = (colorIndex.value + 1) % colorClasses.length;
            position.value = (position.value + 1) % 100;
            
            if (position.value < 25) {
                positionClass.value = 'position-left';
            } else if (position.value < 75) {
                positionClass.value = 'position-center';
            } else {
                positionClass.value = 'position-right';
            }
        };

        const simulateLoading = async () => {
            const loadingChars = ['|', '/', '-', '\\'];
            for (let i = 0; i < 20; i++) {
                bootSequence.value = `LOADING ${loadingChars[i % 4]}`;
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        };

        const loadHyperlinks = async () => {
            currentView.value = 'boot';
            await simulateLoading();
            currentView.value = 'hyperlinks';
        };

        const handleKeydown = (event) => {
            if (currentView.value === 'menu') {
                if (event.key === 'ArrowUp') {
                    selectedMenuItem.value = (selectedMenuItem.value - 1 + menuItems.value.length) % menuItems.value.length;
                } else if (event.key === 'ArrowDown') {
                    selectedMenuItem.value = (selectedMenuItem.value + 1) % menuItems.value.length;
                } else if (event.key === 'Enter') {
                    if (selectedMenuItem.value === 0) {
                        loadResume();
                    } else if (selectedMenuItem.value === 1) {
                        loadBlogList();
                    } else if (selectedMenuItem.value === 2) {
                        loadHyperlinks();
                    }
                }
            } else if (currentView.value === 'blogList') {
                if (event.key === 'ArrowUp') {
                    selectedBlogPost.value = (selectedBlogPost.value - 1 + blogPosts.value.length) % blogPosts.value.length;
                } else if (event.key === 'ArrowDown') {
                    selectedBlogPost.value = (selectedBlogPost.value + 1) % blogPosts.value.length;
                } else if (event.key === 'Enter') {
                    loadBlogPost(selectedBlogPost.value);
                } else if (event.key.toLowerCase() === 'r') {
                    currentView.value = 'menu';
                }
            } else if (currentView.value === 'hyperlinks') {
                if (event.key === 'ArrowUp') {
                    selectedHyperlinkItem.value = (selectedHyperlinkItem.value - 1 + hyperlinkItems.value.length) % hyperlinkItems.value.length;
                } else if (event.key === 'ArrowDown') {
                    selectedHyperlinkItem.value = (selectedHyperlinkItem.value + 1) % hyperlinkItems.value.length;
                } else if (event.key === 'Enter') {
                    window.open(hyperlinkItems.value[selectedHyperlinkItem.value].url, '_blank');
                } else if (event.key.toLowerCase() === 'r') {
                    currentView.value = 'menu';
                }
            } else if (currentView.value === 'resume' || currentView.value === 'blogPost') {
                if (event.key.toLowerCase() === 'r') {
                    currentView.value = currentView.value === 'resume' ? 'menu' : 'blogList';
                }
            }
        };

        onMounted(() => {
            typeBootSequence();
            window.addEventListener('keydown', handleKeydown);
            setInterval(animateHyperlinks, 50); // Increased animation frequency for smoother movement
        });

        watch(currentView, (newView) => {
            if (newView === 'menu' || newView === 'blogList') {
                selectedMenuItem.value = 0;
                selectedBlogPost.value = 0;
            }
        });

        return {
            currentView,
            bootSequence,
            menuItems,
            selectedMenuItem,
            resumeContent,
            blogPosts,
            selectedBlogPost,
            currentBlogPostContent,
            hyperlinkItems,
            hyperlinksAsciiArt,
            selectedHyperlinkItem,
            colorClasses,
            positionClass,
            colorIndex,
            loadResume,
            loadBlogList,
            loadBlogPost,
            formatDate
        };
    }
});

app.mount('#app');
