import React from "react";
import PlayerSection from "components/PlayerSection";
import { requireAuth } from "util/auth.js";
import { useRouter } from "next/router";

function PlayerPage() {
  const router = useRouter()
  const metadata = router.query.metadata;

  return (
    <PlayerSection
      bg="white"
      textColor="dark"
      size="md"
      metadata={metadata}
    />
  );
}

export default requireAuth(PlayerPage);