import HomePageCapabilitiesComponent from "../../components/pages/public/home/HomePageCapabilitiesComponent";
import HomePageClosingComponent from "../../components/pages/public/home/HomePageClosingComponent";
import HomePageHeroComponent from "../../components/pages/public/home/HomePageHeroComponent";
import HomePageJourneyComponent from "../../components/pages/public/home/HomePageJourneyComponent";
import HomePageNetworkComponent from "../../components/pages/public/home/HomePageNetworkComponent";

const PublicHomePage: React.FC = () => (
  <div className="ve-home">
    <HomePageHeroComponent />
    <HomePageNetworkComponent />
    <HomePageJourneyComponent />
    <HomePageCapabilitiesComponent />
    <HomePageClosingComponent />
  </div>
);

export default PublicHomePage;
