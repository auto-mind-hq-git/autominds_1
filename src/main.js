import './style.css'
import Lenis from 'lenis'
import { initDynamicContent } from './utils/dynamicLoader';

// Initialize Dynamic Content from Admin Panel
initDynamicContent();

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Detect mobile once for performance branching
const isMobile = /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  || (window.innerWidth <= 768);
const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

// Initialize Smooth Scroll (Lenis)
// On mobile: completely disable Lenis — native mobile scroll is already optimized
// by the browser and Lenis adds CPU overhead that competes with canvas rendering
let lenis = null;
if (!isMobile) {
  lenis = new Lenis({
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
}

// 2. Hashless Smooth Scroll (Intercept Links)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;

    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      // Use Lenis on desktop, native on mobile
      if (lenis) {
        lenis.scrollTo(targetElement);
      } else {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }

      // Close mobile menu if open
      const mobileBtn = document.querySelector('.mobile-menu-btn');
      const navLinks = document.querySelector('.nav-links');
      if (mobileBtn && mobileBtn.classList.contains('active')) {
        mobileBtn.classList.remove('active');
        navLinks.classList.remove('active');
      }
    }
  });
});

// 3. Handle Initial Hash Load (Clean URL)
window.addEventListener('load', () => {
  if (window.location.hash) {
    const targetId = window.location.hash;
    const targetElement = document.querySelector(targetId);

    if (targetElement) {
      if (lenis) {
        lenis.scrollTo(targetElement, { immediate: false, duration: 1.5 });
      } else {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
      history.replaceState(null, null, window.location.pathname);
    }
  }
});

// 3. Navbar Glass Effect & Mobile Menu
const navbar = document.getElementById('navbar');
const mobileBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

// Smart Scroll Logic
let lastScrollTop = 0;

const handleNavScroll = (scrollTop) => {
  if (scrollTop > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  if (scrollTop > lastScrollTop && scrollTop > 100) {
    navbar.classList.add('nav-hidden');
  } else {
    navbar.classList.remove('nav-hidden');
  }

  lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
};

// On desktop use Lenis scroll event, on mobile use native scroll
if (lenis) {
  lenis.on('scroll', ({ scroll }) => handleNavScroll(scroll));
} else {
  window.addEventListener('scroll', () => handleNavScroll(window.scrollY), { passive: true });
}

// Custom Cursor Logic
const cursor = document.querySelector('.custom-cursor');
document.addEventListener('mousemove', (e) => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
});

document.querySelectorAll('a, button, .service-card, input, select, textarea').forEach(el => { // Updated selector
  el.addEventListener('mouseenter', () => cursor.classList.add('active'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
});

// --- Contact Form Logic (EmailJS) ---

// GOOGLE FORM CONFIGURATION
const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSf6QQbfXogxHxMKRwUa7ARR9HLK1c-IiLvuwgxQ6O-LeWsteA/formResponse';

const contactForm = document.querySelector('.contact-form');
const submitBtn = contactForm ? contactForm.querySelector('button[type="submit"]') : null;

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Basic Validation
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const message = document.getElementById('message');
    const interest = document.getElementById('interest');
    let isValid = true;

    [name, email, message].forEach(input => {
      if (!input.value.trim()) {
        input.classList.add('input-error');
        isValid = false;
      } else {
        input.classList.remove('input-error');
      }
    });

    if (!isValid) return;

    // Loading State
    const originalBtnText = submitBtn.innerText;
    submitBtn.innerText = 'Transmitting...';
    submitBtn.classList.add('btn-disabled');
    submitBtn.disabled = true;

    // Map Service Interest Values to Google Form Expected Values
    const interestMap = {
      'automation': 'Ai automation',
      'website': 'Web development',
      'agent': 'Custom ai agent',
      'other': 'Other'
    };

    // Prepare FormData for Google Forms
    const formData = new FormData();
    formData.append('entry.1892089111', name.value);
    formData.append('entry.1992298724', email.value);
    formData.append('entry.1099071446', interestMap[interest.value] || 'Other');
    formData.append('entry.1051882245', message.value);

    // Send to Google Forms
    // mode: 'no-cors' needed because Google Forms doesn't return CORS headers.
    // This defines an opaque response, so we can't check response.ok, but we assume success if no network error.
    // --- Dual Submission Logic ---
    const EMAILJS_SERVICE_ID = 'service_v9yqu4b'; // Replace with actual Service ID
    const EMAILJS_TEMPLATE_ID = 'template_o7iu6ae'; // Replace with actual Template ID

    // 1. Google Forms Submission
    const googleSubmission = fetch(GOOGLE_FORM_URL, {
      method: 'POST',
      mode: 'no-cors',
      body: formData
    });

    // 2. EmailJS Submission
    const emailJsSubmission = emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, contactForm)
      .then(() => {
        console.log('EmailJS Success');
      })
      .catch((error) => {
        console.error('EmailJS Failed:', error);
        // We don't throw here so Promise.all doesn't fail immediately if only email fails
        // But maybe we want to know?
        // Let's allow partial failure but log it.
      });

    Promise.all([googleSubmission, emailJsSubmission])
      .then(() => {
        // Assume success if code reaches here (since we caught EmailJS error above, it resolves undefined)
        showToast('Message Sent Successfully!', 'success');
        contactForm.reset();
      })
      .catch((error) => {
        console.error('Submission Error:', error);
        showToast('Something went wrong. Please try again.', 'error');
      })
      .finally(() => {
        submitBtn.innerText = originalBtnText;
        submitBtn.classList.remove('btn-disabled');
        submitBtn.disabled = false;
      });
  });

  // Clear error on input
  contactForm.querySelectorAll('input, textarea').forEach(input => {
    input.addEventListener('input', () => input.classList.remove('input-error'));
  });
}

