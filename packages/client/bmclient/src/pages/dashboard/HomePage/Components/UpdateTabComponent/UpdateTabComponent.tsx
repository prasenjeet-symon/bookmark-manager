import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UserTab } from "@/datasource/schema";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { UpdateTabComponentController } from "./UpdateTabComponent.controller";
import "./UpdateTabComponent.css";

const formUpdateTabSchema = z.object({
  tabName: z.string().min(1, { message: "Tab name is required." }).max(50, { message: "Tab name is too long." }),
});

export default function UpdateTabComponent({ tab }: { tab: UserTab }) {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<z.infer<typeof formUpdateTabSchema>>({
    resolver: zodResolver(formUpdateTabSchema),
    defaultValues: {
      tabName: tab.name,
    },
  });

  function onSubmit(values: z.infer<typeof formUpdateTabSchema>) {
    const tabName = values.tabName;
    tab.name = tabName;

    const controller = new UpdateTabComponentController();
    controller.updateTab(tab);
    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
      <FontAwesomeIcon onClick={() => setIsOpen(true)} className="ml-3" size="sm" icon={faEdit} />
      </DialogTrigger>
      <DialogContent className="add-tab-dialog" onInteractOutside={() => setIsOpen(false)}>
        <DialogHeader>
          <DialogTitle>Update tab</DialogTitle>
          <DialogDescription>Fill out the form to update tab. Tab makes it easy to organize your bookmarks.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="add-tab-form">
              <FormField
                control={form.control}
                name="tabName"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input type="text" placeholder="Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <br />
            </div>
            <div className="add-tab-form-footer">
              <Button type="submit">Update tab</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
