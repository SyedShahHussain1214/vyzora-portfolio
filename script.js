const header = document.querySelector('.site-header');
const mobileToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.main-nav');

function updateHeader() {
  if (window.scrollY > 40) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', updateHeader);
updateHeader();

function closeNavigation() {
  document.body.classList.remove('nav-open');
  mobileToggle.setAttribute('aria-expanded', 'false');
}

mobileToggle.addEventListener('click', function() {
  const isOpen = document.body.classList.toggle('nav-open');
  mobileToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
});

nav.querySelectorAll('a').forEach(function(link) {
  link.addEventListener('click', function() {
    closeNavigation();
  });
});

document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') {
    closeNavigation();
    mobileToggle.focus();
  }
});

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.16 });

  document.querySelectorAll('.reveal').forEach(function(el) {
    observer.observe(el);
  });
} else {
  document.querySelectorAll('.reveal').forEach(function(el) {
    el.classList.add('visible');
  });
}

const scrollProgress = document.createElement('div');
scrollProgress.className = 'scroll-progress';
document.body.appendChild(scrollProgress);

function updateScrollProgress() {
  const height = document.documentElement.scrollHeight - window.innerHeight;
  const percentage = height <= 0 ? 0 : window.scrollY / height;
  scrollProgress.style.transform = `scaleX(${Math.min(Math.max(percentage, 0), 1)})`;
}

window.addEventListener('scroll', updateScrollProgress);
updateScrollProgress();

const heroFrame = document.querySelector('.hero-frame-image');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (heroFrame && !reducedMotion) {
  window.addEventListener('mousemove', function(event) {
    const x = Math.round((event.clientX / Math.max(window.innerWidth, 1)) * 18 - 9);
    const y = Math.round((event.clientY / Math.max(window.innerHeight, 1)) * 18 - 9);
    heroFrame.style.setProperty('--pointer-x', `${x * 0.45}px`);
    heroFrame.style.setProperty('--pointer-y', `${y * 0.45}px`);
  });
}

const youtubeVideos = [
  { videoId: '28gF2wVUeBM', title: 'Bito Screen 1', category: 'Food & Beverage / Content', image: 'https://i.ytimg.com/vi/28gF2wVUeBM/hqdefault.jpg' },
  { videoId: 'N2c59hdhyFI', title: 'Sakoon-Perfume CGI ad', category: 'Perfume / CGI', image: 'https://i.ytimg.com/vi/N2c59hdhyFI/hqdefault.jpg' },
  { videoId: 'MiNuuXdDjWg', title: '10 September 2026', category: 'Creative Production', image: 'https://i.ytimg.com/vi/MiNuuXdDjWg/hqdefault.jpg' },
  { videoId: 'urAsTqWD0Qg', title: 'Sakoon Perfume CGI ad 2', category: 'Perfume / CGI', image: 'https://i.ytimg.com/vi/urAsTqWD0Qg/hqdefault.jpg' },
  { videoId: 'AMY_-uERE3E', title: 'CGI ad-Beauty Brands Editions', category: 'Beauty / CGI', image: 'https://i.ytimg.com/vi/AMY_-uERE3E/hqdefault.jpg' },
  { videoId: 'Mwct32P7F-8', title: 'EMPEROR-Energy Drink CGI ad', category: 'Energy Drink / CGI', image: 'https://i.ytimg.com/vi/Mwct32P7F-8/hqdefault.jpg' }
];

function loadYouTubeVideos() {
  const grid = document.getElementById('youtube-grid');
  if (!grid) {
    return;
  }

  renderYouTubeGallery(youtubeVideos);
}


const ecosystemContent = {
  branding: {
    title: 'BRANDING',
    description: 'Identity, voice and the creative foundation that lets a business become recognizable.',
    tags: ['Identity Systems', 'Brand Strategy', 'Creative Direction'],
    projects: 'BITO · AURELUME · SAKOON'
  },
  content: {
    title: 'CONTENT',
    description: 'Premium social, campaign and product storytelling designed for attention and recall.',
    tags: ['Social Content', 'Campaigns', 'Video Production'],
    projects: 'BITO · FOOD STORIES · BEAUTY CGI'
  },
  websites: {
    title: 'WEBSITES',
    description: 'Digital homes that present the brand clearly and convert the visit into momentum.',
    tags: ['Web Design', 'Digital Experience', 'E-Commerce'],
    projects: 'STORE SYSTEMS · DIGITAL LAUNCH'
  },
  marketing: {
    title: 'MARKETING',
    description: 'Strategy, channel planning and performance-minded creative to grow demand.',
    tags: ['Digital Marketing', 'Social Media', 'Growth'],
    projects: 'AD CAMPAIGNS · AWARENESS · PERFORMANCE'
  },
  advertising: {
    title: 'ADVERTISING',
    description: 'Creative production built for campaigns, product presence and digital attention.',
    tags: ['Product Advertising', 'CGI', 'Motion'],
    projects: 'SAKOON · EMPEROR · BEAUTY BRANDS'
  },
  performance: {
    title: 'PERFORMANCE',
    description: 'Creative testing, content optimization and conversion systems around business objectives.',
    tags: ['Optimization', 'Creative Testing', 'Conversion'],
    projects: 'SHOPIFY · CONTENT SYSTEMS · SOCIAL'
  },
  growth: {
    title: 'GROWTH',
    description: 'AI-era discovery, GEO, content visibility and digital momentum working together.',
    tags: ['GEO', 'AI Discovery', 'Modern Visibility'],
    projects: 'SEARCH LANDSCAPE · DISCOVERY · DIGITAL SYSTEMS'
  }
};

const ecosystemNodes = Array.from(document.querySelectorAll('.ecosystem-node'));
const ecosystemTitle = document.getElementById('ecosystemTitle');
const ecosystemDescription = document.getElementById('ecosystemDescription');
const ecosystemTags = document.getElementById('ecosystemTags');
const ecosystemProjects = document.getElementById('ecosystemProjects');

function setEcosystem(type) {
  if (!ecosystemContent[type]) {
    return;
  }

  const section = ecosystemContent[type];
  ecosystemTitle.textContent = section.title;
  ecosystemDescription.textContent = section.description;
  ecosystemProjects.textContent = section.projects;
  ecosystemTags.innerHTML = section.tags.map(function(item) {
    return `<span>${item}</span>`;
  }).join('');
}

ecosystemNodes.forEach(function(node) {
  node.addEventListener('mouseenter', function() {
    const type = node.dataset.ecosystem;
    ecosystemNodes.forEach(function(item) {
      item.classList.toggle('active', item === node);
    });
    setEcosystem(type);
  });

  node.addEventListener('focus', function() {
    const type = node.dataset.ecosystem;
    ecosystemNodes.forEach(function(item) {
      item.classList.toggle('active', item === node);
    });
    setEcosystem(type);
  });
});

function renderYouTubeGallery(videos) {
  const grid = document.getElementById('youtube-grid');
  if (!grid) {
    return;
  }

  grid.innerHTML = videos.map(function(video, index) {
    return `<article class="youtube-card reveal visible">
      <div class="youtube-embed-wrap">
        <iframe src="https://www.youtube.com/embed/${video.videoId}?rel=0&modestbranding=1" title="${video.title}" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
      </div>
      <div class="youtube-content">
        <span class="youtube-title">${video.title}</span>
        <span class="youtube-category">${video.category}</span>
      </div>
    </article>`;
  }).join('');
}

loadYouTubeVideos();
