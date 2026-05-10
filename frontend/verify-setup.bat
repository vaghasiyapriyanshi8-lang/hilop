@echo off
REM Hilop Frontend - Setup Verification Script (Windows)
REM This script verifies that all required files are created and the project is ready

setlocal enabledelayedexpansion

echo.
echo ==========================================
echo Hilop Frontend - Setup Verification
echo ==========================================
echo.

REM Counter for checks
set PASSED=0
set FAILED=0

REM Function to check if file exists
:check_file
if exist "%1" (
  echo [OK] %1
  set /a PASSED+=1
) else (
  echo [MISSING] %1
  set /a FAILED+=1
)
goto :eof

REM Function to check if directory exists
:check_dir
if exist "%1\" (
  echo [OK] %1\
  set /a PASSED+=1
) else (
  echo [MISSING] %1\
  set /a FAILED+=1
)
goto :eof

echo Checking Directory Structure...
echo ================================

if exist "app\" (echo [OK] app\) else (echo [MISSING] app\ & set /a FAILED+=1)
if exist "components\" (echo [OK] components\) else (echo [MISSING] components\ & set /a FAILED+=1)
if exist "lib\" (echo [OK] lib\) else (echo [MISSING] lib\ & set /a FAILED+=1)
if exist "hooks\" (echo [OK] hooks\) else (echo [MISSING] hooks\ & set /a FAILED+=1)
if exist "store\" (echo [OK] store\) else (echo [MISSING] store\ & set /a FAILED+=1)
if exist "services\" (echo [OK] services\) else (echo [MISSING] services\ & set /a FAILED+=1)
if exist "types\" (echo [OK] types\) else (echo [MISSING] types\ & set /a FAILED+=1)
if exist "utils\" (echo [OK] utils\) else (echo [MISSING] utils\ & set /a FAILED+=1)

echo.
echo Checking Configuration Files...
echo ================================

if exist "package.json" (echo [OK] package.json & set /a PASSED+=1) else (echo [MISSING] package.json & set /a FAILED+=1)
if exist "tsconfig.json" (echo [OK] tsconfig.json & set /a PASSED+=1) else (echo [MISSING] tsconfig.json & set /a FAILED+=1)
if exist "next.config.js" (echo [OK] next.config.js & set /a PASSED+=1) else (echo [MISSING] next.config.js & set /a FAILED+=1)
if exist "tailwind.config.js" (echo [OK] tailwind.config.js & set /a PASSED+=1) else (echo [MISSING] tailwind.config.js & set /a FAILED+=1)
if exist "postcss.config.js" (echo [OK] postcss.config.js & set /a PASSED+=1) else (echo [MISSING] postcss.config.js & set /a FAILED+=1)
if exist ".eslintrc.json" (echo [OK] .eslintrc.json & set /a PASSED+=1) else (echo [MISSING] .eslintrc.json & set /a FAILED+=1)
if exist ".prettierrc" (echo [OK] .prettierrc & set /a PASSED+=1) else (echo [MISSING] .prettierrc & set /a FAILED+=1)
if exist "Dockerfile" (echo [OK] Dockerfile & set /a PASSED+=1) else (echo [MISSING] Dockerfile & set /a FAILED+=1)
if exist ".env.example" (echo [OK] .env.example & set /a PASSED+=1) else (echo [MISSING] .env.example & set /a FAILED+=1)

echo.
echo Checking Page Files...
echo ================================

