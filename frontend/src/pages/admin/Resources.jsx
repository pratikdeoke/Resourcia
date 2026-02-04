import { useEffect, useState } from "react";
import { getResources } from "../../api/resource.api";

export default function Resources() {
  const [resources, setResources] = useState([]);

  useEffect(() => {
    getResources().then((res) => setResources(res.data.data));
  }, []);

  return (
    <div>
      <h3>Resources</h3>

      {resources.map((r) => (
        <div key={r.id}>
          <p>{r.name}</p>
          <p>{r.type}</p>
          <p>{r.capacity}</p>
        </div>
      ))}
    </div>
  );
}