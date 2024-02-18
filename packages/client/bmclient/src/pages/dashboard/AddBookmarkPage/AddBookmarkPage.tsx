import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ErrorManager } from "@/datasource/http/error.manager";
import { ApplicationToken } from "@/datasource/http/http.manager";
import { Link, TabCategory, UserTab } from "@/datasource/schema";
import { getRandomIntId } from "@/datasource/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { v4 } from "uuid";
import { z } from "zod";
import DropdownCategoryComponent from "../HomePage/Components/AddLinkComponent/components/DropdownCategoryComponent/DropdownCategoryComponent";
import DropdownTabComponent from "../HomePage/Components/AddLinkComponent/components/DropdownTabComponent/DropdownTabComponent";
import { AddBookmarkPageController } from "./AddBookmarkPage.component";
import "./AddBookmarkPage.css";
import LinkAddedComponent from "./Components/LinkAddedComponent/LinkAddedComponent";

const addBookmarkSchema = z.object({
  title: z.string().min(1, { message: "Title is required." }).max(500, { message: "Title is too long." }),
  url: z.string().min(1, { message: "URL is required." }).max(5000, { message: "URL is too long." }),
  notes: z.string().max(500, { message: "Notes is too long." }),
  tagString: z.string().max(2500, { message: "Tag string is too long." }),
});

export default function AddBookmarkPage() {
  const [tab, setTab] = useState<UserTab | null>(null);
  const [category, setCategory] = useState<TabCategory | null>(null);
  const [isAdded, setIsAdded] = useState<boolean>(false);

  const linkForm = useForm<z.infer<typeof addBookmarkSchema>>({
    resolver: zodResolver(addBookmarkSchema),
    defaultValues: {
      title: "",
      url: "",
      notes: "",
      tagString: "",
    },
  });

  const onSubmit = (values: z.infer<typeof addBookmarkSchema>) => {
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

    if (!tab) {
      ErrorManager.getInstance().dispatch("Please choose tab to continue");
      return;
    }

    // If there is no category return
    if (!category) {
      ErrorManager.getInstance().dispatch("Please choose category to continue");
      return;
    }

    const userId = ApplicationToken.getInstance().getUserId;
    if (!userId) {
      ErrorManager.getInstance().dispatch("Please login to continue");
      return;
    }

    const link = new Link(getRandomIntId(), v4(), title, url, getRandomIntId(), null, notes, null, category.identifier, userId, new Date(), new Date(), false, tags);
    const controller = new AddBookmarkPageController();
    controller.addLink(link, tab.identifier);
    setIsAdded(true);
  };

    // return <Button> <a href='javascript:(function(){function openPopup(url, title, width, height) {var left = (screen.width - width) / 2;var top = (screen.height - height) / 3;var popup = window.open(url, title, "width=" + width + ",height=" + height + ",left=" + left + ",top=" + top);return popup;}var url = "http://localhost:5173/dashboard/add-bookmark";var title = "Add to Linkify";var width = screen.width * 0.5;var height = screen.height * 0.6;openPopup(url, title, width, height);})();
    // '>Add to Linkify</a> </Button>

  if (isAdded) {
    return (
      <LinkAddedComponent
        addMore={() => {
          // Clear prev selection
          setTab(null);
          setCategory(null);
          linkForm.reset();
          setIsAdded(false);
        }}
      />
    );
  }

  return (
    <>
      <section className="add-bookmark-page-style page-content">
        {/*  A header */}
        <h1 className="text-3xl">Add bookmark</h1>
        <p className="text-base text-slate-200">Add a new bookmark to your desired tab and category. Fill the form below to continue.</p>

        {/* Form */}
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

              {/* Tab chooser */}
              <DropdownTabComponent
                tabSelected={(tab) => {
                  setTab(tab);
                }}
              />

              {/* Category chooser */}
              {tab ? <DropdownCategoryComponent tab={tab} selectedCategory={(category) => setCategory(category)} /> : null}

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
      </section>
    </>
  );
}