if exist "app\layout.tsx" (echo [OK] app\layout.tsx & set /a PASSED+=1) else (echo [MISSING] app\layout.tsx & set /a FAILED+=1)
if exist "app\globals.css" (echo [OK] app\globals.css & set /a PASSED+=1) else (echo [MISSING] app\globals.css & set /a FAILED+=1)
if exist "app\page.tsx" (echo [OK] app\page.tsx & set /a PASSED+=1) else (echo [MISSING] app\page.tsx & set /a FAILED+=1)
if exist "app\products\page.tsx" (echo [OK] app\products\page.tsx & set /a PASSED+=1) else (echo [MISSING] app\products\page.tsx & set /a FAILED+=1)
if exist "app\products\[id]\page.tsx" (echo [OK] app\products\[id]\page.tsx & set /a PASSED+=1) else (echo [MISSING] app\products\[id]\page.tsx & set /a FAILED+=1)
if exist "app\cart\page.tsx" (echo [OK] app\cart\page.tsx & set /a PASSED+=1) else (echo [MISSING] app\cart\page.tsx & set /a FAILED+=1)
if exist "app\checkout\page.tsx" (echo [OK] app\checkout\page.tsx & set /a PASSED+=1) else (echo [MISSING] app\checkout\page.tsx & set /a FAILED+=1)
if exist "app\auth\login\page.tsx" (echo [OK] app\auth\login\page.tsx & set /a PASSED+=1) else (echo [MISSING] app\auth\login\page.tsx & set /a FAILED+=1)
if exist "app\auth\signup\page.tsx" (echo [OK] app\auth\signup\page.tsx & set /a PASSED+=1) else (echo [MISSING] app\auth\signup\page.tsx & set /a FAILED+=1)
if exist "app\profile\page.tsx" (echo [OK] app\profile\page.tsx & set /a PASSED+=1) else (echo [MISSING] app\profile\page.tsx & set /a FAILED+=1)

echo.
echo Checking UI Components...
echo ================================

if exist "components\ui\button.tsx" (echo [OK] components\ui\button.tsx & set /a PASSED+=1) else (echo [MISSING] components\ui\button.tsx & set /a FAILED+=1)
if exist "components\ui\input.tsx" (echo [OK] components\ui\input.tsx & set /a PASSED+=1) else (echo [MISSING] components\ui\input.tsx & set /a FAILED+=1)
if exist "components\ui\card.tsx" (echo [OK] components\ui\card.tsx & set /a PASSED+=1) else (echo [MISSING] components\ui\card.tsx & set /a FAILED+=1)
if exist "components\ui\toast.tsx" (echo [OK] components\ui\toast.tsx & set /a PASSED+=1) else (echo [MISSING] components\ui\toast.tsx & set /a FAILED+=1)
if exist "components\ui\toaster.tsx" (echo [OK] components\ui\toaster.tsx & set /a PASSED+=1) else (echo [MISSING] components\ui\toaster.tsx & set /a FAILED+=1)

echo.
echo Checking Layout Components...
echo ================================

if exist "components\layout\header.tsx" (echo [OK] components\layout\header.tsx & set /a PASSED+=1) else (echo [MISSING] components\layout\header.tsx & set /a FAILED+=1)
if exist "components\layout\footer.tsx" (echo [OK] components\layout\footer.tsx & set /a PASSED+=1) else (echo [MISSING] components\layout\footer.tsx & set /a FAILED+=1)

echo.
echo Checking Section Components...
echo ================================

if exist "components\sections\hero.tsx" (echo [OK] components\sections\hero.tsx & set /a PASSED+=1) else (echo [MISSING] components\sections\hero.tsx & set /a FAILED+=1)
if exist "components\sections\featured-products.tsx" (echo [OK] components\sections\featured-products.tsx & set /a PASSED+=1) else (echo [MISSING] components\sections\featured-products.tsx & set /a FAILED+=1)
if exist "components\sections\categories.tsx" (echo [OK] components\sections\categories.tsx & set /a PASSED+=1) else (echo [MISSING] components\sections\categories.tsx & set /a FAILED+=1)
if exist "components\sections\new-arrivals.tsx" (echo [OK] components\sections\new-arrivals.tsx & set /a PASSED+=1) else (echo [MISSING] components\sections\new-arrivals.tsx & set /a FAILED+=1)
if exist "components\sections\flash-sale.tsx" (echo [OK] components\sections\flash-sale.tsx & set /a PASSED+=1) else (echo [MISSING] components\sections\flash-sale.tsx & set /a FAILED+=1)

echo.
echo Checking Provider Components...
echo ================================

if exist "components\providers.tsx" (echo [OK] components\providers.tsx & set /a PASSED+=1) else (echo [MISSING] components\providers.tsx & set /a FAILED+=1)
if exist "components\auth-initializer.tsx" (echo [OK] components\auth-initializer.tsx & set /a PASSED+=1) else (echo [MISSING] components\auth-initializer.tsx & set /a FAILED+=1)

echo.
echo Checking Library Files...
echo ================================

