import React, { useCallback, useState } from "react";
import {
  Input,
  Table,
  Pagination,
  PaginationItem,
  PaginationLink,
  FormGroup,
  Form,
  Card,
} from "reactstrap";
import MyInput from "../form/MyInput";
import "./style.css";

const ReactTable = (props) => {
  const {
    columns,
    data = [],
    search,
    setSearch,
    page,
    setPage,
    perpage,
    setPerpage,
    total,
    addnew = null,
    sort = "updatedAt",
    setSort,
    sortdir = "desc",
    setSortdir,
  } = props;

  const [search_, setSearch_] = useState(search);

  const handleSearchChange = useCallback(
    ({ target: { value } }) => setSearch_(value),
    []
  );
  const handleSetSearch = useCallback(
    (e) => {
      e.preventDefault();
      setSearch(search_);
    },
    [setSearch, search_]
  );
  const handlePerpageChange = useCallback(
    ({ target: { value } }) => {
      setPerpage(value);
    },
    [setPerpage]
  );
  const handleClickNext = useCallback(() => {
    setPage(page + 1);
  }, [page, setPage]);
  const handleClickPrev = useCallback(() => {
    setPage(page - 1);
  }, [page, setPage]);

  return (
    <Card
      className="react-table card-plain bg-transparent"
      data-background-color="blue"
    >
      <div className="d-flex flex-wrap justify-content-between">
        <div className="col-lg-3 col-md-4 col-sm-6 col-8">
          <Form onSubmit={handleSetSearch}>
            <MyInput
              icon="ui-1_zoom-bold"
              type="search"
              placeholder="Search ..."
              value={search_}
              onChange={handleSearchChange}
            />
          </Form>
        </div>
        {addnew && <div>{addnew()}</div>}
      </div>
      <div className="table-responsive mt-1 mb-1">
        <Table className="text-white table-striped middle-td">
          <thead>
            <tr>
              {columns.map((item, key) => (
                <th
                  key={key}
                  width={item.width}
                  className={
                    item.sortable
                      ? `cursor-pointer sortable ${
                          item.sortable === sort ? sortdir : ""
                        }`
                      : ""
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    if (item.sortable) {
                      if (item.sortable !== sort) setSort(item.sortable);
                      if (item.sortable === sort)
                        setSortdir(sortdir === "asc" ? "desc" : "asc");
                    }
                  }}
                >
                  {item.Col ? item.Col() : item.col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, key) => (
              <tr key={key}>
                {columns.map((col, key1) => (
                  <td key={key1}>
                    {col.accessor
                      ? item[col.accessor]
                      : col.Cell({ item, key }, props)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <div className="d-flex justify-content-between">
        <div>
          <FormGroup className="no-border">
            <Input type="select" value={perpage} onChange={handlePerpageChange}>
              <option value={5} className="text-primary">
                5
              </option>
              <option value={10} className="text-primary">
                10
              </option>
              <option value={20} className="text-primary">
                20
              </option>
              <option value={50} className="text-primary">
                50
              </option>
            </Input>
          </FormGroup>
        </div>
        <div>
          <nav aria-label="Page navigation">
            <Pagination className="pagination justify-content-end">
              <PaginationItem className={page === 1 ? "disabled" : ""}>
                <PaginationLink
                  href="#pablo"
                  onClick={handleClickPrev}
                  className="text-white bg-info"
                  tabIndex="-1"
                >
                  Prev
                </PaginationLink>
              </PaginationItem>
              {Array.from({ length: Math.ceil(total / perpage) }, (_, key) => (
                <PaginationItemElement
                  key={key}
                  index={key}
                  page={page}
                  setPage={setPage}
                />
              ))}
              <PaginationItem
                className={
                  page === Math.ceil(total / perpage) ? "disabled" : ""
                }
              >
                <PaginationLink
                  href="#pablo"
                  onClick={handleClickNext}
                  className="text-white bg-info"
                >
                  Next
                </PaginationLink>
              </PaginationItem>
            </Pagination>
          </nav>
        </div>
      </div>
    </Card>
  );
};

const PaginationItemElement = ({ index, page, setPage }) => {
  const handlePageClick = useCallback(
    (e) => {
      e.preventDefault();
      setPage(index + 1);
    },
    [setPage, index]
  );

  return (
    <PaginationItem>
      <PaginationLink
        href="#pablo"
        onClick={handlePageClick}
        className={`text-white bg-${index + 1 === page ? "secondary" : "info"}`}
      >
        {index + 1}{" "}
        {index + 1 === page && <span className="sr-only">(current)</span>}
      </PaginationLink>
    </PaginationItem>
  );
};

export default ReactTable;
