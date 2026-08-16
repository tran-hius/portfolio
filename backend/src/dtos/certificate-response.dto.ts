export interface CertificateResponseDTO {
  _id: string;
  userId: string;
  title: string;
  issuer: string;
  issueDate: Date | string;
  expiryDate: Date | string | null;
  credentialId: string | null;
  credentialUrl: string | null;
  imageUrl: string | null;
  order: number;
  createdAt?: Date | string | undefined;
  updatedAt?: Date | string | undefined;
}
