import type { Project, ProjectFrontmatter } from '../types';

// Auto-discovery di tutti i .md
const modules = import.meta.glob('../data/*.md', { query: '?raw', import: 'default', eager: true });

function parseFrontmatter(markdown: string) {
  const match = markdown.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { data: {}, content: markdown };
  
  const frontmatter = match[1];
  const content = match[2];
  const data: any = {};
  
  frontmatter.split('\n').forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) return;
    
    const key = line.slice(0, colonIndex).trim();
    let value: any = line.slice(colonIndex + 1).trim();
    
    // Parse array
    if (value.startsWith('[')) {
      value = value.slice(1, -1).split(',').map(v => v.trim().replace(/['"]/g, ''));
    }
    // Parse object
    else if (key === 'links') {
      data.links = {};
      return;
    }
    else if (line.startsWith('  ') && data.links) {
      const subKey = key;
      data.links[subKey] = value.replace(/['"]/g, '');
      return;
    }
    // Parse string
    else {
      value = value.replace(/['"]/g, '');
    }
    
    data[key] = value;
  });
  
  return { data, content };
}

export async function loadProjects(): Promise<Project[]> {
  const projects: Project[] = [];

  for (const path in modules) {
    const raw = modules[path] as string;
    const { data, content } = parseFrontmatter(raw);
    const slug = path.split('/').pop()?.replace('.md', '') || '';
    
    projects.push({
      slug,
      frontmatter: data as ProjectFrontmatter,
      content
    });
  }

  return projects.sort((a, b) => 
    new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime()
  );
}

export function filterProjects(projects: Project[], filter: 'all' | 'games' | 'coding'): Project[] {
  if (filter === 'all') return projects;
  if (filter === 'games') return projects.filter(p => p.frontmatter.type === 'game');
  if (filter === 'coding') return projects.filter(p => p.frontmatter.type === 'coding');
  return projects;
}