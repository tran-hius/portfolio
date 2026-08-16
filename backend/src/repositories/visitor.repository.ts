import { VisitorModel, type IVisitor } from "../schema/visitor.schema.js";

export type CreateVisitorDTO = Partial<IVisitor> & { ip: string };

export const visitorRepository = {
  async create(data: CreateVisitorDTO) {
    return await VisitorModel.create(data);
  },

  async findAll(
    filter: Record<string, any> = {},
    options: {
      sort?: Record<string, 1 | -1>;
      skip?: number;
      limit?: number;
    } = {},
  ) {
    const { sort = { visitedAt: -1 }, skip = 0, limit = 50 } = options;
    return await VisitorModel.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .exec();
  },

  async count(filter: Record<string, any> = {}) {
    return await VisitorModel.countDocuments(filter);
  },

  async countDistinctIPs(filter: Record<string, any> = {}): Promise<number> {
    const distinctIPs = await VisitorModel.distinct("ip", filter);
    return distinctIPs.length;
  },

  async countTodayUniqueIPs(): Promise<number> {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    return this.countDistinctIPs({
      visitedAt: { $gte: startOfToday },
    });
  },
};
