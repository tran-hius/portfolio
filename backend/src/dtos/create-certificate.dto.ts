export interface CreateCertificateDTO {
  title: string;
  issuer: string;
  issueDate: string | Date;
  expiryDate?: string | Date | null | undefined;
  credentialId?: string | null | undefined;
  credentialUrl?: string | null | undefined;
  imageUrl?: string | null | undefined;
  order?: number | undefined;
}
