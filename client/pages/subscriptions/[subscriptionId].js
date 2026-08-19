import buildAxios from "../../api/init-axios.js";
import Link from "next/link";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString('en-GB', {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "Europe/Zagreb"
});
};


const subscriptionPayment = ({ subscription }) => {
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
        className="btn btn-warning mt-3">
        Pay now
      </Link>
    </div>
)
}

export async function getServerSideProps(context) {
    const {subscriptionId} = context.query;
    const client = buildAxios(context);
    const {data} = await client.post("/subscription/idsearch", {subscriptionId});

    return {props : {subscription: data}}
}

export default subscriptionPayment;