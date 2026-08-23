import Sidebar from "../../components/sidebar.js";
import buildAxios from "../../api/init-axios.js";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString('en-GB', {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Europe/Zagreb"
});
};
const formatSubscriptionStatus = (isSubscribed) => {
    return isSubscribed ? 'Subscribed' : 'Not subscribed';
};

const AccountInformation = ({ currentUser, subscription }) => {
    
    return (
    <div className="d-flex">
        <Sidebar />
        <div className="p-4 flex-grow-1">
        <h2>Account Information</h2>
        {currentUser ? (
          <>
            <p>
              <strong>Name:</strong> {currentUser.firstName} {currentUser.lastName}
            </p>
            <p>
              <strong>Email:</strong> {currentUser.email}
            </p>
            <p>
              <strong>Date of birth:</strong> {formatDate(currentUser.dateOfBirth)}
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
              <strong>Subscription status:</strong> {formatSubscriptionStatus(currentUser.isSubscribed)}
            </p>
            {subscription && (
            <p>
              <strong>Valid until:</strong> {subscription.expiresAt}
            </p>
            )}
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
      const { data } = await client.get("/subscription/user/active");
      
      return {props : {subscription: data}}
    } catch (error) {
      return { props: { subscription: null }}
    }};

    export default AccountInformation;