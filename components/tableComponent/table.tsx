// Assuming this is in a file named TableComponent.jsx
import Link from "next/link";
import styles from "./table.module.css";

const TableComponent = ({ data }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Details</th>
          {/* Add more table headers if needed */}
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index}>
            <td>
              <Link href={`/details/${item.id}`} passHref>
                {item.name}
              </Link>
            </td>
            <td>
              <Link href={`/details/${item.id}`} passHref>
                View Details
              </Link>
            </td>
            {/* Add more table cells if needed */}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TableComponent;
