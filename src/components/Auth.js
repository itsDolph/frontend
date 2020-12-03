import React, { useState } from "react";
import FormAlert from "components/FormAlert";
import AuthForm from "components/AuthForm";
import AuthFooter from "components/AuthFooter";
import { useRouter } from "next/router";

function Auth(props) {
  const router = useRouter();
  const [formAlert, setFormAlert] = useState(null);

  const handleAuth = (user) => {
    router.push(props.afterAuthPath);
  };

  const handleFormAlert = (data) => {
    setFormAlert(data);
  };

  return (
    <>
      {formAlert && (
        <FormAlert type={formAlert.type} message={formAlert.message} />
      )}

      <AuthForm
        type={props.type}
        typeValues={props.typeValues}
        onAuth={handleAuth}
        onFormAlert={handleFormAlert}
      />

      {["signup", "signin"].includes(props.type) && (
        <>
          <AuthFooter type={props.type} typeValues={props.typeValues} />
        </>
      )}
    </>
  );
}

export default Auth;
