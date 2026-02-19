// ============================================
// KULE BELDEN - 3D DYNAMIC PORTFOLIO JS
// ============================================

function initializeApp() {
  // Initialize all effects
  initLoader();
  initParticles();
  initScrollAnimations();
  init3DTilt();
  initNavigation();
  initProjectLinks();
  initProjectIconClicks();
  initProjectCardClicks();
  initMouseTrail();
  initCounters();
  initContactForm();
  initMobileMenu();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}

// Loader
function initLoader() {
  const loader = document.querySelector('.loader');
  if (loader) {
    setTimeout(() => {
      loader.classList.add('hidden');
    }, 2000);
  }
}

// Three.js Particles Background
function initParticles() {
  const container = document.getElementById('canvas-container');
  if (!container) return;
  
  // Check if Three.js is loaded
  if (typeof THREE === 'undefined') {
    console.log('Three.js not loaded, using fallback');
    createFallbackParticles(container);
    return;
  }

  // Scene setup
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);

  // Create particles
  const particlesGeometry = new THREE.BufferGeometry();
  const particlesCount = 500;
  
  const posArray = new Float32Array(particlesCount * 3);
  
  for (let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 10;
  }
  
  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
  
  // Material
  const material = new THREE.PointsMaterial({
    size: 0.02,
    color: 0x7cf03d,
    transparent: true,
    opacity: 0.8,
  });
  
  // Particles mesh
  const particlesMesh = new THREE.Points(particlesGeometry, material);
  scene.add(particlesMesh);
  
  camera.position.z = 3;
  
  // Mouse interaction
  let mouseX = 0;
  let mouseY = 0;
  
  document.addEventListener('mousemove', (event) => {
    mouseX = event.clientX / window.innerWidth - 0.5;
    mouseY = event.clientY / window.innerHeight - 0.5;
  });
  
  // Animation
  const animate = () => {
    requestAnimationFrame(animate);
    
    particlesMesh.rotation.y += 0.001;
    particlesMesh.rotation.x += 0.001;
    
    // Mouse follow effect
    particlesMesh.rotation.y += mouseX * 0.05;
    particlesMesh.rotation.x += mouseY * 0.05;
    
    renderer.render(scene, camera);
  };
  
  animate();
  
  // Resize handler
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

// Fallback particles using CSS
function createFallbackParticles(container) {
  const particleCount = 50;
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.cssText = `
      position: absolute;
      width: ${Math.random() * 4 + 2}px;
      height: ${Math.random() * 4 + 2}px;
      background: #7cf03d;
      border-radius: 50%;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      opacity: ${Math.random() * 0.5 + 0.1};
      animation: floatParticle ${Math.random() * 10 + 10}s linear infinite;
      animation-delay: ${Math.random() * -20}s;
    `;
    container.appendChild(particle);
  }
  
  // Add keyframes if not exists
  if (!document.querySelector('#particle-styles')) {
    const style = document.createElement('style');
    style.id = 'particle-styles';
    style.textContent = `
      @keyframes floatParticle {
        0%, 100% {
          transform: translate(0, 0) rotate(0deg);
        }
        25% {
          transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * -100 - 50}px) rotate(90deg);
        }
        50% {
          transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * -100 - 50}px) rotate(180deg);
        }
        75% {
          transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * -100 - 50}px) rotate(270deg);
        }
      }
    `;
    document.head.appendChild(style);
  }
}

// Scroll Animations
function initScrollAnimations() {
  const reveals = document.querySelectorAll('.reveal');
  
  const revealOnScroll = () => {
    const windowHeight = window.innerHeight;
    const elementVisible = 150;
    
    reveals.forEach((reveal) => {
      const elementTop = reveal.getBoundingClientRect().top;
      
      if (elementTop < windowHeight - elementVisible) {
        reveal.classList.add('active');
      }
    });
  };
  
  window.addEventListener('scroll', revealOnScroll);
  revealOnScroll(); // Initial check
}

// 3D Tilt Effect for Cards
function init3DTilt() {
  const cards = document.querySelectorAll('.skill-card, .project-card, .stat-card');
  
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
    });
  });
}

