import { NavLink, Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../styles/receivingPage.css";

function ReceivingPage() {
    const { t } = useTranslation();

    return (
        <div className="letters-page letters-page-receiving">
            <h2>{t("receivingPage.title")}</h2>
            
            <div className="subnav-tabs">
                <NavLink
                    to="registered"
                    className={({ isActive }) => (isActive ? "subnav-tab active" : "subnav-tab")}
                >
                    {t("receivingPage.registeredPost")}
                </NavLink>
                <NavLink
                    to="normal"
                    className={({ isActive }) => (isActive ? "subnav-tab active" : "subnav-tab")}
                >
                    {t("receivingPage.normalPost")}
                </NavLink>
                <NavLink
                    to="byhand"
                    className={({ isActive }) => (isActive ? "subnav-tab active" : "subnav-tab")}
                >
                    {t("receivingPage.byHand")}
                </NavLink>
            </div>

            <Outlet />
        </div>
    );
}

export default ReceivingPage;