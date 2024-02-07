import { UserTab } from "@/datasource/schema";
import "./TabSectionComponent.css";

export default function TabSectionComponent({ tab }: { tab: UserTab }) {
  return (
    <>
      <section className="tab-content-item">
        <div className="mt-60">
          <h1> {tab.name}</h1>
        </div>
      </section>
    </>
  );
}
