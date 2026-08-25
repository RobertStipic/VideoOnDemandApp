import Sidebar from "../../../components/sidebar.js";
import buildAxios from "../../../api/init-axios.js";
import { formatDate } from "../../../common/formatDate.js";

const PaymentDetails = ({ currentUser, payment }) => {

  return (
    <div className="d-flex">
        <Sidebar />
        <div className="p-4 flex-grow-1">
            <h2>Payment details</h2>
            {currentUser ? (
            <>
            <div className="card mb-3">
                <div className="card-header">
                    Payment Info
                </div>
                <div className="card-body">
                    <dl className="row mb-0">
                        <dt className="col-sm-3">
                            Ammount
                        </dt>
                        <dd className="col-sm-9">
                            {payment.payment_info.amount}
                        </dd>
                        <dt className="col-sm-3">
                            Currency
                        </dt>
                        <dd className="col-sm-9">
                            {payment.payment_info.currency.toUpperCase()}
                        </dd>
                        <dt className="col-sm-3">
                            Status
                        </dt>
                        <dd className="col-sm-9">
                            {payment.payment_info.status}
                        </dd>
                        <dt className="col-sm-3">
                            Payment time
                        </dt>
                        <dd className="col-sm-9">
                            {formatDate(payment.paymentTime)}
                        </dd>
                        <dt className="col-sm-3">
                            Description
                        </dt>
                        <dd className="col-sm-9">
                            {payment.payment_info.description}
                        </dd>
                        <dt className="col-sm-3">
                            Paid
                        </dt>
                        <dd className="col-sm-9">
                            {payment.payment_info.paid ? "Yes" : "No"}
                        </dd>                                                                        
                    </dl>
                </div>
            </div>
            <div className="card mb-3">
                <div className="card-header">
                    Payment Method
                </div>
                <div className="card-body">
                <dl className="row mb-0">
                    <dt className="col-sm-3">
                        Type
                    </dt>
                    <dd className="col-sm-9">
                        {payment.payment_method_details.type.toUpperCase()}
                    </dd>
                    <dt className="col-sm-3">
                        Card
                    </dt>
                    <dd className="col-sm-9">
                        {payment.payment_method_details.card.toUpperCase()} ending in {payment.payment_method_details.card_last4}
                    </dd>
                    <dt className="col-sm-3">
                        Expiry
                    </dt>
                    <dd className="col-sm-9">
                        {payment.payment_method_details.card_exp_month}/{payment.payment_method_details.card_exp_year}
                    </dd>
                    <dt className="col-sm-3">
                        Network
                    </dt>
                    <dd className="col-sm-9">
                        {payment.payment_method_details.network.toUpperCase()}
                    </dd>                    
                </dl>
              </div>    
            </div>
            <div className="card">
                <div className="card-header">
                    Receipt
                </div>
                <div className="card-body">
                    <dl className="row mb-0">
                        <dt className="col-sm-3">
                            Email
                        </dt>
                        <dd className="col-sm-9">
                            {payment.receipt_info.receipt_email}
                        </dd>
                        <dt className="col-sm-3">
                            Receipt URL
                        </dt>
                        <dd className="col-sm-9">
                            <a href={payment.receipt_info.receipt_url}
                            target="_blank"
                            rel="nonopener noreferrer">
                                {payment.receipt_info.receipt_url}
                            </a>
                        </dd>
                    </dl>
                </div>
            </div>
            </>
           ) : (
            <h3>You are not signed in. Please sign in to continue.</h3>
        )}
        </div>
    </div>
  )};


  export async function getServerSideProps(context) {
    const { stripeID } = context.query;

    try {
        const client = buildAxios(context);
        const { data } = await client.get("payment/find",{ 
           data: {stripeID}
        })
        
        return { props: { payment: data }};
    } catch (error) {
        return { props : { payment: null }};
    }
  }

  export default PaymentDetails;