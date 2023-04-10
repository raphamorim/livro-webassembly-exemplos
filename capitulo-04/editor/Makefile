build:
	cargo build --release
	cp target/wasm32-unknown-unknown/release/editor.wasm ./editor.wasm
	du -k ./editor.wasm
	cargo server --port 5000

watch:
	cargo watch -i *.wasm -- make build

watch-dev:
	cargo watch -i *.wasm -- make build-debug

build-debug:
	cargo build
	cp target/wasm32-unknown-unknown/debug/editor.wasm ./editor.wasm

lint:
	cargo fmt --check

server:
	cargo server --port 5000