import './style.css'
import Lenis from 'lenis'

// Initialize Smooth Scroll (Lenis)
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  direction: 'vertical',
  gestureDirection: 'vertical',
  smooth: true,
  mouseMultiplier: 1,
  smoothTouch: false,
  touchMultiplier: 2,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// 1. Navbar Glass Effect & Mobile Menu
const navbar = document.getElementById('navbar');
const mobileBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// Custom Cursor Logic
const cursor = document.querySelector('.custom-cursor');
document.addEventListener('mousemove', (e) => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
});

document.querySelectorAll('a, button, .service-card').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('active'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
});

// Mobile Menu Toggle
if (mobileBtn) {
  mobileBtn.addEventListener('click', () => {
    mobileBtn.classList.toggle('active');
    navLinks.classList.toggle('active');
  });
}

// Close menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    mobileBtn.classList.remove('active');
    navLinks.classList.remove('active');
  });
});

// 2. Scroll Animation (Canvas Frame Sequence)
const canvas = document.getElementById('scroll-canvas');
const context = canvas.getContext('2d');
const totalFrames = 241;
const images = [];
// Updated to WebP path
const frameLocation = '/frames_webp/ezgif-frame-';

// Preload images
const preloadImages = () => {
  let loadedCount = 0;
  const loaderFill = document.getElementById('loader-fill');
  const loaderText = document.getElementById('loader-text');
  const loader = document.getElementById('loader');

  // Ensure we don't start animation before at least some images are ready
  const minFramesToStart = 50;
  let hasStarted = false;

  const finishLoading = () => {
    if (hasStarted) return;
    hasStarted = true;

    // Force UI to 100%
    if (loaderFill) loaderFill.style.width = '100%';
    if (loaderText) loaderText.innerText = 'System Ready';

    setTimeout(() => {
      if (loader) loader.classList.add('hidden');
      // Trigger initial draw
      drawImage(0);
      renderLoop();
    }, 500);
  };

  // Safety fallback: Force start after 8 seconds (max wait)
  setTimeout(finishLoading, 8000);

  const updateProgress = () => {
    loadedCount++;
    const percent = Math.floor((loadedCount / totalFrames) * 100);

    if (loaderFill) loaderFill.style.width = `${percent}%`;
    if (loaderText) loaderText.innerText = `Initializing Systems... ${percent}%`;

    // Finish if 95% loaded. This prevents getting stuck at 99% if 1-2 images hang or error out silently.
    if (loadedCount >= totalFrames * 0.95) {
      finishLoading();
    }
  };

  for (let i = 1; i <= totalFrames; i++) {
    const img = new Image();
    const frameIndex = i.toString().padStart(3, '0');
    img.src = `${frameLocation}${frameIndex}.webp`;
    images.push(img);
    img.onload = updateProgress;
    img.onerror = updateProgress; // Count errors too so we don't hang
  }
};

// Set canvas dimensions
const setCanvasDimensions = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
};

// Draw logic with "cover" effect
const drawImage = (index) => {
  if (index >= 0 && index < totalFrames && images[index].complete) {
    const img = images[index];
    // Calculate cover dimensions
    const ratio = Math.max(canvas.width / img.width, canvas.height / img.height);

    let centerShift_x = (canvas.width - img.width * ratio) / 2;
    const centerShift_y = (canvas.height - img.height * ratio) / 2;

    // Mobile Adjustment: Shift focus to the right (to show robot)
    if (window.innerWidth < 768) {
      const overflowX = (img.width * ratio) - canvas.width;
      if (overflowX > 0) {
        // Standard center is -overflowX / 2. 
        // Shift further negative to reveal right side.
        // 0.5 is center, 1.0 is full right side. 0.75 is a good balance.
        centerShift_x = -(overflowX * 0.75);
      }
    }

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(img, 0, 0, img.width, img.height,
      centerShift_x, centerShift_y, img.width * ratio, img.height * ratio);
  }
};

// Initial setup
preloadImages();
setCanvasDimensions();

// Wait for first image then draw
images[0].onload = () => {
  drawImage(0);
}

// Interpolation state
let currentFrameIndex = 0;
let targetFrameIndex = 0;
const easingFactor = 0.08; // Adjust for smoother/faster feel (0.05 - 0.1)

// Scroll Handler
window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const maxScroll = document.body.scrollHeight - window.innerHeight;
  const scrollFraction = scrollTop / maxScroll;

  // Update target, don't draw yet
  targetFrameIndex = Math.min(
    totalFrames - 1,
    Math.max(0, scrollFraction * totalFrames) // ensure >= 0
  );
});

// Render Loop
const renderLoop = () => {
  // Linear Interpolation (Lerp)
  currentFrameIndex += (targetFrameIndex - currentFrameIndex) * easingFactor;

  // Draw the interpolated frame
  const frameToDraw = Math.floor(currentFrameIndex);
  drawImage(frameToDraw);

  requestAnimationFrame(renderLoop);
};

// Resize Handler
window.addEventListener('resize', () => {
  setCanvasDimensions();
  // Ensure target is correct for new dimensions
  const scrollTop = window.scrollY;
  const maxScroll = document.body.scrollHeight - window.innerHeight;
  const scrollFraction = scrollTop / maxScroll;
  targetFrameIndex = Math.min(
    totalFrames - 1,
    Math.floor(scrollFraction * totalFrames)
  );
});

// Start loop
// Loop started by preloadImages completion

// 3. Intersection Observer (Fade-ins)
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');

      // Check if this is the stats section to trigger counters
      if (entry.target.querySelector('.stat-number')) {
        animateCounters(entry.target);
      }
    }
  });
}, observerOptions);

document.querySelectorAll('.fade-in-section').forEach(section => {
  observer.observe(section);
});

// 4. Number Counters
function animateCounters(container) {
  const counters = container.querySelectorAll('.stat-number');
  counters.forEach(counter => {
    // Prevent re-running if already done
    if (counter.classList.contains('counted')) return;

    counter.classList.add('counted');

    const target = +counter.getAttribute('data-target');
    const duration = 2000; // ms
    const increment = target / (duration / 16); // 60fps

    let current = 0;
    const updateCounter = () => {
      current += increment;
      if (current < target) {
        counter.innerText = Math.ceil(current);
        requestAnimationFrame(updateCounter);
      } else {
        counter.innerText = target;
      }
    };
    updateCounter();
  });
}
