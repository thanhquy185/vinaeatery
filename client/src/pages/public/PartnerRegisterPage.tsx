import PartnerPageCapabilitiesComponent from "../../components/pages/public/partner/PartnerPageCapabilitiesComponent";
import PartnerPageFaqComponent from "../../components/pages/public/partner/PartnerPageFaqComponent";
import PartnerPageHeroComponent from "../../components/pages/public/partner/PartnerPageHeroComponent";
import PartnerPageWorkflowComponent from "../../components/pages/public/partner/PartnerPageWorkflowComponent";

const PartnerRegisterPage: React.FC = () => (
  <div className="ve-partner">
    <PartnerPageHeroComponent />
    <PartnerPageCapabilitiesComponent />
    <PartnerPageWorkflowComponent />
    <PartnerPageFaqComponent />
  </div>
);

export default PartnerRegisterPage;
