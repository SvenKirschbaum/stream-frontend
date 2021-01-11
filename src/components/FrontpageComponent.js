import {Button, Container} from "react-bootstrap";
import {Link} from "react-router-dom";

function Frontpage() {
    return (
        <Container fluid className="frontpage">
            <Link to={"/live"}>
                <Button size="lg" variant="info">Liveanzeige</Button>
            </Link>
            <Link to={"/manage"}>
                <Button size="lg" variant="secondary">Verwaltung</Button>
            </Link>
        </Container>
    )
}

export default Frontpage;