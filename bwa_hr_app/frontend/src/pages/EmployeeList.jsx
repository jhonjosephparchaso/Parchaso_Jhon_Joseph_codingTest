import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../redux/authSlice";
import { setEmployees } from "../redux/employeeSlice";
import EmployeeModal from "../components/EmployeeModal";

function EmployeeList() {
  useEffect(() => {
    document.title = "Employee List";
  }, []);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { token } = useSelector((state) => state.auth);
  const employees = useSelector((state) => state.employees.employees);

  const [message, setMessage] = useState("");

  const [searchTerm, setSearchTerm] = useState("");

  const [sortConfig, setSortConfig] = useState({
    key: "employee_id",
    direction: "asc",
  });

  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get("http://localhost:5001/api/employees", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        dispatch(setEmployees(res.data));
      } catch (err) {
        setMessage(err.response?.data?.message || "Failed to fetch employees");
      }
    };

    fetchEmployees();
  }, [token, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const filteredEmployees = employees.filter((employee) => {
    const searchValue = searchTerm.toLowerCase();

    return (
      employee.employee_id.toString().includes(searchValue) ||
      employee.first_name.toLowerCase().includes(searchValue) ||
      employee.last_name.toLowerCase().includes(searchValue) ||
      employee.division_name.toLowerCase().includes(searchValue) ||
      employee.class_name.toLowerCase().includes(searchValue) ||
      employee.birthday.toLowerCase().includes(searchValue)
    );
  });

  const sortedEmployees = [...filteredEmployees].sort((a, b) => {
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (aValue < bValue) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }

    if (aValue > bValue) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }

    return 0;
  });

  const totalPages = Math.ceil(sortedEmployees.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const paginatedEmployees = sortedEmployees.slice(startIndex, endIndex);

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const getSortArrow = (key) => {
    if (sortConfig.key !== key) return "▾";
    return sortConfig.direction === "asc" ? "▲" : "▼";
  };

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleSaveEmployee = async (form) => {
    try {
      if (selectedEmployee) {
        await axios.put(
          `http://localhost:5001/api/employees/${selectedEmployee.employee_id}`,
          form,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
      } else {
        await axios.post("http://localhost:5001/api/employees", form, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      setIsModalOpen(false);
      setSelectedEmployee(null);

      const res = await axios.get("http://localhost:5001/api/employees", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      dispatch(setEmployees(res.data));
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to save employee");
    }
  };

  const formatDate = (date) => {
    if (!date) return "";
    return date.replaceAll("-", "/");
  };

  return (
    <div className="page">
      {message && <p className="error-message">{message}</p>}

      <div className="table-card">
        <div className="list-actions">
          <div className="search-box">
            <span className="search-icon">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <div className="right-actions">
            <button onClick={handleLogout}>Logout</button>

            <button
              onClick={() => {
                setSelectedEmployee(null);
                setIsModalOpen(true);
              }}
            >
              Add
            </button>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th onClick={() => handleSort("employee_id")}>
                ID <span>{getSortArrow("employee_id")}</span>
              </th>
              <th onClick={() => handleSort("first_name")}>
                First Name <span>{getSortArrow("first_name")}</span>
              </th>
              <th onClick={() => handleSort("last_name")}>
                Last Name <span>{getSortArrow("last_name")}</span>
              </th>
              <th onClick={() => handleSort("division_name")}>
                Division <span>{getSortArrow("division_name")}</span>
              </th>
              <th onClick={() => handleSort("class_name")}>
                Class <span>{getSortArrow("class_name")}</span>
              </th>
              <th onClick={() => handleSort("birthday")}>
                Birthday <span>{getSortArrow("birthday")}</span>
              </th>
            </tr>
          </thead>

          <tbody>
            {paginatedEmployees.length === 0 ? (
              <tr>
                <td colSpan="6">No employees found.</td>
              </tr>
            ) : (
              paginatedEmployees.map((employee) => (
                <tr
                  key={employee.employee_id}
                  onClick={() => navigate(`/employees/${employee.employee_id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <td>{employee.employee_id}</td>
                  <td>{employee.first_name}</td>
                  <td>{employee.last_name}</td>
                  <td>
                    {employee.division_id}. {employee.division_name}
                  </td>
                  <td>
                    {employee.class_id}. {employee.class_name}
                  </td>
                  <td>{formatDate(employee.birthday)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="pagination">
          <div>
            Number of items:
            <select value={itemsPerPage} onChange={handleItemsPerPageChange}>
              <option value={5}>5</option>
              <option value={10}>10</option>
            </select>
          </div>

          <span>
            {sortedEmployees.length === 0
              ? "0-0 of 0"
              : `${startIndex + 1}-${Math.min(endIndex, sortedEmployees.length)} of ${
                  sortedEmployees.length
                }`}
          </span>

          <button onClick={handlePreviousPage} disabled={currentPage === 1}>
            ‹
          </button>

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            ›
          </button>
        </div>
      </div>

      <EmployeeModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedEmployee(null);
        }}
        onSave={handleSaveEmployee}
        selectedEmployee={selectedEmployee}
      />
    </div>
  );
}

export default EmployeeList;
