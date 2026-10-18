import PartnerPageIntroComponent from "./PartnerPageIntroComponent";
import PartnerRegistrationFormComponent from "./PartnerRegistrationFormComponent";

const PartnerPageHeroComponent: React.FC = () => (
  <div className="ve-partner__layout">
    <PartnerPageIntroComponent />
    <PartnerRegistrationFormComponent />
  </div>
);

export default PartnerPageHeroComponent;
