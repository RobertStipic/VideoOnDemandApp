import { useState } from "react";
import axios from "axios";
import Router from "next/router";

const plans = [
  { id: 1, name: "Monthly", price: 12, duration: "30 days", monthly: "12" },
  { id: 2, name: "6 Months", price: 55, duration: "180 days", monthly: "9,17" },
  { id: 3, name: "Yearly", price: 100, duration: "365 days", monthly: "8,33"},
];

export default function PlanSelection({ currentUser }) {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [error, setError] = useState("");

  const handleSubscribe = async () => {
    if (!selectedPlan) return;
    setError("");
    try {
      const response = await axios.post("/subscription/new", {
        plan: selectedPlan,
        status: "pending",  
      });

      const subscriptionId = response.data.subscriptionObj.id;
      Router.push(`/subscriptions/${subscriptionId}`);

    } catch (err) {
      setError("Failed to create subscription. Please try again.");
    } 
  };

  return (
    <div>
      <h2>Choose your plan</h2>
      <div className="row">
        {plans.map((plan) => (
          <div key={plan.id} className="col-md-4 mb-3">
            <div
              className={`card ${selectedPlan === plan.id ? "border-primary" : ""}`}
              onClick={() => setSelectedPlan(plan.id)}
              style={{ cursor: "pointer" }}
            >
              <div className="card-body">
                <h5 className="card-title">{plan.name}</h5>
                <p className="card-text">€{plan.price}</p>
                <p className="text-muted"><b>{plan.duration}</b></p>
                <p className="text-muted">No ads</p>
                <p className="text-muted">Monthly price <b>€{plan.monthly}</b></p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {error && <div className="alert alert-danger">
        <strong>Something went wrong:</strong>
        {error}</div>}
      <button
        className="btn btn-warning"
        disabled={!selectedPlan}
        onClick={handleSubscribe}>
        Subscribe
      </button>
    </div>
  );
}