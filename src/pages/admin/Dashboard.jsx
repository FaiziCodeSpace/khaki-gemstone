import NotificationsTable from "../../components/admin/Dashboard/NotificationsTable";
import Stats from "../../components/admin/Dashboard/Stats";

export default function Dashboard(){
    return(
        <main>
            <Stats/>
            <NotificationsTable/>
        </main>
    )
}