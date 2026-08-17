import mongoose from "mongoose";
import { envConfig } from "../config/env.config.js";
import { HashUtil } from "../utils/hash.util.js";
import User from "../schema/user.schema.js";
import { Logger } from "../utils/logger.util.js";

const seedAdmin = async () => {
  try {
    const mongoUri = envConfig.MONGO_URI;
    Logger.info(`Connecting to MongoDB at: ${mongoUri}`);
    await mongoose.connect(mongoUri);

    const email = envConfig.ADMIN_EMAIL?.trim().toLowerCase();
    const rawPassword = envConfig.ADMIN_PASSWORD;

    if (!email || !rawPassword) {
      Logger.error(
        "FATAL: ADMIN_EMAIL and ADMIN_PASSWORD must be defined in your environment (.env).",
      );
      process.exit(1);
    }

    const hashedPassword = await HashUtil.hash(rawPassword);

    await User.deleteMany({ email: { $ne: email } });

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      existingUser.firstName = "Tran";
      existingUser.lastName = "Hieu";
      existingUser.password = hashedPassword;
      existingUser.role = "admin";
      await existingUser.save();
      Logger.info(`[SEED] Master admin account updated: ${email}`);
    } else {
      await User.create({
        firstName: "Tran",
        lastName: "Hieu",
        email,
        password: hashedPassword,
        role: "admin",
      });
      Logger.info(`[SEED] Master admin account created: ${email}`);
    }

    const count = await User.countDocuments({});
    Logger.info(`[SEED] Database now has exactly ${count} admin account.`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    Logger.error("Failed to seed admin user:", error);
    process.exit(1);
  }
};

seedAdmin();
