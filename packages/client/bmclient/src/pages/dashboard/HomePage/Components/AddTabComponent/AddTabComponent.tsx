import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ApplicationToken } from "@/datasource/http/http.manager";
import { UserTab } from "@/datasource/schema";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { v4 } from "uuid";
import { z } from "zod";
import { AddTabComponentController } from "./AddTabComponent.controller";
import "./AddTabComponent.css";
import { getRandomIntId } from "@/datasource/utils";

const formAddTabSchema = z.object({
  tabName: z.string().min(1, { message: "Tab name is required." }).max(50, { message: "Tab name is too long." }),
});

export default function AddTabComponent() {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<z.infer<typeof formAddTabSchema>>({
    resolver: zodResolver(formAddTabSchema),
    defaultValues: {
      tabName: "",
    },
  });

  function onSubmit(values: z.infer<typeof formAddTabSchema>) {
    const tabName = values.tabName;
    const controller = new AddTabComponentController();
    const userId = ApplicationToken.getInstance().getUserId;
    if (!userId) {
      return;
    }

    const tab: UserTab = new UserTab(getRandomIntId(), v4(), userId, tabName, null, +new Date(), new Date(), new Date(), false);
    controller.addTab(tab);
    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <FontAwesomeIcon onClick={() => setIsOpen(true)} icon={faAdd} />
      </DialogTrigger>
      <DialogContent className="add-tab-dialog" onInteractOutside={() => setIsOpen(false)}>
        <DialogHeader>
          <DialogTitle>Add a new tab</DialogTitle>
          <DialogDescription>Fill out the form to add a new tab. Tab makes it easy to organize your bookmarks.</DialogDescription>
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
              <Button type="submit">Add tab</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
