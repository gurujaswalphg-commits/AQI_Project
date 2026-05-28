# Health recommendations for each AQI category
health_recommendations = {
    "Good": {
        "general": "Air quality is considered satisfactory, and air pollution poses little or no risk.",
        "sensitive": "No precautions needed.",
        "precautions": ["No precautions needed.", "Great day for outdoor exercise!"]
    },
    "Moderate": {
        "general": "Air quality is acceptable. Unusually sensitive people should consider limiting activities.",
        "sensitive": "Sensitive Groups (children, elderly, people with respiratory diseases) should reduce prolonged outdoor activities.",
        "precautions": ["Limit strenuous outdoor activities", "Consider light indoor activities for sensitive groups"]
    },
    "Unhealthy for Sensitive Groups": {
        "general": "Members of sensitive groups may experience health effects.",
        "sensitive": "You should reduce prolonged outdoor exertion. Consider using N95 masks if exposed.",
        "precautions": ["Reduce outdoor activities", "Use N95 masks for outdoor exposure", "Keep windows closed"]
    },
    "Unhealthy": {
        "general": "Everyone may begin to experience health effects.",
        "sensitive": "Avoid outdoor activities. Use air purifiers indoors.",
        "precautions": ["Stay indoors", "Close all windows and doors", "Use HEPA air filters", "Wear N95/N100 masks if outside"]
    },
    "Very Unhealthy": {
        "general": "Health warning of emergency conditions: the entire population is more likely to be affected.",
        "sensitive": "Avoid all outdoor activities. Use hospitals if needed.",
        "precautions": ["Stay indoors with air filtration", "Avoid all outdoor activities", "Seek medical help if experiencing symptoms"]
    },
    "Hazardous": {
        "general": "Health alert: everyone may experience serious health effects.",
        "sensitive": "Emergency conditions: Seek medical help immediately.",
        "precautions": ["Remain indoors", "Use industrial air filters", "Seek immediate medical attention", "Emergency services should be on alert"]
    }
}
# Standard AQI categories and colors
aqi_categories = {
    (0, 50): ("Good", "Green"),
    (51, 100): ("Moderate", "Yellow"),
    (101, 150): ("Unhealthy for Sensitive Groups", "Orange"),
    (151, 200): ("Unhealthy", "Red"),
    (201, 300): ("Very Unhealthy", "Purple"),
    (301, 500): ("Hazardous", "Maroon")
}
# Save as app.py and run: streamlit run app.py

import streamlit as st
import pandas as pd
import numpy as np
import requests
import matplotlib.pyplot as plt
import json
from datetime import datetime, timedelta
import io
import seaborn as sns
import statsmodels.api as sm
 

# Configure Streamlit page
st.set_page_config(page_title="AQI Dashboard", layout="wide", initial_sidebar_state="expanded")

# City coordinates for OpenWeatherMap Air Pollution API - All Indian State Capitals
city_coords = {
    # Union Territories
    "Delhi": {"lat": 28.6139, "lon": 77.2090},
    "Chandigarh": {"lat": 30.7333, "lon": 76.7794},
    "Puducherry": {"lat": 12.0657, "lon": 79.8711},
    "Lakshadweep": {"lat": 10.5667, "lon": 72.7417},
    "Ladakh": {"lat": 34.1526, "lon": 77.5771},
    
    # Northern States
    "Shimla": {"lat": 31.7771, "lon": 77.1025},
    "Dehradun": {"lat": 30.3165, "lon": 78.0322},
    "Lucknow": {"lat": 26.8467, "lon": 80.9462},
    "Jaipur": {"lat": 26.8124, "lon": 75.8456},
    
    # North-Eastern States
    "Dispur": {"lat": 26.1445, "lon": 91.7362},
    "Itanagar": {"lat": 28.2180, "lon": 93.6053},
    "Imphal": {"lat": 24.8170, "lon": 94.9885},
    "Kohima": {"lat": 25.6816, "lon": 94.1096},
    "Agartala": {"lat": 23.8103, "lon": 91.2789},
    "Aizawl": {"lat": 23.1815, "lon": 92.7879},
    "Gangtok": {"lat": 27.5330, "lon": 88.6006},
    "Shillong": {"lat": 25.5788, "lon": 91.8933},
    
    # Western States
    "Mumbai": {"lat": 19.0760, "lon": 72.8777},
    "Gandhinagar": {"lat": 23.2156, "lon": 72.6369},
    "Panaji": {"lat": 15.4909, "lon": 73.8278},
    
    # Central States
    "Bhopal": {"lat": 23.1815, "lon": 75.7873},
    "Raipur": {"lat": 21.2514, "lon": 81.6296},
    
    # Eastern States
    "Patna": {"lat": 25.5941, "lon": 85.1376},
    "Ranchi": {"lat": 23.3441, "lon": 85.3096},
    "Bhubaneswar": {"lat": 20.2961, "lon": 85.8245},
    "Kolkata": {"lat": 22.5726, "lon": 88.3639},
    
    # Southern States
    "Bengaluru": {"lat": 12.9716, "lon": 77.5946},
    "Hyderabad": {"lat": 17.3850, "lon": 78.4867},
    "Chennai": {"lat": 13.0827, "lon": 80.2707},
    "Thiruvananthapuram": {"lat": 8.5241, "lon": 76.9366},
}

