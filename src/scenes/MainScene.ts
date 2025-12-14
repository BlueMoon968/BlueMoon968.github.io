import { Application, Container, Graphics } from 'pixi.js';
import type { Project } from '../types';
import { soundManager } from '../utils/sound';
import { Cartridge } from '../components/Cartridge';

export class MainScene {
  private app: Application;
  private container: Container;
  private cartridges: Cartridge[] = [];
  private shelf: Graphics;
  private isReady = false;
  
  constructor(parentElement: HTMLElement) {
    this.app = new Application();
    this.container = new Container();
    this.shelf = new Graphics();
    
    this.initialize(parentElement);
  }

  private async initialize(parentElement: HTMLElement) {
    await this.app.init({
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: 0x0a0a1f,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
      antialias: false,
    });

    parentElement.appendChild(this.app.canvas);
    this.app.stage.addChild(this.container);
    
    // Aggiungi shelf UNA SOLA VOLTA
    this.container.addChild(this.shelf);
    this.drawShelf();
    
    this.isReady = true;
    
    window.addEventListener('resize', () => this.resize());
  }

private drawShelf() {
  const { width, height } = this.app.screen;
  
  this.shelf.clear();
  
  // Background
  this.shelf.rect(0, 0, width, height);
  this.shelf.fill({ color: 0x0a0a1f });

  // Shelf planks
  const shelfY = height * 0.3;
  const shelfHeight = 8;
  
  for (let i = 0; i < 3; i++) {
    const y = shelfY + (i * height * 0.25);
    
    this.shelf.rect(0, y + shelfHeight, width, 4);
    this.shelf.fill({ color: 0x050510, alpha: 0.5 });
    
    this.shelf.rect(0, y, width, shelfHeight);
    this.shelf.fill({ color: 0x1a1a3e });
    
    this.shelf.rect(0, y, width, 2);
    this.shelf.fill({ color: 0x2a2a4e });
  }
}

  public addProjects(projects: Project[], onCartridgeClick: (project: Project) => void) {
    console.log(this.app)
    this.cartridges.forEach(c => c.destroy());
    this.cartridges = [];

    const { width, height } = this.app.screen;
    const startY = height * 0.3;
    const rowHeight = height * 0.25;
    
    const isMobile = width < 768;
    const cartsPerRow = isMobile ? 2 : Math.min(4, Math.ceil(width / 200));
    const cartWidth = isMobile ? 80 : 120;
    const spacing = isMobile ? 20 : 40;

    projects.forEach((project, index) => {
      const row = Math.floor(index / cartsPerRow);
      const col = index % cartsPerRow;
      
      const totalWidth = (cartsPerRow * cartWidth) + ((cartsPerRow - 1) * spacing);
      const startX = (width - totalWidth) / 2;
      
      const x = startX + (col * (cartWidth + spacing));
      const y = startY + (row * rowHeight) + 20;

      const cartridge = new Cartridge(project, x, y, cartWidth);
      
      cartridge.onClick(() => {
        soundManager.select();
        onCartridgeClick(project);
      });

      this.container.addChild(cartridge.sprite);
      this.cartridges.push(cartridge);
    });
  }

  public filterCartridges(visibleProjects: Project[]) {
    const visibleSlugs = new Set(visibleProjects.map(p => p.slug));
    
    this.cartridges.forEach(cart => {
      cart.setVisible(visibleSlugs.has(cart.project.slug));
    });
  }

  private resize() {
    this.app.renderer.resize(window.innerWidth, window.innerHeight);
    this.drawShelf();
    this.repositionCartridges();
  }

  private repositionCartridges() {
    if (this.cartridges.length === 0) return;

    const { width, height } = this.app.screen;
    const startY = height * 0.3;
    const rowHeight = height * 0.25;
    
    const isMobile = width < 768;
    const cartsPerRow = isMobile ? 2 : Math.min(4, Math.ceil(width / 200));
    const cartWidth = isMobile ? 80 : 120;
    const spacing = isMobile ? 20 : 40;

    this.cartridges.forEach((cartridge, index) => {
      const row = Math.floor(index / cartsPerRow);
      const col = index % cartsPerRow;
      
      const totalWidth = (cartsPerRow * cartWidth) + ((cartsPerRow - 1) * spacing);
      const startX = (width - totalWidth) / 2;
      
      cartridge.sprite.x = startX + (col * (cartWidth + spacing));
      cartridge.sprite.y = startY + (row * rowHeight) + 20;
    });
  }

  public update(delta: number) {
    this.cartridges.forEach(cart => cart.update(delta));
  }

  public startAnimationLoop() {
    this.app.ticker.add((ticker) => {
      this.update(ticker.deltaTime);
    });
  }

  public destroy() {
    this.app.destroy(true, { children: true });
  }
}
