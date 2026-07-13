#!/bin/bash

# Quizlet Clone - Check All Script
# Runs build and lint for both API and Web apps

set -e

echo "======================================"
echo "  Quizlet Clone - Quality Check"
echo "======================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Track failures
FAILURES=0

# Check API
echo -e "${YELLOW}>>> Checking API...${NC}"
cd apps/api

echo "  Building API..."
if npm run build 2>&1 | tee /tmp/api-build.log; then
    echo -e "  ${GREEN}✓ API Build passed${NC}"
else
    echo -e "  ${RED}✗ API Build failed${NC}"
    FAILURES=$((FAILURES + 1))
fi

echo "  Linting API..."
if npm run lint 2>&1 | tee /tmp/api-lint.log; then
    echo -e "  ${GREEN}✓ API Lint passed${NC}"
else
    echo -e "  ${RED}✗ API Lint failed${NC}"
    FAILURES=$((FAILURES + 1))
fi

cd ../..

# Check Web
echo ""
echo -e "${YELLOW}>>> Checking Web...${NC}"
cd apps/web

echo "  Building Web..."
if npm run build 2>&1 | tee /tmp/web-build.log; then
    echo -e "  ${GREEN}✓ Web Build passed${NC}"
else
    echo -e "  ${RED}✗ Web Build failed${NC}"
    FAILURES=$((FAILURES + 1))
fi

echo "  Linting Web..."
if npm run lint 2>&1 | tee /tmp/web-lint.log; then
    echo -e "  ${GREEN}✓ Web Lint passed${NC}"
else
    echo -e "  ${RED}✗ Web Lint failed${NC}"
    FAILURES=$((FAILURES + 1))
fi

cd ../..

# Summary
echo ""
echo "======================================"
if [ $FAILURES -eq 0 ]; then
    echo -e "${GREEN}✓ All checks passed!${NC}"
    echo "======================================"
    exit 0
else
    echo -e "${RED}✗ $FAILURES check(s) failed${NC}"
    echo "======================================"
    echo ""
    echo "Log files:"
    echo "  - /tmp/api-build.log"
    echo "  - /tmp/api-lint.log"
    echo "  - /tmp/web-build.log"
    echo "  - /tmp/web-lint.log"
    exit 1
fi