# City population data (approximate, for demo)
city_population = {
    "Delhi": 32000000,
    "Chandigarh": 1200000,
    "Puducherry": 950000,
    "Lakshadweep": 65000,
    "Ladakh": 300000,
    "Shimla": 170000,
    "Dehradun": 2100000,
    "Lucknow": 3400000,
    "Jaipur": 4000000,
    "Dispur": 1100000,
    "Itanagar": 60000,
    "Imphal": 270000,
    "Kohima": 100000,
    "Agartala": 520000,
    "Aizawl": 330000,
    "Gangtok": 100000,
    "Shillong": 150000,
    "Mumbai": 21000000,
    "Gandhinagar": 300000,
    "Panaji": 115000,
    "Bhopal": 2500000,
    "Raipur": 1100000,
    "Patna": 2500000,
    "Ranchi": 1500000,
    "Bhubaneswar": 1100000,
    "Kolkata": 15000000,
    "Bengaluru": 13000000,
    "Hyderabad": 10000000,
    "Chennai": 11000000,
    "Thiruvananthapuram": 950000
     }

# Mock AQI data for demonstration
mock_aqi_data = {
    # Union Territories
    "Delhi": 285,
    "Chandigarh": 145,
    "Puducherry": 95,
    "Lakshadweep": 45,
    "Ladakh": 65,
    
    # Northern States
    "Shimla": 85,
    "Dehradun": 165,
    "Lucknow": 215,
    "Jaipur": 195,
    
    # North-Eastern States
    "Dispur": 105,
    "Itanagar": 75,
    "Imphal": 85,
    "Kohima": 65,
    "Agartala": 95,
    "Aizawl": 55,
    "Gangtok": 45,
    "Shillong": 75,
    
    # Western States
    "Mumbai": 165,
    "Gandhinagar": 155
}

# Mock pollutant data for demonstration
mock_pollutants = {
    "PM2.5": {"range": (0, 500), "unit": "µg/m³", "bad_threshold": 35},
    "PM10": {"range": (0, 500), "unit": "µg/m³", "bad_threshold": 75},
    "NO2": {"range": (0, 1000), "unit": "ppb", "bad_threshold": 100},
    "SO2": {"range": (0, 1000), "unit": "ppb", "bad_threshold": 75},
    "O3": {"range": (0, 500), "unit": "ppb", "bad_threshold": 70},
    "CO": {"range": (0, 50), "unit": "ppm", "bad_threshold": 4}
}

def get_aqi_category(aqi):
    for (lower, upper), (category, color) in aqi_categories.items():
        if lower <= aqi <= upper:
            return category, color
    return "Hazardous", "Maroon"

def generate_pollutant_data(aqi_value):
    """Generate realistic pollutant concentrations based on AQI value"""
    factor = aqi_value / 150  # Normalize to moderate level
    pollutants = {}
    
    pollutants["PM2.5"] = min(100 * factor, 500)
    pollutants["PM10"] = min(150 * factor, 500)
    pollutants["NO2"] = min(80 * factor, 1000)
    pollutants["SO2"] = min(60 * factor, 1000)
    pollutants["O3"] = min(70 * factor, 500)
    pollutants["CO"] = min(3 * factor, 50)
    
    return pollutants

def get_health_recommendations(aqi_category):
    """Get health recommendations based on AQI category"""
    return health_recommendations.get(aqi_category, health_recommendations["Good"])

def calculate_statistics(data_array):
    """Calculate statistical measures"""
    return {
        "mean": np.mean(data_array),
        "median": np.median(data_array),
        "std": np.std(data_array),
        "min": np.min(data_array),
        "max": np.max(data_array),
        "q25": np.percentile(data_array, 25),
        "q75": np.percentile(data_array, 75)
    }

def export_to_csv(df):
    """Create a CSV download link"""
    csv = df.to_csv(index=False)
    return csv.encode()

# -----------------------------
# Sidebar: User Input
# -----------------------------

st.sidebar.title("AQI Dashboard")

# Data Source Selection
st.sidebar.subheader("AQI Data Source")
aqi_data_source = st.sidebar.radio(
    "Select AQI Data Source for Current Value:",
    ("Real-Time (API)", "Demo Dataset"),
    index=1
)

# API Key Input
st.sidebar.subheader("OpenWeatherMap API Configuration")
api_key = st.sidebar.text_input(
    "OpenWeatherMap API Key:",
    type="password",
    help="Get your free API key from https://openweathermap.org/api/air-pollution"
)

use_real_time = aqi_data_source == "Real-Time (API)" and api_key.strip() != ""


