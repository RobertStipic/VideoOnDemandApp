import "@coreui/coreui/dist/css/coreui.min.css";

export default () => {
  return (
<div className="sidebar border-end">
  <ul className="sidebar-nav compact">
    <li className="nav-title">Account settings</li>
    <li className="nav-item">
      <a className="nav-link" href="/account">
        Account Information
      </a>
    </li>
    <li className="nav-item">
      <a className="nav-link" href="/account/changepassword">
        Change password
      </a>
    </li>
    <li className="nav-item">
      <a className="nav-link" href="/account/subscriptions">
        Subscriptions
      </a>
    </li>
    <li className="nav-item">
      <a className="nav-link" href="/account/activity">
        Activity
      </a>
    </li>
  </ul>
</div>
)};

