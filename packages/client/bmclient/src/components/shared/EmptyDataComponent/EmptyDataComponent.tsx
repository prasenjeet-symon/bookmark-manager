import "./EmptyDataComponent.css"; // Import CSS file for styling

export default function EmptyDataComponent({ description, img, title }: { img: string; title: string; description: string | null }) {
  return (
    <section className="empty-data-component">
      <img src={img} alt="Empty Data" className="big-image" />
      <h2 className="title text-foreground">{title}</h2>
      <p className="description text-neutral-500">{description}</p>
    </section>
  );
}
