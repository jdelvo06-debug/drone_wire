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
    BASE_URL="http://localhost:3002"
    echo -e "${BLUE}🔍 Running health check on LOCAL environment${NC}"
else
    BASE_URL="https://dronewire.org"
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
        PASSED=$((PASSED + 1))
    else
        echo -e "${RED}✗ FAILED${NC} (HTTP $status, expected $expected_status)"
        FAILED=$((FAILED + 1))
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
        PASSED=$((PASSED + 1))
    else
        echo -e "${RED}✗ FAILED${NC} (no data)"
        FAILED=$((FAILED + 1))
    fi
}

# Function to verify the public AI health endpoint is healthy
check_ai_health() {
    local name=$1
    local url=$2
    local body_file
    local status

    printf "%-30s" "$name..."

    body_file=$(mktemp)
    status=$(curl -sS -o "$body_file" -w "%{http_code}" --max-time 10 "$url" 2>/dev/null) || status="000"

    if [ "$status" = "200" ] && grep -Eq '"status"[[:space:]]*:[[:space:]]*"healthy"' "$body_file"; then
        echo -e "${GREEN}✓ OK${NC} (HTTP 200, healthy)"
        PASSED=$((PASSED + 1))
    else
        echo -e "${RED}✗ FAILED${NC} (HTTP $status, expected HTTP 200 with healthy status)"
        FAILED=$((FAILED + 1))
    fi

    rm -f "$body_file"
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
check_ai_health "AI Health API" "$BASE_URL/api/health/ai"

echo ""
echo -e "${YELLOW}📊 Data Verification${NC}"
echo "-------------------------------------------"
check_api_data "Articles have data" "$BASE_URL/api/articles" '"articles"'
check_api_data "Contracts have data" "$BASE_URL/api/contracts" '"contracts"'

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
