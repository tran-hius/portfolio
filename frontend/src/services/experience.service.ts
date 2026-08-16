import { fetchPublic, fetchWithAuth } from "./client.js";
import type { Experience } from "../types/portfolio.js";

export const experienceService = {
  async fetchExperiences(): Promise<Experience[]> {
    try {
      const json = await fetchPublic<{ success: boolean; data: Experience[] }>("/experiences");
      return json.data || [];
    } catch (err) {
      console.warn("Failed to fetch experience data", err);
      return [];
    }
  },

  async createExperience(data: Partial<Experience>): Promise<Experience> {
    const res = await fetchWithAuth<{ success: boolean; data: Experience }>("/experiences", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return res.data;
  },

  async updateExperience(id: string, data: Partial<Experience>): Promise<Experience> {
    const res = await fetchWithAuth<{ success: boolean; data: Experience }>(`/experiences/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return res.data;
  },

  async deleteExperience(id: string): Promise<any> {
    const res = await fetchWithAuth<{ success: boolean; data: any }>(`/experiences/${id}`, {
      method: "DELETE",
    });
    return res.data;
  },
};

export const fetchExperiences = experienceService.fetchExperiences;
export const createExperience = experienceService.createExperience;
export const updateExperience = experienceService.updateExperience;
export const deleteExperience = experienceService.deleteExperience;
