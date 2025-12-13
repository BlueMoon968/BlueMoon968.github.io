export interface ProjectFrontmatter {
  title: string;
  type: 'game' | 'coding';
  genre?: string;
  platform?: string;
  date: string;
  technologies?: string[];
  links?: {
    game?: string;
    source?: string;
    demo?: string;
  };
  image?: string;
  featured?: boolean;
}

export interface Project {
  slug: string;
  frontmatter: ProjectFrontmatter;
  content: string;
}

export type Theme = 'light' | 'dark';
export type FilterType = 'all' | 'games' | 'coding';

export interface CartridgeData {
  project: Project;
  x: number;
  y: number;
  scale: number;
}
