import { POST } from "../../app/api/insights/check-in/route";
import { prisma } from "../../lib/prisma";
import { auth } from "../../lib/auth";

jest.mock("../../lib/prisma", () => ({
  prisma: {
    moodCheckIn: {
      create: jest.fn(),
    },
    streak: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  },
}));

jest.mock("../../lib/auth", () => ({
  auth: jest.fn(),
}));

describe("CheckIn API", () => {
  const mockUser = { id: "user-1", name: "Test User" };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST", () => {
    it("should return 401 for unauthenticated requests", async () => {
      (auth as jest.Mock).mockResolvedValue(null);
      const req = new Request("http://localhost/api/insights/check-in", {
        method: "POST",
        body: JSON.stringify({ moodScore: 5, energyLevel: 5 }),
      });
      const res = await POST(req);
      expect(res.status).toBe(401);
    });

    it("should validate moodScore range (1-10)", async () => {
      (auth as jest.Mock).mockResolvedValue({ user: mockUser });
      const req = new Request("http://localhost/api/insights/check-in", {
        method: "POST",
        body: JSON.stringify({ moodScore: 15, energyLevel: 5 }), // Invalid moodScore
      });
      const res = await POST(req);
      expect(res.status).toBe(400);
    });

    it("should create a check-in for an authenticated user", async () => {
      (auth as jest.Mock).mockResolvedValue({ user: mockUser });
      
      const mockCheckIn = { id: "checkin-1", moodScore: 8 };
      (prisma.moodCheckIn.create as jest.Mock).mockResolvedValue(mockCheckIn);
      (prisma.streak.findUnique as jest.Mock).mockResolvedValue(null); // No streak update for simplicity

      const req = new Request("http://localhost/api/insights/check-in", {
        method: "POST",
        body: JSON.stringify({ moodScore: 8, energyLevel: 7, triggers: "Study" }),
      });
      const res = await POST(req);
      const data = await res.json();

      expect(res.status).toBe(201);
      expect(data).toEqual(mockCheckIn);
      expect(prisma.moodCheckIn.create).toHaveBeenCalled();
    });
  });
});