function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `notification-toast ${type}`;
  toast.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
  document.body.appendChild(toast);

  // Animate In
  setTimeout(() => toast.classList.add('show'), 100);

  // Remove after 3s
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

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
// Use 'desynchronized' hint for non-blocking GPU rendering (Chrome 75+)
// Falls back gracefully on unsupported browsers
const context = canvas.getContext('2d', {
  alpha: false,           // No transparency needed, perf boost
  desynchronized: true    // Decouple canvas rendering from DOM (reduces latency)
});

// Mobile: load every 2nd frame to halve memory usage (121 vs 241 frames)
// The visual difference is minimal since frames are interpolated
const sourceFrameCount = 241;
const frameStep = isMobile ? 2 : 1; // Skip every other frame on mobile
const totalFrames = Math.ceil(sourceFrameCount / frameStep);
const images = [];
const bitmaps = []; // Pre-decoded ImageBitmap objects for faster drawing
const frameLocation = '/frames/ezgif-frame-';

// Preload images with optional pre-decoding
const preloadImages = () => {
  let loadedCount = 0;
  const loaderFill = document.getElementById('loader-fill');
  const loaderText = document.getElementById('loader-text');
  const loader = document.getElementById('loader');
  let hasStarted = false;

  const finishLoading = () => {
    if (hasStarted) return;
    hasStarted = true;

    if (loaderFill) loaderFill.style.width = '100%';
    if (loaderText) loaderText.innerText = 'System Ready';

    setTimeout(() => {
      if (loader) loader.classList.add('hidden');
      drawImage(0);
      renderLoop();
      initAdvancedAnimations();
    }, 500);
  };

  // Safety fallback: Force start after 8 seconds
  setTimeout(finishLoading, isMobile ? 5000 : 8000);

  const updateProgress = () => {
    loadedCount++;
    const percent = Math.floor((loadedCount / totalFrames) * 100);

    if (loaderFill) loaderFill.style.width = `${percent}%`;
    if (loaderText) loaderText.innerText = `Initializing Systems... ${percent}%`;

    if (loadedCount >= totalFrames * 0.95) {
      finishLoading();
    }
  };

  // Pre-decode an image into an ImageBitmap (off main thread)
  const preDecodeImage = (img, index) => {
    if (typeof createImageBitmap === 'function') {
      createImageBitmap(img).then(bitmap => {
        bitmaps[index] = bitmap;
      }).catch(() => {
        // Fallback: just use the Image element directly
      });
    }
  };

  for (let i = 0; i < totalFrames; i++) {
    const sourceIndex = (i * frameStep) + 1; // Map to original frame number
    const img = new Image();
    const frameIndex = sourceIndex.toString().padStart(3, '0');
    img.src = `${frameLocation}${frameIndex}.jpg`;
    // Hint browser about decoding priority
    img.decoding = 'async';
    images.push(img);

    img.onload = () => {
      preDecodeImage(img, i);
      updateProgress();
    };
    img.onerror = updateProgress;
  }
};

