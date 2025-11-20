import { useEffect, useState } from "react";

import useLocalStorage from "./useLocalStorage";

function useColorMode() {
  const [colorMode, setColorMode] = useLocalStorage("color-mode", "light");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    try {
      const className = "dark";
      const htmlClasses = window.document.documentElement.classList;
      const bodyClasses = window.document.body.classList;
      if (colorMode === "dark") {
        htmlClasses.add(className);
        bodyClasses.add(className);
        if (process.env.NODE_ENV === "development") console.log("useColorMode: added 'dark' class to html and body");
      } else {
        htmlClasses.remove(className);
        bodyClasses.remove(className);
        if (process.env.NODE_ENV === "development") console.log("useColorMode: removed 'dark' class from html and body");
      }
    } catch (e) {
      if (process.env.NODE_ENV === "development") console.warn("useColorMode error applying class:", e);
    }
  }, [colorMode, isMounted]);

  return [colorMode, setColorMode];
}

export default useColorMode;
