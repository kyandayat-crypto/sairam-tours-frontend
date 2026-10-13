
import { useEffect, useState } from "react";
import "./Admin.css";

const API_URL = "http://localhost:5264/api";

const menu = [
  { id: "dashboard", icon: "▦", label: "Dashboard" },
  { id: "bookings", icon: "▤", label: "Bookings" },
  { id: "vehicles", icon: "🚘", label: "Vehicles" },
  { id: "customers", icon: "♙", label: "Customers & Payments" },
  { id: "settings", icon: "⚙", label: "Website Settings" },
];

const demoBookings = [
  { id: 1, customer: "Rahul Patil", mobile: "9876543210", pickup: "Aurangabad", destination: "Pune", date: "2026-10-15", fare: 4500, status: "Pending" },
  { id: 2, customer: "Amit Sharma", mobile: "9876543211", pickup: "Pune", destination: "Mumbai", date: "2026-10-16", fare: 5500, status: "Confirmed" },
];

export default function Admin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [bookings, setBookings] = useState(demoBookings);
  const [vehicles, setVehicles] = useState([
    { id: 1, name: "Premium Sedan", seats: 4, price: 15, available: true },
    { id: 2, name: "Luxury SUV", seats: 7, price: 22, available: true },
    { id: 3, name: "Travel Van", seats: 12, price: 28, available: false },
  ]);
  const [settings, setSettings] = useState({
    phone: "9096820758",
    whatsapp: "9096820758",
    offer: "Book your next journey with Sai Ram Tours!",
    city: "Chhatrapati Sambhajinagar",
  });

  useEffect(() => {
    if (!loggedIn) return;

    fetch(`${API_URL}/bookings`)
      .then((response) => {
        if (!response.ok) throw new Error("API unavailable");
        return response.json();
      })
      .then((data) => {
        const list = Array.isArray(data)
          ? data
          : data.$values || data.bookings || [];

        if (!list.length) return;

        setBookings(list.map((b, index) => ({
          id: b.id ?? b.bookingId ?? index + 1,
          customer: b.customerName ?? b.name ?? b.fullName ?? "Customer",
          mobile: b.mobile ?? b.phone ?? b.phoneNumber ?? "—",
          pickup: b.pickup ?? b.pickupLocation ?? b.fromCity ?? "—",
          destination: b.destination ?? b.dropLocation ?? b.toCity ?? "—",
          date: (b.travelDate ?? b.journeyDate ?? b.date ?? "").toString().slice(0, 10),
          fare: Number(b.fare ?? b.price ?? b.amount ?? 0),
          status: b.status ?? "Pending",
        })));
      })
      .catch(() => {
        // API unavailable asel tar demo bookings disatil.
      });
  }, [loggedIn]);

  function handleLogin(event) {
    event.preventDefault();

    // He demo credentials aahet. Production sathi backend authentication lava.
    if (username === "admin" && password === "SaiRam@123") {
      setLoggedIn(true);
      setError("");
    } else {
      setError("Username kiwa password chukicha aahe.");
    }
  }

  function updateStatus(id, status) {
    setBookings((old) =>
      old.map((booking) =>
        booking.id === id ? { ...booking, status } : booking
      )
    );
  }

  function addVehicle() {
    const name = prompt("Vehicle name taka:");
    if (!name?.trim()) return;

    const seats = Number(prompt("Seating capacity kiti?", "4")) || 4;
    const price = Number(prompt("Per km price taka:", "15")) || 15;

    setVehicles((old) => [
      ...old,
      {
        id: Date.now(),
        name: name.trim(),
        seats,
        price,
        available: true,
      },
    ]);
  }

  const today = new Date().toISOString().slice(0, 10);
  const todaysBookings = bookings.filter((b) => b.date === today).length;
  const pending = bookings.filter((b) => b.status === "Pending").length;
  const monthlyIncome = bookings
    .filter((b) => b.status === "Confirmed" && b.date.startsWith(today.slice(0, 7)))
    .reduce((sum, b) => sum + Number(b.fare || 0), 0);
  const customers = new Set(bookings.map((b) => b.mobile).filter((m) => m !== "—")).size;

  if (!loggedIn) {
    return (
      <main className="admin-login-page">
        <form className="admin-login-card" onSubmit={handleLogin}>
          <div className="admin-logo">SR</div>
          <p className="admin-eyebrow">SAI RAM TOURS & TRAVELS</p>
          <h1>Owner Login</h1>
          <p className="admin-muted">Sign in to manage your travel business.</p>

          <label htmlFor="admin-username">Username</label>
          <input
            id="admin-username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
            autoComplete="username"
            required
          />

          <label htmlFor="admin-password">Password</label>
          <input
            id="admin-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            autoComplete="current-password"
            required
          />

          {error && <p className="admin-error">{error}</p>}
          <button className="admin-primary-btn" type="submit">Login to Admin →</button>
          <a className="admin-back-link" href="/">← Back to website</a>
        </form>
      </main>
    );
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <a className="admin-brand" href="/">
          <span className="admin-brand-mark">SR</span>
          <span><strong>SAI RAM</strong><small>OWNER PANEL</small></span>
        </a>

        <p className="admin-menu-label">MANAGEMENT</p>
        <nav className="admin-nav">
          {menu.map((item) => (
            <button
              key={item.id}
              className={activeTab === item.id ? "admin-nav-item active" : "admin-nav-item"}
              onClick={() => setActiveTab(item.id)}
            >
              <span>{item.icon}</span>{item.label}
            </button>
          ))}
        </nav>

        <div className="admin-sidebar-bottom">
          <span className="admin-online-dot" /> Owner access
          <button onClick={() => setLoggedIn(false)}>↪ Logout</button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div>
            <p className="admin-eyebrow">SAI RAM TOURS & TRAVELS</p>
            <h1>{menu.find((item) => item.id === activeTab)?.label}</h1>
          </div>
          <a href="/" className="admin-view-site">↗ View Website</a>
        </header>

        {activeTab === "dashboard" && (
          <>
            <section className="admin-welcome">
              <div>
                <p>OWNER OVERVIEW</p>
                <h2>Welcome back, Admin 👋</h2>
                <span>Here is what is happening with your business.</span>
              </div>
              <div className="admin-welcome-icon">✦</div>
            </section>

            <section className="admin-stat-grid">
              <article className="admin-stat-card">
                <span>Total Bookings</span><strong>{bookings.length}</strong><small>All booking records</small>
              </article>
              <article className="admin-stat-card">
                <span>Today's Bookings</span><strong>{todaysBookings}</strong><small>Traveling today</small>
              </article>
              <article className="admin-stat-card">
                <span>Total Customers</span><strong>{customers}</strong><small>Unique phone numbers</small>
              </article>
              <article className="admin-stat-card">
                <span>Monthly Income</span><strong>₹{monthlyIncome.toLocaleString("en-IN")}</strong><small>Confirmed bookings</small>
              </article>
            </section>

            <section className="admin-panel">
              <div className="admin-panel-heading">
                <div><h2>Recent Bookings</h2><p>Latest travel reservations</p></div>
                <button className="admin-outline-btn" onClick={() => setActiveTab("bookings")}>View all →</button>
              </div>
              <BookingTable bookings={bookings.slice(0, 5)} onStatusChange={updateStatus} />
            </section>

            <section className="admin-stat-grid admin-bottom-stats">
              <article className="admin-stat-card">
                <span>Pending Enquiries</span><strong>{pending}</strong><small>Need your attention</small>
              </article>
              <article className="admin-stat-card">
                <span>Available Vehicles</span><strong>{vehicles.filter((v) => v.available).length}</strong><small>Ready for booking</small>
              </article>
            </section>
          </>
        )}

        {activeTab === "bookings" && (
          <section className="admin-panel">
            <div className="admin-panel-heading">
              <div><h2>Booking Management</h2><p>Review bookings and update their status.</p></div>
            </div>
            <BookingTable bookings={bookings} onStatusChange={updateStatus} />
            <p className="admin-note">Status updates are currently in this page only; database saving will be connected next.</p>
          </section>
        )}

        {activeTab === "vehicles" && (
          <section className="admin-panel">
            <div className="admin-panel-heading">
              <div><h2>Your Fleet</h2><p>Manage vehicles and their availability.</p></div>
              <button className="admin-primary-btn admin-small-btn" onClick={addVehicle}>+ Add Vehicle</button>
            </div>
            <div className="admin-vehicle-grid">
              {vehicles.map((vehicle) => (
                <article className="admin-vehicle-card" key={vehicle.id}>
                  <div className="admin-car-icon">🚘</div>
                  <h3>{vehicle.name}</h3>
                  <p>{vehicle.seats} seats · ₹{vehicle.price}/km</p>
                  <span className={vehicle.available ? "admin-status confirmed" : "admin-status pending"}>
                    {vehicle.available ? "Available" : "Unavailable"}
                  </span>
                  <button
                    className="admin-outline-btn"
                    onClick={() => setVehicles((old) => old.map((v) => v.id === vehicle.id ? { ...v, available: !v.available } : v))}
                  >
                    Change Availability
                  </button>
                </article>
              ))}
            </div>
            <p className="admin-note">Vehicle changes are demo-only for now; permanent saving and vehicle photos will be connected to the backend.</p>
          </section>
        )}

        {activeTab === "customers" && (
          <section className="admin-panel">
            <div className="admin-panel-heading">
              <div><h2>Customers & Payments</h2><p>Customer contact details and booking fare overview.</p></div>
            </div>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead><tr><th>Customer</th><th>Mobile</th><th>Journey</th><th>Total Fare</th><th>Status</th></tr></thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b.id}>
                      <td>{b.customer}</td><td>{b.mobile}</td>
                      <td>{b.pickup} → {b.destination}</td>
                      <td>₹{Number(b.fare || 0).toLocaleString("en-IN")}</td>
                      <td><span className={`admin-status ${b.status.toLowerCase()}`}>{b.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="admin-note">Advance and balance payments are not stored yet; they need payment fields in the database.</p>
          </section>
        )}

        {activeTab === "settings" && (
          <section className="admin-panel admin-settings-panel">
            <div className="admin-panel-heading">
              <div><h2>Website Settings</h2><p>Update the contact and promotional details.</p></div>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); alert("Settings are updated in this demo session."); }}>
              <label>Contact Number</label>
              <input value={settings.phone} onChange={(e) => setSettings({ ...settings, phone: e.target.value })} />
              <label>WhatsApp Number</label>
              <input value={settings.whatsapp} onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })} />
              <label>Service City</label>
              <input value={settings.city} onChange={(e) => setSettings({ ...settings, city: e.target.value })} />
              <label>Homepage Offer / Banner Text</label>
              <textarea rows="3" value={settings.offer} onChange={(e) => setSettings({ ...settings, offer: e.target.value })} />
              <button className="admin-primary-btn" type="submit">Save Settings</button>
            </form>
            <p className="admin-note">Settings currently stay in this browser session. Next, we can save them permanently to MySQL.</p>
          </section>
        )}
      </main>
    </div>
  );
}

function BookingTable({ bookings, onStatusChange }) {
  if (!bookings.length) return <p className="admin-empty">No bookings found.</p>;

  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr><th>Booking</th><th>Customer</th><th>Journey</th><th>Date</th><th>Fare</th><th>Status</th></tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b.id}>
              <td>#{b.id}</td>
              <td><strong>{b.customer}</strong><small className="admin-cell-small">{b.mobile}</small></td>
              <td>{b.pickup} → {b.destination}</td>
              <td>{b.date || "—"}</td>
              <td>₹{Number(b.fare || 0).toLocaleString("en-IN")}</td>
              <td>
                <select value={b.status} onChange={(e) => onStatusChange(b.id, e.target.value)}>
                  <option>Pending</option>
                  <option>Confirmed</option>
                  <option>Completed</option>
                  <option>Cancelled</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
