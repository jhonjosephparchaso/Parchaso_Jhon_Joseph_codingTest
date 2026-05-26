import { useEffect, useState } from "react";

function EmployeeModal({ isOpen, onClose, onSave, selectedEmployee }) {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    division_id: "",
    class_id: "",
    birthday: "",
  });

  useEffect(() => {
    if (selectedEmployee) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm({
        first_name: selectedEmployee.first_name,
        last_name: selectedEmployee.last_name,
        division_id: selectedEmployee.division_id,
        class_id: selectedEmployee.class_id,
        birthday: selectedEmployee.birthday,
      });
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm({
        first_name: "",
        last_name: "",
        division_id: "",
        class_id: "",
        birthday: "",
      });
    }
  }, [selectedEmployee, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "division_id") {
      setForm({
        ...form,
        division_id: value,
        class_id: "",
      });
      return;
    }

    setForm({
      ...form,
      [name]: value,
    });
  };

  const getClassOptions = () => {
    if (
      form.division_id === "1" ||
      form.division_id === 1 ||
      form.division_id === "3" ||
      form.division_id === 3
    ) {
      return [
        { id: 1, name: "A" },
        { id: 2, name: "AE" },
        { id: 3, name: "AS" },
      ];
    }

    if (form.division_id === "2" || form.division_id === 2) {
      return [
        { id: 4, name: "WA" },
        { id: 5, name: "WAE" },
        { id: 6, name: "WAS" },
      ];
    }

    return [];
  };

  const isFormValid =
    form.first_name &&
    form.last_name &&
    form.division_id &&
    form.class_id &&
    form.birthday;

  const today = new Date().toISOString().split("T")[0];

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isFormValid) return;

    onSave(form);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{selectedEmployee ? "Edit Employee" : "Employee Info"}</h2>

        <form onSubmit={handleSubmit}>
          <div className="modal-form-row">
            <label>First Name:</label>
            <input
              type="text"
              name="first_name"
              value={form.first_name}
              onChange={handleChange}
            />
          </div>

          <div className="modal-form-row">
            <label>Last Name:</label>
            <input
              type="text"
              name="last_name"
              value={form.last_name}
              onChange={handleChange}
            />
          </div>

          <div className="modal-form-row">
            <label>Division:</label>
            <select
              name="division_id"
              value={form.division_id}
              onChange={handleChange}
            >
              <option value="" disabled></option>
              <option value="1">Mobile</option>
              <option value="2">Web</option>
              <option value="3">Infra</option>
            </select>
          </div>

          <div className="modal-form-row">
            <label>Class:</label>
            <select
              name="class_id"
              value={form.class_id}
              onChange={handleChange}
              disabled={!form.division_id}
            >
              <option value="" disabled></option>
              {getClassOptions().map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <div className="modal-form-row">
            <label>Birthday:</label>
            <input
              type="date"
              name="birthday"
              value={form.birthday}
              max={today}
              onChange={handleChange}
            />
          </div>
          
          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>

            <button type="submit" disabled={!isFormValid}>
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EmployeeModal;
