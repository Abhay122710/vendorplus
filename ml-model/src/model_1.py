import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score, confusion_matrix

def load_data(file_path):
    df = pd.read_csv(file_path)
    print("Dataset Loaded Successfully!")
    return df

def preprocess_data(df):
    data = df.copy()

    le = LabelEncoder()
    categorical_cols = ['Area', 'Shop_Type', 'Product', 'Day_of_Week', 'Season', 'Demand_Level']

    mappings = {}

    for col in categorical_cols:
        data[col] = le.fit_transform(data[col])
        mappings[col] = dict(zip(le.classes_, le.transform(le.classes_)))

    return data, mappings

def train_model(data):
    X = data.drop(['Demand_Level'], axis=1)
    y = data['Demand_Level']

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)

    print("Model Training Complete.")
    return model, X_test, y_test, X

def evaluate_model(model, X_test, y_test):
    y_pred = model.predict(X_test)

    print("\nClassification Report:\n")
    print(classification_report(y_test, y_pred))

    accuracy = accuracy_score(y_test, y_pred)
    print(f"\nModel Accuracy: {accuracy * 100:.2f}%")

    cm = confusion_matrix(y_test, y_pred)

    plt.figure(figsize=(8, 6))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues')
    plt.title(f'Confusion Matrix (Accuracy: {accuracy*100:.2f}%)')
    plt.xlabel('Predicted')
    plt.ylabel('Actual')
    plt.show()

def plot_feature_importance(model, X):
    plt.figure(figsize=(10, 6))
    importances = pd.Series(model.feature_importances_, index=X.columns)
    importances.nlargest(10).plot(kind='barh')
    plt.title('Feature Importance')
    plt.show()

def visualize_data(df):

    plt.figure(figsize=(12, 6))
    sns.countplot(data=df, x='Shop_Type', hue='Demand_Level')
    plt.xticks(rotation=45)
    plt.title('Demand by Shop Type')
    plt.show()

    plt.figure(figsize=(14, 7))
    top_products = df['Product'].value_counts().nlargest(5).index
    filtered_df = df[df['Product'].isin(top_products)]

    sns.boxplot(data=filtered_df, x='Product', y='Sales_Quantity', hue='Season')
    plt.title('Seasonal Sales Trends')
    plt.show()

    pivot_df = df.groupby(['Area', 'Demand_Level']).size().unstack(fill_value=0)

    plt.figure(figsize=(10, 6))
    sns.heatmap(pivot_df, annot=True, fmt="d", cmap="YlGnBu")
    plt.title('Demand Heatmap by Area')
    plt.show()

def recommend_stock(df, area, season, day):
    relevant_data = df[
        (df['Area'] == area) &
        (df['Season'] == season) &
        (df['Day_of_Week'] == day)
    ]

    recommendations = relevant_data[
        relevant_data['Demand_Level'] == 'High'
    ]['Product'].value_counts().head(3)

    print(f"\n--- Inventory Alert for {area} ({season}, {day}) ---")

    if not recommendations.empty:
        for i, (prod, count) in enumerate(recommendations.items(), 1):
            print(f"{i}. {prod}")
    else:
        print("No strong demand detected.")

def simulate_revenue_impact(df, area):
    high_demand_df = df[
        (df['Area'] == area) &
        (df['Demand_Level'] == 'High')
    ]

    potential_revenue = (high_demand_df['Price'] * high_demand_df['Sales_Quantity']).sum()
    total_units = high_demand_df['Sales_Quantity'].sum()
    top_product = high_demand_df['Product'].mode()[0]

    print(f"\n--- Revenue Insight: {area} ---")
    print(f"Revenue Potential: ₹{potential_revenue:,.2f}")
    print(f"Units Sold: {total_units}")
    print(f"Top Product: {top_product}")

def main():
    file_path = "vendor_plus_dataset.csv"

    df = load_data(file_path)
    data, mappings = preprocess_data(df)

    model, X_test, y_test, X = train_model(data)

    evaluate_model(model, X_test, y_test)
    plot_feature_importance(model, X)

    visualize_data(df)

    recommend_stock(df, 'Bidholi', 'Winter', 'Sunday')
    simulate_revenue_impact(df, 'Kandholi')

if __name__ == "__main__":
    main()