cities = st.sidebar.multiselect(
    "Select Cities (Indian State Capitals):",
    sorted(city_coords.keys()),
    default=["Delhi", "Mumbai", "Bengaluru", "Hyderabad", "Kolkata", "Chennai"]
)

# Display available cities in sidebar
with st.sidebar.expander("ℹ️ View All Available Cities"):
    cols = st.columns(2)
    for idx, city in enumerate(sorted(city_coords.keys())):
        with cols[idx % 2]:
            st.write(f"• {city}")


# Policy Simulation Controls
st.sidebar.subheader("Policy Simulation Parameters")
traffic_reduction = st.sidebar.slider("Traffic Reduction (%)", 0, 50, 20)
industry_reduction = st.sidebar.slider("Industrial Emission Reduction (%)", 0, 50, 10)
construction_reduction = st.sidebar.slider("Construction Dust Control (%)", 0, 50, 15)
household_reduction = st.sidebar.slider("Household Emission Reduction (%)", 0, 50, 10)
green_cover_increase = st.sidebar.slider("Green Cover Increase (%)", 0, 50, 20)

# Pollutant Source Attribution Controls
st.sidebar.subheader("Source Attribution (Estimate % Contribution)")
source_traffic = st.sidebar.slider("Traffic", 0, 100, 40)
source_industry = st.sidebar.slider("Industry", 0, 100, 30)
source_construction = st.sidebar.slider("Construction", 0, 100, 15)
source_household = st.sidebar.slider("Household", 0, 100, 10)
source_other = st.sidebar.slider("Other", 0, 100, 5)
# Normalize so total is 100%
total_source = source_traffic + source_industry + source_construction + source_household + source_other
if total_source == 0:
    total_source = 1  # avoid division by zero
source_contributions = {
    "Traffic": source_traffic / total_source * 100,
    "Industry": source_industry / total_source * 100,
    "Construction": source_construction / total_source * 100,
    "Household": source_household / total_source * 100,
    "Other": source_other / total_source * 100
}

# --- ARIMA Forecasting Integration (All Cities, Multi-City File) ---
import statsmodels.api as sm

@st.cache_data

def load_aqi_data():
    file_path = r'multi_city_aqi.xlsx'
    df = pd.read_excel(file_path)
    return df

df = load_aqi_data()
city_list = sorted(df['City'].unique())

st.sidebar.subheader('ARIMA Forecasting (Select City)')
selected_city = st.sidebar.selectbox('Choose a city for ARIMA forecasting:', city_list)
forecast_steps = st.sidebar.slider('Forecast Days Ahead', 5, 30, 10, key=f'arima_forecast_slider_{selected_city}')

city_df = df[df['City'] == selected_city].sort_values('Datetime')
aqi_series = city_df['US_AQI'].dropna().reset_index(drop=True)

st.header(f'{selected_city} AQI Forecasting (ARIMA)')

if len(aqi_series) < 30:
    st.error('Not enough data for ARIMA forecasting. At least 30 data points are required.')
else:
    try:
        model = sm.tsa.ARIMA(aqi_series, order=(1,1,0))
        model_fit = model.fit()
        forecast = model_fit.forecast(steps=forecast_steps)
        st.subheader('ARIMA Forecast')
        fig, ax = plt.subplots(figsize=(10,4))
        ax.plot(aqi_series, label='Historical AQI')
        ax.plot(np.arange(len(aqi_series), len(aqi_series)+forecast_steps), forecast, label='ARIMA Forecast', marker='o')
        ax.set_title(f'{selected_city} AQI Forecast (ARIMA)')
        ax.legend()
        st.pyplot(fig)
        st.write('Forecasted AQI values:', forecast.values)
    except Exception as e:
        st.error(f'ARIMA model failed: {e}')
# --- End ARIMA Forecasting Integration ---

# -----------------------------
# Step 1: Multi-City Data Fetch
# -----------------------------
st.title("🌍 AQI Analysis, Forecasting & Clean City Ranking with Policy Optimization")

# Display available cities information
st.markdown(f"""
### 📊 Coverage: All **{len(city_coords)}** Indian State & Union Territory Capitals
Select multiple cities to analyze and compare their air quality trends and apply policy simulations.
""")

city_forecasts = {}


