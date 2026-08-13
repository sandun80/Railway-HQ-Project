import { Link, Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../styles/receivingPage.css";

function ReceivingPage(){
    const { t } = useTranslation();

    return(
        <div className="letters-page letters-page-receiving">
            <h2>{t("receivingPage.title")}</h2>
            
            <div className="button-group">
                <Link to="registered">{t("receivingPage.registeredPost")}</Link>
                <Link to="normal">{t("receivingPage.normalPost")}</Link>
                <Link to="byhand">{t("receivingPage.byHand")}</Link>
            </div>

            <Outlet />
        </div>
    );
}

export default ReceivingPage;