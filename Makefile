BIN=node_modules/.bin

build:
	$(BIN)/babel scripts -d modules

clean:
	rm -rf modules

lint:
	$(BIN)/eslint src

.PHONY: build clean
