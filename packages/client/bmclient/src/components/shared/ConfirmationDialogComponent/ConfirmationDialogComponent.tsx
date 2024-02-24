import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import "./ConfirmationDialogComponent.css";

export default function ConfirmationDialogComponent({ confirm, icon, title, description }: { confirm: () => void; icon: IconDefinition; title: string; description: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <FontAwesomeIcon
            onClick={(e) => {
              e.preventDefault();
              setIsOpen(true);
            }}
            size="sm"
            icon={icon}
            className="mx-1 cursor-pointer"
          />
        </DialogTrigger>
        <DialogContent onInteractOutside={() => setIsOpen(false)}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>

            <div className="flex justify-end mt-5 pt-5">
              {/* Cancel button */}
              <Button className="mr-5" onClick={() => setIsOpen(false)} variant="ghost">
                Cancel
              </Button>
              {/* Confirm button */}
              <Button
                onClick={() => {
                  confirm();
                  setIsOpen(false);
                }}
              >
                Confirm
              </Button>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
