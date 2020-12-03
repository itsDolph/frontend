import React from "react";
import "styles/global.scss";
import NavbarCustom from "components/NavbarCustom";
import Footer from "components/Footer";
import { ProvideAuth } from "util/auth.js";

function MyApp({ Component, pageProps }) {
  return (
    <ProvideAuth>
      <>
        <NavbarCustom
          bg="white"
          variant="light"
          expand="md"
          logo="/yourtube.svg"
        />

        <Component {...pageProps} />

        <Footer
          bg="light"
          textColor="dark"
          size="sm"
          bgImage=""
          bgImageOpacity={1}
          description="A short description of what you do here"
          copyright="© 2020 yourtube"
          logo="/yourtube.svg"
        />
      </>
    </ProvideAuth>
  );
}

export default MyApp;
