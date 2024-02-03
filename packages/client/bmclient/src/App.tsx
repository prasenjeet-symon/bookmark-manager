import { useEffect } from "react";
import { Button } from "./components/ui/button";

export default function App() {
  useEffect(() => {}, []); // Empty dependency array means the effect runs once

  return (
    <h1 className="text-3xl font-bold">
      Hello world!
      <Button>Click me</Button>
    </h1>
  );
}
