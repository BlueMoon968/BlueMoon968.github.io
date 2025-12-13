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
    
    // Color scheme based on type - Vaporwave palette
    const colors = {
      game: {
        primary: 0xff6ec7,   // Hot pink
        secondary: 0x7b68ee, // Medium purple
        accent: 0x00d4ff     // Cyan
      },
      coding: {
        primary: 0x7b68ee,   // Medium purple
        secondary: 0x00d4ff, // Cyan
        accent: 0xff6ec7     // Hot pink
      }
    };

    const palette = isGame ? colors.game : colors.coding;

    // Cartridge body
    this.body.roundRect(0, 0, width, height, 8);
    this.body.fill({ color: palette.primary });

    // Top notch
    const notchWidth = width * 0.6;
    const notchHeight = height * 0.15;
    this.body.roundRect(width * 0.2, -notchHeight * 0.5, notchWidth, notchHeight, 4);
    this.body.fill({ color: palette.secondary });

    // Label area
    const labelY = height * 0.3;
    const labelHeight = height * 0.4;
    this.body.roundRect(width * 0.1, labelY, width * 0.8, labelHeight, 4);
    this.body.fill({ color: 0x0a0a1f, alpha: 0.8 });

    // Accent line
    this.body.rect(width * 0.1, labelY + labelHeight + 5, width * 0.8, 3);
    this.body.fill({ color: palette.accent });

    this.sprite.addChild(this.body);

    // Label text
    const labelStyle = new TextStyle({
      fontFamily: 'monospace',
      fontSize: width * 0.12,
      fill: 0xffffff,
      align: 'center',
      wordWrap: true,
      wordWrapWidth: width * 0.7
    });

    this.label.text = this.project.frontmatter.title.toUpperCase();
    this.label.style = labelStyle;
    this.label.anchor.set(0.5);
    this.label.x = width / 2;
    this.label.y = labelY + (labelHeight / 2);

    this.sprite.addChild(this.label);

    // Type badge
    const badgeStyle = new TextStyle({
      fontFamily: 'monospace',
      fontSize: width * 0.08,
      fill: palette.accent,
      fontWeight: 'bold'
    });

    const badge = new Text({ 
      text: isGame ? '🎮' : '💻',
      style: badgeStyle 
    });
    badge.anchor.set(0.5);
    badge.x = width / 2;
    badge.y = height * 0.85;
    this.sprite.addChild(badge);

    // Make interactive
    this.sprite.eventMode = 'static';
    this.sprite.cursor = 'pointer';

    this.sprite.on('pointerover', (e: FederatedPointerEvent) => this.onHover(e));
    this.sprite.on('pointerout', (e: FederatedPointerEvent) => this.onHoverOut(e));
  }

  private onHover(_e: FederatedPointerEvent) {
    if (this.isHovered) return;
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
