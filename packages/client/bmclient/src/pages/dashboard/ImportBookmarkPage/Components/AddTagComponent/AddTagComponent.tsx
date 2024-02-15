import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { createRef, useState } from "react";
import "./AddTagComponent.css";

export default function AddTagComponent({ tagsInput }: { tagsInput: (file: File, tags: string[]) => void }) {
  const [isOpenInner, setIsOpenInner] = useState<boolean>(false);
  const refInput = createRef<HTMLTextAreaElement>();
  const [file, setFile] = useState<File>();

  return (
    <Dialog
      open={isOpenInner}
      onOpenChange={(e) => {
        file ? setIsOpenInner(e) : null;
      }}
    >
      <DialogTrigger asChild>
        {/* A button to upload a file */}
        <div>
          <input
            type="file"
            onChange={(e: any) => {
              setFile(e.target.files[0]);
              setIsOpenInner(true);
            }}
            hidden
            id="file-upload-import-bookmark"
          />
          <Button onClick={() => document.getElementById("file-upload-import-bookmark")?.click()}>Select Bookmark</Button>
        </div>
      </DialogTrigger>

      <DialogContent onInteractOutside={() => setIsOpenInner(false)}>
        <DialogHeader>
          <DialogTitle>Add tags</DialogTitle>
          <DialogDescription>Please enter the tags separated by comma.</DialogDescription>
        </DialogHeader>
        <Textarea ref={refInput} placeholder="tag1, tag2, tag3" />
        <div className="catalog-add-tag-footer">
          <Button
            onClick={() => {
              if (refInput.current && file) {
                tagsInput(
                  file,
                  refInput.current.value.split(",").map((tag) => tag.trim())
                );
              }

              setIsOpenInner(false);
            }}
            variant="default"
          >
            Import
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
