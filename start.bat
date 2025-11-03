@echo off
echo ============================================================
echo VIDEO TRIMMER PRO - Starting Web Interface
echo ============================================================
echo.

REM Check if virtual environment exists in parent directory
if exist "..\venv\Scripts\activate.bat" (
    echo Activating virtual environment...
    call ..\venv\Scripts\activate.bat
) else (
    echo Warning: Virtual environment not found at ..\venv
    echo.
    echo Please run this from the parent directory first:
    echo   python -m venv venv
    echo   venv\Scripts\activate
    echo   pip install -r video_trimmer_ui\requirements.txt
    echo.
    pause
    exit /b 1
)

REM Check if requirements are installed
python -c "import fastapi" 2>nul
if errorlevel 1 (
    echo Installing requirements...
    pip install -r requirements.txt
)

REM Start the FastAPI server
echo.
echo Starting server...
echo Open your browser at: http://localhost:8000
echo Press Ctrl+C to stop the server
echo.
python main.py

pause
