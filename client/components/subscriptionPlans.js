import { useState } from "react";
import axios from "axios";
import Router from "next/router";

const plans = [
  { id: 1, name: "Monthly", price: 12, duration: "30 days", monthly: "12" },
  { id: 2, name: "6 Months", price: 55, duration: "180 days", monthly: "9,17" },
  { id: 3, name: "Yearly", price: 100, duration: "365 days", monthly: "8,33"},
];

const PlanSelection = ({ subscription }) => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [errors, setErrors] = useState([]);

  const handleSubscribe = async () => {
    if (!selectedPlan) return;
    setErrors("");
    try {
    if(!subscription){
      const response = await axios.post("/subscription/new", {
        plan: selectedPlan,
        status: "pending",  
      });
      const subscriptionId = response.data.subscriptionObj.id;
      Router.push(`/subscriptions/${subscriptionId}`); 
   
  } else {
      const response = await axios.put(`/subscription/extend/${subscription.id}`, {
        plan: selectedPlan
      })
      const newSubscriptionId = response.data.subscriptionObj.id;

      Router.push(`/subscriptions/${newSubscriptionId}`);
        }  
   }catch (error) {
      if (error.response.status === 400){
        setErrors(error.response.data);
      }
      else if (error.response.status === 401){
        setErrors([{ msg: error.response.data }]);
      }
      else if (error.response.status === 404){
        setErrors([{ msg: error.response.data }]);
      }
      else if (error.response.status === 500){
        setErrors([{ msg: error.response.data }]);
      }
      else {
        setErrors([{ msg: "Unextected error. Please try again" }]);
      }
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
      {errors.length > 0 && (
        <div className="alert alert-danger">
          <strong>Something went wrong:</strong>
          <ul className="my-0">
            {errors.map((err) => (
              <li key={err.msg}>{err.msg}</li>
            ))}
          </ul>
        </div>
      )}
      {subscription ? (
        <button
        className="btn btn-warning"
        disabled={!selectedPlan}
        onClick={handleSubscribe}>
        Extend
      </button>
       ) : (
      <button
        className="btn btn-warning"
        disabled={!selectedPlan}
        onClick={handleSubscribe}>
        Subscribe
      </button>
      )}
    </div>
  );
};

export default PlanSelection;

