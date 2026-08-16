import { fetchPublic, fetchWithAuth } from "./client.js";
import type { Project } from "../types/portfolio.js";

export const projectService = {
  async fetchProjects(): Promise<Project[]> {
    try {
      const json = await fetchPublic<{ success: boolean; data: Project[] }>("/projects");
      return json.data || [];
    } catch (err) {
      console.warn("Failed to fetch projects data", err);
      return [];
    }
  },

  async createProject(data: Partial<Project>): Promise<Project> {
    const res = await fetchWithAuth<{ success: boolean; data: Project }>("/projects", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return res.data;
  },

  async updateProject(id: string, data: Partial<Project>): Promise<Project> {
    const res = await fetchWithAuth<{ success: boolean; data: Project }>(`/projects/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return res.data;
  },

  async deleteProject(id: string): Promise<any> {
    const res = await fetchWithAuth<{ success: boolean; data: any }>(`/projects/${id}`, {
      method: "DELETE",
    });
    return res.data;
  },
};

export const fetchProjects = projectService.fetchProjects;
export const createProject = projectService.createProject;
export const updateProject = projectService.updateProject;
export const deleteProject = projectService.deleteProject;
