import { CertificateModel } from "../schema/certificate.schema.js";
import type { CreateCertificateDTO } from "../dtos/create-certificate.dto.js";
import type { UpdateCertificateDTO } from "../dtos/update-certificate.dto.js";

export const certificateRepository = {
  async create(data: CreateCertificateDTO & { userId: string }) {
    return await CertificateModel.create(data);
  },

  async findAll(
    filter: Record<string, any> = {},
    sort: Record<string, 1 | -1> = { order: 1, issueDate: -1 },
  ) {
    return await CertificateModel.find(filter).sort(sort).exec();
  },

  async findById(id: string) {
    return await CertificateModel.findById(id);
  },

  async updateById(id: string, data: UpdateCertificateDTO) {
    return await CertificateModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  },

  async deleteById(id: string) {
    return await CertificateModel.findByIdAndDelete(id);
  },
};
