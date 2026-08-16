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

export const CertificateService = {
  async create(
    userId: string,
    data: CreateCertificateDTO,
  ): Promise<CertificateResponseDTO> {
    if (!data.title || !data.title.trim()) {
      throw new BadRequestError("Certificate title is required");
    }
    if (!data.issuer || !data.issuer.trim()) {
      throw new BadRequestError("Issuer is required");
    }
    if (!data.issueDate) {
      throw new BadRequestError("Issue date is required");
    }

    const newCert = await certificateRepository.create({
      ...data,
      title: data.title.trim(),
      issuer: data.issuer.trim(),
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

    const updated = await certificateRepository.updateById(id, data);
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
