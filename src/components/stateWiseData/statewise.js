import React, { useEffect, useState } from "react";
import "./statewise.css";
import styled from "styled-components";
import { useTable, useSortBy } from "react-table";

const Styles = styled.div`
  padding: 1rem;

  table {
    border-spacing: 0;
    border: 1px solid black;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      :last-child {
        border-right: 0;
      }
    }
  }
`;

function Table({ columns, data }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = useTable(
    {
      columns,
      data
    },
    useSortBy
  );

  // We don't want to render all 2000 rows for this example, so cap
  // it at 20 for this use case
  //const firstPageRows = rows.slice(0, 20)

  const firstPageRows = rows.slice(0, 38);
  return (
    <>
    <div className="container-fluid mt-5">
        <div className="main-heading">
            <h1 className="mb-5 text-center"> <span className="font-weight-bold">INDIA </span> COVID-19 Cases DashBoard</h1>
            <a href="https://www.cowin.gov.in/">Visit CoWin - Take Vaccine 😷</a>
        </div>
    <div className="table-responsive">
      <table className="table table-hover" {...getTableProps()}>
        <thead className="thead-dark">
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                // Add the sorting props to control sorting. For this example
                // we can add them into the header props
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render("Header")}
                  {/* Add a sort direction indicator */}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? " 🔽"
                        : " 🔼"
                      : ""}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {firstPageRows.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      </div>
      <br />
      {/* <div>Showing the first 20 results of {rows.length} rows</div> */}
      </div>
    </>
  );
}

function App() {
  const columns = React.useMemo(
    () => [
      {
        Header: "India",
        columns: [
          {
            Header: "State ",
            accessor: "state"
          },
          {
            Header: "Confirmed Cases",
            accessor: "confirmed"
          },
          {
            Header: "Recovered Cases",
            accessor: "recovered"
          },
          {
            Header: "Death Cases",
            accessor: "deaths"
          },
          {
            Header: "Active cases",
            accessor: "active"
          },
          {
            Header: "Last Updated",
            accessor: "lastupdatedtime"
          }
        ]
      }
    ],
    []
  );

  // const data = React.useMemo(() => getCovidData()
  const [data, setData] = useState([]);
  const getCovidData = async () => {
    const respon = await fetch("https://data.covid19india.org/data.json");
    const actualData = await respon.json();
    console.log(actualData.statewise);
    setData(actualData.statewise);
  };
  useEffect(() => {
    getCovidData();
  }, []);

  return (
    <Styles>
      <Table columns={columns} data={data} />
    </Styles>
  );
}

export default App;