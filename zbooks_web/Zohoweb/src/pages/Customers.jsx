import { useEffect, useState } from "react";
import { getCustomers, createCustomer } from "../api/customers";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const data = await getCustomers();
      setCustomers(data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createCustomer(form);
      setForm({ name: "", email: "", phone: "" });
      fetchCustomers();
    } catch (error) {
      console.error("Error creating customer:", error);
    }
  };

  return (
    <div>
      <h1>Customers</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="text"
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <button type="submit">Add</button>
      </form>

      <ul>
        {customers.map((c) => (
          <li key={c.id}>
            {c.name} — {c.email} — {c.phone}
          </li>
        ))}
      </ul>
    </div>
  );
}
