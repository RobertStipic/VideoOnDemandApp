import Sidebar from "../../components/sidebar.js";
import buildAxios from "../../api/init-axios.js";
import { formatDate } from "../../common/formatDate.js";
import Link from "next/link";


const PaymentsInformation = ({ currentUser, payments }) => {
  
    return (
    <div className="d-flex">
        <Sidebar />
        <div className="p-4 flex-grow-1">
        <h2>My Payments</h2>
        {currentUser ? (
        <>
        <div className="table-responsive">
            <table className="table table-striped table-hover">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Subscription ID</th>
                        <th>Payment time</th>
                        <th>Receipt email</th>
                        <th>Receipt url</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {payments.map((payment) =>(
                        <tr key={payment.stripeID}>
                            <td>{payment.stripeID}</td>
                            <td>{payment.subscriptionId}</td>
                            <td>{formatDate(payment.paymentTime)}</td>
                            <td>{payment.receipt_info.receipt_email}</td>
                            <td><a href={payment.receipt_info.receipt_url}
                                target="_blank"
                                rel="noopener noreferrer">
                                    View Receipt
                                </a>
                            </td>
                            <td>                         
                                <>    
                                    <Link href="/" className="btn btn-sm btn-primary me-2">
                                        More Details
                                    </Link>
                                </>
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
      const { data } = await client.get("/payment/userpayments");
      
      return {props : { payments : data }};
    } catch (error) {
      return { props: { payments: [] }};
    }};

    export default PaymentsInformation;