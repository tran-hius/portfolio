import type { CertificateResponseDTO } from "../dtos/certificate-response.dto.js";

export class CertificateMapper {
  static toResponse(cert: any): CertificateResponseDTO {
    if (!cert) return null as any;

    const raw =
      typeof cert.toObject === "function" ? cert.toObject() : cert;
    const { __v, ...rest } = raw;

    return {
      _id: rest._id?.toString() || "",
      userId: rest.userId ? rest.userId.toString() : "",
      title: rest.title,
      issuer: rest.issuer,
      issueDate: rest.issueDate,
      expiryDate: rest.expiryDate ?? null,
      credentialId: rest.credentialId ?? null,
      credentialUrl: rest.credentialUrl ?? null,
      imageUrl: rest.imageUrl ?? null,
      order: typeof rest.order === "number" ? rest.order : 0,
      createdAt: rest.createdAt,
      updatedAt: rest.updatedAt,
    };
  }

  static toResponseList(certs: any[]): CertificateResponseDTO[] {
    if (!Array.isArray(certs)) return [];
    return certs.map((c) => this.toResponse(c));
  }
}
