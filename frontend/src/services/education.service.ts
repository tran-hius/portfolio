import { fetchPublic, fetchWithAuth } from "./client.js";
import type { Education } from "../types/portfolio.js";

export const educationService = {
  async fetchEducation(): Promise<Education[]> {
    try {
      const res = await fetchPublic<any>("/education");
      if (Array.isArray(res)) return res;
      if (Array.isArray(res?.data)) return res.data;
      return [];
    } catch {
      return [];
    }
  },

  async createEducation(data: Partial<Education>): Promise<Education> {
    const res = await fetchWithAuth<any>("/education", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return res?.data || res;
  },

  async updateEducation(id: string, data: Partial<Education>): Promise<Education> {
    const res = await fetchWithAuth<any>(`/education/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return res?.data || res;
  },

  async deleteEducation(id: string): Promise<any> {
    const res = await fetchWithAuth<any>(`/education/${id}`, {
      method: "DELETE",
    });
    return res?.data || res;
  },
};

export const fetchEducation = educationService.fetchEducation;
export const createEducation = educationService.createEducation;
export const updateEducation = educationService.updateEducation;
export const deleteEducation = educationService.deleteEducation;
