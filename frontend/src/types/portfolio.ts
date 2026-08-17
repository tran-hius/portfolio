export interface Project {
  _id: string;
  title: string;
  description: string;
  thumbnail?: string | null;
  imageUrl?: string | null;
  technologies: string[];
  githubUrl?: string | null;
  liveUrl?: string | null;
  demoUrl?: string | null;
  category?: string | null;
  isFeatured?: boolean;
}

export interface Skill {
  _id: string;
  name: string;
  category: string;
  proficiency?: number | null;
  icon?: string | null;
  color?: string | null;
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
  isCurrent?: boolean;
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
    startTime: string;
    uptimeSeconds: number;
    nodeVersion: string;
    platform?: string;
  };
  health: string;
  database: {
    status: string;
    latencyMs: number | null;
    name: string;
  };
  memory: {
    rssMb: number;
    heapTotalMb: number;
    heapUsedMb: number;
    externalMb: number;
  };
  traffic: {
    totalRequests: number;
    status2xx?: number;
    status3xx?: number;
    status4xx?: number;
    status5xx?: number;
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