if exist "lib\api.ts" (echo [OK] lib\api.ts & set /a PASSED+=1) else (echo [MISSING] lib\api.ts & set /a FAILED+=1)
if exist "lib\query-client.ts" (echo [OK] lib\query-client.ts & set /a PASSED+=1) else (echo [MISSING] lib\query-client.ts & set /a FAILED+=1)
if exist "lib\utils.ts" (echo [OK] lib\utils.ts & set /a PASSED+=1) else (echo [MISSING] lib\utils.ts & set /a FAILED+=1)

echo.
echo Checking Hooks...
echo ================================

if exist "hooks\use-toast.ts" (echo [OK] hooks\use-toast.ts & set /a PASSED+=1) else (echo [MISSING] hooks\use-toast.ts & set /a FAILED+=1)
if exist "hooks\use-media-query.ts" (echo [OK] hooks\use-media-query.ts & set /a PASSED+=1) else (echo [MISSING] hooks\use-media-query.ts & set /a FAILED+=1)
if exist "hooks\use-fetch.ts" (echo [OK] hooks\use-fetch.ts & set /a PASSED+=1) else (echo [MISSING] hooks\use-fetch.ts & set /a FAILED+=1)
if exist "hooks\use-initialize-auth.ts" (echo [OK] hooks\use-initialize-auth.ts & set /a PASSED+=1) else (echo [MISSING] hooks\use-initialize-auth.ts & set /a FAILED+=1)

echo.
echo Checking State Management...
echo ================================

if exist "store\auth.ts" (echo [OK] store\auth.ts & set /a PASSED+=1) else (echo [MISSING] store\auth.ts & set /a FAILED+=1)
if exist "store\cart.ts" (echo [OK] store\cart.ts & set /a PASSED+=1) else (echo [MISSING] store\cart.ts & set /a FAILED+=1)

echo.
echo Checking API Services...
echo ================================

if exist "services\api\auth.ts" (echo [OK] services\api\auth.ts & set /a PASSED+=1) else (echo [MISSING] services\api\auth.ts & set /a FAILED+=1)
if exist "services\api\products.ts" (echo [OK] services\api\products.ts & set /a PASSED+=1) else (echo [MISSING] services\api\products.ts & set /a FAILED+=1)
if exist "services\api\orders.ts" (echo [OK] services\api\orders.ts & set /a PASSED+=1) else (echo [MISSING] services\api\orders.ts & set /a FAILED+=1)
if exist "services\api\users.ts" (echo [OK] services\api\users.ts & set /a PASSED+=1) else (echo [MISSING] services\api\users.ts & set /a FAILED+=1)

echo.
echo Checking Types and Utils...
echo ================================

if exist "types\index.ts" (echo [OK] types\index.ts & set /a PASSED+=1) else (echo [MISSING] types\index.ts & set /a FAILED+=1)
if exist "utils\format.ts" (echo [OK] utils\format.ts & set /a PASSED+=1) else (echo [MISSING] utils\format.ts & set /a FAILED+=1)
if exist "utils\storage.ts" (echo [OK] utils\storage.ts & set /a PASSED+=1) else (echo [MISSING] utils\storage.ts & set /a FAILED+=1)

echo.
echo Checking Documentation...
echo ================================

if exist "README.md" (echo [OK] README.md & set /a PASSED+=1) else (echo [MISSING] README.md & set /a FAILED+=1)
if exist "DEVELOPMENT.md" (echo [OK] DEVELOPMENT.md & set /a PASSED+=1) else (echo [MISSING] DEVELOPMENT.md & set /a FAILED+=1)
if exist "QUICKSTART.md" (echo [OK] QUICKSTART.md & set /a PASSED+=1) else (echo [MISSING] QUICKSTART.md & set /a FAILED+=1)
if exist "ARCHITECTURE.md" (echo [OK] ARCHITECTURE.md & set /a PASSED+=1) else (echo [MISSING] ARCHITECTURE.md & set /a FAILED+=1)

echo.
echo ==========================================
echo Verification Results
echo ==========================================
echo Passed: %PASSED%
echo Failed: %FAILED%

if %FAILED% equ 0 (
  echo.
  echo [SUCCESS] All files verified successfully!
  echo.
  echo Next steps:
  echo 1. npm install
  echo 2. cp .env.example .env.local (or copy manually)
  echo 3. npm run dev
  echo.
  exit /b 0
) else (
  echo.
  echo [ERROR] Some files are missing!
  echo Please check the files listed above.
  echo.
  exit /b 1
)

endlocal
