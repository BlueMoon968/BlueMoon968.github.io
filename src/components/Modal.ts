import type { Project } from '../types';
import gsap from 'gsap';
import { soundManager } from '../utils/sound';

export class Modal {
  private modal: HTMLElement;
  private modalBody: HTMLElement;
  private closeBtn: HTMLElement;
  public isOpen = false;

  constructor() {
    this.modal = document.getElementById('modal')!;
    this.modalBody = document.getElementById('modalBody')!;
    this.closeBtn = document.getElementById('modalClose')!;

    this.setupEvents();
  }

  private setupEvents() {
    // Close button
    this.closeBtn.addEventListener('click', () => this.close());

    // Click outside to close
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        this.close();
      }
    });

    // ESC key to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal.classList.contains('active')) {
        this.close();
      }
    });
  }

  public open(project: Project) {
    this.isOpen = true
    soundManager.select();
    
    // Render content
    this.modalBody.innerHTML = this.renderProject(project);

    // Show modal with animation
    this.modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    gsap.fromTo(
      this.modal.querySelector('.modal-content'),
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' }
    );
  }

  public close() {
    soundManager.click();

    gsap.to(this.modal.querySelector('.modal-content'), {
      scale: 0.8,
      opacity: 0,
      duration: 0.2,
      ease: 'power2.in',
      onComplete: () => {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
        this.isOpen = false;
      }
    });
  }

  private renderProject(project: Project): string {
    const { frontmatter, content } = project;
    
    const techBadges = frontmatter.technologies
      ?.map(tech => `<span class="tech-badge">${tech}</span>`)
      .join('') || '';

    const links = frontmatter.links
      ? Object.entries(frontmatter.links)
          .filter(([_, url]) => url)
          .map(([type, url]) => {
            const emoji = type === 'game' ? '🎮' : type === 'source' ? '📂' : '🔗';
            return `<a href="${url}" target="_blank" rel="noopener" class="project-link">
              ${emoji} ${type.charAt(0).toUpperCase() + type.slice(1)}
            </a>`;
          })
          .join('')
      : '';

    return `
      <div class="project-detail">
        <div class="project-header">
          <h2>${frontmatter.title}</h2>
          <div class="project-meta">
            ${frontmatter.type === 'game' ? '🎮 Game' : '💻 Coding Project'}
            ${frontmatter.genre ? ` • ${frontmatter.genre}` : ''}
            ${frontmatter.platform ? ` • ${frontmatter.platform}` : ''}
          </div>
          <div class="project-date">📅 ${new Date(frontmatter.date).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</div>
        </div>

        ${techBadges ? `<div class="tech-badges">${techBadges}</div>` : ''}

        <div class="project-content">
          ${this.parseMarkdown(content)}
        </div>

        ${links ? `<div class="project-links">${links}</div>` : ''}
      </div>
    `;
  }

  private parseMarkdown(markdown: string): string {
    // Simple markdown parser - in a real app you'd use a library
    return markdown
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*)\*/gim, '<em>$1</em>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/^(.+)$/gim, '<p>$1</p>')
      .replace(/<p><h/g, '<h')
      .replace(/<\/h([1-3])><\/p>/g, '</h$1>')
      .replace(/<p><\/p>/g, '');
  }
}
