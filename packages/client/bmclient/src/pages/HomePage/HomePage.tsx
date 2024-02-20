import Header from "@/components/shared/Header/Header";
import { faArrowAltCircleRight, faCoffee, faLaptop, faMobilePhone, faStar, faTablet } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import addBookmarkSection from "../../assets/Add bookmark section.png";
import samsungLogo from "../../assets/SAMSUNG.png";
import braveLogo from "../../assets/brave.png";
import chromeLogo from "../../assets/chrome.png";
import dashboardIntroduction from "../../assets/dashboard_introduction.png";
import edgeLogo from "../../assets/edge.png";
import firefoxLogo from "../../assets/firefox.png";
import freeFromLinks from "../../assets/free_from_links.jpg";
import operaLogo from "../../assets/opera.png";
import safariLogo from "../../assets/safari.png";
import stuckWithLinksImage from "../../assets/stuck_with_link.jpg";
import vivaldiLogo from "../../assets/vivaldi.png";
import "./HomePage.css";

export default function HomePage() {
  const router = useNavigate();

  // Nav to signup
  const goToSignup = () => {
    router("/auth/sign-up", { replace: true });
  };

  return (
    <section className="homepage-style">
      <Header />
      {/* Hero section */}
      <section className="hero-section">
        <section>
          <div>
            <img src={stuckWithLinksImage} alt="Stuck with links" />
          </div>
          <div>
            <div> Feeling overwhelmed with links? </div>
            <div>
              Are you the ultimate multitasker, juggling multiple browsers, accounts, and bookmarking websites galore? But let's face it, those bookmarks can sometimes feel like a
              mystery hunt. Ever scratch your head, wondering what you bookmarked and where it went? Don't worry, you're in the right spot to conquer that bookmark jungle.
            </div>
            <div>
              <button onClick={goToSignup}>
                Get Started <FontAwesomeIcon className="ml-2 arrow-icon-right" icon={faArrowAltCircleRight} />
              </button>
            </div>
          </div>
        </section>
      </section>

      {/* Free from links section */}
      <section className="free-from-links-section">
        <section>
          <div className="neon">
            Introducing <span className="gradient-text"> Linkify </span>
          </div>
          <div>All in one solution for managing your bookmarks.</div>
          <img src={freeFromLinks} alt=" Free from links" />
        </section>
      </section>

      {/* Dashboard introduction section */}
      <section className="dashboard-introduction-section">
        <section>
          <div>
            <img src={dashboardIntroduction} alt="Dashboard introduction" />{" "}
          </div>
          <div>
            <div>Organize your bookmarks with ease.</div>
            <div>
              Imagine each tab is like a different realm, each glowing with its unique hue. From vibrant red for "Entertainment" to calming blue for "Productivity," your bookmarks
              are neatly tucked away in their designated categories. It's like having your own personalized rainbow of internet gems at your fingertips!
            </div>
          </div>
        </section>
      </section>

      {/* Review section */}
      <section className="review-section">
        <section>
          <div>Don't listen to us. Listen to them.</div>
          <div>
            <div className="review-item">
              <div>
                <div>
                  <img src="https://iv1.lisimg.com/image/27750656/683full-natalia-kaczorowska.jpg" alt="" />
                </div>
                <div>
                  <div>Emma Johnson</div>
                  <div>
                    <FontAwesomeIcon color="#FFD700" icon={faStar} /> <FontAwesomeIcon color="#FFD700" icon={faStar} /> <FontAwesomeIcon color="#FFD700" icon={faStar} />
                    <FontAwesomeIcon color="#FFD700" icon={faStar} /> <FontAwesomeIcon color="#FFD700" icon={faStar} />
                  </div>
                </div>
              </div>
              <div>I've used a few of these services in the past and dropped them due to lack of features. This one is by far the best I've used and at a great price.</div>
            </div>

            <div className="review-item">
              <div>
                <div>
                  <img
                    src="https://media.licdn.com/dms/image/C5603AQFxxh0RoVMglA/profile-displayphoto-shrink_800_800/0/1658115008654?e=2147483647&v=beta&t=0S3wHe-2go4FZKTY6zQeOv0bPxnJcDIgmf8WOy5seMA"
                    alt=""
                  />
                </div>
                <div>
                  <div>Olivia Smith</div>
                  <div>
                    <FontAwesomeIcon color="#FFD700" icon={faStar} /> <FontAwesomeIcon color="#FFD700" icon={faStar} /> <FontAwesomeIcon color="#FFD700" icon={faStar} />
                    <FontAwesomeIcon color="#FFD700" icon={faStar} /> <FontAwesomeIcon color="#FFD700" icon={faStar} />
                  </div>
                </div>
              </div>
              <div>I am ready to pay, sign up, become a life long member, recommend it to all my clients, and act informally as an evangelist.</div>
            </div>

            <div className="review-item">
              <div>
                <div>
                  <img
                    src="https://media.licdn.com/dms/image/D4E03AQGYAaUM1gOkaA/profile-displayphoto-shrink_800_800/0/1665594522909?e=2147483647&v=beta&t=dD1eosDqxkmfI46ldHYskLfVbJ89AkeJv1bJ4-mXpJQ"
                    alt=""
                  />
                </div>
                <div>
                  <div>Ava Williams</div>
                  <div>
                    <FontAwesomeIcon color="#FFD700" icon={faStar} /> <FontAwesomeIcon color="#FFD700" icon={faStar} /> <FontAwesomeIcon color="#FFD700" icon={faStar} />
                    <FontAwesomeIcon color="#FFD700" icon={faStar} /> <FontAwesomeIcon color="#1f2937" icon={faStar} />
                  </div>
                </div>
              </div>
              <div>You truly have a great product. Great concept and so easy to use.</div>
            </div>
          </div>
        </section>
      </section>

      {/* Add bookmark section */}
      <section className="add-bookmark-section">
        <section>
          <div className="neon">
            Add bookmark with <span className="gradient-text"> Single Click </span>
          </div>
          <div>Wherever you roam online, a single click is all it takes to add bookmarks.</div>
          <img src={addBookmarkSection} alt="Add bookmark section" />
        </section>
      </section>

      {/* Import section */}
      <section className="import-section">
        <section>
          <div>Import with ease</div>
          <div>Import all your favorite bookmarks in one click from all the popular browsers out there.</div>
          <div>
            {/* List all browser with icons */}
            <div className="browser-item">
              <img src={chromeLogo} alt="" />
            </div>
            <div className="browser-item">
              <img src={firefoxLogo} alt="" />
            </div>
            <div className="browser-item">
              <img src={edgeLogo} alt="" />
            </div>
            <div className="browser-item">
              <img src={operaLogo} alt="" />
            </div>
            <div className="browser-item">
              <img src={safariLogo} alt="" />
            </div>
            <div className="browser-item">
              <img src={braveLogo} alt="" />
            </div>
            <div className="browser-item">
              <img src={vivaldiLogo} alt="" />
            </div>
            <div className="browser-item">
              <img src={samsungLogo} alt="" />
            </div>
          </div>
        </section>
      </section>

      {/* All device supported */}
      <section className="all-device-supported">
        <section>
          <div>
            Wherever you go, <span className="gradient-text">We are with you</span>
          </div>
          <div>
            <div className="device-item">
              <FontAwesomeIcon icon={faMobilePhone} />
            </div>
            <div className="device-item">
              <FontAwesomeIcon icon={faLaptop} />
            </div>
            <div className="device-item">
              <FontAwesomeIcon icon={faTablet} />
            </div>
          </div>
        </section>
      </section>

      {/* Pricing section */}
      <section className="pricing-section">
        <section>
          <div>
            Get it all with price of a
            <span>
              coffee <FontAwesomeIcon className="ml-2" size="sm" icon={faCoffee} />{" "}
            </span>
          </div>
          <div>
            <div className="pricing-item gradient-text-price">
              $1.00 / <span className="">month</span>{" "}
            </div>
          </div>
        </section>
      </section>

      {/* Footer */}
      <section className="footer-section">
        <section>
          <div>
            <div className="text-2xl font-bold">Linkify Inc.</div>
            <div>
              <div className="text-sm text-slate-400 mb-5">COMPANY</div>
              <div className="text-base mb-1 hover:cursor-pointer hover:underline">About Us</div>
              <div className="text-base mb-1 hover:cursor-pointer hover:underline">Blog</div>
            </div>
            <div>
              <div className="text-sm text-slate-400 mb-5">SUPPORT</div>
              <div className="text-base mb-1 hover:cursor-pointer hover:underline">Help Center</div>
              <div className="text-base mb-1 hover:cursor-pointer hover:underline">FAQ</div>
            </div>
            <div>
              <div className="text-sm text-slate-400 mb-5">LEGAL</div>
              <div className="text-base mb-1 hover:cursor-pointer hover:underline">Terms of Service</div>
              <div className="text-base mb-1 hover:cursor-pointer hover:underline">Privacy Policy</div>
              <div className="text-base mb-1 hover:cursor-pointer hover:underline">GDPR</div>
            </div>
            <div>
              <div className="text-sm text-slate-400 mb-5">PARTY WITH US</div>
              <div className="social-container">
                <div className="social-item">
                  <Twitter />
                </div>
                <div className="social-item">
                  <Facebook />
                </div>
                <div className="social-item">
                  <Instagram />
                </div>
                <div className="social-item">
                  <Linkedin />
                </div>
              </div>
            </div>
          </div>
          <div className="text-slate-500 text-sm mb-2 text-center mt-20"> © Copyright 2024. All rights reserved </div>
          <div className="text-slate-500 text-sm mb-2 text-center mt-0"> Powered by Linkify </div>
        </section>
      </section>
    </section>
  );
}
