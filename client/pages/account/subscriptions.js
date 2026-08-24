import Sidebar from "../../components/sidebar.js";
import buildAxios from "../../api/init-axios.js";
import { formatDate } from "../../common/formatDate.js";
import Link from "next/link";
import axios from "axios";
import { useState } from "react";

const SubscriptionsInformation = ({ currentUser, subscriptions }) => {
  
  const [errors, setErrors] = useState([]);
  const [cancelling, setCancelling] = useState(false);

    const handleCancel = async (subscriptionId) => {
    if (!window.confirm("Are you sure you want to cancel this subscription?")) {
      return;
    }
    setCancelling(true);
    setErrors([]);

    try {
      const response = await axios.delete(`/subscription/remove/${subscriptionId}`);

      if(response.status === 200){
          window.location.reload();
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
    <div className="d-flex">
        <Sidebar />
        <div className="p-4 flex-grow-1">
        <h2>My Subscriptions</h2>
        {currentUser ? (
        <>
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
        <div className="table-responsive">
            <table className="table table-striped table-hover">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Status</th>
                        <th>Valid until</th>
                        <th>Plan</th>
                        <th>Price</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {subscriptions.map((subscription) =>(
                        <tr key={subscription.id}>
                            <td>{subscription.id}</td>
                            <td>{subscription.status}</td>
                            <td>{formatDate(subscription.expiresAt)}</td>
                            <td>{subscription.plan}</td>
                            <td>€{subscription.price}</td>
                            <td>
                                {subscription.status === "succeeded" && (
                                <>    
                                    <Link href="/" className="btn btn-sm btn-primary me-2">
                                        Extend
                                    </Link>
                                    <button className="btn btn-sm btn-danger" onClick={() => handleCancel(subscription.id)} disabled={cancelling}>
                                    {cancelling ? "Cancelling..." : "Cancel"}
                                    </button>
                                </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        </>
        ) : (
        <h3>You are not signed in. Please sign in to continue.</h3>
      )}
      </div>
    </div>
    )};

    export async function getServerSideProps(context) {
    try{
      const client = buildAxios(context);
      const { data } = await client.get("/subscription/user/all");
      
      return { props : { subscriptions : data }}
    } catch (error) {
      return { props: { subscriptions: [] }}
    }};

    export default SubscriptionsInformation;