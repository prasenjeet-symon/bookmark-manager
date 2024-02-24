import DashboardHeader from "@/components/shared/DashboardHeader/DashboardHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link, ModelStoreStatus } from "@/datasource/schema";
import { faSquare, faSquareCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import SelectionHeaderComponent from "./Components/SelectionHeaderComponent/SelectionHeaderComponent";
import { MyBookmarkPageController } from "./MyBookmarkPage.component";
import "./MyBookmarkPage.css";
import BackButtonComponent from "@/components/shared/BackButtonComponent/BackButtonComponent";
import EmptyDataComponent from "@/components/shared/EmptyDataComponent/EmptyDataComponent";
import NoLinksImage from '../../../assets/catalog.png';
import HeaderMobileDashboard from "@/components/shared/MobileHeaderDashboardComponent/MobileHeaderDashboardComponent";

export default function MyBookmarkPage() {
  const [links, setLinks] = useState<Link[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLinks, setSelectedLinks] = useState<Link[]>([]);

  useEffect(() => {
    const subscription = new MyBookmarkPageController().getCatalogLinks().subscribe((store) => {
      setIsLoading(store.status === ModelStoreStatus.BOOTING ? true : false);
      setLinks(store.data);
      setSelectedLinks(store.data.filter((link) => link.selected));
    });

    return () => subscription.unsubscribe();
  }, []);

  // Toggle link selection
  const toggleLink = (link: Link) => {
    new MyBookmarkPageController().toggleLinkSelection(link);
  };

  return (
    <>
      <DashboardHeader />
      <HeaderMobileDashboard />
      <section className="my-bookmark-page-style page-content">
        {/* Back button */}
        <BackButtonComponent/>

        {/* Catalog selection header */}
        {selectedLinks.length !== 0 ? <SelectionHeaderComponent links={selectedLinks} clear={() => new MyBookmarkPageController().clearSelection()} /> : null}

        {/* Search Input */}
        <div style={{ top: selectedLinks.length !== 0 ? "50px" : "0px"  }} className="search-input flex w-full items-center bg-slate-950">
          <Input onChange={(e) => new MyBookmarkPageController().searchCatalog(e.target.value)} className="w-full" type="text" placeholder="Search..." />
          <Button type="submit">Search</Button>
        </div>

        {/* empty component */}
        {
          !isLoading && links.length === 0 ? <EmptyDataComponent title="No links found" description="Looks like you don't have any bookmark in your catalog. Please import some" img={NoLinksImage} /> : null
        }

        {/* List all links */}
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <div className="catalog-links-holder">
            {links.map((link) => (
              <Card key={link.identifier} className="catalog-link-card">
                <div>
                  <div>
                    <img src={link.icon || ""} alt="" />
                  </div>
                  <div>
                    <div>{link.title}</div>
                    <div className="text-slate-400">{link.url.slice(0, 40)}...</div>
                    <div className="text-slate-400">
                      {link.tags.map((tag) => (
                        <Badge className="mr-2" variant="default">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div onClick={() => toggleLink(link)}>
                  {!link.selected ? <FontAwesomeIcon icon={faSquare} /> : null}
                  {link.selected ? <FontAwesomeIcon icon={faSquareCheck} /> : null}
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
