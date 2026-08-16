import { fetchPublic, fetchWithAuth } from "./client.js";
import type { Education } from "../types/portfolio.js";

export const educationService = {
  async fetchEducation(): Promise<Education[]> {
    try {
      const json = await fetchPublic<{ success: boolean; data: Education[] }>("/education");
      return json.data || [];
    } catch {
      return [];
    }
  },

  async createEducation(data: Partial<Education>): Promise<Education> {
    const res = await fetchWithAuth<{ success: boolean; data: Education }>("/education", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return res.data;
  },

  async updateEducation(id: string, data: Partial<Education>): Promise<Education> {
    const res = await fetchWithAuth<{ success: boolean; data: Education }>(`/education/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return res.data;
  },

  async deleteEducation(id: string): Promise<any> {
    const res = await fetchWithAuth<{ success: boolean; data: any }>(`/education/${id}`, {
      method: "DELETE",
    });
    return res.data;
  },
};

export const fetchEducation = educationService.fetchEducation;
export const createEducation = educationService.createEducation;
export const updateEducation = educationService.updateEducation;
export const deleteEducation = educationService.deleteEducation;