// Interpolation state (declared early so setCanvasDimensions can reference it)
let currentFrameIndex = 0;
let targetFrameIndex = 0;
// Mobile: faster easing = less lag between scroll and frame update
const easingFactor = isMobile ? 0.35 : 0.08;

// Set canvas dimensions (High-DPI Support with Performance Cap)
let lastCanvasWidth = 0;
let lastCanvasHeight = 0;

const setCanvasDimensions = (force = false) => {
  // Mobile: DPR 1 to minimize canvas pixel count
  let dpr = isMobile ? 1 : Math.min(window.devicePixelRatio || 1, 2);

  const maxWidth = isMobile ? 1000 : 3000;
  if (window.innerWidth * dpr > maxWidth) {
    dpr = maxWidth / window.innerWidth;
  }

  const newWidth = Math.floor(window.innerWidth * dpr);
  const newHeight = Math.floor(window.innerHeight * dpr);

  const widthChanged = newWidth !== lastCanvasWidth;
  const heightChanged = newHeight !== lastCanvasHeight;

  if (force || widthChanged) {
    canvas.width = newWidth;
    canvas.height = newHeight;
    lastCanvasWidth = newWidth;
    lastCanvasHeight = newHeight;
    cachedCanvasW = 0; // Invalidate draw cache
    if (images.length > 0 && images[Math.floor(currentFrameIndex)]?.complete) {
      drawImage(Math.floor(currentFrameIndex));
    }
  } else if (heightChanged) {
    canvas.height = newHeight;
    lastCanvasHeight = newHeight;
    cachedCanvasW = 0; // Invalidate draw cache
    if (images.length > 0 && images[Math.floor(currentFrameIndex)]?.complete) {
      drawImage(Math.floor(currentFrameIndex));
    }
  }
};

// Draw logic — cached calculations, uses pre-decoded bitmaps when available
let cachedCanvasW = 0;
let cachedCanvasH = 0;
let cachedRatio = 0;
let cachedCenterX = 0;
let cachedCenterY = 0;
let cachedImgW = 0;
let cachedImgH = 0;

const updateDrawCache = (source) => {
  cachedImgW = source.width;
  cachedImgH = source.height;
  cachedCanvasW = canvas.width;
  cachedCanvasH = canvas.height;
  cachedRatio = Math.max(cachedCanvasW / cachedImgW, cachedCanvasH / cachedImgH);

  cachedCenterX = (cachedCanvasW - cachedImgW * cachedRatio) / 2;
  cachedCenterY = (cachedCanvasH - cachedImgH * cachedRatio) / 2;

  if (isMobile) {
    const overflowX = (cachedImgW * cachedRatio) - cachedCanvasW;
    if (overflowX > 0) {
      cachedCenterX = -(overflowX * 0.75);
    }
  }
};

