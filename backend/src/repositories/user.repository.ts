import User from "../schema/user.schema.js";

export const userRepository = {
  async findById(id: string) {
    return await User.findOne({ _id: id });
  },

  async findByEmail(email: string) {
    return await User.findOne({ email });
  },

  async create(data: any) {
    return await User.create(data);
  },

  async updateById(id: string, data: any) {
    return await User.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  },

  async deleteById(id: string) {
    return await User.findByIdAndDelete(id);
  },
};
