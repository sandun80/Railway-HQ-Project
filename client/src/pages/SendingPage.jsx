import { NavLink, Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../styles/sendingPage.css";

function SendingLetters() {
  const { t } = useTranslation();

  return (
    <div className="letters-page letters-page-sending">
      <h2>{t("sendingPage.title")}</h2>

      <div className="subnav-tabs">
        <NavLink
          to="registered"
          className={({ isActive }) => (isActive ? "subnav-tab active" : "subnav-tab")}
        >
          {t("sendingPage.registeredPost")}
        </NavLink>
        <NavLink
          to="normal"
          className={({ isActive }) => (isActive ? "subnav-tab active" : "subnav-tab")}
        >
          {t("sendingPage.normalPost")}
        </NavLink>
        <NavLink
          to="byhand"
          className={({ isActive }) => (isActive ? "subnav-tab active" : "subnav-tab")}
        >
          {t("sendingPage.byHand")}
        </NavLink>
      </div>

      <Outlet />
    </div>
  );
}

export default SendingLetters;