import { fetchPublic, fetchWithAuth } from "./client.js";
import type { Certificate } from "../types/portfolio.js";

export const certificateService = {
  async fetchCertificates(): Promise<Certificate[]> {
    try {
      const res = await fetchPublic<any>("/certificates");
      if (Array.isArray(res)) return res;
      if (Array.isArray(res?.data)) return res.data;
      return [];
    } catch {
      return [];
    }
  },

  async createCertificate(data: Partial<Certificate>): Promise<Certificate> {
    const res = await fetchWithAuth<any>("/certificates", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return res?.data || res;
  },

  async updateCertificate(id: string, data: Partial<Certificate>): Promise<Certificate> {
    const res = await fetchWithAuth<any>(`/certificates/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return res?.data || res;
  },

  async deleteCertificate(id: string): Promise<any> {
    const res = await fetchWithAuth<any>(`/certificates/${id}`, {
      method: "DELETE",
    });
    return res?.data || res;
  },
};

export const fetchCertificates = certificateService.fetchCertificates;
export const createCertificate = certificateService.createCertificate;
export const updateCertificate = certificateService.updateCertificate;
export const deleteCertificate = certificateService.deleteCertificate;
