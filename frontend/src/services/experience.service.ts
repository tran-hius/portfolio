import { fetchPublic, fetchWithAuth } from "./client.js";
import type { Experience } from "../types/portfolio.js";

export const experienceService = {
  async fetchExperiences(): Promise<Experience[]> {
    try {
      const res = await fetchPublic<any>("/experiences");
      if (Array.isArray(res)) return res;
      if (Array.isArray(res?.data)) return res.data;
      return [];
    } catch (err) {
      console.warn("Failed to fetch experience data", err);
      return [];
    }
  },

  async createExperience(data: Partial<Experience>): Promise<Experience> {
    const res = await fetchWithAuth<any>("/experiences", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return res?.data || res;
  },

  async updateExperience(id: string, data: Partial<Experience>): Promise<Experience> {
    const res = await fetchWithAuth<any>(`/experiences/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return res?.data || res;
  },

  async deleteExperience(id: string): Promise<any> {
    const res = await fetchWithAuth<any>(`/experiences/${id}`, {
      method: "DELETE",
    });
    return res?.data || res;
  },
};

export const fetchExperiences = experienceService.fetchExperiences;
export const createExperience = experienceService.createExperience;
export const updateExperience = experienceService.updateExperience;
export const deleteExperience = experienceService.deleteExperience;
