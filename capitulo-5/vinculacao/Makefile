all:
	rustc numeros.rs --target wasm32-unknown-unknown --crate-type=rlib
	nm -C libnumeros.rlib
	rustc numeros.rs --target wasm32-unknown-unknown --crate-type=staticlib
	rustc vinculacao.rs --target wasm32-unknown-unknown --crate-type=cdylib -L ./
	ou

