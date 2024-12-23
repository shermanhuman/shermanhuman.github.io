<script setup>
import { ref, onMounted, watch } from 'vue';
import MenuManager from './components/MenuManager.vue';
import AsciiArtTitle from './components/AsciiArtTitle.vue';
import DiskLoading from './components/DiskLoading.vue';
import ModemLoading from './components/ModemLoading.vue';

const currentView = ref('boot');
const bootSequence = ref('');
const resumeContent = ref('');
const blogPosts = ref([]);
const selectedBlogPost = ref(0);
const currentBlogPostContent = ref('');
const loading = ref(false);
const currentLoadingAnimation = ref('disk');
const currentAsciiArt = ref(null);
const currentTitle = ref('');

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

const menuItems = ref([
  {
    label: 'VIEW RESUME',
    action: 'loadResume',
    loadingAnimation: 'disk',
    asciiArt: null,
  },
  {
    label: 'VIEW BLOG',
    action: 'loadBlogList',
    loadingAnimation: 'modem',
    asciiArt: [
      "░█▀▀░█▀█░█▀▄░▀█▀░█▀▀",
      "░▀▀█░█▀▀░█░█░░█░░▀▀█",
      "░▀▀▀░▀░░░▀▀░░▀▀▀░▀▀▀",
    ],
  },
  {
    label: 'INTERNET HYPERLINKS',
    action: 'loadHyperlinks',
    loadingAnimation: 'disk',
    asciiArt: hyperlinksAsciiArt,
  },
]);

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
    const menuItem = menuItems.value.find(item => item.action === 'loadResume');
    if (menuItem) {
        currentLoadingAnimation.value = menuItem.loadingAnimation;
        currentAsciiArt.value = menuItem.asciiArt;
        currentTitle.value = menuItem.label;
    }

    currentView.value = 'loading';
    loading.value = true;
    bootSequence.value = 'LOAD "RESUME",8,1\nSEARCHING FOR RESUME\n';
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
        const response = await fetch('resume.html');
        resumeContent.value = await response.text();
        currentView.value = 'resume';
    } catch (error) {
        console.error("Error loading resume:", error);
        bootSequence.value += `\nERROR: FAILED TO LOAD RESUME\n`;
        await new Promise(resolve => setTimeout(resolve, 1500));
        currentView.value = 'menu';
    } finally {
        loading.value = false;
    }
};

const loadBlogList = async () => {
    const menuItem = menuItems.value.find(item => item.action === 'loadBlogList');
    if (menuItem) {
        currentLoadingAnimation.value = menuItem.loadingAnimation;
        currentAsciiArt.value = menuItem.asciiArt;
        currentTitle.value = menuItem.label;
    }

    currentView.value = 'loading';
    loading.value = true;
    bootSequence.value = 'LOAD "BLOG",8,1\nSEARCHING FOR BLOG\n';

    const loadingTime = currentLoadingAnimation.value === 'modem' ? 3000 : 1500;

    await new Promise(resolve => setTimeout(resolve, loadingTime));

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
    } finally {
        loading.value = false;
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

const loadHyperlinks = async () => {
    const menuItem = menuItems.value.find(item => item.action === 'loadHyperlinks');
    if (menuItem) {
        currentLoadingAnimation.value = menuItem.loadingAnimation;
        currentAsciiArt.value = menuItem.asciiArt;
        currentTitle.value = menuItem.label;
    }

    currentView.value = 'loading';
    loading.value = true;

    await new Promise(resolve => setTimeout(resolve, 1500));

    currentView.value = 'hyperlinks';
    loading.value = false;
};

const handleKeydown = (event) => {
    if (currentView.value === 'blogList') {
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
    setInterval(animateHyperlinks, 50);
});

watch(currentView, (newView) => {
    if (newView === 'menu' || newView === 'blogList') {
        selectedBlogPost.value = 0;
    }
});
</script>

<template>
 <div id="screen">
            <div id="boot-sequence" v-if="currentView === 'boot'">
                <pre v-html="bootSequence"></pre>
            </div>

            <MenuManager
                v-if="currentView === 'menu'"
                @loadResume="loadResume"
                @loadBlogList="loadBlogList"
                @loadHyperlinks="loadHyperlinks"
                :menuItems="menuItems"
            />

            <div v-if="currentView === 'loading' && loading">
                <AsciiArtTitle v-if="currentAsciiArt" :asciiArt="currentAsciiArt" :animate="currentTitle == 'INTERNET HYPERLINKS'" />
                <h1 v-else>{{ currentTitle }}</h1>
                <DiskLoading v-if="currentLoadingAnimation === 'disk'" />
                <ModemLoading v-if="currentLoadingAnimation === 'modem'" />
            </div>

            <div id="resume" v-if="currentView === 'resume'">
                <div v-html="resumeContent"></div>
                <p>PRESS 'R' TO RETURN TO MAIN MENU</p>
            </div>

            <div id="blog-list" v-if="currentView === 'blogList'">
                <AsciiArtTitle v-if="currentAsciiArt" :asciiArt="currentAsciiArt" :animate="currentTitle == 'INTERNET HYPERLINKS'"/>
                <h1 v-else>{{ currentTitle }}</h1>
                <ul>
                    <li
                        v-for="(post, index) in blogPosts"
                        :key="index"
                        :class="{ selected: index === selectedBlogPost }"
                    >
                        {{ index + 1 }}. [{{ post.formattedDate }}] {{ post.title }} Last modified: {{ post.formattedLastMod }}
                    </li>
                </ul>
                <p>PRESS 'R' TO RETURN TO MAIN MENU</p>
            </div>

            <div id="blog-post" v-if="currentView === 'blogPost'">
                <div v-html="currentBlogPostContent"></div>
                <p>PRESS 'R' TO RETURN TO BLOG LIST</p>
            </div>

            <div id="hyperlinks" v-if="currentView === 'hyperlinks'">
                <AsciiArtTitle :asciiArt="hyperlinksAsciiArt" :animate="true" />
                <ul>
                    <li
                        v-for="(item, index) in hyperlinkItems"
                        :key="index"
                        :class="{ selected: index === selectedHyperlinkItem }"
                    >
                        {{ index + 1 }}. {{ item.name }}
                    </li>
                </ul>
                <p>PRESS 'R' TO RETURN TO MAIN MENU</p>
            </div>
        </div>
</template>