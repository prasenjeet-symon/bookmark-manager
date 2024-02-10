import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { TabCategory } from "@/datasource/schema";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { UpdateCategoryComponentController } from "./UpdateCategoryComponent.component";
import './UpdateCategoryComponent.css';

const categorySchema = z.object({
  categoryName: z.string().min(1, { message: "Category name is required." }).max(50, { message: "Category name is too long." }),
});

export default function UpdateCategoryComponent({ category }: { category: TabCategory }) {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      categoryName: category.name,
    },
  });

  const onSubmit = (values: z.infer<typeof categorySchema>) => {
    const categoryName = values.categoryName;
    category.name = categoryName;
    const controller = new UpdateCategoryComponentController();
    controller.updateCategory(category);
    setIsOpen(false);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <FontAwesomeIcon className="hover:cursor-pointer" size="sm" onClick={() => setIsOpen(true)} icon={faEdit} />
        </DialogTrigger>
        <DialogContent onInteractOutside={() => setIsOpen(false)}>
          <DialogHeader>
            <DialogTitle>Update category</DialogTitle>
            <DialogDescription>Fill out the form to update category. Category lets you organize related links in one place.</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="update-category-component-style">
              <div className="update-category-form">
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
              <div className="update-category-footer">
                <Button type="submit">Update Category</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
