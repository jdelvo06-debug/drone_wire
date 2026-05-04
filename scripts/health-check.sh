#!/bin/bash

# DroneWire Health Check Script
# Run: ./scripts/health-check.sh [local|prod]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
ENV=${1:-prod}

if [ "$ENV" = "local" ]; then
    BASE_URL="http://localhost:3000"
    echo -e "${BLUE}🔍 Running health check on LOCAL environment${NC}"
else
    BASE_URL="https://drone-wire.vercel.app"
    echo -e "${BLUE}🔍 Running health check on PRODUCTION environment${NC}"
fi

echo ""
echo "Base URL: $BASE_URL"
echo "=========================================="
echo ""

PASSED=0
FAILED=0

# Function to check endpoint
check_endpoint() {
    local name=$1
    local url=$2
    local expected_status=${3:-200}

    printf "%-30s" "$name..."

    status=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "$url" 2>/dev/null || echo "000")

    if [ "$status" = "$expected_status" ]; then
        echo -e "${GREEN}✓ OK${NC} (HTTP $status)"
        ((PASSED++))
    else
        echo -e "${RED}✗ FAILED${NC} (HTTP $status, expected $expected_status)"
        ((FAILED++))
    fi
}

# Function to check API returns data
check_api_data() {
    local name=$1
    local url=$2
    local json_path=$3

    printf "%-30s" "$name..."

    response=$(curl -s --max-time 10 "$url" 2>/dev/null || echo "{}")

    # Check if response contains expected data
    if echo "$response" | grep -q "$json_path"; then
        echo -e "${GREEN}✓ OK${NC} (data present)"
        ((PASSED++))
    else
        echo -e "${RED}✗ FAILED${NC} (no data)"
        ((FAILED++))
    fi
}

echo -e "${YELLOW}📄 Page Endpoints${NC}"
echo "-------------------------------------------"
check_endpoint "Home Page" "$BASE_URL/"
check_endpoint "Articles Page" "$BASE_URL/articles"
check_endpoint "Explainers Page" "$BASE_URL/explainers"
check_endpoint "Contracts Page" "$BASE_URL/contracts"
check_endpoint "About Page" "$BASE_URL/about"

echo ""
echo -e "${YELLOW}🔌 API Endpoints${NC}"
echo "-------------------------------------------"
check_endpoint "Articles API" "$BASE_URL/api/articles"
check_endpoint "Contracts API" "$BASE_URL/api/contracts"

echo ""
echo -e "${YELLOW}📊 Data Verification${NC}"
echo "-------------------------------------------"
check_api_data "Articles have data" "$BASE_URL/api/articles" '"articles"'
check_api_data "Contracts have data" "$BASE_URL/api/contracts" '"contracts"'

echo ""
echo -e "${YELLOW}🔒 Cron Endpoints (Auth Required)${NC}"
echo "-------------------------------------------"
# These should return 401 without auth
check_endpoint "Scrape News (unauth)" "$BASE_URL/api/cron/scrape-news" "401"
check_endpoint "Process AI (unauth)" "$BASE_URL/api/cron/process-ai" "401"

echo ""
echo "=========================================="
echo -e "${BLUE}📋 Summary${NC}"
echo "-------------------------------------------"
echo -e "Passed: ${GREEN}$PASSED${NC}"
echo -e "Failed: ${RED}$FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ All health checks passed!${NC}"
    exit 0
else
    echo -e "${RED}❌ Some health checks failed!${NC}"
    exit 1
fi
