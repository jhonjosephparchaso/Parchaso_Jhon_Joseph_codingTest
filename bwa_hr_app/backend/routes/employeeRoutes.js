const express = require("express");
const db = require("../db");
const verifyToken = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", verifyToken, (req, res) => {
  const sql = `
    SELECT 
      e.employee_id,
      e.first_name,
      e.last_name,
      e.division_id,
      d.division_name,
      e.class_id,
      c.class_name,
      DATE_FORMAT(e.birthday, '%Y-%m-%d') AS birthday
    FROM employee_master e
    JOIN division_master d ON e.division_id = d.division_id
    JOIN class_master c ON e.class_id = c.class_id
    WHERE e.delete_flg = 0
    ORDER BY e.employee_id ASC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Server error" });
    }

    res.json(results);
  });
});

router.get("/:id", verifyToken, (req, res) => {
  const sql = `
    SELECT 
      e.employee_id,
      e.first_name,
      e.last_name,
      e.division_id,
      d.division_name,
      e.class_id,
      c.class_name,
      DATE_FORMAT(e.birthday, '%Y-%m-%d') AS birthday
    FROM employee_master e
    JOIN division_master d ON e.division_id = d.division_id
    JOIN class_master c ON e.class_id = c.class_id
    WHERE e.employee_id = ? AND e.delete_flg = 0
  `;

  db.query(sql, [req.params.id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Server error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json(results[0]);
  });
});

router.post("/", verifyToken, (req, res) => {
  const { first_name, last_name, division_id, class_id, birthday } = req.body;

  if (!first_name || !last_name || !division_id || !class_id || !birthday) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const sql = `
    INSERT INTO employee_master 
    (first_name, last_name, division_id, class_id, birthday)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [first_name, last_name, division_id, class_id, birthday],
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Server error" });
      }

      res.status(201).json({ message: "Employee created successfully" });
    }
  );
});

router.put("/:id", verifyToken, (req, res) => {
  const { first_name, last_name, division_id, class_id, birthday } = req.body;

  if (!first_name || !last_name || !division_id || !class_id || !birthday) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const sql = `
    UPDATE employee_master
    SET first_name = ?, last_name = ?, division_id = ?, class_id = ?, birthday = ?
    WHERE employee_id = ? AND delete_flg = 0
  `;

  db.query(
    sql,
    [first_name, last_name, division_id, class_id, birthday, req.params.id],
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Server error" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Employee not found" });
      }

      res.json({ message: "Employee updated successfully" });
    }
  );
});

router.delete("/:id", verifyToken, (req, res) => {
  const sql = `
    UPDATE employee_master
    SET delete_flg = 1
    WHERE employee_id = ?
  `;

  db.query(sql, [req.params.id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Server error" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json({ message: "Employee deleted successfully" });
  });
});

module.exports = router;