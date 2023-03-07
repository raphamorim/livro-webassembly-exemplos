all:
# 	Para uma melhor visualização dos simbolos é possível usar o rlib
# 	rustc numeros.rs --target wasm32-unknown-unknown --crate-type=rlib
# 	nm -C libnumeros.rlib
	rustc numeros.rs --target wasm32-unknown-unknown --crate-type=staticlib
	nm -C libnumeros.a
	rustc vinculacao.rs --target wasm32-unknown-unknown --crate-type=cdylib -L ./
	# cargo install ou
	ou

