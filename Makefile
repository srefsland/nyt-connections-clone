.PHONY: help install dev build start test test-watch test-coverage test-e2e test-e2e-ui lint format clean docker-build docker-up docker-down docker-logs deploy-aws deploy-azure deploy-gcp

# Default target
.DEFAULT_GOAL := help

# Colors for output
YELLOW := \033[1;33m
GREEN := \033[1;32m
RESET := \033[0m

## help: Display this help message
help:
	@echo "$(YELLOW)Available targets:$(RESET)"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  $(GREEN)%-20s$(RESET) %s\n", $$1, $$2}' $(MAKEFILE_LIST)

## install: Install all dependencies
install:
	npm ci

## dev: Start development server
dev:
	npm run dev

## build: Build production application
build:
	npm run build

## start: Start production server
start:
	npm run start

## test: Run unit tests
test:
	npm run test

## test-watch: Run tests in watch mode
test-watch:
	npm run test:watch

## test-coverage: Run tests with coverage
test-coverage:
	npm run test:coverage

## test-e2e: Run E2E tests
test-e2e:
	npm run test:e2e

## test-e2e-ui: Run E2E tests with UI
test-e2e-ui:
	npm run test:e2e:ui

## lint: Run linter
lint:
	npm run lint

## format: Format code with Prettier
format:
	npx prettier --write .

## clean: Remove build artifacts and dependencies
clean:
	rm -rf .next node_modules coverage test-results playwright-report

## docker-build: Build Docker image
docker-build:
	docker-compose build

## docker-up: Start Docker containers
docker-up:
	docker-compose up -d

## docker-down: Stop Docker containers
docker-down:
	docker-compose down

## docker-logs: View Docker logs
docker-logs:
	docker-compose logs -f

## docker-simple: Run with prebuilt image
docker-simple:
	docker-compose -f docker-compose.simple.yml up -d

## docker-clean: Remove Docker containers, images, and volumes
docker-clean:
	docker-compose down -v --rmi all

## setup-husky: Initialize Husky hooks
setup-husky:
	npm run prepare
	chmod +x .husky/pre-commit

## ci: Run all CI checks locally
ci: lint test build

## all: Install, test, and build
all: install lint test build

## verify: Verify installation and setup
verify:
	@echo "$(YELLOW)Verifying installation...$(RESET)"
	@node --version
	@npm --version
	@docker --version
	@docker-compose --version
	@echo "$(GREEN)All tools installed!$(RESET)"
