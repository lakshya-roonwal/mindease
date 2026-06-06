import { calculateNewStreak } from "../lib/streak";

describe("calculateNewStreak", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should return same streak if updated today", () => {
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

  it("should reset streak to 1 if more than one day has passed", () => {
    const today = new Date("2026-06-06T10:00:00Z");
    jest.setSystemTime(today);
    
    const lastUpdated = new Date("2026-06-04T10:00:00Z");
    expect(calculateNewStreak(lastUpdated, 5)).toBe(1);
  });
});
