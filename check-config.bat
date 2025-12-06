@echo off
echo.
echo ========================================
echo Flutterwave Configuration Checker
echo ========================================
echo.

REM Check if .env file exists
if exist .env (
    echo [OK] .env file found
) else (
    echo [ERROR] .env file NOT found!
    echo.
    echo Please create .env file:
    echo 1. Copy .env.example to .env
    echo 2. Add your Flutterwave public key
    echo.
    pause
    exit /b 1
)

echo.
echo Checking environment variables...
echo.

REM Try to read .env file
findstr "VITE_FLUTTERWAVE_PUBLIC_KEY" .env >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] VITE_FLUTTERWAVE_PUBLIC_KEY is set in .env
    echo.
    echo Next steps:
    echo 1. Make sure you replaced the placeholder with your actual key
    echo 2. Restart the dev server: npm run dev
) else (
    echo [ERROR] VITE_FLUTTERWAVE_PUBLIC_KEY not found in .env
    echo.
    echo Add this line to your .env file:
    echo VITE_FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_TEST-your-key-here
)

echo.
echo ========================================
echo.
pause