// Navigation
function initNavigation() {
  const navLinks = document.querySelectorAll('.nav-links a');
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
  
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// Custom Mouse Trail
function initMouseTrail() {
  const cursorDot = document.createElement('div');
  const cursorOutline = document.createElement('div');
  
  cursorDot.className = 'cursor-dot';
  cursorOutline.className = 'cursor-outline';
  
  document.body.appendChild(cursorDot);
  document.body.appendChild(cursorOutline);
  
  let mouseX = 0;
  let mouseY = 0;
  let outlineX = 0;
  let outlineY = 0;
  
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    cursorDot.style.left = mouseX - 5 + 'px';
    cursorDot.style.top = mouseY - 5 + 'px';
  });
  
  // Animate outline with delay
  const animateOutline = () => {
    outlineX += (mouseX - outlineX) * 0.15;
    outlineY += (mouseY - outlineY) * 0.15;
    
    cursorOutline.style.left = outlineX - 15 + 'px';
    cursorOutline.style.top = outlineY - 15 + 'px';
    
    requestAnimationFrame(animateOutline);
  };
  
  animateOutline();
  
  // Show cursor on mouse enter
  document.addEventListener('mouseenter', () => {
    cursorDot.style.opacity = '1';
    cursorOutline.style.opacity = '1';
  });
  
  document.addEventListener('mouseleave', () => {
    cursorDot.style.opacity = '0';
    cursorOutline.style.opacity = '0';
  });
}

// Open project links in a new window safely
function initProjectLinks() {
  const links = document.querySelectorAll('.project-link');
  if (!links || links.length === 0) return;

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      try {
        const href = link.href || link.getAttribute('href');
        console.log('project link clicked:', href);
        if (!href || href.trim() === '#' ) return;
        e.preventDefault();

        const newWin = window.open(href, '_blank');
        if (newWin) {
          try { newWin.opener = null; } catch (err) { /* ignore */ }
        } else {
          console.warn('Popup blocked when opening project:', href);
        }
      } catch (err) {
        console.error('Error opening project link', err);
      }
    });
  });
}

// Ensure clicking the arrow icon also opens the project in a new tab
function initProjectIconClicks() {
  const icons = document.querySelectorAll('.project-link i');
  if (!icons || icons.length === 0) return;

  icons.forEach(icon => {
    icon.style.cursor = 'pointer';
    icon.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const anchor = icon.closest('a.project-link');
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      if (!href) return;

      console.log('project icon clicked, opening:', href);

      const newWin = window.open(href, '_blank');
      if (newWin) newWin.opener = null;
    });
  });
}

// Make whole project card clickable (opens project link)
function initProjectCardClicks() {
  const cards = document.querySelectorAll('.project-card');
  if (!cards || cards.length === 0) return;

  cards.forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', (e) => {
      // If click came from an actual link, let that handler run
      const link = card.querySelector('a.project-link');
      if (!link) return;
      const href = link.href || link.getAttribute('href');
      if (!href || href.trim() === '#') return;

      try {
        console.log('project card clicked, opening:', href);
        const newWin = window.open(href, '_blank');
        if (newWin) {
          try { newWin.opener = null; } catch (err) { /* ignore */ }
        } else {
          console.warn('Popup blocked when opening project from card:', href);
        }
      } catch (err) {
        console.error('Error opening project from card', err);
      }
    });
  });
}

// Counter Animation
function animateCounter(element, target) {
  let current = 0;
  const increment = target / 100;
  const duration = 2000;
  const stepTime = duration / 100;
  
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = target + '+';
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current) + '+';
    }
  }, stepTime);
}

// Initialize counters when visible
function initCounters() {
  const counters = document.querySelectorAll('.stat-card .number');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.dataset.target);
        animateCounter(entry.target, target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  
  counters.forEach(counter => {
    observer.observe(counter);
  });
}

// Form handling
function initContactForm() {
  const form = document.querySelector('.contact-form form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Get form data
      const formData = new FormData(form);
      const data = Object.fromEntries(formData);
      
      // Show success message
      alert('Thank you for your message! I will get back to you soon.');
      form.reset();
    });
  }
}

// Mobile menu toggle
function initMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      // Change icon
      const icon = menuToggle.querySelector('i');
      if (navLinks.classList.contains('active')) {
        icon.className = 'fas fa-times';
      } else {
        icon.className = 'fas fa-bars';
      }
    });
  }

  // Close menu when clicking a link
  const navLinkItems = document.querySelectorAll('.nav-links a');
  navLinkItems.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      // Reset icon
      const icon = menuToggle.querySelector('i');
      icon.className = 'fas fa-bars';
    });
  });
}

// Initialization is handled by initializeApp() earlier
