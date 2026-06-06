import "@testing-library/jest-dom";

// Mock Prisma
jest.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    streak: {
      findUnique: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
    },
    moodCheckIn: {
      findMany: jest.fn(),
      create: jest.fn(),
      findFirst: jest.fn(),
    },
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

// Mock NextAuth
jest.mock("@/lib/auth", () => ({
  auth: jest.fn(),
}));

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    refresh: jest.fn(),
    back: jest.fn(),
  })),
  usePathname: jest.fn(() => "/dashboard"),
  redirect: jest.fn(),
}));

// Mock Google Generative AI
jest.mock("@google/generative-ai", () => {
  return {
    GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
      getGenerativeModel: jest.fn().mockReturnValue({
        generateContent: jest.fn().mockResolvedValue({
          response: { text: () => "Mock response" }
        }),
        generateContentStream: jest.fn().mockResolvedValue({
          stream: (async function* () {
            yield { text: () => "Mock chunk" };
          })()
        }),
      }),
    })),
  };
});

// Polyfill Request/Response for JSDOM
import { TextEncoder, TextDecoder } from "util";
global.TextEncoder = TextEncoder as any;
global.TextDecoder = TextDecoder as any;

if (typeof Request === "undefined") {
  class DummyRequest {
    url: string;
    method: string;
    _body: any;
    constructor(url: string, options: any = {}) {
      this.url = url;
      this.method = options.method || "GET";
      this._body = options.body;
    }
    async json() {
      if (!this._body) throw new Error("No body");
      return JSON.parse(this._body);
    }
  }
  global.Request = DummyRequest as any;

  class DummyResponse {
    _body: any;
    status: number;
    constructor(body: any, options: any = {}) {
      this._body = body;
      this.status = options.status || 200;
    }
    async json() {
      return JSON.parse(this._body);
    }
  }
  global.Response = DummyResponse as any;
  
  global.Headers = class Headers {} as any;
}


// Mock NextResponse
jest.mock("next/server", () => {
  return {
    NextResponse: {
      json: (body: any, init?: any) => {
        return new Response(JSON.stringify(body), {
          status: init?.status || 200,
          headers: { "Content-Type": "application/json" },
        });
      },
      redirect: jest.fn(),
    },
  };
});

