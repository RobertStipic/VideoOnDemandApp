import { useEffect } from "react";

const BackToTop = () => {
  useEffect(() => {
    const button = document.createElement("button");
    button.innerHTML = "↑";
    button.title = "Back to top";

    Object.assign(button.style, {
      position: "fixed",
      bottom: "2rem",
      right: "2rem",
      width: "48px",
      height: "48px",
      zIndex: "99999",
      backgroundColor: "#dc3545",
      color: "white",
      border: "none",
      borderRadius: "50%",
      fontSize: "24px",
      cursor: "pointer",
      display: "none",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
      clip: "auto",
      clipPath: "none",
      margin: "0",
      padding: "0",
    });

    document.body.appendChild(button);

    const handleScroll = () => {
      if (window.scrollY > 400) {
        button.style.display = "flex";
      } else {
        button.style.display = "none";
      }
    };

    const handleClick = () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    window.addEventListener("scroll", handleScroll);
    button.addEventListener("click", handleClick);

    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      button.removeEventListener("click", handleClick);
      button.remove();
    };
  }, []);

  return null;
};

export default BackToTop;
