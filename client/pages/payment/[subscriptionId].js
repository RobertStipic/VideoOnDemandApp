import { useState } from "react";
import Router from "next/router";
import buildAxios from "../../api/init-axios";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const PaymentForm = ({ subscription }) => {

  const stripe = useStripe();
  const elements = useElements();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) return;

     setLoading(true);
     setErrors([]);;

    const cardElement = elements.getElement(CardNumberElement);
    const { token, error: tokenError } = await stripe.createToken(cardElement);

    if (tokenError) {
    setErrors([{ msg: tokenError.message }]);
    setLoading(false);
    return;
    }

    try {
      const response = await axios.post("/payment/new", {
        token: token.id,
        subscriptionId: subscription.id,
        receipt_email: email,
      });

    const receiptUrl = response.data.payment.receipt_info.receipt_url;

    if (receiptUrl) {
    window.open(receiptUrl, "_blank", "noopener,noreferrer");
    }  
    if(response.status === 201) {
    Router.push("/").then(() => {
         window.location.reload();
        });
    }
    }catch (err) {
    if (err.response.status === 400) {
        setErrors([{ msg: err.response.data }]);
  } else if (err.response.status === 404) {
    setErrors([{ msg: err.response.data }]);
  } else if (err.response.status === 500) {
    setErrors([{ msg: err.response.data }]);
  } else {
    setErrors([{ msg: "Payment failed. Please try again." }]);
  }
    } finally {
      setLoading(false);
    }
  };

  return (
  <form onSubmit={handleSubmit} className="container mt-4">
      <h1>Complete your payment</h1>
      <p>Subscription ID: {subscription.id}</p>

      <div className="form-group">
        <label htmlFor="email">Receipt email</label>
        <input
          id="email"
          type="email"
          className="form-control"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

<div className="form-group mt-3">
  <label>Card number</label>
  <CardNumberElement className="form-control" options= {{ showIcon: true }}/>
</div>

<div className="row mt-3">
  <div className="col">
    <label>Card expiration</label>
    <CardExpiryElement className="form-control" />
  </div>

  <div className="col">
    <label>CVC</label>
    <CardCvcElement className="form-control" />
  </div>
</div>


  {errors.length > 0 && (
  <div className="alert alert-danger mt-3">
    <strong>Something went wrong:</strong>
    <ul className="my-0">
      {errors.map((err) => (
        <li key={err.msg}>{err.msg}</li>
      ))}
    </ul>
  </div>
)}

      <button
        type="submit"
        className="btn btn-success mt-3"
        disabled={!stripe || loading}>
        {loading ? "Processing..." : `Pay €${subscription.price} `}
      </button>
  </form>
  );
};

export default function PaymentPage({ subscription }) {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm subscription={subscription}/>
    </Elements>
  );
}

export async function getServerSideProps(context) {
  const {subscriptionId} = context.query;
  const client = buildAxios(context);
  const {data} = await client.post("/subscription/idsearch", {subscriptionId});
  
  return {props : {subscription: data}}
}