for city in cities:
    if city not in city_coords:
        st.error(f"City {city} not found in coordinates mapping.")
        continue

    # --- Get current AQI from real-time API if selected and available ---
    real_time_aqi_value = None
    real_time_category = None
    if use_real_time:
        coords = city_coords[city]
        url = f"http://api.openweathermap.org/data/2.5/air_pollution"
        try:
            params = {
                "lat": coords["lat"],
                "lon": coords["lon"],
                "appid": api_key
            }
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            data = response.json()
            if 'list' in data and len(data['list']) > 0:
                pollution = data['list'][0]
                main = pollution.get('main', {})
                owm_aqi = main.get('aqi', 3)
                aqi_conversions = {1: 50, 2: 100, 3: 150, 4: 200, 5: 300}
                real_time_aqi_value = aqi_conversions.get(owm_aqi, 150)
                real_time_category, _ = get_aqi_category(real_time_aqi_value)
        except Exception as e:
            st.warning(f"Real-time API error for {city}: {e}. Falling back to demo data.")
            real_time_aqi_value = None

    # --- Get demo AQI from mock data (for current) and from dataset (for ARIMA/historical) ---
    demo_aqi_value = mock_aqi_data.get(city, 100)
    demo_category, _ = get_aqi_category(demo_aqi_value)

    # --- Display both values if available ---
    if use_real_time and real_time_aqi_value is not None:
        st.success(f"✓ {city} - Real-Time AQI: {real_time_aqi_value} ({real_time_category}) | Demo AQI: {demo_aqi_value} ({demo_category})")
        aqi_value = real_time_aqi_value
        category = real_time_category
    else:
        st.info(f"📊 {city} - Demo AQI: {demo_aqi_value} ({demo_category})")
        aqi_value = demo_aqi_value
        category = demo_category

    # --- Use demo dataset for ARIMA/historical/forecast ---
    base_aqi = aqi_value
    forecast = np.array([base_aqi * (1 - 0.05*i) for i in range(forecast_steps)])

    city_forecasts[city] = {
        "baseline": forecast,
        "adjusted": forecast.copy(),
        "avg_baseline": np.mean(forecast),
        "avg_adjusted": np.mean(forecast),
        "current_aqi": aqi_value,
        "category": category
    }

    # --- Fetch meteorological data from OpenWeatherMap ---
    weather_data = {"temp": None, "humidity": None, "wind_speed": None, "rain": None}
    if use_real_time:
        try:
            weather_url = f"http://api.openweathermap.org/data/2.5/weather"
            weather_params = {
                "lat": coords["lat"],
                "lon": coords["lon"],
                "appid": api_key,
                "units": "metric"
            }
            weather_resp = requests.get(weather_url, params=weather_params, timeout=10)
            weather_resp.raise_for_status()
            wdata = weather_resp.json()
            main = wdata.get("main", {})
            wind = wdata.get("wind", {})
            rain = wdata.get("rain", {})
            weather_data["temp"] = main.get("temp")
            weather_data["humidity"] = main.get("humidity")
            weather_data["wind_speed"] = wind.get("speed")
            weather_data["rain"] = rain.get("1h", 0) if rain else 0
        except Exception as e:
            st.warning(f"Weather API error for {city}: {e}")

        city_forecasts[city]["weather"] = weather_data

# Apply policy adjustments to all city forecasts
for city in city_forecasts:
    # Contribution weights (approximate based on studies)
    traffic_factor = 0.4 * (traffic_reduction/100)
    industry_factor = 0.3 * (industry_reduction/100)
    construction_factor = 0.15 * (construction_reduction/100)
    household_factor = 0.1 * (household_reduction/100)
    green_factor = -0.2 * (green_cover_increase/100)  # negative because it reduces AQI

    # Sum of contributing health-issue factors (positive contributors)
    health_issue_factor = traffic_factor + industry_factor + construction_factor + household_factor

    # Total net policy factor includes green cover (negative reduces AQI)
    total_factor = health_issue_factor + green_factor
    adjusted_forecast = city_forecasts[city]["baseline"] * (1 - total_factor)

    city_forecasts[city]["adjusted"] = adjusted_forecast
    city_forecasts[city]["avg_adjusted"] = np.mean(adjusted_forecast)
    # store factor breakdown for display
    city_forecasts[city]["factors"] = {
        "traffic": traffic_factor,
        "industry": industry_factor,
        "construction": construction_factor,
        "household": household_factor,
        "green": green_factor,
        "health_issue_factor": health_issue_factor,
        "total_policy_factor": total_factor
    }

# Display results only if we have data
if not city_forecasts:
    st.error("No valid data was fetched. Please check your API key and try again.")
    st.stop()

# Create tabs for different analysis views

# Add new tab for historical AQI trends
tab0, tab1, tab2, tab3, tab4, tab5 = st.tabs(["📉 Historical Trends", "📈 Forecasts", "💊 Health Tips", "🏆 Rankings", "📊 Statistics", "🔬 Pollutants"])

