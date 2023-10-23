import React, { useCallback, useState, useEffect, useMemo } from "react";
import { Container } from "reactstrap";

import ReactTable from "../common/React-table";
import AXIOS from "../../helpers/axios";
// import { users } from "../../helpers/fakedata";

const ActionCell = ({ item, handleResetPwd, handleResetRole }) => (
  <div className=" btn-group">
    <button
      className="btn btn-sm btn-info"
      disabled={item.role === "admin"}
      onClick={() => handleResetPwd(item._id)}
    >
      Reset Password
    </button>
    <button
      className="btn btn-sm btn-primary"
      disabled={item.role === "admin"}
      onClick={() => handleResetRole(item)}
    >
      Set Role
    </button>
  </div>
);

const Users = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perpage, setPerpage] = useState(5);
  const [total, setTotal] = useState(0);
  const [users, setUsers] = useState([]);

  const getUsers = useCallback(
    (params) => {
      const n = { page, perpage, search, ...params };
      (async () => {
        try {
          const response = await AXIOS.get(
            `/api/users?page=${n.page}&perpage=${n.perpage}&search=${n.search}`
          );
          setUsers(response.data.users);
          setTotal(response.data.total);
        } catch (error) {
          console.log(error);
        }
      })();
    },
    [page, perpage, search]
  );

  const handleResetPwd = useCallback((params) => {
    (async () => {
      try {
        await AXIOS.patch(`/api/users/admin/${params}`);
        window.alert("OK");
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  const handleResetRole = useCallback(
    (item) => {
      (async () => {
        try {
          await AXIOS.put(`/api/users/admin/${item._id}`, {
            role: item.role ? "" : "emp",
          });
          getUsers();
          window.alert("Set role successfully.");
        } catch (error) {
          console.log(error);
        }
      })();
    },
    [getUsers]
  );

  const columns = useMemo(
    () => [
      {
        col: "No",
        Cell: ({ key }, { page, perpage }) => (page - 1) * perpage + key + 1,
        width: "5%",
      },
      {
        col: "Name",
        accessor: "name",
        width: "20%",
      },
      {
        col: "Email",
        accessor: "email",
        width: "20%",
      },
      {
        col: "Status",
        Cell: ({ item }) =>
          item.package ? item.package.trackingNumber : "N/A",
        width: "20%",
      },
      {
        col: "Role",
        accessor: "role",
        width: "10%",
      },
      {
        col: "Actions",
        Cell: ({ item }) => (
          <ActionCell
            item={item}
            handleResetPwd={handleResetPwd}
            handleResetRole={handleResetRole}
          />
        ),
        width: "25%",
      },
    ],
    [handleResetPwd, handleResetRole]
  );

  const handleSetPage = useCallback(
    (params) => {
      setPage(params);
      getUsers({ page: params });
    },
    [getUsers]
  );

  const handleSetPerpage = useCallback(
    (params) => {
      setPage(1);
      setPerpage(params);
      getUsers({ page: 1, perpage: params });
    },
    [getUsers]
  );

  const handleSetSearch = useCallback(
    (params) => {
      setPage(1);
      setSearch(params);
      getUsers({ page: 1, search: params });
    },
    [getUsers]
  );

  useEffect(() => {
    (async () => {
      try {
        const response = await AXIOS.get(
          `/api/users?page=$1&perpage=5&search=`
        );
        setUsers(response.data.users);
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
            backgroundImage: "url(" + require("../../assets/img/bg4.jpg") + ")",
          }}
        ></div>
        <div className="content">
          <Container>
            <ReactTable
              columns={columns}
              data={users}
              search={search}
              setSearch={handleSetSearch}
              page={page}
              setPage={handleSetPage}
              perpage={perpage}
              setPerpage={handleSetPerpage}
              total={total}
            />
          </Container>
        </div>
      </div>
    </>
  );
};

export default Users;
