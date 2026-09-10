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

const youtubeVideos = [
  { videoId: '-JjrTeP06oA', title: 'Branding and Solution you need.', category: 'Branding / Creative Content', image: 'https://i.ytimg.com/vi/-JjrTeP06oA/hqdefault.jpg' },
  { videoId: '28gF2wVUeBM', title: 'Bito Screen 1', category: 'Food & Beverage / Content', image: 'https://i.ytimg.com/vi/28gF2wVUeBM/hqdefault.jpg' },
  { videoId: 'YIVEPAa7FWQ', title: 'Bito Screen 2', category: 'Food & Beverage / Content', image: 'https://i.ytimg.com/vi/YIVEPAa7FWQ/hqdefault.jpg' },
  { videoId: 'nHarODajKSU', title: 'VYZORA Showcased as a Super Car', category: 'Creative Production / Short', image: 'https://i.ytimg.com/vi/nHarODajKSU/hqdefault.jpg' },
  { videoId: 'MiNuuXdDjWg', title: '10 September 2026', category: 'Creative Production / Short', image: 'https://i.ytimg.com/vi/MiNuuXdDjWg/hqdefault.jpg' },
  { videoId: 'urAsTqWD0Qg', title: 'Sakoon Perfume CGI ad 2', category: 'Perfume / CGI / Short', image: 'https://i.ytimg.com/vi/urAsTqWD0Qg/hqdefault.jpg' },
  { videoId: 'N2c59hdhyFI', title: 'Sakoon-Perfume CGI ad', category: 'Perfume / CGI / Short', image: 'https://i.ytimg.com/vi/N2c59hdhyFI/hqdefault.jpg' },
  { videoId: 'AMY_-uERE3E', title: 'CGI ad-Beauty Brands Editions', category: 'Beauty / CGI / Short', image: 'https://i.ytimg.com/vi/AMY_-uERE3E/hqdefault.jpg' },
  { videoId: 'Mwct32P7F-8', title: 'EMPEROR-Energy Drink CGI ad', category: 'Energy Drink / CGI / Short', image: 'https://i.ytimg.com/vi/Mwct32P7F-8/hqdefault.jpg' },
  { videoId: 'kDh1X1IvjNY', title: 'EMPEROR Perfume-CGI ad', category: 'Perfume / CGI / Short', image: 'https://i.ytimg.com/vi/kDh1X1IvjNY/hqdefault.jpg' },
  { videoId: 'gM9uw0oeHdE', title: '2 September 2026', category: 'Creative Production / Short', image: 'https://i.ytimg.com/vi/gM9uw0oeHdE/hqdefault.jpg' },
  { videoId: 'Q_WILFZENhk', title: 'AURELUME Petal Drop Tint — AI Avatar Ad', category: 'Beauty / AI Avatar / Short', image: 'https://i.ytimg.com/vi/Q_WILFZENhk/hqdefault.jpg' },
  { videoId: 'ZMX_ifL0C9Y', title: 'AURELUME Luma Renew Mask — AI Avatar Ad', category: 'Beauty / AI Avatar / Short', image: 'https://i.ytimg.com/vi/ZMX_ifL0C9Y/hqdefault.jpg' }
];

async function loadYouTubeVideos() {
  const grid = document.getElementById('youtube-grid');
  if (!grid) {
    return;
  }

  try {
    const response = await fetch('/api/youtube');
    if (!response.ok) {
      throw new Error(`YouTube feed error: ${response.status}`);
    }
    const data = await response.json();
    renderYouTubeGallery(Array.isArray(data.videos) && data.videos.length ? data.videos : youtubeVideos);
  } catch (error) {
    renderYouTubeGallery(youtubeVideos);
  }
}

function renderYouTubeGallery(videos) {
  const grid = document.getElementById('youtube-grid');
  if (!grid) {
    return;
  }

  grid.innerHTML = videos.map(function(video, index) {
    return `<article class="youtube-card reveal">
      <div class="youtube-embed-wrap">
        <iframe src="https://www.youtube.com/embed/${video.videoId}?rel=0&modestbranding=1" title="${video.title}" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
      </div>
      <div class="youtube-content">
        <span class="youtube-title">${video.title}</span>
        <span class="youtube-category">${video.category}</span>
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
