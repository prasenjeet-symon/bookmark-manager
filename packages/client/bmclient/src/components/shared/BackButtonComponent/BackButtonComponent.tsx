import { Button } from "@/components/ui/button";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import "./BackButtonComponent.css";

export default function BackButtonComponent() {
  const navigate = useNavigate();

  return (
    <Button variant="outline" className="back-button mb-5" onClick={() => navigate(-1)}>
      <FontAwesomeIcon className="mr-5" icon={faArrowLeft} /> Go Back
    </Button>
  );
}
