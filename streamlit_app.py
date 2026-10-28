"""
Food Verse AI – Multimodal Food Intelligence Agent
Skill Wallet Capstone Project 3 | Platform ID: 6ac4ca021dcde6d7857c169a
Turnkey Production-Ready Streamlit Application
"""

import streamlit as st
import io
import os
import json
import base64
import requests
import plotly.graph_objects as go
import plotly.express as px
from PIL import Image

# Set page configuration
st.set_page_config(
    page_title="Food Verse AI - Multimodal Food Intelligence Agent",
    page_icon="🥗",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom High-End Modern Styling
st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&family=Inter:wght@400;500;600&display=swap');
    
    html, body, [class*="css"] {
        font-family: 'Inter', sans-serif;
    }
    
    h1, h2, h3, .brand-text {
        font-family: 'Outfit', sans-serif;
    }
    
    .stApp {
        background-color: #080d0f;
        color: #e2e8f0;
    }
    
    .main-card {
        background: rgba(18, 28, 32, 0.75);
        border: 1px solid rgba(34, 197, 94, 0.2);
        border-radius: 16px;
        padding: 24px;
        margin-bottom: 20px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
    }
    
    .stat-badge {
        background: #111e22;
        border: 1px solid #1f343b;
        border-radius: 12px;
        padding: 12px 16px;
        text-align: center;
    }
    
    .stButton>button {
        background: linear-gradient(135deg, #22c55e 0%, #14b8a6 100%);
        color: #051b11 !important;
        font-weight: 700 !important;
        border: none !important;
        border-radius: 10px !important;
        padding: 10px 24px !important;
        transition: all 0.3s ease;
    }
    
    .stButton>button:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(34, 197, 94, 0.4);
    }
</style>
""", unsafe_allow_html=True)

# Import AI Engine from backend
try:
    from backend.ai_engine import ai_engine
except ImportError:
    # If run in pure standalone cloud without backend folder in path
    import sys
    sys.path.append(os.path.dirname(__file__))
    from backend.ai_engine import ai_engine

# -------------------------------------------------------------
# SIDEBAR: CONFIGURATION & PERSONA
# -------------------------------------------------------------
with st.sidebar:
    st.markdown("""
    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
        <div style="background: linear-gradient(135deg, #22c55e, #0d9488); padding: 10px; border-radius: 12px; color: white; font-size: 24px;">
            🥗
        </div>
        <div>
            <h2 class="brand-text" style="margin: 0; font-size: 20px; font-weight: 800; color: #f8fafc;">Food Verse AI</h2>
            <p style="margin: 0; font-size: 11px; color: #4ade80; font-weight: 600;">Platform ID: 6ac4ca021dcde6d7857c169a</p>
        </div>
    </div>
    """, unsafe_allow_html=True)
    
    st.markdown("### ⚙️ Multimodal AI Config")
    provider_choice = st.selectbox(
        "Active Vision Provider",
        ["Google Gemini 1.5", "Groq LLaMA Vision", "Standalone Demonstration Mode"],
        index=0
    )
    
    api_key_input = ""
    if provider_choice == "Google Gemini 1.5":
        api_key_input = st.text_input("Gemini API Key", type="password", placeholder="AIzaSy...", help="Get a free key from Google AI Studio")
    elif provider_choice == "Groq LLaMA Vision":
        api_key_input = st.text_input("Groq API Key", type="password", placeholder="gsk_...", help="Get free key from Groq Console")
        
    demo_mode_toggle = st.toggle("Enable Fallback Heuristic Engine", value=True, help="Ensures robust operation even if API keys are not supplied or hit quotas.")
    
    st.markdown("---")
    st.markdown("### 🏆 Capstone Objectives")
    st.markdown("""
    - **Epic 1**: Environment & Turnkey Config
    - **Epic 2**: Dish Recognition & Nutrition
    - **Epic 3**: Freshness & Spoilage Diagnostic
    - **Epic 4**: Kitchen Hygiene & Recipe Coach
    - **Epic 5**: Clinical TDEE/BMR Meal Planner
    - **Epic 6**: Edge Cases & Full-Stack Deployment
    """)
    st.markdown("---")
    st.caption("Food Verse AI v2.0 • Zero external DB dependencies required for Streamlit Cloud.")

# -------------------------------------------------------------
# MAIN APP TABS
# -------------------------------------------------------------
st.title("🥗 Food Verse AI – Multimodal Food Intelligence Agent")
st.markdown("**Skill Wallet Capstone Project 3** • Autonomous food vision, freshness diagnostics, commercial safety compliance, and metabolic meal engineering.")

tab1, tab2, tab3, tab4, tab5 = st.tabs([
    "🥗 Nutrition Audit (Epic 2)",
    "🍎 Freshness Diagnostic (Epic 3)",
    "🧼 Kitchen Hygiene (Epic 4)",
    "🍳 Smart Recipe Coach (Epic 4)",
    "📊 TDEE Meal Planner (Epic 5)"
])

# =============================================================
# TAB 1: FOOD RECOGNITION & NUTRITION AUDIT (EPIC 2)
# =============================================================
with tab1:
    st.subheader("Food Recognition & Comprehensive Nutritional Audit")
    st.markdown("Upload or snapshot a meal photo to identify the dish, cuisine, portion grams, macronutrients, and composite health score.")
    
    col1, col2 = st.columns([1, 1.2])
    
    with col1:
        st.markdown("#### 📸 Upload Meal Image")
        uploaded_dish = st.file_uploader("Choose dish image...", type=["jpg", "jpeg", "png", "webp"], key="dish_upload")
        dish_notes = st.text_input("Preparation Notes (optional)", placeholder="e.g. Cooked with olive oil, no dairy...", key="dish_notes")
        
        # Sample selection helper
        st.markdown("**Or load a sample dish:**")
        sample_col1, sample_col2, sample_col3 = st.columns(3)
        sample_img_bytes = None
        if sample_col1.button("Salad Bowl"):
            if os.path.exists("assets/samples/mediterranean_salad.jpg"):
                with open("assets/samples/mediterranean_salad.jpg", "rb") as f:
                    sample_img_bytes = f.read()
        if sample_col2.button("Fresh Berries"):
            if os.path.exists("assets/samples/fresh_strawberries.jpg"):
                with open("assets/samples/fresh_strawberries.jpg", "rb") as f:
                    sample_img_bytes = f.read()
        if sample_col3.button("Avocado"):
            if os.path.exists("assets/samples/spoiled_avocado.jpg"):
                with open("assets/samples/spoiled_avocado.jpg", "rb") as f:
                    sample_img_bytes = f.read()
                    
        active_dish_bytes = uploaded_dish.getvalue() if uploaded_dish else sample_img_bytes
        
        if active_dish_bytes:
            st.image(active_dish_bytes, caption="Uploaded Meal Photo", use_container_width=True)
            run_nutrition = st.button("🚀 Analyze Nutrition", key="run_nutr_btn", use_container_width=True)
        else:
            run_nutrition = False

    with col2:
        if run_nutrition and active_dish_bytes:
            with st.spinner("AI analyzing visual features, ingredients, and nutrient density..."):
                import asyncio
                prov = "groq" if "Groq" in provider_choice else "gemini"
                nutr_data = asyncio.run(ai_engine.analyze_food_nutrition(
                    image_bytes=active_dish_bytes,
                    user_notes=dish_notes,
                    api_key=api_key_input,
                    provider=prov
                ))
                
                st.success(f"**Identified Dish:** {nutr_data.get('dish_name')}")
                st.caption(f"**Cuisine:** {nutr_data.get('cuisine')} | **Estimated Portion:** {nutr_data.get('portion_estimate')}")
                
                # Health Score Gauge
                score = nutr_data.get("health_score", 85)
                fig_gauge = go.Figure(go.Indicator(
                    mode="gauge+number",
                    value=score,
                    title={'text': "Composite Health Score (1-100)"},
                    gauge={
                        'axis': {'range': [0, 100]},
                        'bar': {'color': "#22c55e"},
                        'steps': [
                            {'range': [0, 50], 'color': "#ef4444"},
                            {'range': [50, 75], 'color': "#f59e0b"},
                            {'range': [75, 100], 'color': "#10b981"}
                        ]
                    }
                ))
                fig_gauge.update_layout(height=200, margin=dict(l=20, r=20, t=30, b=10), paper_bgcolor="rgba(0,0,0,0)", font={'color': "white"})
                st.plotly_chart(fig_gauge, use_container_width=True)
                
                # Macronutrients Grid
                m1, m2, m3, m4 = st.columns(4)
                m1.metric("Calories", f"{nutr_data.get('total_calories')} kcal")
                m2.metric("Protein", f"{nutr_data.get('total_protein')} g")
                m3.metric("Carbs", f"{nutr_data.get('total_carbs')} g")
                m4.metric("Fats", f"{nutr_data.get('total_fat')} g")
                
                # Interactive Donut Chart for Macros
                labels = ['Protein', 'Carbohydrates', 'Fats']
                values = [nutr_data.get('total_protein', 20)*4, nutr_data.get('total_carbs', 40)*4, nutr_data.get('total_fat', 15)*9]
                fig_pie = px.pie(values=values, names=labels, hole=0.5, color_discrete_sequence=['#3b82f6', '#10b981', '#f43f5e'])
                fig_pie.update_layout(height=220, margin=dict(l=10, r=10, t=10, b=10), paper_bgcolor="rgba(0,0,0,0)", font={'color': "white"})
                st.plotly_chart(fig_pie, use_container_width=True)
                
                # Dietary Tags & Allergen Warnings
                if nutr_data.get("allergen_alerts") and nutr_data["allergen_alerts"][0] != "None":
                    st.warning(f"⚠️ **Allergen Alert:** Contains {', '.join(nutr_data['allergen_alerts'])}")
                    
                st.info(f"**Dietitian Clinical Summary:** {nutr_data.get('dietitian_summary')}")
        else:
            st.info("Upload an image on the left or click a sample dish to see complete nutrition breakdowns.")

# =============================================================
# TAB 2: FRESHNESS & SPOILAGE DIAGNOSTIC (EPIC 3)
# =============================================================
with tab2:
    st.subheader("Food Freshness & Spoilage Diagnostic Engine")
    st.markdown("Computer vision evaluation of raw produce, meats, and dairy for discoloration, wrinkling, tissue breakdown, and mold.")
    
    c1, c2 = st.columns([1, 1.2])
    with c1:
        uploaded_raw = st.file_uploader("Upload perishable item photo...", type=["jpg", "jpeg", "png", "webp"], key="fresh_upload")
        hint_input = st.text_input("Item Name / Type (optional)", placeholder="e.g. Avocado, Strawberries, Chicken...", key="fresh_hint")
        
        st.markdown("**Or load a sample test perishable:**")
        p_col1, p_col2 = st.columns(2)
        sample_raw_bytes = None
        if p_col1.button("Fresh Strawberries"):
            if os.path.exists("assets/samples/fresh_strawberries.jpg"):
                with open("assets/samples/fresh_strawberries.jpg", "rb") as f:
                    sample_raw_bytes = f.read()
        if p_col2.button("Spoiled Avocado (Mold)"):
            if os.path.exists("assets/samples/spoiled_avocado.jpg"):
                with open("assets/samples/spoiled_avocado.jpg", "rb") as f:
                    sample_raw_bytes = f.read()
                    
        active_raw_bytes = uploaded_raw.getvalue() if uploaded_raw else sample_raw_bytes
        if active_raw_bytes:
            st.image(active_raw_bytes, caption="Target Perishable Item", use_container_width=True)
            run_freshness = st.button("🔬 Diagnose Freshness", key="run_fresh_btn", use_container_width=True)
        else:
            run_freshness = False

    with c2:
        if run_freshness and active_raw_bytes:
            with st.spinner("AI analyzing surface texture, discoloration, and mold colonization..."):
                import asyncio
                prov = "groq" if "Groq" in provider_choice else "gemini"
                fresh_data = asyncio.run(ai_engine.analyze_freshness(
                    image_bytes=active_raw_bytes,
                    food_name_hint=hint_input,
                    api_key=api_key_input,
                    provider=prov
                ))
                
                stage = fresh_data.get("freshness_stage", "Fresh")
                idx = fresh_data.get("freshness_index_percent", 90.0)
                
                if stage == "Fresh":
                    st.success(f"### Classification: {stage} ({idx}%)")
                elif stage == "Moderately Fresh":
                    st.warning(f"### Classification: {stage} ({idx}%)")
                else:
                    st.error(f"### Classification: {stage} ({idx}%)")
                    
                st.markdown(f"**Item Detected:** {fresh_data.get('item_detected')} ({fresh_data.get('food_category')})")
                st.markdown(f"**🛡️ Safety Action:** `{fresh_data.get('safety_action')}`")
                st.markdown(f"**⏳ Remaining Shelf-Life:** `{fresh_data.get('shelf_life_remaining_days')} Days`")
                
                st.markdown("#### Visual Biomarker Observations")
                st.write(f"- **Surface Texture:** {fresh_data.get('surface_texture_notes')}")
                st.write(f"- **Discoloration / Oxidation:** {fresh_data.get('discoloration_observed')}")
                st.write(f"- **Wrinkling / Wilting:** {fresh_data.get('wrinkling_or_wilting')}")
                st.write(f"- **Mold / Rot Presence:** {'⚠️ Detected' if fresh_data.get('mold_or_rot_detected') else '✅ None Detected'}")
                
                st.markdown("#### ❄️ Preservation & Cold Storage Protocols")
                for tip in fresh_data.get("preservation_storage_tips", []):
                    st.write(f"• {tip}")
                    
                st.caption(f"**Microbiological Rationale:** {fresh_data.get('scientific_rationale')}")
        else:
            st.info("Upload an image on the left or select a sample perishable to run freshness diagnostics.")

# =============================================================
# TAB 3: KITCHEN HYGIENE & SAFETY COMPLIANCE (EPIC 4)
# =============================================================
with tab3:
    st.subheader("Commercial Kitchen Hygiene & HACCP Compliance")
    st.markdown("Surveillance and photo auditing for chef hats/hairnets, nitrile glove compliance, sanitation state, and cross-contamination hazards.")
    
    k1, k2 = st.columns([1, 1.2])
    with k1:
        uploaded_kitch = st.file_uploader("Upload kitchen photo or video frame...", type=["jpg", "jpeg", "png", "webp"], key="kitch_upload")
        kitch_notes = st.text_input("Station / Shift Notes (optional)", placeholder="e.g. Hot line station #2...", key="kitch_notes")
        
        sample_kitch_bytes = None
        if st.button("Load Commercial Kitchen Sample"):
            if os.path.exists("assets/samples/commercial_kitchen.jpg"):
                with open("assets/samples/commercial_kitchen.jpg", "rb") as f:
                    sample_kitch_bytes = f.read()
                    
        active_kitch_bytes = uploaded_kitch.getvalue() if uploaded_kitch else sample_kitch_bytes
        if active_kitch_bytes:
            st.image(active_kitch_bytes, caption="Kitchen Prep Station", use_container_width=True)
            run_hygiene = st.button("🛡️ Execute Hygiene Audit", key="run_hygiene_btn", use_container_width=True)
        else:
            run_hygiene = False

    with k2:
        if run_hygiene and active_kitch_bytes:
            with st.spinner("AI scanning station for PPE, sanitized stainless steel, and hazard zones..."):
                import asyncio
                prov = "groq" if "Groq" in provider_choice else "gemini"
                hygiene_data = asyncio.run(ai_engine.analyze_kitchen_hygiene(
                    media_bytes=active_kitch_bytes,
                    inspection_notes=kitch_notes,
                    api_key=api_key_input,
                    provider=prov
                ))
                
                h_score = hygiene_data.get("overall_compliance_score", 88.5)
                h_grade = hygiene_data.get("compliance_grade", "Grade A")
                
                st.metric("Overall Compliance Score", f"{h_score}%", f"Rating: {h_grade}")
                
                st.markdown("#### PPE & Sanitation Audit Checklist")
                st.write(f"- **Chef Hat / Hairnet:** {hygiene_data.get('chef_hat_hairnet_status')}")
                st.write(f"- **Glove Usage:** {hygiene_data.get('glove_usage_status')}")
                st.write(f"- **Workstation Sanitization:** {hygiene_data.get('sanitization_state')}")
                
                if hygiene_data.get("cross_contamination_alert"):
                    st.warning(f"⚠️ **Cross-Contamination Alert:** {hygiene_data['cross_contamination_alert']}")
                    
                st.markdown("#### Itemized Violations Log")
                for vio in hygiene_data.get("itemized_violations", []):
                    st.markdown(f"**[{vio['id']}] {vio['hazard_type']}** ({vio['severity']}) - *{vio['location']}*")
                    st.caption(f"{vio['description']} ➔ **Corrective Action:** {vio['remediation_action']}")
                    
                st.info(f"**HACCP Inspector Summary:** {hygiene_data.get('haccp_summary')}")
        else:
            st.info("Upload a kitchen photo or load sample prep station to execute an automated hygiene compliance audit.")

# =============================================================
# TAB 4: SMART KITCHEN RECIPE ASSISTANT (EPIC 4)
# =============================================================
with tab4:
    st.subheader("Smart Kitchen Recipe Assistant & Pantry Coach")
    st.markdown("List your current pantry inventory to generate nutritious, zero-waste recipes with smart ingredient substitutions.")
    
    r1, r2 = st.columns([1, 1.2])
    with r1:
        st.markdown("#### 🥫 Pantry & Fridge Inventory")
        pantry_input = st.text_area(
            "Available Ingredients (comma-separated)",
            value="Baby Spinach, Eggs, Extra Virgin Olive Oil, Garlic, Chicken Breast, Quinoa, Lemon",
            height=100
        )
        
        pref_col1, pref_col2 = st.columns(2)
        r_cuisine = pref_col1.selectbox("Cuisine Preference", ["Any", "Mediterranean", "Asian Fusion", "Italian", "Mexican", "Continental"])
        r_diet = pref_col2.selectbox("Dietary Filter", ["None", "Vegan", "Vegetarian", "Keto", "High-Protein", "Gluten-Free"])
        
        time_col1, time_col2 = st.columns(2)
        r_time = time_col1.slider("Max Cooking Time (minutes)", 10, 60, 30, step=5)
        r_skill = time_col2.selectbox("Skill Level", ["Easy", "Intermediate", "Master Chef"])
        
        run_recipe = st.button("✨ Formulate Recipe", key="run_rec_btn", use_container_width=True)

    with r2:
        if run_recipe:
            with st.spinner("Executive chef formulating balanced culinary recipe..."):
                import asyncio
                items = [i.strip() for i in pantry_input.split(",") if i.strip()]
                rec_data = asyncio.run(ai_engine.generate_smart_recipe(
                    pantry_items=items,
                    cuisine=r_cuisine,
                    dietary=r_diet,
                    max_time=r_time,
                    skill_level=r_skill
                ))
                
                st.success(f"### {rec_data.get('recipe_title')}")
                st.caption(f"**Cuisine:** {rec_data.get('cuisine')} | **Prep:** {rec_data.get('prep_time_mins')}m | **Cook:** {rec_data.get('cooking_time_mins')}m | **Calories/serving:** {rec_data.get('calories_per_serving')} kcal")
                
                st.markdown("#### 🔄 Smart Culinary Substitutions")
                for orig, sub in rec_data.get("smart_substitutions", {}).items():
                    st.markdown(f"- **{orig}** ➔ *{sub}*")
                    
                st.markdown("#### 👨‍🍳 Step-by-Step Cooking Instructions")
                for s in rec_data.get("step_by_step", []):
                    st.markdown(f"**Step {s['step_number']}:** {s['instruction']}")
                    if s.get("tip"):
                        st.caption(f"💡 *Pro Chef Tip:* {s['tip']}")
                        
                st.info(f"**Chef's Quality Note:** {rec_data.get('chef_notes')}")
        else:
            st.info("Input available pantry ingredients on the left and click 'Formulate Recipe'.")

# =============================================================
# TAB 5: PERSONALIZED MEAL PLANNER (EPIC 5)
# =============================================================
with tab5:
    st.subheader("Clinical BMR/TDEE Personalized Meal Planner")
    st.markdown("Formulate metabolic caloric requirements via the Mifflin-St Jeor equation and produce an adaptive 7-day schedule with automated grocery shopping list.")
    
    mp1, mp2 = st.columns([1, 1.2])
    with mp1:
        st.markdown("#### 👤 Biometric Profile")
        user_name = st.text_input("Name", value="Alex Vance")
        
        bio1, bio2, bio3 = st.columns(3)
        u_age = bio1.number_input("Age", 16, 99, 28)
        u_gender = bio2.selectbox("Gender", ["Male", "Female"])
        u_weight = bio3.number_input("Weight (kg)", 40.0, 200.0, 74.0, step=0.5)
        
        u_height = st.number_input("Height (cm)", 120.0, 220.0, 178.0, step=1.0)
        u_activity = st.selectbox(
            "Physical Activity Level",
            ["Sedentary", "Lightly Active", "Moderately Active", "Very Active", "Extra Active"],
            index=2
        )
        
        goal_col1, goal_col2 = st.columns(2)
        u_diet = goal_col1.selectbox("Dietary Constraint", ["Balanced", "Vegan", "Vegetarian", "Keto", "Diabetic-Friendly", "Mediterranean", "Gluten-Free"])
        u_goal = goal_col2.selectbox("Fitness Target", ["Fat Loss", "Muscle Gain", "Maintenance", "Endurance"])
        
        run_plan = st.button("📊 Calculate TDEE & 7-Day Plan", key="run_plan_btn", use_container_width=True)

    with mp2:
        if run_plan:
            plan_data = ai_engine.calculate_bmr_tdee(
                age=u_age,
                gender=u_gender,
                weight_kg=u_weight,
                height_cm=u_height,
                activity=u_activity,
                goal=u_goal,
                diet=u_diet
            )
            
            p1, p2, p3, p4 = st.columns(4)
            p1.metric("BMR", f"{plan_data['bmr']} kcal")
            p2.metric("TDEE", f"{plan_data['tdee']} kcal")
            p3.metric("Target Daily", f"{plan_data['target_daily_calories']} kcal")
            p4.metric("Protein Target", f"{plan_data['macro_targets']['protein_g']} g")
            
            st.info(f"**Metabolic Summary:** {plan_data['nutritionist_recommendation']}")
            
            st.markdown("#### 📅 7-Day Prescribed Schedule")
            day_names = [d["day"] for d in plan_data["seven_day_schedule"]]
            selected_day = st.selectbox("Select Schedule Day", day_names)
            day_info = next(d for d in plan_data["seven_day_schedule"] if d["day"] == selected_day)
            
            for m in day_info["meals"]:
                with st.expander(f"**{m['meal_type']}:** {m['dish_name']} ({m['calories']} kcal)"):
                    st.write(f"- **Protein:** {m['protein_g']}g | **Carbs:** {m['carbs_g']}g | **Fats:** {m['fat_g']}g")
                    st.write(f"- **Prep Time:** {m['prep_time_mins']} minutes")
                    st.write(f"- **Key Components:** {', '.join(m['key_ingredients'])}")
                    
            st.markdown("#### 🛒 Automated Departmental Grocery Checklist")
            for cat, items in plan_data["automated_grocery_list"].items():
                st.markdown(f"**{cat}**")
                for it in items:
                    st.checkbox(it, key=f"groc_{it}")
        else:
            st.info("Fill out your biometric parameters on the left and click 'Calculate TDEE & 7-Day Plan'.")

# Footer
st.markdown("---")
st.caption("Food Verse AI • Platform ID: 6ac4ca021dcde6d7857c169a • Dual Architecture: Streamlit Turnkey + FastAPI/React SPA")
