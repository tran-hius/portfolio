export interface Project {
  _id: string;
  title: string;
  description: string;
  thumbnail?: string | null;
  imageUrl?: string | null;
  technologies: string[];
  githubUrl?: string | null;
  liveUrl?: string | null;
  category?: string | null;
  isFeatured?: boolean;
}

export interface Skill {
  _id: string;
  name: string;
  category: string;
  proficiency?: number | null;
  icon?: string | null;
  isFeatured?: boolean;
}

export interface Experience {
  _id: string;
  company: string;
  position: string;
  location?: string | null;
  startDate: string | Date;
  endDate?: string | Date | null;
  isCurrent: boolean;
  description?: string | null;
  technologies: string[];
}

export interface Education {
  _id: string;
  institution: string;
  degree: string;
  fieldOfStudy?: string | null;
  startDate: string | Date;
  endDate?: string | Date | null;
  grade?: string | null;
  description?: string | null;
}

export interface Certificate {
  _id: string;
  title: string;
  issuer: string;
  issueDate: string | Date;
  expiryDate?: string | Date | null;
  credentialId?: string | null;
  credentialUrl?: string | null;
  imageUrl?: string | null;
}

export interface SystemMetrics {
  server: {
    uptimeSeconds: number;
    nodeVersion: string;
    platform: string;
    memory?: {
      heapUsedMb: number;
      totalRssMb: number;
    };
  };
  health: string;
  database: {
    status: string;
    latencyMs: number | null;
    name: string;
  };
  traffic: {
    totalRequests: number;
    avgLatencyMs: number;
    errorRatePercent: number;
  };
}

export interface VisitorStats {
  activeVisitors: number;
  totalVisits: number;
  uniqueVisitorsToday: number;
  totalUniqueVisitors: number;
}
