all:
	rustc numeros.rs --target wasm32-unknown-unknown --crate-type=rlib 
	nm -C libnumeros.rlib
	rustc vinculacao.rs --target wasm32-unknown-unknown --crate-type=cdylib 
# 	rustc utils.rs -O --emit=obj --crate-type=rlib
