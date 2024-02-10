import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "@/datasource/schema";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { UpdateLinkComponentController } from "./UpdateLinkComponent.component";
import "./UpdateLinkComponent.css";

const linkSchema = z.object({
  title: z.string().min(1, { message: "Title is required." }).max(500, { message: "Title is too long." }),
  url: z.string().min(1, { message: "URL is required." }).max(500, { message: "URL is too long." }),
  notes: z.string().max(500, { message: "Notes is too long." }),
  tagString: z.string().max(2500, { message: "Tag string is too long." }),
});

export default function UpdateLinkComponent({ link, tabIdentifier }: { link: Link; tabIdentifier: string }) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const linkForm = useForm<z.infer<typeof linkSchema>>({
    resolver: zodResolver(linkSchema),
    defaultValues: {
      title: link.title || "",
      url: link.url,
      notes: link.notes || "",
      tagString: link.tags.join(", "),
    },
  });

  const onSubmit = (values: z.infer<typeof linkSchema>) => {
    const title = values.title;
    const url = values.url;
    const notes = values.notes;
    const tagString = values.tagString;
    const tags = tagString
      .split(",")
      .map((tag) => {
        return tag.trim();
      })
      .filter((tag) => {
        return tag !== "";
      });

    link.title = title;
    link.url = url;
    link.notes = notes;
    link.tags = tags;

    const controller = new UpdateLinkComponentController();
    controller.updateLink(link, tabIdentifier);
    setIsOpen(false);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <div onClick={() => setIsOpen(true)} className="flex justify-between p-2 text-base">
            Update link <FontAwesomeIcon className="ml-3" size="sm" icon={faEdit} />
          </div>
        </DialogTrigger>
        <DialogContent onInteractOutside={() => setIsOpen(false)}>
          <DialogHeader>
            <DialogTitle>Update link</DialogTitle>
            <DialogDescription>Fill out the form to update link.</DialogDescription>
          </DialogHeader>
          <Form {...linkForm}>
            <form onSubmit={linkForm.handleSubmit(onSubmit)} className="update-link-component-style">
              <div className="update-link-form">
                {/* Title */}
                <FormField
                  control={linkForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input type="text" placeholder="Title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <br />

                {/* URL */}
                <FormField
                  control={linkForm.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input type="text" placeholder="URL" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <br />

                {/* Notes */}
                <FormField
                  control={linkForm.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea itemType="text" placeholder="Write your notes..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <br />

                {/* Tag */}
                <FormField
                  control={linkForm.control}
                  name="tagString"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea itemType="text" placeholder="Write your tags separated by comma" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <br />
              </div>
              <div className="update-link-footer">
                <Button type="submit">Update Link</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
