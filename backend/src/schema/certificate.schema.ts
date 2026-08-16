import { Schema, model, Types } from "mongoose";

export interface ICertificate {
  userId: Types.ObjectId;
  title: string;
  issuer: string;
  issueDate: string | Date;
  expiryDate?: string | Date | null | undefined;
  credentialId?: string | null | undefined;
  credentialUrl?: string | null | undefined;
  imageUrl?: string | null | undefined;
  order?: number | undefined;
  createdAt?: Date | undefined;
  updatedAt?: Date | undefined;
}

const certificateSchema = new Schema<ICertificate>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    issuer: {
      type: String,
      required: true,
      trim: true,
    },
    issueDate: {
      type: Schema.Types.Mixed,
      required: true,
    },
    expiryDate: {
      type: Schema.Types.Mixed,
      default: null,
    },
    credentialId: {
      type: String,
      default: null,
      trim: true,
    },
    credentialUrl: {
      type: String,
      default: null,
      trim: true,
    },
    imageUrl: {
      type: String,
      default: null,
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

certificateSchema.index({ userId: 1, order: 1, issueDate: -1 });

export const CertificateModel = model<ICertificate>(
  "Certificate",
  certificateSchema,
);
