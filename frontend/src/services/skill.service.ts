import { fetchPublic, fetchWithAuth } from "./client.js";
import type { Skill } from "../types/portfolio.js";

export const skillService = {
  async fetchSkills(): Promise<Record<string, Skill[]>> {
    try {
      const json = await fetchPublic<{ success: boolean; data: Record<string, Skill[]> }>("/skills?grouped=true");
      return json.data || {};
    } catch (err) {
      console.warn("Failed to fetch skills data", err);
      return {};
    }
  },

  async createSkill(data: Partial<Skill>): Promise<Skill> {
    const res = await fetchWithAuth<{ success: boolean; data: Skill }>("/skills", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return res.data;
  },

  async updateSkill(id: string, data: Partial<Skill>): Promise<Skill> {
    const res = await fetchWithAuth<{ success: boolean; data: Skill }>(`/skills/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return res.data;
  },

  async deleteSkill(id: string): Promise<any> {
    const res = await fetchWithAuth<{ success: boolean; data: any }>(`/skills/${id}`, {
      method: "DELETE",
    });
    return res.data;
  },
};

export const fetchSkills = skillService.fetchSkills;
export const createSkill = skillService.createSkill;
export const updateSkill = skillService.updateSkill;
export const deleteSkill = skillService.deleteSkill;
