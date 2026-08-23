import { useState } from "react";
import Router from "next/router";
import axios from "axios";
import buildAxios from "../../api/init-axios.js";
import Link from "next/link";
import { formatDate } from "../../common/formatDate.js";


const subscriptionPayment = ({ subscription }) => {

  const [errors, setErrors] = useState([]);
  const [cancelling, setCancelling] = useState(false);

    const handleCancel = async () => {
    if (!window.confirm("Are you sure you want to cancel this subscription?")) {
      return;
    }
    setCancelling(true);
    setErrors([]);

    try {
      const response = await axios.delete(`/subscription/remove/${subscription.id}`);

      if(response.status === 200){
      Router.push("/").then(() => {
              window.location.reload();
            });
      }      
    } catch (err) {
      if (err.response.status === 400) {
        setErrors([{ msg: err.response.data }]);
        }
        else if (err.response.status === 401) {
        setErrors([{ msg: err.response.data }]);
      } else if (err.response.status === 404) {
        setErrors([{ msg: err.response.data }]);
      } else if (err.response.status === 500) {
        setErrors([{ msg: err.response.data }]);
      } else {
        setErrors([{ msg: "Cancellation failed. Please try again." }]);
      }
    } finally {
      setCancelling(false);
    }
  };

    return (
    <div className="container mt-4">
        <div className="card" style={{width: "30rem"}}>
            <div className="card-body">
                <h5>Subscription: {subscription.id}</h5>
                <p className="card-text">Selected plan: <b>{subscription.plan}</b> with price <b>€{subscription.price}</b></p>
                <p className="text-muted">Subscription valid until: <b>{formatDate(subscription.expiresAt)}</b></p>
                <p className="text-muted">Payment expiries: <b>{formatDate(subscription.paymentExpiresAt)}</b></p>
            </div>
        </div>
        <Link
        href={`/payment/${subscription.id}`}
        className="btn btn-warning mt-3 me-2">
        Pay now
      </Link>
      <button
        className="btn btn-danger mt-3"
        onClick={handleCancel}
        disabled={cancelling}
      >
        {cancelling ? "Cancelling..." : "Cancel"}
      </button>

      {errors.length > 0 && (
        <div className="alert alert-danger mt-3">
          <strong>Something went wrong:</strong>
          <ul className="my-0">
            {errors.map((err, index) => (
              <li key={index}>{err.msg}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
);
};

export async function getServerSideProps(context) {
    const {subscriptionId} = context.query;
    const client = buildAxios(context);
    const {data} = await client.post("/subscription/idsearch", {subscriptionId});

    return {props : {subscription: data}}
}

export default subscriptionPayment;