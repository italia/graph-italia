import { useEffect } from "react";

import { Link, useParams } from "react-router-dom";
import Layout from "../../components/layout";
import useEditKpiGroupStore from "./editKpiGroupStore";

function EditKpiGroup() {
  const { id } = useParams();
  const { load, vm } = useEditKpiGroupStore();

  useEffect(() => {
    if (id) {
      load(id);
    }
  }, []);

  return (
    <Layout>
      <div className="p-4">
        <div className="container">
          <Link to="/home" className="link-primary">
            Back
          </Link>
          {vm && (
            <div>
              <h1>EDIT KPI GROUP: {vm.name}</h1>
              <pre>{vm.description}</pre>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default EditKpiGroup;
