import React, { useCallback, useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Container } from "reactstrap";
import moment from "moment";

import ReactTable from "../common/React-table";
import AXIOS from "../../helpers/axios";
import { UserAvatar } from "./chat";
// import { packages } from "../../helpers/fakedata";

const PackageCell = ({ item }) => (
  <table className="w-100">
    <tbody>
      <tr>
        <td className="border-top-0 border-bottom border-right p-0 pl-1 pr-1 w-50">
          {item.package.width}
        </td>
        <td className="border-top-0 border-bottom p-0 pl-1 pr-1 w-50">
          {item.package.length}
        </td>
      </tr>
      <tr>
        <td className="border-top-0 border-right p-0 pl-1 pr-1">
          {item.package.height}
        </td>
        <td className="border-top-0 p-0 pl-1 pr-1">{item.package.weight}</td>
      </tr>
    </tbody>
  </table>
);
const PackageCol = () => (
  <table className="w-100">
    <tbody>
      <tr>
        <td className="border-top-0 border-bottom border-right p-0 pl-1 pr-1 w-50">
          Width
        </td>
        <td className="border-top-0 border-bottom p-0 pl-1 pr-1 w-50">
          Length
        </td>
      </tr>
      <tr>
        <td className="border-top-0 border-right p-0 pl-1 pr-1">Height</td>
        <td className="border-top-0 p-0 pl-1 pr-1">Weight</td>
      </tr>
    </tbody>
  </table>
);
const CustomerCell = ({ item }) => (
  <table className="w-100">
    <tbody>
      <tr>
        <td className="border-top-0 p-0 pl-1 pr-1 text-center">
          {item.customer.prefix}
        </td>
      </tr>
      <tr>
        <td className="p-0 pl-1 pr-1 text-center">ID: {item.customer.id}</td>
      </tr>
    </tbody>
  </table>
);
const ActionCell = ({ item, handleRedirect }) => {
  return (
    <Button onClick={() => handleRedirect(item)} color="primary" size="sm">
      View
    </Button>
  );
};

const AddNew = () => {
  const navigate = useNavigate();
  const handleRedirect = useCallback(() => {
    navigate("/packages/add");
  }, [navigate]);

  return (
    <Button className="mt-0" color="info" onClick={handleRedirect}>
      Add New
    </Button>
  );
};

const Packages = () => {
  const navigate = useNavigate();

  const handleRedirect = useCallback(
    (item) => {
      navigate("/packages/" + item._id);
    },
    [navigate]
  );

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perpage, setPerpage] = useState(5);
  const [total, setTotal] = useState(0);
  const [sort, setSort] = useState("updatedAt");
  const [sortdir, setSortdir] = useState("desc");
  const [packages, setPackages] = useState([]);

  const columns = useMemo(
    () => [
      {
        col: "No",
        Cell: ({ key }, { page, perpage }) => (page - 1) * perpage + key + 1,
        width: "5%",
        sortable: "updatedAt",
      },
      {
        col: "Image",
        Cell: ({ item }) => (item.images ? item.images.length : 0) + " Images",
        width: "15%",
        sortable: "iamges",
      },
      {
        col: "Date",
        Cell: ({ item }) =>
          moment(new Date(item.date)).format("MM/DD/yyyy HH:mm"),
        width: "10%",
        sortable: "date",
      },
      {
        col: "Customer",
        width: "10%",
        Cell: CustomerCell,
      },
      {
        col: "Tracking Number",
        accessor: "trackingNumber",
        width: "15%",
        sortable: "trackingNumber",
      },
      {
        Col: PackageCol,
        width: "15%",
        Cell: PackageCell,
      },
      {
        col: "Status",
        accessor: "status",
        width: "10%",
        sortable: "status",
      },
      {
        col: "Staff",
        width: "10%",
        Cell: ({ item }) =>
          item.assign && item.assign.length
            ? item.assign.map((uitem, key) => (
                <UserAvatar user={uitem} key={key} />
              ))
            : "N/A",
      },
      {
        col: "Actions",
        accessor: "",
        Cell: ({ item }) => (
          <ActionCell item={item} handleRedirect={handleRedirect} />
        ),
        width: "10%",
      },
    ],
    [handleRedirect]
  );

  const getPkgs = useCallback(
    (params) => {
      const n = { page, perpage, search, sort, sortdir, ...params };
      (async () => {
        try {
          const response = await AXIOS.get(
            `/api/packages?page=${n.page}&perpage=${n.perpage}&search=${n.search}&sort=${sort}&sortdir=${sortdir}`
          );
          setPackages(response.data.packages);
          setTotal(response.data.total);
        } catch (error) {
          console.log(error);
        }
      })();
    },
    [page, perpage, search, sort, sortdir]
  );

  const handleSetPage = useCallback(
    (params) => {
      setPage(params);
      getPkgs({ page: params });
    },
    [getPkgs]
  );

  const handleSetPerpage = useCallback(
    (params) => {
      setPage(1);
      setPerpage(params);
      getPkgs({ page: 1, perpage: params });
    },
    [getPkgs]
  );

  const handleSetSearch = useCallback(
    (params) => {
      setPage(1);
      setSearch(params);
      getPkgs({ page: 1, search: params });
    },
    [getPkgs]
  );

  const handleSetSort = useCallback(
    (params) => {
      setSort(params);
      getPkgs({ sort: params });
    },
    [getPkgs]
  );

  const handleSetSortdir = useCallback(
    (params) => {
      setSortdir(params);
      getPkgs({ sortdir: params });
    },
    [getPkgs]
  );

  useEffect(() => {
    (async () => {
      try {
        const response = await AXIOS.get(
          `/api/packages?page=1&perpage=5&search=&sort=updatedAt&sortdir=desc`
        );
        setPackages(response.data.packages);
        setTotal(response.data.total);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  return (
    <>
      <div className="page-header clear-filter" filter-color="blue">
        <div
          className="page-header-image"
          style={{
            backgroundImage: "url(" + require("../../assets/img/bg3.jpg") + ")",
          }}
        ></div>
        <div className="content">
          <Container>
            <ReactTable
              columns={columns}
              data={packages}
              search={search}
              setSearch={handleSetSearch}
              page={page}
              setPage={handleSetPage}
              perpage={perpage}
              setPerpage={handleSetPerpage}
              total={total}
              addnew={AddNew}
              sort={sort}
              setSort={handleSetSort}
              sortdir={sortdir}
              setSortdir={handleSetSortdir}
            />
          </Container>
        </div>
      </div>
    </>
  );
};

export default Packages;
