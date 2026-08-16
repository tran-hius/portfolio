import type {
  Project,
  Skill,
  Experience,
  Education,
  Certificate,
  SystemMetrics,
} from "../types/portfolio.js";

const API_BASE = "http://localhost:3001/api/v1";

/**
 * Connect to backend Server-Sent Events (SSE) stream for live active visitor counts
 */
export const subscribeToRealtimeVisitors = (
  onCountUpdate: (count: number) => void,
): (() => void) => {
  let eventSource: EventSource | null = null;

  try {
    eventSource = new EventSource(`${API_BASE}/analytics/realtime`);

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (typeof data.activeVisitors === "number") {
          onCountUpdate(data.activeVisitors);
        }
      } catch (err) {
        console.warn("Failed to parse SSE payload:", err);
      }
    };

    eventSource.onerror = () => {
      // Gracefully handle reconnection attempts by browser
    };
  } catch (err) {
    console.warn("EventSource connection error:", err);
  }

  return () => {
    if (eventSource) {
      eventSource.close();
    }
  };
};

export const fetchProjects = async (): Promise<Project[]> => {
  try {
    const res = await fetch(`${API_BASE}/projects`);
    if (!res.ok) throw new Error("Failed to fetch projects");
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    console.warn("Using fallback projects data", err);
    return [
      {
        _id: "p1",
        title: "Autonomous Agent Orchestrator",
        description:
          "High-throughput multi-agent execution framework with reactive task scheduling, vector embeddings, and real-time streaming telemetry.",
        technologies: ["Node.js", "TypeScript", "Express", "MongoDB", "SSE", "Docker"],
        githubUrl: "https://github.com/tran-hius/portfolio",
        liveUrl: "https://github.com/tran-hius/portfolio",
        category: "Backend & Systems",
        isFeatured: true,
      },
      {
        _id: "p2",
        title: "Realtime Analytics & Telemetry Engine",
        description:
          "Distributed event processing engine tracking live client connections, IP analytics, and system latency with zero external runtime bloat.",
        technologies: ["TypeScript", "Mongoose", "SSE", "Tailwind CSS", "React"],
        githubUrl: "https://github.com/tran-hius/portfolio",
        liveUrl: "https://github.com/tran-hius/portfolio",
        category: "Observability",
        isFeatured: true,
      },
      {
        _id: "p3",
        title: "Cloudinary Native Media Pipeline",
        description:
          "Secure direct-to-cloud cryptographic media optimization service generating SHA-1 signatures with streaming upload and auto-cleanup.",
        technologies: ["Node.js", "Cloudinary", "Crypto", "TypeScript"],
        githubUrl: "https://github.com/tran-hius/portfolio",
        liveUrl: "https://github.com/tran-hius/portfolio",
        category: "Cloud Services",
        isFeatured: false,
      },
    ];
  }
};

export const fetchSkills = async (): Promise<Record<string, Skill[]>> => {
  try {
    const res = await fetch(`${API_BASE}/skills?grouped=true`);
    if (!res.ok) throw new Error("Failed to fetch skills");
    const json = await res.json();
    return json.data || {};
  } catch (err) {
    console.warn("Using fallback skills data", err);
    return {
      Frontend: [
        { _id: "s1", name: "React 19", category: "Frontend", proficiency: 95 },
        { _id: "s2", name: "TypeScript", category: "Frontend", proficiency: 98 },
        { _id: "s3", name: "Tailwind CSS", category: "Frontend", proficiency: 92 },
        { _id: "s4", name: "Next.js", category: "Frontend", proficiency: 90 },
      ],
      Backend: [
        { _id: "s5", name: "Node.js", category: "Backend", proficiency: 96 },
        { _id: "s6", name: "Express.js", category: "Backend", proficiency: 94 },
        { _id: "s7", name: "RESTful API & SSE", category: "Backend", proficiency: 95 },
        { _id: "s8", name: "Microservices", category: "Backend", proficiency: 88 },
      ],
      Database: [
        { _id: "s9", name: "MongoDB", category: "Database", proficiency: 92 },
        { _id: "s10", name: "Mongoose", category: "Database", proficiency: 94 },
        { _id: "s11", name: "Redis", category: "Database", proficiency: 85 },
        { _id: "s12", name: "PostgreSQL", category: "Database", proficiency: 82 },
      ],
      DevOps: [
        { _id: "s13", name: "Docker", category: "DevOps", proficiency: 88 },
        { _id: "s14", name: "Git / CI-CD", category: "DevOps", proficiency: 92 },
        { _id: "s15", name: "Linux / Bash", category: "DevOps", proficiency: 86 },
        { _id: "s16", name: "Cloudinary", category: "DevOps", proficiency: 90 },
      ],
    };
  }
};

