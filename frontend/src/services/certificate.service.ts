import { fetchPublic, fetchWithAuth } from "./client.js";
import type { Certificate } from "../types/portfolio.js";

export const certificateService = {
  async fetchCertificates(): Promise<Certificate[]> {
    try {
      const json = await fetchPublic<{ success: boolean; data: Certificate[] }>("/certificates");
      return json.data || [];
    } catch {
      return [];
    }
  },

  async createCertificate(data: Partial<Certificate>): Promise<Certificate> {
    const res = await fetchWithAuth<{ success: boolean; data: Certificate }>("/certificates", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return res.data;
  },

  async updateCertificate(id: string, data: Partial<Certificate>): Promise<Certificate> {
    const res = await fetchWithAuth<{ success: boolean; data: Certificate }>(`/certificates/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return res.data;
  },

  async deleteCertificate(id: string): Promise<any> {
    const res = await fetchWithAuth<{ success: boolean; data: any }>(`/certificates/${id}`, {
      method: "DELETE",
    });
    return res.data;
  },
};

export const fetchCertificates = certificateService.fetchCertificates;
export const createCertificate = certificateService.createCertificate;
export const updateCertificate = certificateService.updateCertificate;
export const deleteCertificate = certificateService.deleteCertificate;
