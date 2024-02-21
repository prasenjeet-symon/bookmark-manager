import EmptyDataComponent from "@/components/shared/EmptyDataComponent/EmptyDataComponent";
import { Input } from "@/components/ui/input";
import { Link, TabCategory, UserTab } from "@/datasource/schema";
import { faClose, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import searchNoResult from "../../../../../assets/search.png";
import { SearchComponentController } from "./SearchComponent.component";
import "./SearchComponent.css";
import SearchCategoryItemComponent from "./components/SearchCategoryItemComponent/SearchCategoryItemComponent";

interface SearchResult {
  links: Link[];
  tab: UserTab | null;
  category: TabCategory | null;
}

export default function SearchComponent({ onClose }: { onClose: () => void }) {
  const [links, setLinks] = useState<SearchResult[]>([]);

  useEffect(() => {
    const subscription = new SearchComponentController().getSearchedLinks().subscribe((model) => {
      setLinks(model);
    });

    return () => subscription?.unsubscribe();
  }, []);

  const search = (value: string) => {
    new SearchComponentController().search(value);
  };

  return (
    <>
      <section className="search-component-style">
        {/* Search input */}
        <div className="search-input-holder">
          <div>
            <FontAwesomeIcon onClick={onClose} className="mr-3" icon={faClose} />
          </div>
          <div>
            <Input className="w-full" onChange={(e) => search(e.target.value)} type="text" placeholder="Search" />
          </div>
          <div>
            <FontAwesomeIcon className="ml-3" icon={faSearch} />
          </div>
        </div>

        {/* Empty result */}
        {links.length === 0 ? <EmptyDataComponent title="No results found" description="Try searching for something else" img={searchNoResult} /> : null}

        {/* Search results */}
        {/* {links.map((p) => (
          <SearchCategoryItemComponent links={p.links} category={p.category} tab={p.tab} />
        ))} */}
        <ThreeColumnLayout result={links} />
      </section>
    </>
  );
}

const ThreeColumnLayout: React.FC<{ result: SearchResult[] }> = ({ result }) => {
  const [firstColumnItems, setFirstColumnItems] = useState<SearchResult[]>([]);
  const [secondColumnItems, setSecondColumnItems] = useState<SearchResult[]>([]);
  const [thirdColumnItems, setThirdColumnItems] = useState<SearchResult[]>([]);

  const fillColumns = () => {
    // Clear the columns
    setFirstColumnItems([]);
    setSecondColumnItems([]);
    setThirdColumnItems([]);

    // Calculate the number of items per column
    const itemsPerColumn = Math.ceil(result.length / 3);

    // Fill the columns with items
    result.forEach((item, index) => {
      if (index < itemsPerColumn) {
        setFirstColumnItems((prevItems) => [...prevItems, item]);
      } else if (index < 2 * itemsPerColumn) {
        setSecondColumnItems((prevItems) => [...prevItems, item]);
      } else {
        setThirdColumnItems((prevItems) => [...prevItems, item]);
      }
    });
  };

  useEffect(() => {
    fillColumns();
  }, [result]);

  return (
    <div className="three-column-layout-style search-three-col-layout">
      <div>
        {firstColumnItems.map((p) => (
          <SearchCategoryItemComponent links={p.links} category={p.category} tab={p.tab} />
        ))}
      </div>
      <div>
        {secondColumnItems.map((p) => (
          <SearchCategoryItemComponent links={p.links} category={p.category} tab={p.tab} />
        ))}
      </div>
      <div>
        {thirdColumnItems.map((p) => (
          <SearchCategoryItemComponent links={p.links} category={p.category} tab={p.tab} />
        ))}
      </div>
    </div>
  );
};
