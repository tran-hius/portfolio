import { fetchPublic, fetchWithAuth } from "./client.js";
import type { Skill } from "../types/portfolio.js";

export const skillService = {
  async fetchSkills(): Promise<Record<string, Skill[]>> {
    try {
      const res = await fetchPublic<any>("/skills?grouped=true");
      if (res?.data && typeof res.data === "object") return res.data;
      if (res && typeof res === "object") return res;
      return {};
    } catch (err) {
      console.warn("Failed to fetch skills data", err);
      return {};
    }
  },

  async createSkill(data: Partial<Skill>): Promise<Skill> {
    const res = await fetchWithAuth<any>("/skills", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return res?.data || res;
  },

  async updateSkill(id: string, data: Partial<Skill>): Promise<Skill> {
    const res = await fetchWithAuth<any>(`/skills/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return res?.data || res;
  },

  async deleteSkill(id: string): Promise<any> {
    const res = await fetchWithAuth<any>(`/skills/${id}`, {
      method: "DELETE",
    });
    return res?.data || res;
  },
};

export const fetchSkills = skillService.fetchSkills;
export const createSkill = skillService.createSkill;
export const updateSkill = skillService.updateSkill;
export const deleteSkill = skillService.deleteSkill;