const drawImage = (index) => {
  if (index < 0 || index >= totalFrames) return;

  // Prefer pre-decoded ImageBitmap (faster draw, no decode jank)
  const source = bitmaps[index] || (images[index]?.complete ? images[index] : null);
  if (!source) return;

  // Only recalculate layout if canvas size or image changed
  if (canvas.width !== cachedCanvasW || canvas.height !== cachedCanvasH
    || source.width !== cachedImgW || source.height !== cachedImgH) {
    updateDrawCache(source);
  }

  context.clearRect(0, 0, cachedCanvasW, cachedCanvasH);
  context.drawImage(source, 0, 0, cachedImgW, cachedImgH,
    cachedCenterX, cachedCenterY, cachedImgW * cachedRatio, cachedImgH * cachedRatio);
};

// Initial setup
preloadImages();
setCanvasDimensions(true); // Force initial setup

// Wait for first image then draw
images[0].onload = () => {
  drawImage(0);
}

// (currentFrameIndex, targetFrameIndex, easingFactor moved above setCanvasDimensions)

// Navigation Highlighting & Progress Bar
// Navigation Highlighting & Progress Bar
const sections = document.querySelectorAll('section');
const navItems = document.querySelectorAll('.nav-links a');
const progressBar = document.getElementById('scroll-progress');

// Optimization: Cache maxScroll to avoid reflows during scroll
let maxScroll = document.body.scrollHeight - window.innerHeight;

window.addEventListener('resize', () => {
  maxScroll = document.body.scrollHeight - window.innerHeight;
  // Note: setCanvasDimensions is called by the debounced resize handler below
});

// Use rAF-throttled scroll handler — only process scroll once per frame
// This prevents the scroll handler from firing hundreds of times between frames
let scrollTicking = false;

window.addEventListener('scroll', () => {
  if (!scrollTicking) {
    scrollTicking = true;
    requestAnimationFrame(() => {
      const scrollTop = window.scrollY;
      const scrollFraction = maxScroll > 0 ? scrollTop / maxScroll : 0;

      if (progressBar) {
        progressBar.style.width = `${scrollFraction * 100}%`;
      }

      targetFrameIndex = Math.min(
        totalFrames - 1,
        Math.max(0, scrollFraction * totalFrames)
      );

      scrollTicking = false;
    });
  }
}, { passive: true });

// 3. Active Section Highlighting (IntersectionObserver - High Performance)
const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const currentId = entry.target.getAttribute('id');
      navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href').includes(currentId)) {
          item.classList.add('active');
        }
      });
    }
  });
}, {
  threshold: 0.5 // Trigger when 50% of section is visible
});

sections.forEach(section => {
  navObserver.observe(section);
});

// --- Advanced Animations (GSAP) ---
const initAdvancedAnimations = () => {
  // 1. Hero Staggered Reveal
  const heroTl = gsap.timeline();
  heroTl.from(".hero-content h1", {
    y: 100,
    opacity: 0,
    duration: 1,
    ease: "power4.out"
  })
    .from(".hero-content p", {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: "power3.out"
    }, "-=0.8")
    .from(".hero-buttons", {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: "back.out(1.7)"
    }, "-=0.6");

  // 2. Magnetic Buttons
  const buttons = document.querySelectorAll(".btn");
  buttons.forEach(btn => {
    btn.addEventListener("mousemove", (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      gsap.to(btn, {
        x: x * 0.3, // Strength of magnet
        y: y * 0.3,
        duration: 0.3,
        ease: "power2.out"
      });
    });

    btn.addEventListener("mouseleave", () => {
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: "elastic.out(1, 0.3)"
      });
    });
  });

  // 3. Service Cards 3D Tilt
  const cards = document.querySelectorAll(".service-card");
  cards.forEach(card => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -5; // Max 5deg rotation
      const rotateY = ((x - centerX) / centerX) * 5;

      gsap.to(card, {
        perspective: 1000,
        rotationX: rotateX,
        rotationY: rotateY,
        scale: 1.02,
        duration: 0.5,
        ease: "power2.out"
      });
    });

    card.addEventListener("mouseleave", () => {
      gsap.to(card, {
        rotationX: 0,
        rotationY: 0,
        scale: 1,
        duration: 0.5,
        ease: "power2.out"
      });
    });
  });
};

