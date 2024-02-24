import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ApplicationToken } from "@/datasource/http/http.manager";
import { Link } from "@/datasource/schema";
import { getRandomIntId } from "@/datasource/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { v4 } from "uuid";
import { z } from "zod";
import { AddLinkComponentController } from "./AddLinkComponent.controller";
import "./AddLinkComponent.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink } from "@fortawesome/free-solid-svg-icons";
import DropdownTabComponent from "./components/DropdownTabComponent/DropdownTabComponent";

const linkSchema = z.object({
  title: z.string().min(1, { message: "Title is required." }).max(500, { message: "Title is too long." }),
  url: z.string().min(1, { message: "URL is required." }).max(500, { message: "URL is too long." }),
  notes: z.string().max(500, { message: "Notes is too long." }),
  tagString: z.string().max(2500, { message: "Tag string is too long." }),
});

export default function AddLinkComponent({ tabIdentifier, categoryIdentifier }: { tabIdentifier: string; categoryIdentifier: string }) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const linkForm = useForm<z.infer<typeof linkSchema>>({
    resolver: zodResolver(linkSchema),
    defaultValues: {
      title: "",
      url: "",
      notes: "",
      tagString: "",
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

    const userId = ApplicationToken.getInstance().getUserId;
    if (!userId) {
      return;
    }

    const linkFinal = url.includes("https://") ? url : "https://" + url;

    const controller = new AddLinkComponentController();
    const link = new Link(getRandomIntId(), v4(), title, linkFinal, getRandomIntId(), null, notes, null, categoryIdentifier, userId, new Date(), new Date(), false, tags);
    controller.addLink(link, tabIdentifier);
    setIsOpen(false);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <div onClick={() => setIsOpen(true)} className="text-base hover:cursor-pointer p-2 font-medium flex items-center">
             <span className="mr-2"><FontAwesomeIcon icon={faLink} /></span>
             <span>Add a bookmark</span>
          </div>
        </DialogTrigger>
        <DialogContent onInteractOutside={() => setIsOpen(false)}>
          <DialogHeader>
            <DialogTitle>Add a link</DialogTitle>
            <DialogDescription>Fill out the form to add a new link.</DialogDescription>
          </DialogHeader>
          <Form {...linkForm}>
            <form onSubmit={linkForm.handleSubmit(onSubmit)} className="add-link-component-style">
              <div className="add-link-form">
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
              <div className="add-link-footer">
                <Button type="submit">Add Link</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
