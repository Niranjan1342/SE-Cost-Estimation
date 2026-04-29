import os

import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, mean_squared_error
from sklearn.model_selection import train_test_split


def train_model():
    """Offline phase: train and export standalone cost/time models."""
    backend_dir = os.path.dirname(os.path.abspath(__file__))
    dataset_path = os.path.abspath(os.path.join(backend_dir, "..", "data", "dataset.csv"))
    cost_model_path = os.path.join(backend_dir, "cost_model.pkl")
    time_model_path = os.path.join(backend_dir, "time_model.pkl")

    data = pd.read_csv(dataset_path)

    # Fixed feature schema expected by the online prediction API.
    feature_columns = [
        "size",
        "modules",
        "integration",
        "tech_stack",
        "reusability",
        "team",
        "complexity",
    ]
    x = data[feature_columns]
    y_cost = data["cost"]
    y_time = data["time"]

    x_train, x_test, y_cost_train, y_cost_test, y_time_train, y_time_test = (
        train_test_split(
            x,
            y_cost,
            y_time,
            test_size=0.2,
            random_state=42,
        )
    )

    cost_model = RandomForestRegressor(
        n_estimators=300,
        random_state=42,
        max_depth=10,
        min_samples_split=2,
        min_samples_leaf=1,
    )
    time_model = RandomForestRegressor(
        n_estimators=300,
        random_state=42,
        max_depth=10,
        min_samples_split=2,
        min_samples_leaf=1,
    )

    cost_model.fit(x_train, y_cost_train)
    time_model.fit(x_train, y_time_train)

    # Optional baseline model for quick comparison.
    baseline_cost = LinearRegression()
    baseline_time = LinearRegression()
    baseline_cost.fit(x_train, y_cost_train)
    baseline_time.fit(x_train, y_time_train)

    cost_pred = cost_model.predict(x_test)
    time_pred = time_model.predict(x_test)
    base_cost_pred = baseline_cost.predict(x_test)
    base_time_pred = baseline_time.predict(x_test)

    print("=== Random Forest Evaluation ===")
    print(
        f"Cost MAE: {mean_absolute_error(y_cost_test, cost_pred):.3f} | "
        f"Cost RMSE: {np.sqrt(mean_squared_error(y_cost_test, cost_pred)):.3f}"
    )
    print(
        f"Time MAE: {mean_absolute_error(y_time_test, time_pred):.3f} | "
        f"Time RMSE: {np.sqrt(mean_squared_error(y_time_test, time_pred)):.3f}"
    )
    print("=== Linear Regression Baseline (Optional) ===")
    print(
        f"Cost MAE: {mean_absolute_error(y_cost_test, base_cost_pred):.3f} | "
        f"Cost RMSE: {np.sqrt(mean_squared_error(y_cost_test, base_cost_pred)):.3f}"
    )
    print(
        f"Time MAE: {mean_absolute_error(y_time_test, base_time_pred):.3f} | "
        f"Time RMSE: {np.sqrt(mean_squared_error(y_time_test, base_time_pred)):.3f}"
    )

    # Save independent models for online prediction (no dataset upload/runtime training).
    joblib.dump(cost_model, cost_model_path)
    joblib.dump(time_model, time_model_path)

    print(f"Cost model saved to: {cost_model_path}")
    print(f"Time model saved to: {time_model_path}")


if __name__ == "__main__":
    train_model()
