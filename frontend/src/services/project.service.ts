import { fetchPublic, fetchWithAuth } from "./client.js";
import type { Project } from "../types/portfolio.js";

export const projectService = {
  async fetchProjects(): Promise<Project[]> {
    try {
      const res = await fetchPublic<any>("/projects");
      if (Array.isArray(res)) return res;
      if (Array.isArray(res?.data)) return res.data;
      return [];
    } catch (err) {
      console.warn("Failed to fetch projects data", err);
      return [];
    }
  },

  async createProject(data: Partial<Project>): Promise<Project> {
    const res = await fetchWithAuth<any>("/projects", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return res?.data || res;
  },

  async updateProject(id: string, data: Partial<Project>): Promise<Project> {
    const res = await fetchWithAuth<any>(`/projects/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return res?.data || res;
  },

  async deleteProject(id: string): Promise<any> {
    const res = await fetchWithAuth<any>(`/projects/${id}`, {
      method: "DELETE",
    });
    return res?.data || res;
  },
};

export const fetchProjects = projectService.fetchProjects;
export const createProject = projectService.createProject;
export const updateProject = projectService.updateProject;
export const deleteProject = projectService.deleteProject;
