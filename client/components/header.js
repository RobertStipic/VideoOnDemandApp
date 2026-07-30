import Link from "next/link";

export default ({currentUser}) => {
    const links = [
        !currentUser &&{label: "Sign up", href: "/user/signup"},
        !currentUser &&{label: "Sign in", href: "/user/signin"},
        currentUser &&{label: "Sign out", href: "/user/signout"},
    ].filter ( linkConfig => linkConfig)
    .map (({ label, href }) => {
        return <li key ={href}>
            <Link className="btn btn-outline-light me-2" href= {href}>
             {label}
            </Link>
        </li>
    });


    return (
    <header className="p-3 bg-dark text-white">
        <div className="container-fluid px-4">
            <div className="d-flex flex-wrap align-items-center justify-content-between">
            <Link className="btn btn-outline-warning" href="/" style={{ marginLeft: "25px" }}>
             Vodapp
            </Link>

        <div className="d-flex" style={{ marginLeft: "25px" }}>
            <ul className="nav">
                {links}
            </ul>
        </div>
        </div>
        </div>
</header>
)};