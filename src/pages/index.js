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
      title="Your favorite videos, stashed away."
      subtitle="The world's easiest turnkey media server. Just enter your favorite links and enjoy."
      buttonText={accountExists ? "Dashboard" : "Get Started"}
      buttonColor="primary"
      image="/undraw_video_files_fu10.svg"
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
