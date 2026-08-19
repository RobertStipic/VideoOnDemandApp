import { useState } from "react";
import buildAxios from "../../api/init-axios";
import PlanSelection from "../../components/plans";
import ActiveSubscription from "../../components/ActiveSubscription";

const SubscriptionPage = ({ currentUser, error }) => {

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!currentUser) {
    return <div className="alert alert-warning">Please sign in to manage subscriptions.</div>;
  }

  return (
    <div className="container mt-4">
      <h1>Subscription</h1>
      <p>Subscribe to watch unlimited movies in best quality. Choose one
        of three avaiable <b>plans</b>
      </p>
        <PlanSelection user={currentUser} />
    </div>
  );
};



export default SubscriptionPage;