import React, { useEffect, useState } from "react";
import PageLoader from "components/PageLoader";
import HeroSection from "components/HeroSection";
import { useRouter } from "next/router";
import { checkUser} from "util/db.js";

function IndexPage(props) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [accountExists, setAccountExists] = useState(false);

  useEffect(() => {
    checkUser().then((response) => {
      setLoading(false);
      setAccountExists(response.account_created);
    });
  }, []);

  return (
    <>
    {loading && (
        <PageLoader
          style={{
            height: "500px",
          }}
        />
      )}
      {!loading && (
    <HeroSection
      bg="white"
      textColor="dark"
      size="md"
      bgImage=""
      bgImageOpacity={1}
      title="Your landing page title here"
      subtitle="This landing page is perfect for showing off your awesome product and driving people to sign up for a paid plan."
      buttonText={accountExists ? "Dashboard" : "Get Started"}
      buttonColor="primary"
      image="https://uploads.divjoy.com/undraw-japan_ubgk.svg"
      buttonOnClick={() => {
        // Navigate to signup page
        if (accountExists) {
          router.push("/dashboard");
        } else {
          router.push("/auth/signup");
        } 
      }}
    />)}
    </>
  );
}

export default IndexPage;
