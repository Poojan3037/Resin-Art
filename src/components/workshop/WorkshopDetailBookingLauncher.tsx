"use client";

import { useState } from "react";
import Button from "@/components/Button";
import { Workshop } from "@/types/workshop";
import WorkshopBookingDialog from "./WorkshopBookingDialog";

type PropsType = {
  workshop: Workshop;
};

const WorkshopDetailBookingLauncher = ({ workshop }: PropsType) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {isOpen && (
        <WorkshopBookingDialog
          workshop={workshop}
          onClose={() => setIsOpen(false)}
        />
      )}
      <Button
        variant="primary"
        fullWidth
        className="font-extrabold"
        onClick={() => setIsOpen(true)}
        disabled={workshop.availableSeats === 0}
      >
        {workshop.availableSeats === 0 ? "Sold Out" : "Book Now"}
      </Button>
    </>
  );
};

export default WorkshopDetailBookingLauncher;
