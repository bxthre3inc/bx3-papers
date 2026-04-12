# Bxthre3 Deep-Dive: Unit Economics & Technical Interdependencies

## 1. The \"Resolution Pop\" Revenue Architecture

The \"Pop\" is the commercial gate. Here is how the tiers translate to
COGS (Cost of Goods Sold) and Revenue.

  --------------------------------------------------------------------------------------------------
  **Tier**         **Resolution**   **Data Source**   **Processing      **Margin**   **User Value**
                                                      (Zo)**                         
  ---------------- ---------------- ----------------- ----------------- ------------ ---------------
  **Free**         50m              Sentinel-2        Minimal / Cache   95%          Awareness
                                    (Public)                                         

  **Basic**        20m              Sentinel-2        Batch Kriging     85%          Basic Reporting
                                    (Refined)                                        

  **Pro**          10m              Planet/Airbus     Real-time         60%          Precision Ag
                                    (Commercial)      Bayesian                       

  **Enterprise**   **1m**           **Terrestrial +   **High-Fidelity   **75%**      **Legal/Trial
                                    Synthetic**       DEM**                          QCV**
  --------------------------------------------------------------------------------------------------

**The \"Pop\" Trigger:** When a user at the 20m tier attempts to
generate a **DEM (Worksheet)** for a specific valve, the system blocks
execution until they \"Pop\" to Enterprise. Why? Because 20m data is too
\"noisy\" for deterministic legal proof. **The Pop is a requirement for
legal safety.**

## 2. Hardware Bill of Materials (BOM) & Scalability

To hit your \"Money ASAP\" goal, we must understand the cost to deploy
the **Sovereign Infrastructure**.

### A. The Hub (Edge Gateway)

-   **Estimated COGS:** \$450 - \$600 (Industrial Grade).

-   **Key Components:** Raspberry Pi Compute Module 4 or IMX8, LTE
    > Cat-M1 Modem, LoRa Concentrator, High-Precision RTC.

-   **Value Multiplier:** This is the only device that can generate the
    > **IRP Ledger**. It is sold as a \"Compliance Lease\" at
    > \$2,500/year.

### B. The Relay (Data Aggregation Node)

-   **Estimated COGS:** \$120 - \$180.

-   **Key Components:** ESP32-S3, LoRa Transceiver, Solar Charge
    > Controller, 18650 Li-ion.

-   **Ratio:** 1 Relay per 40 acres.

### C. The Sensor (Telemetric Endpoint)

-   **Estimated COGS:** \$45 - \$85 (Depending on probe type).

-   **Key Components:** Capacitive soil moisture, I2C interface, Sub-GHz
    > radio.

-   **Ratio:** 5-10 Sensors per Relay cluster.

## 3. The \"Zo\" Scientific Workflow: Deep Logic

When **Zo (The Scientist)** receives a request from the **Map Manager
(The Librarian)**, it performs a 3-step deterministic calculation:

1.  **Vertical Profiling:** Zo correlates surface NDVI (from satellite)
    > with deep-soil VWC (from sensors).

2.  **Horizontal Interpolation (Kriging):** Zo fills the gaps between
    > physical sensors using the 1m elevation and slope data provided by
    > the Map Manager.

3.  **The Worksheet Output:** Instead of a complex map, Zo spits out a
    > **JSON Worksheet** for the Hub.

    -   *Example:* IF sensor_01 \< 0.22 AND time \> 04:00 THEN
        > pulse_valve_A(45min).

## 4. The June 29th \"Hook\" Economics

Why is a farmer willing to pay a \$25,000 retainer?

-   **The Cost of Loss:** Average water right value in Subdistrict 1 can
    > exceed \$3,000 per acre-foot. A 500-acre farm losing 20% of its
    > allocation loses **\$300,000 in asset value.**

-   **The Bxthre3 Fee:** \$25,000 for the infrastructure + \$5,000 for
    > the QCV report.

-   **ROI:** 10:1. You are selling the cheapest \"Insurance Policy\" in
    > the valley.

## 5. Deployment Roadmap: The \"First 5 Fields\"

1.  **Selection:** Identify 5 high-stakes farms in the June 29th
    > litigation.

2.  **Infrastructure Injection:** Deploy 1 Hub and 2 Relays per farm
    > (Sovereign Infrastructure).

3.  **Data Warm-up:** Ingest historical satellite data into the **SDW**
    > to build the Bayesian priors.

4.  **The First Pop:** Trigger the 1m \"Resolution Pop\" for the legal
    > survey.

5.  **Evidence Generation:** Deliver the first **QCV** preview to the
    > attorneys 30 days before the trial to \"freeze\" the opposing
    > counsel.
