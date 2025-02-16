import pandas as pd
from sklearn.model_selection import train_test_split
from xgboost import XGBRegressor
import pickle
import os

def train_and_save_model():
    # Load the data
    data = pd.read_csv('backened\\filtered_housing_data.csv')

    # Preprocessing
    data = pd.get_dummies(data, columns=['location'], drop_first=True)

    # Features and target
    X = data.drop('price', axis=1)
    y = data['price']

    # Train-test split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Train the model
    model = XGBRegressor(
        objective='reg:squarederror',
        n_estimators=100,
        learning_rate=0.1,
        max_depth=5,
        random_state=42
    )
    model.fit(X_train, y_train)

    # Save the model
    with open('model.pkl', 'wb') as f:
        pickle.dump(model, f)

    print("Model trained and saved as 'model.pkl'")
    return model

if __name__ == "__main__":
    train_and_save_model()