# ========== TAB 0: HISTORICAL TRENDS ========== 
with tab0:
    st.subheader(f"📉 Historical AQI Trends for {selected_city}")
    # Get city data
    city_hist_df = df[df['City'] == selected_city].sort_values('Datetime')
    if 'Datetime' in city_hist_df.columns:
        city_hist_df['Datetime'] = pd.to_datetime(city_hist_df['Datetime'])
        min_date = city_hist_df['Datetime'].min().date()
        max_date = city_hist_df['Datetime'].max().date()
        # Date range selector
        date_range = st.date_input(
            "Select date range:",
            value=(min_date, max_date),
            min_value=min_date,
            max_value=max_date
        )
        # Filter by date
        mask = (city_hist_df['Datetime'].dt.date >= date_range[0]) & (city_hist_df['Datetime'].dt.date <= date_range[1])
        filtered_df = city_hist_df.loc[mask]
        if filtered_df.empty:
            st.warning("No AQI data available for the selected date range.")
        else:
            fig, ax = plt.subplots(figsize=(12, 4))
            ax.plot(filtered_df['Datetime'], filtered_df['US_AQI'], marker='o', label='AQI')
            ax.set_title(f"{selected_city} AQI Historical Trend")
            ax.set_xlabel("Date")
            ax.set_ylabel("AQI Value")
            ax.grid(True, alpha=0.3)
            ax.legend()
            st.pyplot(fig)
            st.dataframe(filtered_df[['Datetime', 'US_AQI']].rename(columns={'US_AQI': 'AQI'}), use_container_width=True)
    else:
        st.warning("No datetime information available for historical AQI trends.")

        # --- Show meteorological data for selected city (latest) ---
        if selected_city in city_forecasts and city_forecasts[selected_city].get("weather"):
            weather = city_forecasts[selected_city]["weather"]
            st.markdown("#### 🌦️ Latest Meteorological Data")
            st.write({
                "Temperature (°C)": weather["temp"],
                "Humidity (%)": weather["humidity"],
                "Wind Speed (m/s)": weather["wind_speed"],
                "Rainfall (mm, last 1h)": weather["rain"]
            })

# ========== TAB 1: FORECASTS ==========
with tab1:
    st.subheader("📈 Multi-City AQI Forecasts")
    
    fig, ax = plt.subplots(figsize=(14, 6))
    for city in city_forecasts:
        ax.plot(city_forecasts[city]["baseline"], marker='o', label=f"{city} Baseline", linewidth=2)
        ax.plot(city_forecasts[city]["adjusted"], marker='x', linestyle='--', label=f"{city} Adjusted (Policy)", linewidth=2, alpha=0.7)
    ax.axhline(50, color='green', linestyle='--', linewidth=2, label="WHO Safe Limit (50)", alpha=0.7)
    ax.axhline(100, color='orange', linestyle='--', linewidth=1, alpha=0.5, label="Moderate Threshold (100)")
    ax.fill_between(range(forecast_steps), 0, 50, alpha=0.1, color='green', label="Good Air Quality Zone")
    ax.set_title("Multi-City AQI Forecasts with Policy Optimization", fontsize=14, fontweight='bold')
    ax.set_xlabel("Days Ahead", fontsize=12)
    ax.set_ylabel("AQI Value", fontsize=12)
    ax.legend(loc="best", fontsize=9)
    ax.grid(True, alpha=0.3)
    plt.tight_layout()
    st.pyplot(fig)
    
    st.subheader("📊 Detailed Forecast Comparison")
    comparison_data = []
    for city in city_forecasts:
        for i in range(forecast_steps):
            comparison_data.append({
                "City": city,
                "Day": i+1,
                "Baseline AQI": round(city_forecasts[city]["baseline"][i], 2),
                "Adjusted AQI": round(city_forecasts[city]["adjusted"][i], 2),
                "Improvement": round(city_forecasts[city]["baseline"][i] - city_forecasts[city]["adjusted"][i], 2),
                "Status": "Good" if city_forecasts[city]["adjusted"][i] < 51 else "Moderate" if city_forecasts[city]["adjusted"][i] < 101 else "Unhealthy"
            })
    
    comparison_df = pd.DataFrame(comparison_data)
    st.dataframe(comparison_df, width='stretch', height=400)
    
    # Download button
    csv_data = export_to_csv(comparison_df)
    st.download_button(
        label="📥 Download Forecast Data (CSV)",
        data=csv_data,
        file_name=f"AQI_Forecast_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv",
        mime="text/csv"
    )