// Initialize after loader finishes
// We'll hook this into the existing 'finishLoading' function or call it here if we want immediate effects behind the loader
// ideally it runs when loader disappears.
// Let's modify the finishLoading function in preloadImages to call this.

// Render Loop — optimized per device
let lastDrawnFrame = -1;

const renderLoop = () => {
  if (isMobile) {
    // MOBILE: Skip interpolation entirely — snap directly to target frame
    // This eliminates the constant lerp animation loop overhead
    // and makes frames feel instantly responsive to scroll position
    const frameToDraw = Math.floor(targetFrameIndex);
    if (frameToDraw !== lastDrawnFrame) {
      drawImage(frameToDraw);
      lastDrawnFrame = frameToDraw;
    }
  } else {
    // DESKTOP: Smooth interpolation for buttery animation
    const diff = targetFrameIndex - currentFrameIndex;
    if (Math.abs(diff) < 0.05) {
      currentFrameIndex = targetFrameIndex;
    } else {
      currentFrameIndex += diff * easingFactor;
    }

    const frameToDraw = Math.floor(currentFrameIndex);
    if (frameToDraw !== lastDrawnFrame) {
      drawImage(frameToDraw);
      lastDrawnFrame = frameToDraw;
    }
  }

  requestAnimationFrame(renderLoop);
};

// Resize Handler — debounced to prevent mobile address bar flicker
let resizeTimer = null;
window.addEventListener('resize', () => {
  // Cancel any pending resize to debounce rapid changes
  if (resizeTimer) clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    setCanvasDimensions();
    // Ensure target is correct for new dimensions
    const scrollTop = window.scrollY;
    const currentMaxScroll = document.body.scrollHeight - window.innerHeight;
    const scrollFraction = currentMaxScroll > 0 ? scrollTop / currentMaxScroll : 0;
    targetFrameIndex = Math.min(
      totalFrames - 1,
      Math.max(0, Math.floor(scrollFraction * totalFrames))
    );
  }, 100); // 100ms debounce
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
      if (entry.target.querySelector('.stat-number, .stat-number-new')) {
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
  const counters = container.querySelectorAll('.stat-number, .stat-number-new');
  counters.forEach(counter => {
    // Prevent re-running if already done
    if (counter.classList.contains('counted')) return;

    counter.classList.add('counted');

    const target = +counter.getAttribute('data-target');
    const isFloat = target % 1 !== 0;
    const duration = 2000; // ms
    const increment = target / (duration / 16); // 60fps

    let current = 0;
    const updateCounter = () => {
      current += increment;
      if (current < target) {
        // Use textContent for performance
        // Format floats to 1 decimal, ints with commas
        counter.textContent = isFloat
          ? current.toFixed(1)
          : Math.floor(current).toLocaleString();
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = isFloat ? target : target.toLocaleString();
      }
    };
    updateCounter();
  });
}

// --- Testimonial Carousel Logic ---
const track = document.querySelector('.testimonial-track');
const btnPrev = document.querySelector('.control-btn.prev');
const btnNext = document.querySelector('.control-btn.next');

if (track && btnPrev && btnNext) {
  const scrollAmount = () => {
    // Scroll by width of one card + gap (approx)
    // We can use the first card's width, or default if not yet rendered
    const card = track.querySelector('.testimonial-card');
    return card ? card.offsetWidth + 32 : 300; // 32px is the gap (2rem)
  };

  btnNext.addEventListener('click', () => {
    track.scrollBy({
      left: scrollAmount(),
      behavior: 'smooth'
    });
  });

  btnPrev.addEventListener('click', () => {
    track.scrollBy({
      left: -scrollAmount(),
      behavior: 'smooth'
    });
  });
}

// --- Project Modal Logic Removed ---
