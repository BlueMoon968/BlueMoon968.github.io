import './styles/main.scss';
import { MainScene } from './scenes/MainScene';
import { Modal } from './components/Modal';
import { loadProjects, filterProjects } from './utils/projectLoader';
import { getInitialTheme, setTheme, toggleTheme } from './utils/theme';
import { soundManager } from './utils/sound';
import type { Project, FilterType } from './types';
import gsap from 'gsap';

class App {
  private scene: MainScene;
  private modal: Modal;
  private projects: Project[] = [];
  private currentFilter: FilterType = 'all';

  constructor() {
    this.scene = new MainScene(document.getElementById('pixiContainer')!);
    this.modal = new Modal();
    
    this.init();
  }

  private async init() {
    // Set initial theme
    setTheme(getInitialTheme());

    // Load projects
    this.projects = await loadProjects();
    
    // Add projects to scene
    this.scene.addProjects(this.projects, (project) => {
      this.modal.open(project);
    });

    // Start animation loop
    this.scene.startAnimationLoop();

    // Setup UI
    this.setupThemeToggle();
    this.setupFilters();
    this.setupEasterEggs();

    // Konami code easter egg
    this.setupKonamiCode();
  }

  private setupThemeToggle() {
    const toggle = document.getElementById('themeToggle');
    if (!toggle) return;

    toggle.addEventListener('click', () => {
      toggleTheme();
      soundManager.click();
      
      // Fun animation on theme change
      gsap.fromTo(document.body, 
        { filter: 'brightness(0)' },
        { filter: 'brightness(1)', duration: 0.5, ease: 'power2.out' }
      );
    });
  }

  private setupFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const filter = target.dataset.filter as FilterType;
        
        if (filter === this.currentFilter) return;

        soundManager.click();
        this.currentFilter = filter;

        // Update active state
        filterBtns.forEach(b => b.classList.remove('active'));
        target.classList.add('active');

        // Filter projects
        const filtered = filterProjects(this.projects, filter);
        this.scene.filterCartridges(filtered);
      });
    });
  }

  private setupEasterEggs() {
    const easterEgg = document.getElementById('easterEggChar');
    if (!easterEgg) return;

    // Appear after a delay
    setTimeout(() => {
      gsap.to(easterEgg, {
        bottom: 20,
        duration: 1,
        ease: 'bounce.out'
      });
    }, 3000);

    // Click to toggle sound
    easterEgg.addEventListener('click', () => {
      soundManager.toggle();
      
      // Animate
      gsap.to(easterEgg, {
        rotation: 360,
        duration: 0.5,
        ease: 'power2.inOut'
      });

      // Show toast
      this.showToast(soundManager['enabled'] ? '🔊 Sound ON' : '🔇 Sound OFF');
    });

    // Random movements
    setInterval(() => {
      if (Math.random() > 0.7) {
        gsap.to(easterEgg, {
          y: -20,
          duration: 0.5,
          yoyo: true,
          repeat: 1,
          ease: 'power1.inOut'
        });
      }
    }, 5000);
  }

  private setupKonamiCode() {
    const code = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let position = 0;

    document.addEventListener('keydown', (e) => {
      if (e.key === code[position]) {
        position++;
        if (position === code.length) {
          this.activateKonamiCode();
          position = 0;
        }
      } else {
        position = 0;
      }
    });
  }

  private activateKonamiCode() {
    // Secret vaporwave mode!
    this.showToast('🌈 VAPORWAVE MODE ACTIVATED! 🌈');
    
    // Add rainbow effect
    const style = document.createElement('style');
    style.textContent = `
      @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
      }
      body { animation: rainbow 3s linear infinite; }
    `;
    document.head.appendChild(style);

    // Play a celebratory sound
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        soundManager.playBeep(400 + (i * 200), 0.1);
      }, i * 100);
    }

    // Remove after 10 seconds
    setTimeout(() => {
      style.remove();
      this.showToast('Back to normal! 😊');
    }, 10000);
  }

  private showToast(message: string) {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: var(--accent-purple);
      color: white;
      padding: 1rem 2rem;
      border-radius: 25px;
      font-weight: bold;
      z-index: 9999;
      box-shadow: 0 0 40px var(--accent-purple);
    `;
    document.body.appendChild(toast);

    gsap.fromTo(toast,
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(2)' }
    );

    setTimeout(() => {
      gsap.to(toast, {
        scale: 0,
        opacity: 0,
        duration: 0.3,
        ease: 'back.in(2)',
        onComplete: () => toast.remove()
      });
    }, 2000);
  }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new App());
} else {
  new App();
}
