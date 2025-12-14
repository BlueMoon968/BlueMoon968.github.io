import { Container, Graphics, Text, TextStyle, FederatedPointerEvent } from 'pixi.js';
import type { Project } from '../types';
import { soundManager } from '../utils/sound';
import gsap from 'gsap';

export class Cartridge {
  public sprite: Container;
  public project: Project;
  private body: Graphics;
  private label: Text;
  private isHovered = false;
  private floatOffset = Math.random() * Math.PI * 2;

  constructor(project: Project, x: number, y: number, width: number) {
    this.project = project;
    this.sprite = new Container();
    this.sprite.x = x;
    this.sprite.y = y;

    this.body = new Graphics();
    this.label = new Text({ text: '', style: new TextStyle() });

    this.create(width);
    this.sprite.alpha = 0;
    
    // Entrance animation
    gsap.to(this.sprite, {
      alpha: 1,
      duration: 0.5,
      delay: Math.random() * 0.5,
      ease: 'power2.out'
    });
  }

  private create(width: number) {
    const height = width * 1.4;
    const isGame = this.project.frontmatter.type === 'game';
    
    // Colori stile GB
    const cartColor = isGame ? 0x7b68ee : 0xff6ec7; // Viola per games, rosa per coding
    
    // Corpo principale cartuccia
    this.body.roundRect(0, 0, width, height, 6);
    this.body.fill({ color: cartColor });
    
    // Tacca superiore
    const notchW = width * 0.6;
    const notchH = height * 0.1;
    this.body.roundRect(width * 0.2, -notchH * 0.4, notchW, notchH, 3);
    this.body.fill({ color: cartColor });
    
    // Linee decorative in alto
    this.body.rect(width * 0.15, 10, width * 0.7, 2);
    this.body.fill({ color: 0x000000, alpha: 0.15 });
    this.body.rect(width * 0.15, 14, width * 0.7, 2);
    this.body.fill({ color: 0x000000, alpha: 0.15 });
    
    // Label bianca centrale
    const labelY = height * 0.3;
    const labelH = height * 0.45;
    this.body.roundRect(width * 0.12, labelY, width * 0.76, labelH, 4);
    this.body.fill({ color: 0xffffff });
    
    // Bordo interno label
    this.body.roundRect(width * 0.15, labelY + 3, width * 0.7, labelH - 6, 3);
    this.body.stroke({ color: 0xe0e0e0, width: 1 });
    
    this.sprite.addChild(this.body);
    
    // Testo titolo
    const titleStyle = new TextStyle({
      fontFamily: 'Courier New, monospace',
      fontSize: width * 0.10,
      fill: 0x333333,
      align: 'center',
      fontWeight: 'bold',
      wordWrap: true,
      wordWrapWidth: width * 0.65
    });
    
    this.label.text = this.project.frontmatter.title.toUpperCase();
    this.label.style = titleStyle;
    this.label.anchor.set(0.5);
    this.label.x = width / 2;
    this.label.y = labelY + (labelH / 2);
    this.sprite.addChild(this.label);
    
    // Badge tipo sotto
    const badgeStyle = new TextStyle({
      fontFamily: 'Courier New, monospace',
      fontSize: width * 0.09,
      fill: 0xffffff,
      fontWeight: 'bold'
    });
    
    const badge = new Text({ 
      text: isGame ? 'GAME' : 'CODE',
      style: badgeStyle 
    });
    badge.anchor.set(0.5);
    badge.x = width / 2;
    badge.y = height * 0.85;
    this.sprite.addChild(badge);
    
    // Interattività
    this.sprite.eventMode = 'static';
    this.sprite.cursor = 'pointer';
    this.sprite.on('pointerover', (e) => this.onHover(e));
    this.sprite.on('pointerout', (e) => this.onHoverOut(e));
  }

  private onHover(_e: FederatedPointerEvent) {
    if (this.isHovered) return;

    const modal = document.querySelector('.modal.active');
    if (modal) return;

    this.isHovered = true;
    soundManager.hover();

    gsap.to(this.sprite.scale, {
      x: 1.1,
      y: 1.1,
      duration: 0.3,
      ease: 'back.out(2)'
    });

    gsap.to(this.sprite, {
      y: this.sprite.y - 10,
      duration: 0.3,
      ease: 'power2.out'
    });
  }

  private onHoverOut(_e: FederatedPointerEvent) {
    this.isHovered = false;

    gsap.to(this.sprite.scale, {
      x: 1,
      y: 1,
      duration: 0.3,
      ease: 'power2.inOut'
    });

    gsap.to(this.sprite, {
      y: this.sprite.y + 10,
      duration: 0.3,
      ease: 'power2.in'
    });
  }

  public onClick(callback: () => void) {
    this.sprite.on('pointertap', () => {
      callback();
      
      // Click animation
      gsap.to(this.sprite.scale, {
        x: 0.95,
        y: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1
      });
    });
  }

  public update(delta: number) {
    // Subtle floating animation
    if (!this.isHovered) {
      this.floatOffset += delta * 0.02;
      this.sprite.y += Math.sin(this.floatOffset) * 0.2;
    }
  }

  public setVisible(visible: boolean) {
    gsap.to(this.sprite, {
      alpha: visible ? 1 : 0,
      duration: 0.3,
      ease: 'power2.inOut'
    });
  }

  public destroy() {
    this.sprite.destroy({ children: true });
  }
}
