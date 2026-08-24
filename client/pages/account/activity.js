import Sidebar from "../../components/sidebar.js";
import buildAxios from "../../api/init-axios.js";
import { formatDate } from "../../common/formatDate.js";

const ActivityInformation = ({ currentUser, loginHistory }) => {

  const activityColor = (activityType) => {
    switch (activityType) {
      case "registration":
        return "badge bg-success";
      case "login":
        return "badge bg-warning text-dark";
    }};

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="p-4 flex-grow-1">
        <h2>My Activity</h2>
        {currentUser ? (
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th>Activity Type</th>
                  <th>Logged At</th>
                </tr>
              </thead>
              <tbody>
                {loginHistory.map((activity) => (
                  <tr key={activity.loggedAt}>
                    <td>
                      <span className={activityColor(activity.activityType)}>
                        {activity.activityType}
                      </span>
                    </td>
                    <td>{formatDate(activity.loggedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
        <h3>You are not signed in. Please sign in to continue.</h3>
      )}
      </div>
    </div>
  )};

export async function getServerSideProps(context) {
  try {
    const client = buildAxios(context);
    const { data } = await client.get("/activity/useractivity");

    return { props: { loginHistory: data.login_history }};
  } catch (error) {
    return { props: { loginHistory: [] }};
  }};

export default ActivityInformation;