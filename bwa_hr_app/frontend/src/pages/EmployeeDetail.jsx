import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import EmployeeModal from "../components/EmployeeModal";

function EmployeeDetail() {
  useEffect(() => {
    document.title = "Employee Details";
  }, []);

  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);

  const [employee, setEmployee] = useState(null);
  const [message, setMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5001/api/employees/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setEmployee(res.data);
      } catch (err) {
        setMessage(err.response?.data?.message || "Failed to fetch employee");
      }
    };

    fetchEmployee();
  }, [id, token]);

  const handleSaveEmployee = async (form) => {
    try {
      await axios.put(`http://localhost:5001/api/employees/${id}`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const res = await axios.get(`http://localhost:5001/api/employees/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setEmployee(res.data);
      setIsModalOpen(false);
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to update employee");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this employee?")) {
      return;
    }

    try {
      await axios.delete(`http://localhost:5001/api/employees/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      navigate("/employees");
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to delete employee");
    }
  };

  if (!employee) {
    return <p className="page">Loading employee...</p>;
  }

  const formatDate = (date) => {
    if (!date) return "";
    return date.replaceAll("-", "/");
  };

  return (
    <div className="page">
      <div className="detail-header">
        <button onClick={() => navigate("/employees")}>Go back</button>

        <div>
          <button onClick={() => setIsModalOpen(true)}>Edit</button>
          <button onClick={handleDelete}>Delete</button>
        </div>
      </div>

      {message && <p className="error-message">{message}</p>}

      <div className="detail-card">
        <div className="detail-row">
          <div>
            <strong>ID</strong>
            <p>{employee.employee_id}</p>
          </div>
        </div>

        <div className="detail-row two-columns">
          <div>
            <strong>First Name</strong>
            <p>{employee.first_name}</p>
          </div>

          <div>
            <strong>Last Name</strong>
            <p>{employee.last_name}</p>
          </div>
        </div>

        <div className="detail-row two-columns">
          <div>
            <strong>Division</strong>
            <p>
              {employee.division_name}
            </p>
          </div>

          <div>
            <strong>Class</strong>
            <p>
              {employee.class_name}
            </p>
          </div>
        </div>

        <div className="detail-row">
          <div>
            <strong>Birthday</strong>
            <p>{formatDate(employee.birthday)}</p>
          </div>
        </div>
      </div>

      <EmployeeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveEmployee}
        selectedEmployee={employee}
      />
    </div>
  );
}

export default EmployeeDetail;
