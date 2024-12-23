<script setup>
import { ref, onMounted, watch } from 'vue';

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

const colorGradients = [
    ['#FF0000', '#FF3333', '#FF6666', '#FF9999', '#FFCCCC', '#FFEEEE'], // Red gradient
    ['#00FF00', '#33FF33', '#66FF66', '#99FF99', '#CCFFCC', '#EEFFEE'], // Green gradient
    ['#0000FF', '#3333FF', '#6666FF', '#9999FF', '#CCCCFF', '#EEEEFF']  // Blue gradient
];

const position = ref(0);
const direction = ref(1); // 1 for right, -1 for left
const colorIndices = ref([5, 4, 3, 2, 1, 0]);
const currentGradient = ref(0);

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
    console.log("Starting boot sequence");
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
    console.log("Boot sequence completed, changing to menu view");
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
    console.log("Loading resume");
    currentView.value = 'boot';
    bootSequence.value = 'LOAD "RESUME",8,1\nSEARCHING FOR RESUME\nLOADING\n';
    await new Promise(resolve => setTimeout(resolve, 1500));
    try {
        const response = await fetch('resume.html');
        resumeContent.value = await response.text();
        currentView.value = 'resume';
        console.log("Resume loaded successfully");
    } catch (error) {
        console.error("Error loading resume:", error);
        bootSequence.value += `\nERROR: FAILED TO LOAD RESUME\n`;
        await new Promise(resolve => setTimeout(resolve, 1500));
        currentView.value = 'menu';
    }
};

const loadBlogList = async () => {
    console.log("Loading blog list");
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
        console.log("Blog list loaded successfully");
    } catch (error) {
        console.error('Error loading blog list:', error);
        bootSequence.value += `\nERROR: FAILED TO LOAD BLOG LIST\n`;
        await new Promise(resolve => setTimeout(resolve, 1500));
        currentView.value = 'menu';
    }
};

const loadBlogPost = async (index) => {
    console.log(`Loading blog post at index ${index}`);
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
        console.log("Blog post loaded successfully");
    } catch (error) {
        console.error('Error loading blog post:', error);
        bootSequence.value += `\nERROR: FAILED TO LOAD BLOG POST\n`;
        await new Promise(resolve => setTimeout(resolve, 1500));
        currentView.value = 'blogList';
    }
};

const animateHyperlinks = () => {
    position.value += direction.value;

    if (position.value >= 100 || position.value <= -100) {
        direction.value *= -1;
    }

    if (position.value % 10 === 0) {
        for (let i = 0; i < colorIndices.value.length; i++) {
            colorIndices.value[i] = (colorIndices.value[i] + 1) % 6;
        }

        if (colorIndices.value[0] === 5) {
            currentGradient.value = (currentGradient.value + 1) % colorGradients.length;
        }
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
    console.log("Loading hyperlinks");
    currentView.value = 'boot';
    await simulateLoading();
    currentView.value = 'hyperlinks';
    console.log("Hyperlinks loaded");
};

const handleKeydown = (event) => {
    console.log(`Key pressed: ${event.key}`);
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
    console.log("Vue app mounted, current view:", currentView.value);
    typeBootSequence();
    window.addEventListener('keydown', handleKeydown);
    setInterval(animateHyperlinks, 50);
});

watch(currentView, (newView) => {
    console.log("Current view changed to:", newView);
    if (newView === 'menu' || newView === 'blogList') {
        selectedMenuItem.value = 0;
        selectedBlogPost.value = 0;
    }
});

</script>

<template>
 <div id="screen">
            <div id="boot-sequence" v-if="currentView === 'boot'">
                <pre v-html="bootSequence"></pre>
            </div>

            <div id="main-menu" v-if="currentView === 'menu'">
                <h1>MAIN MENU</h1>
                <ul>
                    <li v-for="(item, index) in menuItems" :key="index" :class="{ selected: index === selectedMenuItem }">
                        {{ index + 1 }}. {{ item }}
                    </li>
                </ul>
            </div>

            <div id="resume" v-if="currentView === 'resume'">
                <div v-html="resumeContent"></div>
                <p>PRESS 'R' TO RETURN TO MAIN MENU</p>
            </div>

            <div id="blog-list" v-if="currentView === 'blogList'">
                <h1>BLOG POSTS</h1>
                <ul>
                    <li v-for="(post, index) in blogPosts" :key="index" :class="{ selected: index === selectedBlogPost }">
                        {{ index + 1 }}. [{{ post.formattedDate }}] {{ post.title }}
                        Last modified: {{ post.formattedLastMod }}
                    </li>
                </ul>
                <p>PRESS 'R' TO RETURN TO MAIN MENU</p>
            </div>

            <div id="blog-post" v-if="currentView === 'blogPost'">
                <div v-html="currentBlogPostContent"></div>
                <p>PRESS 'R' TO RETURN TO BLOG LIST</p>
            </div>

            <div id="hyperlinks" v-if="currentView === 'hyperlinks'">
                <div :style="{ transform: `translateX(${position}%)`, transition: 'transform 0.05s linear' }">
                    <pre v-for="(line, lineIndex) in hyperlinksAsciiArt" 
                         :key="lineIndex" 
                         :style="{ color: colorGradients[currentGradient][colorIndices[lineIndex]] }">
                        {{ line }}
                    </pre>
                </div>
                <ul>
                    <li v-for="(item, index) in hyperlinkItems" :key="index" :class="{ selected: index === selectedHyperlinkItem }">
                        {{ index + 1 }}. {{ item.name }}
                    </li>
                </ul>
                <p>PRESS 'R' TO RETURN TO MAIN MENU</p>
            </div>
        </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>