"use client";
import { useParams } from "next/navigation";
import EmailEdit from "@/app/components/EmailEdit";
import InfoEdit from "@/app/components/InfoEdit";
import ShippingEdit from "@/app/components/ShippingEdit";
import PasswordReset from "@/app/components/PasswordReset";
import withAuth from "@/app/components/withAuth";

function EditProfile() {
  const params = useParams();
  const { slug } = params;

  const renderComponent = () => {
    switch (slug) {
      case "email":
        return <EmailEdit />;
      case "info":
        return <InfoEdit />;
      case "endereco":
        return <ShippingEdit />;
      case "reset-senha":
        return <PasswordReset />;
      default:
        return null;
    }
  };

  return renderComponent();
}

export default withAuth(EditProfile);