# ========== TAB 2: HEALTH RECOMMENDATIONS ==========
with tab2:
    st.subheader("💊 Health Recommendations & Guidance")
    
    col1, col2 = st.columns([1, 1])
    
    with tab5:
        st.subheader(f"🔬 Pollutant Breakdown for {selected_city}")
        # Use the same date range as in historical tab if available
        city_hist_df = df[df['City'] == selected_city].sort_values('Datetime')
        if 'Datetime' in city_hist_df.columns:
            city_hist_df['Datetime'] = pd.to_datetime(city_hist_df['Datetime'])
            min_date = city_hist_df['Datetime'].min().date()
            max_date = city_hist_df['Datetime'].max().date()
            date_range = st.date_input(
                "Select date range for pollutant breakdown:",
                value=(min_date, max_date),
                min_value=min_date,
                max_value=max_date,
                key="pollutant_date_range"
            )
            mask = (city_hist_df['Datetime'].dt.date >= date_range[0]) & (city_hist_df['Datetime'].dt.date <= date_range[1])
            filtered_df = city_hist_df.loc[mask]
            if filtered_df.empty:
                st.warning("No data for selected date range.")
            else:
                # If pollutant columns exist, show their mean values
                pollutant_cols = [col for col in filtered_df.columns if col.upper() in ["PM2.5", "PM10", "NO2", "SO2", "O3", "CO"]]
                if pollutant_cols:
                    mean_vals = filtered_df[pollutant_cols].mean().to_dict()
                    pollutant_df = pd.DataFrame([
                        {"Pollutant": k, "Mean Concentration": v, "Unit": mock_pollutants.get(k, {}).get("unit", "")}
                        for k, v in mean_vals.items()
                    ])
                    st.bar_chart(pollutant_df.set_index("Pollutant")["Mean Concentration"])
                    st.dataframe(pollutant_df, use_container_width=True)
                else:
                    # Fallback to mock pollutant data
                    st.info("No pollutant columns in dataset. Showing generated demo values.")
                    aqi_val = mock_aqi_data.get(selected_city, 100)
                    pollutants = generate_pollutant_data(aqi_val)
                    pollutant_df = pd.DataFrame([
                        {"Pollutant": k, "Concentration": v, "Unit": mock_pollutants[k]["unit"]} for k, v in pollutants.items()
                    ])
                    st.bar_chart(pollutant_df.set_index("Pollutant")["Concentration"])
                    st.dataframe(pollutant_df, use_container_width=True)
        else:
            st.info("No datetime information available for pollutant breakdown.")

        # Add color_map definition here (fix indentation)
        color_map = {
            "Good": "🟢",
            "Moderate": "🟡",
            "Unhealthy for Sensitive Groups": "🟠",
            "Unhealthy": "🔴",
            "Very Unhealthy": "🟣",
            "Hazardous": "⚫"
        }
        # Ensure 'aqi' and 'category' are defined
        aqi = None
        category = None
        if city in city_forecasts:
            aqi = city_forecasts[city].get("current_aqi", None)
            category = city_forecasts[city].get("category", None)
        if aqi is None:
            aqi = mock_aqi_data.get(city, 100)
        if category is None:
            category, _ = get_aqi_category(aqi)
        emoji = color_map.get(category, "⚪")
        st.write(f"{emoji} **{city}**: {aqi} - {category}")
    
    with col2:
        st.write("### General Recommendations")
        selected_city = st.selectbox("Select a city for detailed health guidance:", sorted(city_forecasts.keys()))
        
        if selected_city:
            aqi = city_forecasts[selected_city]["current_aqi"]
            category = city_forecasts[selected_city]["category"]
            recommendations = get_health_recommendations(category)
            
            st.success(f"**Selected City:** {selected_city} (AQI: {aqi})")
            st.info(f"**Category:** {category}")
            
            st.markdown("**For General Population:**")
            st.write(recommendations["general"])
            
            st.markdown("**For Sensitive Groups:**")
            st.write(recommendations["sensitive"])
            
            st.markdown("**Recommended Precautions:**")
            for precaution in recommendations["precautions"]:
                st.write(f"• {precaution}")
    
    # Guidelines table
    st.write("### AQI Guidelines & Health Effects")
    guidelines_data = {
        "AQI Range": ["0-50", "51-100", "101-150", "151-200", "201-300", "301-500"],
        "Category": ["Good", "Moderate", "Unhealthy for Sensitive Groups", "Unhealthy", "Very Unhealthy", "Hazardous"],
        "Health Effect": [
            "No health risks",
            "Acceptable; unusual sensitivity in few",
            "Sensitive groups at risk",
            "General population at risk",
            "High risk for all",
            "Emergency; life-threatening"
        ]
    }
    guidelines_df = pd.DataFrame(guidelines_data)
    st.table(guidelines_df)

