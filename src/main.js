import './style.css'

// 1. Navbar Glass Effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// 2. Scroll Animation (Canvas Frame Sequence)
const canvas = document.getElementById('scroll-canvas');
const context = canvas.getContext('2d');
const totalFrames = 241;
const images = [];
const frameLocation = '/frames/ezgif-frame-';

// Preload images
const preloadImages = () => {
  for (let i = 1; i <= totalFrames; i++) {
    const img = new Image();
    const frameIndex = i.toString().padStart(3, '0');
    img.src = `${frameLocation}${frameIndex}.jpg`;
    images.push(img);
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
    const centerShift_x = (canvas.width - img.width * ratio) / 2;
    const centerShift_y = (canvas.height - img.height * ratio) / 2;

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
renderLoop();

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
