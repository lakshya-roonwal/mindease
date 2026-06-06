import { GET, POST, PUT, DELETE } from "../app/api/journal/route";
import { prisma } from "../lib/prisma";
import { auth } from "../lib/auth";

jest.mock("../lib/prisma", () => ({
  prisma: {
    journalEntry: {
      findMany: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
    },
  },
}));

jest.mock("../lib/auth", () => ({
  auth: jest.fn(),
}));

describe("Journal API", () => {
  const mockUser = { id: "user-1", name: "Test User" };

  beforeEach(() => {
    jest.clearAllMocks();
    (auth as jest.Mock).mockResolvedValue({ user: mockUser });
  });

  describe("GET", () => {
    it("should fetch entries with pagination", async () => {
      (prisma.journalEntry.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.journalEntry.count as jest.Mock).mockResolvedValue(0);

      const req = new Request("http://localhost/api/journal?page=1");
      const res = await GET(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.entries).toEqual([]);
      expect(data.pagination.currentPage).toBe(1);
    });
  });

  describe("POST", () => {
    it("should create a new entry", async () => {
      const mockEntry = { id: "entry-1", content: "Test content" };
      (prisma.journalEntry.create as jest.Mock).mockResolvedValue(mockEntry);

      const req = new Request("http://localhost/api/journal", {
        method: "POST",
        body: JSON.stringify({ content: "This is a long enough content", moodScore: 7 }),
      });
      const res = await POST(req);
      const data = await res.json();

      expect(res.status).toBe(201);
      expect(data.content).toBe("Test content");
    });

    it("should return 400 if content is too short", async () => {
      const req = new Request("http://localhost/api/journal", {
        method: "POST",
        body: JSON.stringify({ content: "", moodScore: 7 }),
      });
      const res = await POST(req);
      expect(res.status).toBe(400);
    });
  });

  describe("PUT", () => {
    it("should update an existing entry", async () => {
      const mockEntry = { id: "entry-1", content: "Updated content", userId: "user-1" };
      (prisma.journalEntry.findUnique as jest.Mock).mockResolvedValue(mockEntry);
      (prisma.journalEntry.update as jest.Mock).mockResolvedValue(mockEntry);

      const req = new Request("http://localhost/api/journal", {
        method: "PUT",
        body: JSON.stringify({ id: "entry-1", content: "Updated content" }),
      });
      const res = await PUT(req);
      expect(res.status).toBe(200);
    });
  });

  describe("DELETE", () => {
    it("should soft delete an entry", async () => {
      (prisma.journalEntry.updateMany as jest.Mock).mockResolvedValue({ count: 1 });

      const req = new Request("http://localhost/api/journal?id=entry-1", {
        method: "DELETE",
      });
      const res = await DELETE(req);
      expect(res.status).toBe(200);
      expect(prisma.journalEntry.updateMany).toHaveBeenCalled();
    });
  });
});
