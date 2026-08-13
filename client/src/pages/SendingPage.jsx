import { Link, Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../styles/sendingPage.css";

function SendingLetters() {
  const { t } = useTranslation();

  return (
    <div className="letters-page letters-page-sending">
      <h2>{t("sendingPage.title")}</h2>

      <div className="button-group">
        <Link to="registered">{t("sendingPage.registeredPost")}</Link>
        <Link to="normal">{t("sendingPage.normalPost")}</Link>
        <Link to="byhand">{t("sendingPage.byHand")}</Link>
      </div>

      <Outlet />
    </div>
  );
}

export default SendingLetters;