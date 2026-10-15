
import { useState } from "react";
import "./App.css";
import Admin from "./Pages/Admin";
import Fleet from "./Fleet";

const API_URL = "https://sairam-tours-api.onrender.com/api";
const PHONE = "919096820758";
const initialForm = {
  customerName: "",
  phone: "",
  fromCity: "",
  toCity: "",
  journeyDate: "",
  passengers: "2",
  vehicleType: "Innova Crysta",
};

function App() {
  const [showAdmin, setShowAdmin] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  function updateForm(event) {
    setForm((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
  }

  function openWhatsApp(message) {
    const url = `https://wa.me/${PHONE}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
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

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          result.message || "Booking submit zali nahi. Please try again."
        );
      }

      const bookingId =
        result.bookingId ?? result.id ?? "Pending confirmation";

      setStatus(`Booking request successful! Booking ID: ${bookingId}`);

      const message = [
        "NEW BOOKING REQUEST - SAI MALHAR TOURS & TRAVELS",
        "",
        `Booking ID: ${bookingId}`,
        `Customer: ${form.customerName}`,
        `Phone: ${form.phone}`,
        `Pickup: ${form.fromCity}`,
        `Destination: ${form.toCity}`,
        `Journey Date: ${form.journeyDate}`,
        `Passengers: ${form.passengers}`,
        `Vehicle: ${form.vehicleType}`,
        "",
        "Please confirm vehicle availability and fare.",
      ].join("\n");

      // Open WhatsApp with booking details after successful API response.
      openWhatsApp(message);

      setForm(initialForm);
    } catch (error) {
      setStatus(
        error.message || "Server connection failed. Please try again."
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

  if (showAdmin) {
    return (
      <div className="admin-page-wrapper">
        <div className="admin-backbar">
          <button type="button" onClick={() => setShowAdmin(false)}>
            ← Back to Sai Malhar Website
          </button>
        </div>
        <Admin />
      </div>
    );
  }

  return (
    <div className="site">
      <div className="topbar">
        <span>YOUR JOURNEY, OUR PRIORITY</span>
        <span>Premium Travel Across India</span>
      </div>

      <header className="navbar">
        <a className="brand" href="#home">
          <span className="brand-mark">SM</span>
          <span className="brand-contact">
            <strong>SAI MALHAR</strong>
            <small>TOURS &amp; TRAVELS</small>
            <span className="brand-phone">9096820758</span>
          </span>
        </a>

        <nav className="nav-links">
          <a href="#home">Home</a>
          <a href="#fleet">Our Fleet</a>
          <a href="#tours">Tours</a>
          <a href="#booking">Services</a>
          <a href="#contact">Contact</a>
        </nav>

        <div className="nav-actions">
          <a
            className="nav-whatsapp"
            href={`https://wa.me/${PHONE}?text=${encodeURIComponent(
              "Hello Sai Malhar Tours & Travels, I want to enquire about vehicle availability and fare."
            )}`}
            target="_blank"
            rel="noreferrer"
            aria-label="Contact us on WhatsApp"
            title="Chat on WhatsApp"
          >
            <svg viewBox="0 0 32 32" width="26" height="26" fill="currentColor">
              <path d="M16 3a13 13 0 0 0-11.2 19.6L3 29l6.6-1.7A13 13 0 1 0 16 3Zm0 23.3a10.3 10.3 0 0 1-5.2-1.4l-.4-.2-3.9 1 1-3.8-.3-.4A10.3 10.3 0 1 1 16 26.3Zm5.7-7.7c-.3-.2-1.8-.9-2.1-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1a8.5 8.5 0 0 1-2.5-1.5 9.4 9.4 0 0 1-1.7-2.1c-.2-.4 0-.5.2-.7l.5-.6c.2-.2.2-.4.3-.6.1-.2 0-.4 0-.6l-1-2.3c-.3-.6-.6-.5-.8-.5h-.7c-.2 0-.6.1-.9.4-.3.3-1.2 1.2-1.2 2.8s1.2 3.2 1.4 3.4c.2.2 2.4 3.7 5.9 5.1.8.3 1.4.5 1.9.6.8.3 1.5.2 2.1.1.7-.1 1.8-.7 2-1.4.2-.7.2-1.3.1-1.4-.1-.1-.3-.2-.6-.4Z" />
            </svg>
          </a>

          <a className="nav-cta" href="#booking">
            BOOK YOUR RIDE <span>↗</span>
          </a>
        </div>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-shade" />
          <div className="hero-content">
            <p className="eyebrow">
              <span /> TRAVEL IN COMFORT. ARRIVE IN STYLE.
            </p>
            <h1>
              YOUR JOURNEY.
              <br />
              <span>OUR PASSION.</span>
            </h1>
            <p className="hero-description">
              Discover comfortable journeys, dependable service and
              memorable road trips with Sai Malhar Tours &amp; Travels.
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
              <span className="note-line" />
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
                  maxLength={10}
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
                  <option value="Innova Crysta">Toyota Innova Crysta</option>
                  <option value="Swift Dzire">Maruti Suzuki Swift Dzire</option>
                  <option value="Ertiga">Maruti Suzuki Ertiga</option>
                </select>
              </label>
            </div>

            <button
              type="submit"
              className="gold-button submit-button"
              disabled={loading}
            >
              {loading ? "SENDING REQUEST..." : "CONFIRM BOOKING REQUEST ↗"}
            </button>

            {status && (
              <p className="form-status" role="status">
                {status}
              </p>
            )}

            <p className="form-disclaimer">
              Your request will be saved in our booking system. Our team
              will confirm availability and fare separately.
            </p>
          </form>
        </section>

        <Fleet />

        <section className="journey-section" id="tours">
          <div className="journey-copy">
            <p className="eyebrow">MORE THAN JUST A RIDE</p>
            <h2>
              Every mile,
              <br />a better memory.
            </h2>
            <p>
              Whether it is a family holiday, airport transfer, business
              trip or weekend escape, plan your next journey with Sai
              Malhar Tours &amp; Travels.
            </p>
            <a className="gold-button" href="#booking">
              PLAN YOUR TRIP ↗
            </a>
          </div>
          <div
            className="journey-image"
            role="img"
            aria-label="Scenic road trip through the mountains"
          />
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
          <div className="footer-about">
            <a className="brand footer-brand" href="#home">
              <span className="brand-mark">SM</span>
              <span className="brand-contact">
                <strong>SAI MALHAR</strong>
                <small>TOURS &amp; TRAVELS</small>
                <span className="brand-phone">9096820758</span>
              </span>
            </a>
            <p>
              Every journey begins with trust. Travel comfortably with
              Sai Malhar Tours &amp; Travels.
            </p>
            <a className="footer-book-btn" href="#booking">
              Book Your Journey ↗
            </a>
          </div>

          <div className="footer-column">
            <h3>Quick Links</h3>
            <a href="#home">Home</a>
            <a href="#tours">About Us</a>
            <a href="#fleet">Our Fleet</a>
            <a href="#tours">Tours &amp; Destinations</a>
            <a href="#booking">Book a Ride</a>
          </div>

          <div className="footer-column">
            <h3>Our Services</h3>
            <a href="#booking">Outstation Trips</a>
            <a href="#booking">Family Travel</a>
            <a href="#booking">Group Travel</a>
            <a href="#booking">Custom Tours</a>
          </div>

          <div className="footer-column">
            <h3>Information</h3>
            <a href="#tours">About Our Company</a>
            <a href="#contact">Contact Us</a>
            <a href="#booking">Booking Enquiry</a>
            <a
              href="#admin"
              onClick={(event) => {
                event.preventDefault();
                setShowAdmin(true);
                window.scrollTo(0, 0);
              }}
            >
              Admin Panel
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} Sai Malhar Tours &amp; Travels.
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


