
import { useState } from "react";
import "./App.css";

const API_URL = "http://localhost:5264/api";

const fleet = [
  {
    name: "Premium Sedan",
    type: "Comfortable city travel",
    seats: "4 Passengers",
    image:
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "Luxury SUV",
    type: "Family and outstation trips",
    seats: "6-7 Passengers",
    image:
      "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "Travel Van",
    type: "Group and family journeys",
    seats: "8+ Passengers",
    image:
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=900&q=85",
  },
];

function App() {
  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    fromCity: "",
    toCity: "",
    journeyDate: "",
    passengers: "2",
    vehicleType: "SUV",
  });

  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  function updateForm(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function submitBooking(event) {
    event.preventDefault();
    setLoading(true);
    setStatus("");

    try {
      const response = await fetch(`${API_URL}/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          passengers: Number(form.passengers),
          journeyDate: `${form.journeyDate}T00:00:00`,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Booking submit zali nahi.");
      }
      const bookingId = result.bookingId ?? result.id ?? "Not returned";

      setStatus(
        `Booking successful! Tumcha Booking ID: ${bookingId}`
      );

      setForm({
        customerName: "",
        phone: "",
        fromCity: "",
        toCity: "",
        journeyDate: "",
        passengers: "2",
        vehicleType: "SUV",
      });
    } catch (error) {
      setStatus(
        error.message ||
          "Server connect hot nahi. Backend chalu aahe ka te check kara."
      );
    } finally {
      setLoading(false);
    }
  }

  const today = new Date();
  const minDate = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  return (
    <div className="site">
      <div className="topbar">
        <span>YOUR JOURNEY, OUR PRIORITY</span>
        <span>Premium Travel Across India</span>
      </div>

      <header className="navbar">
        <a className="brand" href="#home">
          <span className="brand-mark">SR</span>
          <span>
            <strong>SAI RAM</strong>
            <small>TOURS & TRAVELS</small>
          </span>
        </a>

        <nav className="nav-links">
          <a href="#home">Home</a>
          <a href="#fleet">Our Fleet</a>
          <a href="#tours">Tours</a>
          <a href="#booking">Services</a>
          <a href="#contact">Contact</a>
        </nav>

        <a className="nav-cta" href="#booking">
          BOOK YOUR RIDE <span>↗</span>
        </a>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-shade"></div>
          <div className="hero-content">
            <p className="eyebrow">
              <span></span> TRAVEL IN COMFORT. ARRIVE IN STYLE.
            </p>

            <h1>
              YOUR JOURNEY.
              <br />
              <span>OUR PASSION.</span>
            </h1>

            <p className="hero-description">
              Discover comfortable journeys, dependable service and
              memorable road trips with Sai Ram Tours & Travels.
            </p>

            <div className="hero-actions">
              <a className="gold-button" href="#booking">
                BOOK YOUR JOURNEY <span>↗</span>
              </a>
              <a className="outline-button" href="#fleet">
                EXPLORE OUR FLEET
              </a>
            </div>

            <div className="hero-note">
              <span className="note-line"></span>
              COMFORT · CARE · EVERY MILE
            </div>
          </div>

          <div className="hero-bottom">
            <span>PRIVATE TRANSFERS</span>
            <span>OUTSTATION TRIPS</span>
            <span>FAMILY TOURS</span>
          </div>
        </section>

        <section className="booking-strip" id="booking">
          <div className="section-intro">
            <p className="eyebrow dark-eyebrow">START YOUR JOURNEY</p>
            <h2>Reserve Your Ride</h2>
            <p>Share your travel details and send a booking request.</p>
          </div>

          <form className="booking-form" onSubmit={submitBooking}>
            <div className="form-grid">
              <label>
                Full Name
                <input
                  name="customerName"
                  value={form.customerName}
                  onChange={updateForm}
                  placeholder="Enter your name"
                  required
                />
              </label>

              <label>
                Phone Number
                <input
                  name="phone"
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]{10}"
                  maxLength="10"
                  value={form.phone}
                  onChange={updateForm}
                  placeholder="10-digit mobile number"
                  required
                />
              </label>

              <label>
                Pickup Location
                <input
                  name="fromCity"
                  value={form.fromCity}
                  onChange={updateForm}
                  placeholder="From city"
                  required
                />
              </label>

              <label>
                Destination
                <input
                  name="toCity"
                  value={form.toCity}
                  onChange={updateForm}
                  placeholder="To city"
                  required
                />
              </label>

              <label>
                Journey Date
                <input
                  name="journeyDate"
                  type="date"
                  min={minDate}
                  value={form.journeyDate}
                  onChange={updateForm}
                  required
                />
              </label>

              <label>
                Passengers
                <select
                  name="passengers"
                  value={form.passengers}
                  onChange={updateForm}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 15, 20].map(
                    (number) => (
                      <option key={number} value={number}>
                        {number} passenger{number > 1 ? "s" : ""}
                      </option>
                    )
                  )}
                </select>
              </label>

              <label className="full-width">
                Select Vehicle
                <select
                  name="vehicleType"
                  value={form.vehicleType}
                  onChange={updateForm}
                >
                  <option value="Sedan">Premium Sedan</option>
                  <option value="SUV">SUV / Family Car</option>
                  <option value="Innova">Innova</option>
                  <option value="Tempo Traveller">Tempo Traveller</option>
                  <option value="Bus">Bus</option>
                </select>
              </label>
            </div>

            <button className="gold-button submit-button" disabled={loading}>
              {loading ? "SENDING REQUEST..." : "CONFIRM BOOKING REQUEST ↗"}
            </button>

            {status && (
              <p className="form-status" role="status">
                {status}
              </p>
            )}

            <p className="form-disclaimer">
              Your request will be saved in our booking system. The team
              can confirm availability and fare separately.
            </p>
          </form>
        </section>

        <section className="fleet-section" id="fleet">
          <div className="section-heading">
            <div>
              <p className="eyebrow dark-eyebrow">TRAVEL YOUR WAY</p>
              <h2>Explore Our Fleet</h2>
            </div>
            <p>
              Choose the right ride for your next city transfer, family
              outing or long-distance journey.
            </p>
          </div>

          <div className="fleet-grid">
            {fleet.map((vehicle) => (
              <article className="fleet-card" key={vehicle.name}>
                <div className="fleet-image">
                  <img src={vehicle.image} alt={vehicle.name} loading="lazy" />
                  <span className="fleet-tag">SAI RAM TRAVELS</span>
                </div>
                <div className="fleet-info">
                  <div>
                    <h3>{vehicle.name}</h3>
                    <p>{vehicle.type}</p>
                  </div>
                  <span className="seat-count">{vehicle.seats}</span>
                  <a href="#booking" className="fleet-link">
                    ENQUIRE NOW <span>↗</span>
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="journey-section" id="tours">
          <div className="journey-copy">
            <p className="eyebrow">MORE THAN JUST A RIDE</p>
            <h2>
              Every mile,
              <br />
              a better memory.
            </h2>
            <p>
              Whether it is a family holiday, airport transfer, business
              trip or weekend escape, plan your next journey with Sai Ram
              Tours & Travels.
            </p>
            <a className="gold-button" href="#booking">
              PLAN YOUR TRIP ↗
            </a>
          </div>
          <div className="journey-image" role="img" aria-label="Scenic road trip through the mountains"></div>
        </section>

        <section className="services-section">
          <p className="eyebrow dark-eyebrow">TRAVEL WITH CONFIDENCE</p>
          <h2>Made for Your Journey</h2>
          <div className="services-grid">
            <article>
              <span>01</span>
              <h3>Outstation Trips</h3>
              <p>Plan comfortable intercity and long-distance journeys.</p>
            </article>
            <article>
              <span>02</span>
              <h3>Family Travel</h3>
              <p>Choose a vehicle to suit your group and travel needs.</p>
            </article>
            <article>
              <span>03</span>
              <h3>Custom Tours</h3>
              <p>Share your route and schedule to request a tailored trip.</p>
            </article>
          </div>
        </section>
      </main>

      

<footer className="footer" id="contact">
  <div className="footer-main">

    {/* BRAND COLUMN */}
    <div className="footer-about">
      <a className="brand footer-brand" href="#home">
        <span className="brand-mark">SR</span>
        <span>
          <strong>SAI RAM</strong>
          <small>TOURS &amp; TRAVELS</small>
        </span>
      </a>

      <p>
        Every journey begins with trust. Travel comfortably
        with Sai Ram Tours &amp; Travels.
      </p>

      <a className="footer-book-btn" href="#booking">
        Book Your Journey ↗
      </a>
    </div>

    {/* QUICK LINKS */}
    <div className="footer-column">
      <h3>Quick Links</h3>
      <a href="#home">Home</a>
      <a href="#about">About Us</a>
      <a href="#fleet">Our Fleet</a>
      <a href="#tours">Tours &amp; Destinations</a>
      <a href="#booking">Book a Ride</a>
    </div>

    {/* SERVICES */}
    <div className="footer-column">
      <h3>Our Services</h3>
      <a href="#booking">Outstation Trips</a>
      <a href="#booking">Family Travel</a>
      <a href="#booking">Group Travel</a>
      <a href="#booking">Custom Tours</a>
    </div>

    {/* INFORMATION */}
    <div className="footer-column">
      <h3>Information</h3>
      <a href="#about">About Our Company</a>
      <a href="#contact">Contact Us</a>
      <a href="#booking">Booking Enquiry</a>
      <a href="/admin">Admin Panel</a>
    </div>

  </div>

  {/* BOTTOM FOOTER */}
  <div className="footer-bottom">
    <p>
      © {new Date().getFullYear()} Sai Ram Tours &amp; Travels.
      All rights reserved.
      
    </p>
         <div className="creator-info">
    <p>Created by: krushna_yandayat</p>
    <p>Mobile: 9096820758</p>
  </div>
  
    <a href="#home">Home ↑</a>
  </div>
</footer>

    </div>
  );
}

export default App;
