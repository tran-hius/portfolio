import { certificateRepository } from "../repositories/certificate.repository.js";
import { CertificateMapper } from "../mappers/certificate.mapper.js";
import type { CreateCertificateDTO } from "../dtos/create-certificate.dto.js";
import type { UpdateCertificateDTO } from "../dtos/update-certificate.dto.js";
import type { CertificateResponseDTO } from "../dtos/certificate-response.dto.js";
import {
  NotFoundError,
  BadRequestError,
  ForbiddenError,
} from "../errors/app.error.js";

export interface CertificateFilter {
  issuer?: string | undefined;
  search?: string | undefined;
}

const escapeRegex = (str: string): string => {
  return str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

const cleanString = (val?: any): string | null => {
  if (val === undefined || val === null) return null;
  const str = String(val).trim();
  return str.length > 0 ? str : null;
};

export const CertificateService = {
  async create(
    userId: string,
    data: CreateCertificateDTO,
  ): Promise<CertificateResponseDTO> {
    const title = cleanString(data.title);
    const issuer = cleanString(data.issuer);
    const issueDate = cleanString(data.issueDate);

    if (!title) {
      throw new BadRequestError("Certificate title is required");
    }
    if (!issuer) {
      throw new BadRequestError("Issuer is required");
    }
    if (!issueDate) {
      throw new BadRequestError("Issue date is required");
    }

    const expiryDate = cleanString(data.expiryDate);
    const credentialId = cleanString(data.credentialId);
    const credentialUrl = cleanString(data.credentialUrl);
    const imageUrl = cleanString(data.imageUrl);

    const newCert = await certificateRepository.create({
      title,
      issuer,
      issueDate,
      expiryDate,
      credentialId,
      credentialUrl,
      imageUrl,
      order: typeof data.order === "number" ? data.order : 0,
      userId,
    });

    return CertificateMapper.toResponse(newCert);
  },

  async findAll(
    filter: CertificateFilter = {},
  ): Promise<CertificateResponseDTO[]> {
    const mongoFilter: Record<string, any> = {};

    if (filter.issuer) {
      const safeIssuer = escapeRegex(filter.issuer);
      mongoFilter.issuer = { $regex: new RegExp(`^${safeIssuer}$`, "i") };
    }

    if (filter.search) {
      const safeSearch = escapeRegex(filter.search);
      mongoFilter.$or = [
        { title: { $regex: safeSearch, $options: "i" } },
        { issuer: { $regex: safeSearch, $options: "i" } },
      ];
    }

    const certificates = await certificateRepository.findAll(mongoFilter);
    return CertificateMapper.toResponseList(certificates);
  },

  async findById(id: string): Promise<CertificateResponseDTO> {
    const cert = await certificateRepository.findById(id);

    if (!cert) {
      throw new NotFoundError(`Certificate with id ${id} not found`);
    }

    return CertificateMapper.toResponse(cert);
  },

  async updateById(
    id: string,
    userId: string,
    data: UpdateCertificateDTO,
  ): Promise<CertificateResponseDTO> {
    const existing = await certificateRepository.findById(id);

    if (!existing) {
      throw new NotFoundError(`Certificate with id ${id} not found`);
    }

    if (existing.userId.toString() !== userId) {
      throw new ForbiddenError(
        "You do not have permission to update this certificate",
      );
    }

    const updatePayload: Record<string, any> = {};

    if (data.title !== undefined) {
      const title = cleanString(data.title);
      if (!title) throw new BadRequestError("Certificate title cannot be empty");
      updatePayload.title = title;
    }

    if (data.issuer !== undefined) {
      const issuer = cleanString(data.issuer);
      if (!issuer) throw new BadRequestError("Issuer cannot be empty");
      updatePayload.issuer = issuer;
    }

    if (data.issueDate !== undefined) {
      const issueDate = cleanString(data.issueDate);
      if (!issueDate) throw new BadRequestError("Issue date cannot be empty");
      updatePayload.issueDate = issueDate;
    }

    if (data.expiryDate !== undefined) {
      updatePayload.expiryDate = cleanString(data.expiryDate);
    }

    if (data.credentialId !== undefined) {
      updatePayload.credentialId = cleanString(data.credentialId);
    }

    if (data.credentialUrl !== undefined) {
      updatePayload.credentialUrl = cleanString(data.credentialUrl);
    }

    if (data.imageUrl !== undefined) {
      updatePayload.imageUrl = cleanString(data.imageUrl);
    }

    if (data.order !== undefined) {
      updatePayload.order = Number(data.order) || 0;
    }

    const updated = await certificateRepository.updateById(id, updatePayload);
    return CertificateMapper.toResponse(updated);
  },

  async deleteById(
    id: string,
    userId: string,
  ): Promise<{ success: boolean; message: string }> {
    const existing = await certificateRepository.findById(id);

    if (!existing) {
      throw new NotFoundError(`Certificate with id ${id} not found`);
    }

    if (existing.userId.toString() !== userId) {
      throw new ForbiddenError(
        "You do not have permission to delete this certificate",
      );
    }

    await certificateRepository.deleteById(id);

    return {
      success: true,
      message: "Certificate deleted successfully",
    };
  },
};
