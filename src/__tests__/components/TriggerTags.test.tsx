import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import TriggerTags from "@/components/dashboard/TriggerTags";

describe("TriggerTags", () => {
  const mockOnChange = jest.fn();
  const defaultTags = [
    "Study Stress", "Sleep", "Health", "Social", "Finance", 
    "Family", "Exams", "Personal", "Time Management", "Other"
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all 10 default tags", () => {
    render(<TriggerTags selectedTags={[]} onChange={mockOnChange} />);
    defaultTags.forEach(tag => {
      expect(screen.getByText(tag)).toBeInTheDocument();
    });
  });

  it("selects a tag when clicked", () => {
    render(<TriggerTags selectedTags={[]} onChange={mockOnChange} />);
    const tagButton = screen.getByText("Study Stress");
    fireEvent.click(tagButton);
    expect(mockOnChange).toHaveBeenCalledWith(["Study Stress"]);
  });

  it("deselects a tag when clicked again", () => {
    render(<TriggerTags selectedTags={["Sleep"]} onChange={mockOnChange} />);
    const tagButton = screen.getByText("Sleep");
    fireEvent.click(tagButton);
    expect(mockOnChange).toHaveBeenCalledWith([]);
  });

  it("enforces max 5 tags selection", () => {
    const selected = ["Study Stress", "Sleep", "Health", "Social", "Finance"];
    render(<TriggerTags selectedTags={selected} onChange={mockOnChange} />);
    
    // Try to select a 6th tag
    const tagButton = screen.getByText("Exams");
    fireEvent.click(tagButton);
    
    expect(mockOnChange).not.toHaveBeenCalled();
  });

  it("has correct aria-pressed attributes based on selection", () => {
    render(<TriggerTags selectedTags={["Health"]} onChange={mockOnChange} />);
    
    expect(screen.getByText("Health")).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText("Sleep")).toHaveAttribute("aria-pressed", "false");
  });
});