export const fetchExperiences = async (): Promise<Experience[]> => {
  try {
    const res = await fetch(`${API_BASE}/experiences`);
    if (!res.ok) throw new Error("Failed to fetch experiences");
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    console.warn("Using fallback experience data", err);
    return [
      {
        _id: "e1",
        company: "High-Performance Software Labs",
        position: "Senior Full-Stack Engineer",
        location: "Hanoi, Vietnam",
        startDate: "2023",
        endDate: null,
        isCurrent: true,
        description:
          "Architected backend microservices and high-fidelity interactive interfaces. Built realtime telemetry streams, secure authentication layers, and automated verification suites.",
        technologies: ["Node.js", "TypeScript", "React", "MongoDB", "SSE", "Docker"],
      },
      {
        _id: "e2",
        company: "Digital Innovations Corp",
        position: "Backend & Systems Developer",
        location: "Vietnam",
        startDate: "2021",
        endDate: "2023",
        isCurrent: false,
        description:
          "Engineered RESTful APIs, optimized database queries, implemented anti-IDOR authorization safeguards, and integrated 3rd-party cloud services.",
        technologies: ["TypeScript", "Express", "Mongoose", "PostgreSQL", "Git"],
      },
    ];
  }
};

export const fetchEducation = async (): Promise<Education[]> => {
  try {
    const res = await fetch(`${API_BASE}/education`);
    if (!res.ok) throw new Error("Failed to fetch education");
    const json = await res.json();
    return json.data || [];
  } catch {
    return [
      {
        _id: "ed1",
        institution: "University of Science and Technology",
        degree: "Bachelor of Science",
        fieldOfStudy: "Computer Science & Software Engineering",
        startDate: "2019",
        endDate: "2023",
        grade: "Honors / Excellent",
        description: "Specialized in Distributed Computing, Algorithms, and Software Architecture.",
      },
    ];
  }
};

export const fetchCertificates = async (): Promise<Certificate[]> => {
  try {
    const res = await fetch(`${API_BASE}/certificates`);
    if (!res.ok) throw new Error("Failed to fetch certificates");
    const json = await res.json();
    return json.data || [];
  } catch {
    return [
      {
        _id: "c1",
        title: "AWS Certified Solutions Architect",
        issuer: "Amazon Web Services",
        issueDate: "2024",
        credentialId: "AWS-PSA-99412",
        credentialUrl: "https://aws.amazon.com/verification",
      },
      {
        _id: "c2",
        title: "Certified MongoDB Developer Associate",
        issuer: "MongoDB Inc.",
        issueDate: "2023",
        credentialId: "MDB-DEV-8812",
        credentialUrl: "https://learn.mongodb.com/certificates",
      },
    ];
  }
};

export const fetchSystemMetrics = async (): Promise<SystemMetrics | null> => {
  try {
    const res = await fetch(`${API_BASE}/system/metrics`);
    if (!res.ok) throw new Error("Failed to fetch metrics");
    const json = await res.json();
    return json.data || null;
  } catch {
    return null;
  }
};

