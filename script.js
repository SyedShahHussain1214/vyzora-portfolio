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

let revealObserver = null;

if ('IntersectionObserver' in window) {
  revealObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.16 });

  document.querySelectorAll('.reveal').forEach(function(el) {
    revealObserver.observe(el);
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

const bitoVideoIds = ['28gF2wVUeBM', 'YIVEPAa7FWQ'];

const youtubeVideos = [
  { videoId: '-JjrTeP06oA', title: 'Branding & Solutions', category: 'UGC', image: 'https://i.ytimg.com/vi/-JjrTeP06oA/hqdefault.jpg' },
  { videoId: '28gF2wVUeBM', title: 'Bito Screen 1', category: 'UGC', image: 'https://i.ytimg.com/vi/28gF2wVUeBM/hqdefault.jpg' },
  { videoId: 'YIVEPAa7FWQ', title: 'Bito Screen 2', category: 'UGC', image: 'https://i.ytimg.com/vi/YIVEPAa7FWQ/hqdefault.jpg' },
  { videoId: 'nHarODajKSU', title: 'Vyzora Super Car Showcase', category: 'CGI', image: 'https://i.ytimg.com/vi/nHarODajKSU/hqdefault.jpg' },
  { videoId: 'MiNuuXdDjWg', title: 'Studio Production Reel', category: 'CGI', image: 'https://i.ytimg.com/vi/MiNuuXdDjWg/hqdefault.jpg' },
  { videoId: 'urAsTqWD0Qg', title: 'Sakoon Perfume Campaign II', category: 'CGI', image: 'https://i.ytimg.com/vi/urAsTqWD0Qg/hqdefault.jpg' },
  { videoId: 'N2c59hdhyFI', title: 'Sakoon Perfume Campaign', category: 'CGI', image: 'https://i.ytimg.com/vi/N2c59hdhyFI/hqdefault.jpg' },
  { videoId: 'AMY_-uERE3E', title: 'Beauty Brands Edition', category: 'CGI', image: 'https://i.ytimg.com/vi/AMY_-uERE3E/hqdefault.jpg' },
  { videoId: 'Mwct32P7F-8', title: 'Emperor Energy Drink Campaign', category: 'CGI', image: 'https://i.ytimg.com/vi/Mwct32P7F-8/hqdefault.jpg' },
  { videoId: 'kDh1X1IvjNY', title: 'Emperor Perfume Campaign', category: 'CGI', image: 'https://i.ytimg.com/vi/kDh1X1IvjNY/hqdefault.jpg' },
  { videoId: 'gM9uw0oeHdE', title: 'Studio Production Reel II', category: 'UGC', image: 'https://i.ytimg.com/vi/gM9uw0oeHdE/hqdefault.jpg' },
  { videoId: 'Q_WILFZENhk', title: 'Aurelume Petal Drop Tint', category: 'AI Avatar', image: 'https://i.ytimg.com/vi/Q_WILFZENhk/hqdefault.jpg' },
  { videoId: 'ZMX_ifL0C9Y', title: 'Aurelume Luma Renew Mask', category: 'AI Avatar', image: 'https://i.ytimg.com/vi/ZMX_ifL0C9Y/hqdefault.jpg' }
];

function groupVideosBySection(videos) {
  const groups = { bito: [], cgi: [], other: [] };
  videos.forEach(function(video) {
    if (bitoVideoIds.indexOf(video.videoId) !== -1) {
      groups.bito.push(video);
    } else if (video.category === 'CGI') {
      groups.cgi.push(video);
    } else {
      groups.other.push(video);
    }
  });
  return groups;
}

async function loadYouTubeVideos() {
  let videos = youtubeVideos;

  try {
    const response = await fetch('/api/youtube');
    if (!response.ok) {
      throw new Error(`YouTube feed error: ${response.status}`);
    }
    const data = await response.json();
    if (Array.isArray(data.videos) && data.videos.length) {
      videos = data.videos;
    }
  } catch (error) {
    videos = youtubeVideos;
  }

  const groups = groupVideosBySection(videos);
  renderYouTubeGallery('youtube-grid', groups.other);
  renderYouTubeGallery('cgi-grid', groups.cgi);
  renderYouTubeGallery('bito-video-grid', groups.bito);
}

function renderYouTubeGallery(gridId, videos) {
  const grid = document.getElementById(gridId);
  if (!grid || !videos.length) {
    return;
  }

  grid.innerHTML = videos.map(function(video, index) {
    return `<article class="youtube-card reveal">
      <div class="youtube-embed-wrap">
        <iframe src="https://www.youtube.com/embed/${video.videoId}?rel=0&modestbranding=1" title="${video.title}" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
      </div>
      <div class="youtube-content">
        <span class="youtube-title">${video.title} - ${video.category}</span>
      </div>
    </article>`;
  }).join('');

  const cards = grid.querySelectorAll('.youtube-card');
  if (revealObserver) {
    cards.forEach(function(card) {
      revealObserver.observe(card);
    });
  } else {
    cards.forEach(function(card) {
      card.classList.add('visible');
    });
  }
}

loadYouTubeVideos();

const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxClose = document.querySelector('.lightbox-close');
let lastFocusedTrigger = null;

function openLightbox(trigger) {
  const image = trigger.getAttribute('data-image');
  if (!image || !lightbox) {
    return;
  }

  lastFocusedTrigger = trigger;
  lightboxImage.src = image;
  lightboxImage.alt = trigger.getAttribute('data-caption') || 'Vyzora project image';
  lightboxCaption.textContent = trigger.getAttribute('data-caption') || '';
  lightbox.classList.add('active');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.classList.add('lightbox-open');
  lightboxClose.focus();
}

function closeLightbox() {
  if (!lightbox) {
    return;
  }

  lightbox.classList.remove('active');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('lightbox-open');
  if (lastFocusedTrigger) {
    lastFocusedTrigger.focus();
  }
}

document.querySelectorAll('.lightbox-trigger').forEach(function(trigger) {
  trigger.addEventListener('click', function() {
    openLightbox(trigger);
  });
});

if (lightbox) {
  lightbox.addEventListener('click', function(event) {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });
}

if (lightboxClose) {
  lightboxClose.addEventListener('click', closeLightbox);
}

document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape' && lightbox && lightbox.classList.contains('active')) {
    closeLightbox();
  }
});