# ========== TAB 3: RANKINGS ==========
with tab3:
    st.subheader("🏆 Clean City Ranking Analysis")
    
    ranking_df = pd.DataFrame({
        "City": [city for city in city_forecasts],
        "Current AQI": [city_forecasts[city]["current_aqi"] for city in city_forecasts],
        "Avg Baseline": [round(city_forecasts[city]["avg_baseline"], 2) for city in city_forecasts],
        "Avg Adjusted": [round(city_forecasts[city]["avg_adjusted"], 2) for city in city_forecasts],
        "AQI Improvement": [round(city_forecasts[city]["avg_baseline"] - city_forecasts[city]["avg_adjusted"], 2) for city in city_forecasts],
        "Improvement %": [round((city_forecasts[city]["avg_baseline"] - city_forecasts[city]["avg_adjusted"]) / city_forecasts[city]["avg_baseline"] * 100, 1) for city in city_forecasts]
    })
    
    ranking_df = ranking_df.sort_values(by="Avg Adjusted").reset_index(drop=True)
    ranking_df.index = ranking_df.index + 1
    
    col1, col2 = st.columns([1, 1])
    
    with col1:
        st.write("### Cleanest Cities (Policy Scenario)")
        st.dataframe(ranking_df.head(5), width='stretch')
    
    with col2:
        st.write("### Most Polluted Cities (Policy Scenario)")
        st.dataframe(ranking_df.tail(5), width='stretch')
    
    # Visualization
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
    
    # Bar chart
    ranking_sorted = ranking_df.sort_values("Avg Adjusted")
    ax1.barh(ranking_sorted["City"], ranking_sorted["Avg Adjusted"], color='steelblue')
    ax1.set_xlabel("Average Adjusted AQI", fontsize=11)
    ax1.set_title("Cities Ranked by Air Quality (Lower is Better)", fontsize=12, fontweight='bold')
    ax1.axvline(50, color='green', linestyle='--', label='WHO Safe Limit', linewidth=2)
    ax1.legend()
    
    # Improvement comparison
    ax2.bar(ranking_df["City"], ranking_df["Improvement %"], color='coral')
    ax2.set_ylabel("Improvement Percentage (%)", fontsize=11)
    ax2.set_title("Policy Impact: AQI Improvement %", fontsize=12, fontweight='bold')
    ax2.tick_params(axis='x', rotation=45)
    
    plt.tight_layout()
    st.pyplot(fig)
    
    # Download ranking data
    csv_ranking = export_to_csv(ranking_df)
    st.download_button(
        label="📥 Download Rankings (CSV)",
        data=csv_ranking,
        file_name=f"AQI_Rankings_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv",
        mime="text/csv"
    )

# ========== TAB 4: STATISTICS ==========
with tab4:
    st.subheader("📊 Statistical Analysis")
    
    col1, col2 = st.columns([1, 1])
    
    with col1:
        st.write("### Baseline AQI Statistics")
        stats_baseline = {}
        for city in city_forecasts:
            stats_baseline[city] = calculate_statistics(city_forecasts[city]["baseline"])
        
        stats_baseline_df = pd.DataFrame(stats_baseline).round(2)
        st.dataframe(stats_baseline_df, width='stretch')
    
    with col2:
        st.write("### Adjusted AQI Statistics")
        stats_adjusted = {}
        for city in city_forecasts:
            stats_adjusted[city] = calculate_statistics(city_forecasts[city]["adjusted"])
        
        stats_adjusted_df = pd.DataFrame(stats_adjusted).round(2)
        st.dataframe(stats_adjusted_df, width='stretch')
    
    # Distribution visualization
    fig, axes = plt.subplots(1, 2, figsize=(14, 5))
    
    # Baseline distribution
    baseline_data = [city_forecasts[city]["baseline"] for city in city_forecasts]
    axes[0].boxplot(baseline_data, tick_labels=list(city_forecasts.keys()))
    axes[0].set_title("Baseline AQI Distribution", fontsize=12, fontweight='bold')
    axes[0].set_ylabel("AQI Value")
    axes[0].tick_params(axis='x', rotation=45)
    axes[0].grid(True, alpha=0.3)
    
    # Adjusted distribution
    adjusted_data = [city_forecasts[city]["adjusted"] for city in city_forecasts]
    axes[1].boxplot(adjusted_data, tick_labels=list(city_forecasts.keys()))
    axes[1].set_title("Adjusted AQI Distribution (with Policy)", fontsize=12, fontweight='bold')
    axes[1].set_ylabel("AQI Value")
    axes[1].tick_params(axis='x', rotation=45)
    axes[1].grid(True, alpha=0.3)
    
    plt.tight_layout()
    st.pyplot(fig)
    
    # Summary statistics
    st.write("### Overall Summary")
    summary_cols = st.columns(4)
    
    all_baseline = np.concatenate([city_forecasts[city]["baseline"] for city in city_forecasts])
    all_adjusted = np.concatenate([city_forecasts[city]["adjusted"] for city in city_forecasts])
    
    with summary_cols[0]:
        st.metric("Global Mean (Baseline)", f"{np.mean(all_baseline):.1f}")
    with summary_cols[1]:
        st.metric("Global Mean (Adjusted)", f"{np.mean(all_adjusted):.1f}")
    with summary_cols[2]:
        st.metric("Global Improvement", f"{np.mean(all_baseline) - np.mean(all_adjusted):.1f}")
    with summary_cols[3]:
        improvement_pct = (np.mean(all_baseline) - np.mean(all_adjusted)) / np.mean(all_baseline) * 100
        st.metric("Improvement %", f"{improvement_pct:.1f}%")

    # --- Population Exposure & Vulnerability ---
    st.subheader("👥 Population Exposure & Vulnerability")
    exposure_data = []
    aqi_category_counts = {cat: 0 for (cat, _) in [v for v in aqi_categories.values()]}
    aqi_category_pop = {cat: 0 for (cat, _) in [v for v in aqi_categories.values()]}
    for city in city_forecasts:
        pop = city_population.get(city, 0)
        aqi = city_forecasts[city]["current_aqi"]
        cat, _ = get_aqi_category(aqi)
        aqi_category_counts[cat] += 1
        aqi_category_pop[cat] += pop
        exposure_data.append({"City": city, "Population": pop, "AQI": aqi, "Category": cat})
    exposure_df = pd.DataFrame(exposure_data)
    st.dataframe(exposure_df, use_container_width=True)

    # Bar chart: population exposed per AQI category
    fig_exp, ax_exp = plt.subplots()
    ax_exp.bar(aqi_category_pop.keys(), aqi_category_pop.values(), color=[v[1] for v in aqi_categories.values()])
    ax_exp.set_ylabel('Population Exposed')
    ax_exp.set_title('Population Exposure by AQI Category')
    st.pyplot(fig_exp)

    # Highlight sensitive groups
    sensitive_categories = ["Unhealthy for Sensitive Groups", "Unhealthy", "Very Unhealthy", "Hazardous"]
    sensitive_pop = sum([aqi_category_pop[cat] for cat in sensitive_categories if cat in aqi_category_pop])
    if sensitive_pop > 0:
        st.warning(f"Estimated {sensitive_pop:,} people (including children, elderly, and those with respiratory conditions) are currently exposed to unhealthy air quality.")
    else:
        st.success("No sensitive groups are currently exposed to unhealthy air quality.")