/* =========================================================================
   AUTH & ADMIN MANAGEMENT API
   ========================================================================= */

const TOKEN_KEY = "portfolio_admin_token";
const USER_KEY = "portfolio_admin_user";

export const getStoredToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setStoredAuth = (token: string, user: any) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const clearStoredAuth = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const getStoredUser = () => {
  try {
    const str = localStorage.getItem(USER_KEY);
    return str ? JSON.parse(str) : null;
  } catch {
    return null;
  }
};

const authFetch = async (endpoint: string, options: RequestInit = {}) => {
  const token = getStoredToken();
  const headers = new Headers(options.headers || {});
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || `Request failed with status ${res.status}`);
  }
  return json;
};

// Admin Auth
export const loginAdmin = async (email: string, password: string) => {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Login failed");
  if (json.data?.accessToken) {
    setStoredAuth(json.data.accessToken, json.data.user);
  }
  return json.data;
};

export const registerAdmin = async (email: string, password: string, name: string) => {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, name, role: "admin" }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Registration failed");
  if (json.data?.accessToken) {
    setStoredAuth(json.data.accessToken, json.data.user);
  }
  return json.data;
};

// Projects CRUD
export const createProject = async (data: Partial<Project>) => {
  const res = await authFetch("/projects", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return res.data;
};

export const updateProject = async (id: string, data: Partial<Project>) => {
  const res = await authFetch(`/projects/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return res.data;
};

export const deleteProject = async (id: string) => {
  const res = await authFetch(`/projects/${id}`, {
    method: "DELETE",
  });
  return res.data;
};

// Skills CRUD
export const createSkill = async (data: Partial<Skill>) => {
  const res = await authFetch("/skills", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return res.data;
};

export const updateSkill = async (id: string, data: Partial<Skill>) => {
  const res = await authFetch(`/skills/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return res.data;
};

export const deleteSkill = async (id: string) => {
  const res = await authFetch(`/skills/${id}`, {
    method: "DELETE",
  });
  return res.data;
};

// Experience CRUD
export const createExperience = async (data: Partial<Experience>) => {
  const res = await authFetch("/experiences", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return res.data;
};

export const updateExperience = async (id: string, data: Partial<Experience>) => {
  const res = await authFetch(`/experiences/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return res.data;
};

export const deleteExperience = async (id: string) => {
  const res = await authFetch(`/experiences/${id}`, {
    method: "DELETE",
  });
  return res.data;
};

// Education CRUD
export const createEducation = async (data: Partial<Education>) => {
  const res = await authFetch("/education", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return res.data;
};

export const updateEducation = async (id: string, data: Partial<Education>) => {
  const res = await authFetch(`/education/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return res.data;
};

export const deleteEducation = async (id: string) => {
  const res = await authFetch(`/education/${id}`, {
    method: "DELETE",
  });
  return res.data;
};

// Certificate CRUD
export const createCertificate = async (data: Partial<Certificate>) => {
  const res = await authFetch("/certificates", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return res.data;
};

export const updateCertificate = async (id: string, data: Partial<Certificate>) => {
  const res = await authFetch(`/certificates/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return res.data;
};

export const deleteCertificate = async (id: string) => {
  const res = await authFetch(`/certificates/${id}`, {
    method: "DELETE",
  });
  return res.data;
};

// Cloudinary Upload
export const uploadImage = async (file: File): Promise<{ url: string; publicId: string }> => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await authFetch("/upload", {
    method: "POST",
    body: formData,
  });
  return res.data;
};

// Visitor Logs
export const fetchVisitorLogs = async (page = 1, limit = 20) => {
  try {
    const res = await authFetch(`/analytics/visitors?page=${page}&limit=${limit}`);
    return res.data;
  } catch {
    return {
      visitors: [],
      pagination: { total: 0, page: 1, limit: 20, totalPages: 0 },
      stats: { totalDistinctIPs: 1, todayUniqueIPs: 1 },
    };
  }
};

