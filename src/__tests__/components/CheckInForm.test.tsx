import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CheckInForm from "@/components/dashboard/CheckInForm";

// Mock fetch
global.fetch = jest.fn();

describe("CheckInForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders step 1 initially", () => {
    render(<CheckInForm />);
    expect(screen.getByText(/Step 1: Mood & Energy/i)).toBeInTheDocument();
  });

  it("advances to step 2 when Next is clicked", async () => {
    render(<CheckInForm />);
    const nextButton = screen.getByText(/Next/i);
    fireEvent.click(nextButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Step 2: Triggers/i)).toBeInTheDocument();
    });
  });

  it("submits the form and calls API", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true })
    });

    render(<CheckInForm />);
    
    // Go to step 2
    fireEvent.click(screen.getByText(/Next/i));
    
    // Wait for step 2 to render
    await waitFor(() => {
      expect(screen.getByText(/Finish Check-in/i)).toBeInTheDocument();
    });

    // Select a trigger
    fireEvent.click(screen.getByText("Sleep"));

    // Submit
    const submitButton = screen.getByText(/Finish Check-in/i);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/insights/check-in", expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: expect.any(String), // We could be more specific, but any string is fine for now
      }));
    });

    // Check success state
    await waitFor(() => {
      expect(screen.getByText(/Logged!/i)).toBeInTheDocument();
    });
  });

  it("shows error state on API failure", async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error("Network Error"));

    render(<CheckInForm />);
    
    // Go to step 2
    fireEvent.click(screen.getByText(/Next/i));
    
    // Wait for step 2 to render
    await waitFor(() => {
      expect(screen.getByText(/Finish Check-in/i)).toBeInTheDocument();
    });

    // Submit
    fireEvent.click(screen.getByText(/Finish Check-in/i));

    // Check error message
    await waitFor(() => {
      expect(screen.getByText(/Network Error/i)).toBeInTheDocument();
    });
  });
});
