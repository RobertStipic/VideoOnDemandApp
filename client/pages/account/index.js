import Sidebar from "../../components/sidebar.js";
import { getServerData } from "../../api/init-axios.js";
import { formatDate, formatDateShort } from "../../common/formatDate.js";
import { useAuth } from "../../context/AuthContext.js";

const formatSubscriptionStatus = (isSubscribed) => {
  return isSubscribed ? "Subscribed" : "Not subscribed";
};

const AccountInformation = ({ subscription }) => {
  const { user: currentUser } = useAuth();

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="p-4 flex-grow-1">
        <h2>Account Information</h2>
        {currentUser ? (
          <>
            <p>
              <strong>Name:</strong> {currentUser.firstName}{" "}
              {currentUser.lastName}
            </p>
            <p>
              <strong>Email:</strong> {currentUser.email}
            </p>
            <p>
              <strong>Date of birth:</strong>{" "}
              {formatDateShort(currentUser.dateOfBirth)}
            </p>
            <p>
              <strong>Country:</strong> {currentUser.country}
            </p>
            <p>
              <strong>City:</strong> {currentUser.city}
            </p>
            <p>
              <strong>Gender:</strong> {currentUser.gender}
            </p>
            <p>
              <strong>Subscription status:</strong>{" "}
              {formatSubscriptionStatus(currentUser.isSubscribed)}
            </p>
            {subscription && (
              <p>
                <strong>Valid until:</strong>{" "}
                {formatDate(subscription.expiresAt)}
              </p>
            )}
          </>
        ) : (
          <h3>You are not signed in. Please sign in to continue.</h3>
        )}
      </div>
    </div>
  );
};

export async function getServerSideProps(context) {
  const subscription = await getServerData(
    context,
    "/subscription/user/active",
  );
  return { props: { subscription: subscription || null } };
}

export default AccountInformation;
