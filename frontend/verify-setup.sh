#!/bin/bash

# Hilop Frontend - Setup Verification Script
# This script verifies that all required files are created and the project is ready

echo "=========================================="
echo "Hilop Frontend - Setup Verification"
echo "=========================================="
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counter for checks
PASSED=0
FAILED=0

# Function to check if file exists
check_file() {
  if [ -f "$1" ]; then
    echo -e "${GREEN}✓${NC} $1"
    ((PASSED++))
  else
    echo -e "${RED}✗${NC} $1"
    ((FAILED++))
  fi
}

# Function to check if directory exists
check_dir() {
  if [ -d "$1" ]; then
    echo -e "${GREEN}✓${NC} $1/"
    ((PASSED++))
  else
    echo -e "${RED}✗${NC} $1/"
    ((FAILED++))
  fi
}

echo "Checking Directory Structure..."
echo "================================"

# Check main directories
check_dir "app"
check_dir "components"
check_dir "lib"
check_dir "hooks"
check_dir "store"
check_dir "services"
check_dir "types"
check_dir "utils"

echo ""
echo "Checking Configuration Files..."
echo "================================"

# Check config files
check_file "package.json"
check_file "tsconfig.json"
check_file "next.config.js"
check_file "tailwind.config.js"
check_file "postcss.config.js"
check_file ".eslintrc.json"
check_file ".prettierrc"
check_file "Dockerfile"
check_file ".env.example"

echo ""
echo "Checking Page Files..."
echo "================================"

# Check pages
check_file "app/layout.tsx"
check_file "app/globals.css"
check_file "app/page.tsx"
check_file "app/products/page.tsx"
check_file "app/products/\[id\]/page.tsx"
check_file "app/cart/page.tsx"
check_file "app/checkout/page.tsx"
check_file "app/auth/login/page.tsx"
check_file "app/auth/signup/page.tsx"
check_file "app/profile/page.tsx"

echo ""
echo "Checking UI Components..."
echo "================================"

# Check UI components
check_file "components/ui/button.tsx"
check_file "components/ui/input.tsx"
check_file "components/ui/card.tsx"
check_file "components/ui/toast.tsx"
check_file "components/ui/toaster.tsx"

echo ""
echo "Checking Layout Components..."
echo "================================"

# Check layout components
check_file "components/layout/header.tsx"
check_file "components/layout/footer.tsx"

echo ""
echo "Checking Section Components..."
echo "================================"

# Check section components
check_file "components/sections/hero.tsx"
check_file "components/sections/featured-products.tsx"
check_file "components/sections/categories.tsx"
check_file "components/sections/new-arrivals.tsx"
check_file "components/sections/flash-sale.tsx"

echo ""
echo "Checking Provider Components..."
echo "================================"

# Check provider components
check_file "components/providers.tsx"
check_file "components/auth-initializer.tsx"

echo ""
echo "Checking Library Files..."
echo "================================"

# Check lib files
check_file "lib/api.ts"
check_file "lib/query-client.ts"
check_file "lib/utils.ts"

echo ""
echo "Checking Hooks..."
echo "================================"

# Check hooks
check_file "hooks/use-toast.ts"
check_file "hooks/use-media-query.ts"
check_file "hooks/use-fetch.ts"
check_file "hooks/use-initialize-auth.ts"

echo ""
echo "Checking State Management..."
echo "================================"

# Check stores
check_file "store/auth.ts"
check_file "store/cart.ts"

echo ""
echo "Checking API Services..."
echo "================================"

# Check services
check_file "services/api/auth.ts"
check_file "services/api/products.ts"
check_file "services/api/orders.ts"
check_file "services/api/users.ts"

echo ""
echo "Checking Types & Utils..."
echo "================================"

# Check types and utils
check_file "types/index.ts"
check_file "utils/format.ts"
check_file "utils/storage.ts"

echo ""
echo "Checking Documentation..."
echo "================================"

# Check documentation
check_file "README.md"
check_file "DEVELOPMENT.md"
check_file "QUICKSTART.md"
check_file "ARCHITECTURE.md"
check_file "COMPLETE_PROJECT_GUIDE.md"
check_file "FRONTEND_IMPLEMENTATION_SUMMARY.md"

echo ""
echo "=========================================="
echo "Verification Results"
echo "=========================================="
echo -e "Passed: ${GREEN}$PASSED${NC}"
echo -e "Failed: ${RED}$FAILED${NC}"

if [ $FAILED -eq 0 ]; then
  echo ""
  echo -e "${GREEN}✓ All files verified successfully!${NC}"
  echo ""
  echo "Next steps:"
  echo "1. npm install"
  echo "2. cp .env.example .env.local"
  echo "3. npm run dev"
  echo ""
  exit 0
else
  echo ""
  echo -e "${RED}✗ Some files are missing!${NC}"
  echo "Please check the files listed above."
  echo ""
  exit 1
fi
