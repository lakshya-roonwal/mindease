import { calculateNewStreak } from "@/lib/streak";

describe("Streak Logic", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should return current streak if updated today", () => {
    const today = new Date("2026-06-06T10:00:00Z");
    jest.setSystemTime(today);
    
    const lastUpdated = new Date("2026-06-06T08:00:00Z");
    expect(calculateNewStreak(lastUpdated, 5)).toBe(5);
  });

  it("should increment streak if updated yesterday", () => {
    const today = new Date("2026-06-06T10:00:00Z");
    jest.setSystemTime(today);
    
    const lastUpdated = new Date("2026-06-05T10:00:00Z");
    expect(calculateNewStreak(lastUpdated, 5)).toBe(6);
  });

  it("should reset streak to 1 if more than one day has passed (broken streak)", () => {
    const today = new Date("2026-06-06T10:00:00Z");
    jest.setSystemTime(today);
    
    const lastUpdated = new Date("2026-06-04T10:00:00Z");
    expect(calculateNewStreak(lastUpdated, 5)).toBe(1);
  });

  it("should handle leap years correctly", () => {
    const today = new Date("2028-03-01T10:00:00Z");
    jest.setSystemTime(today);
    
    const lastUpdated = new Date("2028-02-29T10:00:00Z");
    expect(calculateNewStreak(lastUpdated, 10)).toBe(11);
  });

  it("should handle month boundaries correctly", () => {
    const today = new Date("2026-07-01T10:00:00Z");
    jest.setSystemTime(today);
    
    const lastUpdated = new Date("2026-06-30T10:00:00Z");
    expect(calculateNewStreak(lastUpdated, 30)).toBe(31);
  });
});
