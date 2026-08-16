export interface UpdateCertificateDTO {
  title?: string | undefined;
  issuer?: string | undefined;
  issueDate?: string | Date | undefined;
  expiryDate?: string | Date | null | undefined;
  credentialId?: string | null | undefined;
  credentialUrl?: string | null | undefined;
  imageUrl?: string | null | undefined;
  order?: number | undefined;
}
