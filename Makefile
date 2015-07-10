BIN = node_modules/.bin

all: install

install: build
	cp ./example-config.json config.json
	@echo "[i] Install complete."

test: build
	@echo "[i] Running tests..."
	@npm run test
	@echo "[i] Tests complete."

clean:
	@echo "[i] Clearing generated files..."
	rm -rf ./logs
	rm -rf ./public/js/cognactime.min.js
	rm -rf ./public/css/cognactime.min.css
	rm -rf ./config.json
	@make install

prod:
	@echo "Setting up for production..."
	@echo "Fetching remote git tree and resetting..."
	@git fetch && git reset --hard origin/master
	@make clean
	@echo "Not set up for prod yet."

dev: build
	@echo "[i] Starting development server..."
	@npm run watch

build: node_modules
	@echo "[i] Triggering build..."
	@npm run build
	@echo "[i] Build complete."

node_modules:
	@echo "[i] Fetching dependencies..."
	@npm install
	@echo "[i] Completed fetching dependencies."

.PHONY: test clean prod dev node_modules
