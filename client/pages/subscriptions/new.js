import buildAxios from "../../api/init-axios";
import PlanSelection from "../../components/subscriptionPlans";

const SubscriptionPage = ({ currentUser, subscription }) => {

  return (
    <div className="container mt-4">
      <h1>Subscription</h1>
      { currentUser ? (
        <>
      <p>Subscribe to watch unlimited movies in best quality. Choose one
        of three avaivable <b>plans</b>
      </p>
        <PlanSelection subscription={subscription} />
        </>
        ) : (
          <h3> You are not signed in. Please sign in to continue. </h3>
        )}
    </div>
  );
};

    export async function getServerSideProps(context) {
    try{
      const client = buildAxios(context);
      const { data } = await client.get("/subscription/user/active");
      
      return { props : { subscription : data }}
    } catch (error) {
      return { props: { subscription: null }}
    }};


export default SubscriptionPage;