# ========== TAB 5: POLLUTANTS ==========
with tab5:
    st.subheader("🔬 Pollutant Concentration Analysis")
    
    st.info("Showing estimated pollutant levels based on AQI values. Individual measurements may vary.")
    
    # Generate pollutant data for selected city
    selected_city = st.selectbox("Select a city to view pollutant breakdown:", sorted(city_forecasts.keys()), key="pollutant_select")
    
    aqi_value = city_forecasts[selected_city]["current_aqi"]
    pollutants = generate_pollutant_data(aqi_value)
    
    # Display pollutant table
    col1, col2 = st.columns([2, 1])
    
    with col1:
        pollutant_data = []
        for pollutant, value in pollutants.items():
            threshold = mock_pollutants[pollutant]["bad_threshold"]
            unit = mock_pollutants[pollutant]["unit"]
            status = "⚠️ High" if value > threshold else "✓ Normal"
            
            pollutant_data.append({
                "Pollutant": pollutant,
                "Value": f"{value:.1f}",
                "Unit": unit,
                "Threshold": threshold,
                "Status": status
            })
        
        pollutant_df = pd.DataFrame(pollutant_data)
        st.dataframe(pollutant_df, width='stretch')
    
    with col2:
        st.write(f"### City: {selected_city}")
        st.metric("Current AQI", f"{aqi_value}")
        st.metric("Category", city_forecasts[selected_city]["category"])
    
    # Pollutant comparison visualization
    fig, ax = plt.subplots(figsize=(12, 6))
    
    pollutant_names = list(pollutants.keys())
    pollutant_values = list(pollutants.values())
    thresholds = [mock_pollutants[p]["bad_threshold"] for p in pollutant_names]
    
    x = np.arange(len(pollutant_names))
    width = 0.35
    
    bars1 = ax.bar(x - width/2, pollutant_values, width, label="Current Level", color='steelblue')
    bars2 = ax.bar(x + width/2, thresholds, width, label="WHO/Safe Threshold", color='lightcoral')
    
    ax.set_xlabel("Pollutant Type", fontsize=12)
    ax.set_ylabel("Concentration", fontsize=12)
    ax.set_title(f"Pollutant Levels in {selected_city} vs Safe Thresholds", fontsize=13, fontweight='bold')
    ax.set_xticks(x)
    ax.set_xticklabels(pollutant_names)
    ax.legend()
    ax.grid(True, axis='y', alpha=0.3)
    plt.tight_layout()
    st.pyplot(fig)
    
    # Pollutant composition for all cities
    st.write("### Pollutant Levels Across All Cities")
    
    all_city_pollutants = {}
    for city in city_forecasts:
        all_city_pollutants[city] = generate_pollutant_data(city_forecasts[city]["current_aqi"])
    
    pollutant_comparison_df = pd.DataFrame(all_city_pollutants).T.round(2)
    st.dataframe(pollutant_comparison_df, width='stretch')
    
    # Download pollutant data
    csv_pollutants = export_to_csv(pollutant_comparison_df.reset_index().rename(columns={"index": "City"}))
    st.download_button(
        label="📥 Download Pollutant Data (CSV)",
        data=csv_pollutants,
        file_name=f"Pollutant_Analysis_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv",
        mime="text/csv"
    )

# ========== FOOTER ==========
st.markdown("---")
st.markdown("""
ℹ️ **About this Dashboard:**
- AQI data based on EPA standards (0-500 scale)
- Policy simulation shows potential impact of emission reduction measures
- Health recommendations based on WHO guidelines
- Forecasts are indicative and based on current trends
""")
st.markdown(
    """
    ---
    **Developed By: Gurpreet Singh, Assistant Professor, CEA, GLA University Mathura, 2026**
    """,
    unsafe_allow_html=True
)

