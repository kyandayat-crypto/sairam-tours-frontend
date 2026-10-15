
import { useState } from "react";
import "./Fleet.css";

const fleet = [
  {
    id: "innova",
    name: "Toyota Innova Crysta",
    type: "Premium family travel",
    seats: "6-7 Passengers",
    image: "/images/innova-crysta.jpeg",
    rates: {
      "Shirdi Airport Pickup": 1200,
      "Shirdi Railway Station Pickup": 800,
      "Kopargaon Railway Station Pickup": 1500,
      "Nagarsol Railway Station Pickup": 2500,
      "Manmad Railway Station Pickup": 3000,
      "Nashik Railway Station Pickup": 4000,
      "Nashik Airport Pickup": 4500,
      "Shani Shingnapur Darshan": 3500,
      "Nashik Darshan": 6000,
      "Chhatrapati Sambhaji Nagar Darshan": 6000,
      "Bhimashankar Darshan": 8500,
    },
  },
  {
    id: "dzire",
    name: "Maruti Suzuki Swift Dzire",
    type: "Comfortable budget travel",
    seats: "4 Passengers",
    image: "/images/swift-dzire.jpeg",
    rates: {
      "Shirdi Airport Pickup": 600,
      "Shirdi Railway Station Pickup": 400,
      "Kopargaon Railway Station Pickup": 800,
      "Nagarsol Railway Station Pickup": 1500,
      "Manmad Railway Station Pickup": 1800,
      "Nashik Railway Station Pickup": 2800,
      "Nashik Airport Pickup": 3000,
      "Shani Shingnapur Darshan": 2000,
      "Nashik Darshan": 3200,
      "Chhatrapati Sambhaji Nagar Darshan": 3200,
      "Bhimashankar Darshan": 5000,
    },
  },
  {
    id: "ertiga",
    name: "Maruti Suzuki Ertiga",
    type: "Family and group travel",
    seats: "6-7 Passengers",
    image: "/images/ertiga.jpeg",
    rates: {
      "Shirdi Airport Pickup": 700,
      "Shirdi Railway Station Pickup": 500,
      "Shani Shingnapur Darshan": 2200,
      "Nashik Darshan": 3500,
      "Chhatrapati Sambhaji Nagar Darshan": 3500,
      "Bhimashankar Darshan": 5500,
    },
  },
];

const formatPrice = (price) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);

export default function Fleet() {
  const [selectedService, setSelectedService] = useState(
    "Shirdi Railway Station Pickup"
  );

  const [selectedCar, setSelectedCar] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  const services = [
    ...new Set(fleet.flatMap((car) => Object.keys(car.rates))),
  ];

  const availableCars = fleet.filter(
    (car) => car.rates[selectedService] !== undefined
  );

  function handleServiceChange(event) {
    setSelectedService(event.target.value);
    setSelectedCar("");
  }

  function handleBooking(car) {
    const phone = customerPhone.replace(/\D/g, "");

    if (!customerName.trim()) {
      alert("Please enter your name.");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }

    const rate = car.rates[selectedService];

    const message = [
      "Hello Sai Malhar Tours & Travels Shirdi,",
      "",
      "I want to enquire about a taxi booking.",
      `Name: ${customerName.trim()}`,
      `Mobile: ${phone}`,
      `Vehicle: ${car.name}`,
      `Service: ${selectedService}`,
      `Quoted fare: ${formatPrice(rate)}`,
      "",
      "Please confirm availability and final fare.",
    ].join("\n");

    // Replace this with the actual business WhatsApp number.
    const whatsappNumber = "91XXXXXXXXXX";

    if (!/^91\d{10}$/.test(whatsappNumber)) {
      alert(
        "Please add the business WhatsApp number in Fleet.jsx first."
      );
      return;
    }

    window.open(
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  return (
    <section className="fleet-section" id="fleet">
      <div className="fleet-heading">
        <span className="fleet-eyebrow">
          SAI MALHAR TOURS &amp; TRAVELS
        </span>

        <h2>Choose Your Perfect Ride</h2>

        <p>
          Shirdi pickups, railway station transfers, airport pickups
          and pilgrimage tours at the listed fares.
        </p>
      </div>

      <div className="fleet-service-picker">
        <label htmlFor="fleet-service">
          Select Pickup / Darshan Service
        </label>

        <select
          id="fleet-service"
          value={selectedService}
          onChange={handleServiceChange}
        >
          {services.map((service) => (
            <option key={service} value={service}>
              {service}
            </option>
          ))}
        </select>
      </div>

      <div className="fleet-grid">
        {fleet.map((car) => {
          const rate = car.rates[selectedService];
          const available = rate !== undefined;
          const selected = selectedCar === car.id;

          return (
            <article
              className={`fleet-card ${selected ? "selected" : ""}`}
              key={car.id}
            >
              <div className="fleet-image-wrap">
                <img
                  src={car.image}
                  alt={car.name}
                  className="fleet-photo"
                  loading="lazy"
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                    event.currentTarget.nextElementSibling.style.display =
                      "grid";
                  }}
                />

                <div className="fleet-image-fallback">
                  Vehicle photo not found.
                  <br />
                  Check the image file in public/images.
                </div>

                <span className="fleet-seats">{car.seats}</span>
              </div>

              <div className="fleet-card-content">
                <h3>{car.name}</h3>
                <p className="fleet-car-type">{car.type}</p>

                <div className="fleet-rate-row">
                  <span>Fare for selected service</span>

                  {available ? (
                    <strong>{formatPrice(rate)}</strong>
                  ) : (
                    <strong className="fleet-unavailable">
                      Rate on request
                    </strong>
                  )}
                </div>

                {!available && (
                  <p className="fleet-note">
                    A fare for this service has not been provided.
                    Please contact the operator.
                  </p>
                )}

                <button
                  type="button"
                  className={`fleet-select-button ${
                    selected ? "active" : ""
                  }`}
                  disabled={!available}
                  onClick={() => setSelectedCar(car.id)}
                >
                  {selected
                    ? "Vehicle Selected ✓"
                    : "Select This Vehicle"}
                </button>

                {selected && available && (
                  <div className="fleet-booking-form">
                    <label>
                      Your Name
                      <input
                        type="text"
                        autoComplete="name"
                        placeholder="Enter your name"
                        value={customerName}
                        onChange={(event) =>
                          setCustomerName(event.target.value)
                        }
                      />
                    </label>

                    <label>
                      Mobile Number
                      <input
                        type="tel"
                        inputMode="numeric"
                        autoComplete="tel-national"
                        maxLength={10}
                        placeholder="10-digit mobile number"
                        value={customerPhone}
                        onChange={(event) =>
                          setCustomerPhone(
                            event.target.value
                              .replace(/\D/g, "")
                              .slice(0, 10)
                          )
                        }
                      />
                    </label>

                    <div className="fleet-total">
                      <span>Estimated fare</span>
                      <strong>{formatPrice(rate)}</strong>
                    </div>

                    <button
                      type="button"
                      className="fleet-whatsapp-button"
                      onClick={() => handleBooking(car)}
                    >
                      Enquire on WhatsApp ↗
                    </button>
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>

      <p className="fleet-disclaimer">
        Fares are based on the rates supplied by the operator.
        Confirm vehicle availability, trip details and the final
        fare before booking.
      </p>
    </section>
  );
}
