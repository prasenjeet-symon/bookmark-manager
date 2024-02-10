import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { TabCategory } from "@/datasource/schema";
import { getRandomIntId } from "@/datasource/utils";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { v4 } from "uuid";
import { z } from "zod";
import { AddCategoryComponentController } from "./AddCategoryComponent.controller";
import "./AddCategoryComponent.css";

const categorySchema = z.object({
  categoryName: z.string().min(1, { message: "Category name is required." }).max(50, { message: "Category name is too long." }),
});

export default function AddCategoryComponent({ tabIdentifier }: { tabIdentifier: string }) {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      categoryName: "",
    },
  });

  const onSubmit = (values: z.infer<typeof categorySchema>) => {
    const categoryName = values.categoryName;
    const category = new TabCategory(getRandomIntId(), v4(), categoryName, +new Date(), null, null, tabIdentifier, new Date(), new Date(), false);
    const controller = new AddCategoryComponentController();
    controller.addCategory(category);
    setIsOpen(false);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Card onClick={() => setIsOpen(true)} className="add-category-item-component-style">
            {/* Plus icon to add new category */}
            <FontAwesomeIcon icon={faPlus} size="2x" />

            {/* A text  */}
            <div>Add new category</div>
          </Card>
        </DialogTrigger>
        <DialogContent onInteractOutside={() => setIsOpen(false)}>
          <DialogHeader>
            <DialogTitle>Add a category</DialogTitle>
            <DialogDescription>Fill out the form to add a new category. Category lets you organize related links in one place.</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="add-category-form">
                <FormField
                  control={form.control}
                  name="categoryName"
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
              <div className="add-category-footer">
                <Button type="submit">Add Category</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
