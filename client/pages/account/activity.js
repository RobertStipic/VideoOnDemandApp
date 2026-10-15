import Sidebar from "../../components/sidebar.js";
import { getServerData } from "../../api/init-axios.js";
import { formatDate } from "../../common/formatDate.js";
import { useAuth } from "../../context/AuthContext.js";

const ActivityInformation = ({ loginHistory }) => {
  const { user: currentUser } = useAuth();

  const activityColor = (activityType) => {
    switch (activityType) {
      case "registration":
        return "badge bg-success text-dark";
      case "login":
        return "badge bg-info";
    }
  };

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
  );
};

export async function getServerSideProps(context) {
  const data = await getServerData(context, "/activity/useractivity");
  return { props: { loginHistory: data?.login_history || [] } };
}

export default ActivityInformation;
