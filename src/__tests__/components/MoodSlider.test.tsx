import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import MoodSlider from "@/components/dashboard/MoodSlider";

describe("MoodSlider", () => {
  const mockOnChange = jest.fn();

  it("renders with default value", () => {
    render(<MoodSlider value={5} onChange={mockOnChange} />);
    expect(screen.getByLabelText(/Mood Score/i)).toHaveValue("5");
  });

  it("calls onChange when slider value changes", () => {
    render(<MoodSlider value={5} onChange={mockOnChange} />);
    const slider = screen.getByLabelText(/Mood Score/i);
    fireEvent.change(slider, { target: { value: "8" } });
    expect(mockOnChange).toHaveBeenCalledWith(8);
  });

  it("has correct accessibility attributes", () => {
    render(<MoodSlider value={7} onChange={mockOnChange} />);
    const slider = screen.getByLabelText(/Mood Score/i);
    expect(slider).toHaveAttribute("aria-valuemin", "1");
    expect(slider).toHaveAttribute("aria-valuemax", "10");
    expect(slider).toHaveAttribute("aria-valuenow", "7");
  });
});
