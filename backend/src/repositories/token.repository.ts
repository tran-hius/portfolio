import Token from "../schema/token.schema.js";

const tokenRepository = {
  async create(data: { userId: string; token: string; expiresAt: Date }) {
    return await Token.create(data);
  },

  async findByToken(token: string) {
    return await Token.findOne({ token });
  },

  async findByUserId(userId: string) {
    return await Token.findOne({ userId });
  },

  async updateById(
    id: string,
    data: {
      token?: string;
      expiresAt?: Date;
    },
  ) {
    return await Token.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  },

  async deleteById(id: string) {
    return await Token.findByIdAndDelete(id);
  },

  async deleteByToken(token: string) {
    return await Token.findOneAndDelete({ token });
  },

  async deleteByUserId(userId: string) {
    return await Token.deleteMany({ userId });
  },
};

export default tokenRepository;
