import Landing from "../scenes/Landing";
import DesktopSkills from "../scenes/skills/DesktopSkills";
import MobileSkills from "../scenes/skills/MobileSkills";
import Contact from "../scenes/Contact";
import Footer from "../scenes/Footer";
import DesktopAboutMe from "../scenes/aboutMe/DesktopAboutMe";
import useMediaQuery from "../hooks/useMediaQuery";
import MobileAboutMe from "../scenes/aboutMe/MobileAboutMe";
import Navbar from "../scenes/Navbar";
import SocialMedia from "../scenes/SocialMedia";
import Transition from "../components/animation/Transition";
import DesktopProject from "../scenes/project/DesktopProject";
import MobileProject from "../scenes/project/MobileProject";

function Pages() {
  const isDesktop = useMediaQuery("(min-width: 48rem)");
  return (
    <>
      <Navbar />
      <SocialMedia />
      <div
        id="home"
        className="w-5/6 max-w-screen-smd mx-auto flex min-h-screen justify-center items-center md:items-start md:pt-56 relative scroll-effect border-b border-b-gray-700">
        <Landing />
      </div>

      <div className="w-5/6 max-w-screen-smd mx-auto h-full relative border-b border-b-gray-700">
        {isDesktop ? <DesktopAboutMe /> : <MobileAboutMe />}
      </div>
      <div className="w-5/6 max-w-screen-smd mx-auto h-full relative border-b border-b-gray-700 ">
        {isDesktop ? <DesktopSkills /> : <MobileSkills />}
      </div>
      <div className="w-5/6 max-w-screen-smd mx-auto h-full relative border-b border-b-gray-700 ">
        {isDesktop ? <DesktopProject /> : <MobileProject />}
      </div>
      <div className="w-5/6 max-w-screen-smd mx-auto md:h-full">
        <Contact />
      </div>
      <Footer />
    </>
  );
}

export default Transition(Pages);
