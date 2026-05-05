# Run Instructions

## Project
AI-Based Software Cost Estimation with Visualization and What-If Analysis

## Prerequisites
- Python 3.10+ installed
- Node.js 18+ and npm installed
- PowerShell terminal (Windows)

## 1) Start Backend (Flask API)
Open Terminal 1 and run:

```powershell
cd "C:\Users\niran\OneDrive\Desktop\AI-Based-Software-Cost-Estimation-with-Visualization-and-What-If-Analysis\backend"
python -m venv .venv
- .\.venv\Scripts\python.exe app.py
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python train.py
python app.py
```

Backend runs on: `http://localhost:5000`
Training creates:
- `backend/cost_model.pkl`
- `backend/time_model.pkl`

## 2) Start Frontend (React)
Open Terminal 2 and run:

```powershell
cd "C:\Users\niran\OneDrive\Desktop\AI-Based-Software-Cost-Estimation-with-Visualization-and-What-If-Analysis\frontend"
npm install
npm start
```

Frontend runs on: `http://localhost:3000`

## 3) Use the App
1. Open `http://localhost:3000`
2. Fill form values
3. Click **Predict**
4. Review:
   - Estimated Cost
   - Estimated Time
   - Feature Importance chart
   - What-If Analysis chart

## Troubleshooting
### PowerShell blocks virtual environment activation
Run once:

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

Then activate again:

```powershell
.\.venv\Scripts\Activate.ps1
```

### "Unable to connect to server"
- Make sure backend is running on port `5000`
- Check backend terminal for errors
- Confirm frontend API target is `http://localhost:5000/predict`

### Port already in use
- Stop the process using that port, then restart backend/frontend

