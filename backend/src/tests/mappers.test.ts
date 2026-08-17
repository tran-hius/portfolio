import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { UserMapper } from "../mappers/user.mapper.js";
import { ProjectMapper } from "../mappers/project.mapper.js";

describe("DTO Mappers", () => {
  it("strips password and private properties from UserMapper", () => {
    const mockUser = {
      _id: "60d0fe4f5311236168a109ca",
      email: "admin@tranhieu.dev",
      firstName: "Tran",
      lastName: "Hieu",
      role: "admin",
      password: "$2b$10$encryptedpasswordhashvalue",
      __v: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const response = UserMapper.toResponse(mockUser);
    assert.strictEqual(response._id, "60d0fe4f5311236168a109ca");
    assert.strictEqual(response.email, "admin@tranhieu.dev");
    assert.strictEqual((response as any).password, undefined);
    assert.strictEqual((response as any).__v, undefined);
  });

  it("maps project fields cleanly and normalizes URLs", () => {
    const mockProject = {
      _id: "60d0fe4f5311236168a109cb",
      userId: "60d0fe4f5311236168a109ca",
      title: "Portfolio Website",
      description: "Modern fullstack portfolio",
      thumbnail: "https://example.com/img.png",
      technologies: ["React", "TypeScript", "Node.js"],
      isFeatured: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const response = ProjectMapper.toResponse(mockProject);
    assert.strictEqual(response.title, "Portfolio Website");
    assert.strictEqual(response.imageUrl, "https://example.com/img.png");
    assert.strictEqual(response.isFeatured, true);
    assert.deepStrictEqual(response.technologies, ["React", "TypeScript", "Node.js"]);
  });
});
